import axios, { AxiosError } from "axios";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ITeam, IUser } from "../types/global";
import { useSelector } from "react-redux";
import { RootState } from "../hooks/store";
import { BACKEND_URL } from "../constants/data";
import { FaChessKing } from "react-icons/fa";

const Team = () => {
  const location = useLocation();
  const userState = useSelector((state: RootState) => state.user);
  const [team, setTeam] = useState<ITeam>({
    name: "",
    _id: "",
    creator: userState,
    members: [],
  });
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<IUser[]>([]);

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  console.log("🚀 ~ Team ~ team:", team);

  const addMemberHandler = useCallback(
    async (member: IUser) => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        await axios.post(
          `${BACKEND_URL}/teams/members`,
          { userId: member._id, teamId: team._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTeam((prev) => ({ ...prev, members: [...prev.members, member] }));
      } catch (error) {
        if (error instanceof AxiosError) console.warn(error.response?.data);
      }
    },
    [team._id]
  );

  const getSearchedUsers = useCallback(async (search: string) => {
    if (search.trim().length === 0) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      console.log({ search });
      const response = await axios.post(
        `${BACKEND_URL}/users`,
        { search },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setSearchResult(data.data.users);
    } catch (error) {
      if (error instanceof AxiosError) console.warn(error.response?.data);
    }
  }, []);
  useEffect(() => {
    const getTeam = async () => {
      const teamId = location.pathname.split("/").at(-1);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${BACKEND_URL}/teams/${teamId}`, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setTeam(data.data.team);
      } catch (error) {
        if (error instanceof AxiosError) console.warn(error.response?.data);
      }
    };

    getTeam();
  }, [location.pathname]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getSearchedUsers(search);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [search, getSearchedUsers]);

  if (!userState.loggedIn) return <Navigate to="/sign-in" />;

  return (
    <div className="flex">
      <section className="w-[20% min-w-[16rem] border-r-[.1rem] border-r-gray-100">
        <div
          className={`flex items-center py-2 px-2 mb-1 justify-between bg-gray-100 ${
            team.profile ? "" : "animate-pulse"
          }`}
        >
          <div className="flex items-center gap-4">
            <img
              src={`${
                team.profile
                  ? `http://localhost:5050/uploads/teams/profiles/${team.profile}`
                  : ""
              }`}
              alt="profile"
              className="size-[2.8rem] rounded-full drop-shadow-md"
            />
            <span className="font-semibold text-slate-600">{team.name}</span>
          </div>
        </div>

        <div className="flex ml-2 mb-1">
          <input
            type="text"
            placeholder="Search member"
            className="py-2 w-full text-slate-700 font-semibold tracking-wide placeholder:font-normal indent-2 outline-none border-b-[.1rem] border-b-slate-400 transition-all duration-200  focus:bg-gray-50"
            value={search}
            onChange={searchHandler}
          />
        </div>

        {search && searchResult.length > 0 && (
          <section className="relative w-full">
            <div className="absolute w-full px-2 divide-y-[.05rem] divide-slate-200 h-[65vh] bg-yellow-50 drop-shadow-md overflow-y-scroll scroll-bar-none">
              {searchResult.map((user) => (
                <SearchMember
                  key={user._id}
                  onAddMember={addMemberHandler}
                  user={user}
                  showAddBtn={
                    !team.members.find((member) => member._id === user._id)
                  }
                />
              ))}
            </div>
          </section>
        )}

        {/*//! */}
        <div className="px-2 divide-y-[.05rem] divide-slate-200 h-[65vh] overflow-y-scroll scroll-bar-none">
          <Member user={team.creator} isAdmin={true} />
          {team.members.map((user) => (
            <Member key={user._id} user={user} />
          ))}
        </div>
      </section>
      <section></section>
    </div>
  );
};

type SearchMemberProps = {
  user: IUser;
  showAddBtn: boolean;
  onAddMember: (user: IUser) => void;
};
const SearchMember = ({ user, onAddMember, showAddBtn }: SearchMemberProps) => {
  return (
    <div className="relative flex items-center py-2">
      <span className="text-4xl">{user.profile}</span>
      <p className="flex flex-col">
        <span className="text-slate-700 text-[.9rem] font-semibold">
          {user.name.length < 25 ? user.name : user.name.slice(0, 22) + "..."}
        </span>
        <span className="text-[.7rem] text-slate-600">
          {user.email.length < 25
            ? user.email
            : user.email.slice(0, 22) + "..."}
        </span>
      </p>
      {showAddBtn && (
        <button
          className="absolute right-1 font-extrabold text-2xl text-slate-600 transition-all duration-200 hover:scale-[1.1] active:scale-[1]"
          onClick={() => onAddMember(user)}
        >
          +
        </button>
      )}
    </div>
  );
};
type MemberProps = {
  user: IUser;
  isAdmin?: boolean;
};
const Member = ({
  user: { name, profile, email },
  isAdmin = false,
}: MemberProps) => {
  return (
    <div className="relative flex items-center py-2">
      <span className="text-4xl">{profile}</span>
      <p className="flex flex-col">
        <span className="text-slate-700 text-[.9rem] font-semibold">
          {name.length < 25 ? name : name.slice(0, 22) + "..."}
        </span>
        <span className="text-[.7rem] text-slate-600">
          {email.length < 25 ? email : email.slice(0, 22) + "..."}
        </span>
      </p>

      {isAdmin && (
        <span className="absolute right-1 text-slate-600">
          <FaChessKing />
        </span>
      )}
    </div>
  );
};

export default Team;
