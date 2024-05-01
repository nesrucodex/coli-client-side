import { NavLink } from "react-router-dom";
import { ITeam } from "../types/global";
import { MEMBER_STATUS } from "../constants/data";
import { FaEdit, FaTimes } from "react-icons/fa";
import { MouseEvent, useState } from "react";
import Overlay from "./Overlay";
import TeamUpdator from "./Teams/TeamUpdate";
import { useSelector } from "react-redux";
import { RootState } from "../hooks/store";
import axios, { AxiosError } from "axios";

type TeamBoxProp = {
  team: ITeam;
  setTeams: React.Dispatch<React.SetStateAction<ITeam[]>>;
};
export const TeamBox = ({ team, setTeams }: TeamBoxProp) => {
  const [showTeamUpdator, setShowTeamUpdator] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  const deleteTeamHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5050/api/v1/teams/${team._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeams((prev) => prev.filter((tm) => tm._id !== team._id));
    } catch (error) {
      if (error instanceof AxiosError) console.warn(error.response?.data);
    }
  };
  return (
    <div
      key={team._id}
      className="relative w-full max-sm:w-[70%] mx-auto border-2 rounded-[.3rem] border-gray-400 flex flex-col"
    >
      <div className="flex items-center py-2 px-2 mb-1 justify-between ">
        <NavLink to={`/${team._id}`} className="flex items-center gap-4">
          <img
            src={`http://localhost:5050/uploads/teams/profiles/${team?.profile}`}
            alt="profile"
            className="size-[3rem] rounded-full drop-shadow-md"
          />
          <span className="font-semibold text-slate-600">{team?.name}</span>
        </NavLink>
        {team.creator._id === user._id && (
          <div className="flex items-center gap-4">
            <button
              className="text-slate-700 cursor-pointer duration-200 transition-all hover:scale-110 active:scale-100"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setShowTeamUpdator(true);
              }}
            >
              <FaEdit size={20} />
            </button>
            <button
              className="text-red-700 cursor-pointer duration-200 transition-all hover:scale-110 active:scale-100"
              onClick={() => {
                deleteTeamHandler();
              }}
            >
              <FaTimes size={22} />
            </button>
          </div>
        )}
      </div>
      <p className="h-[.02rem] bg-slate-100 mx-2"></p>

      <NavLink to={`/${team._id}`} className="min-h-[4rem]">
        <div
          className="px-2 text-slate-700 line-clamp-4"
          dangerouslySetInnerHTML={{ __html: team.description || "234" }}
        />
      </NavLink>
      <div className="border-t-[.1rem] border-t-gray-100 w-full flex gap-0 items-center mt-2 py-2 px-2 ">
        <img
          className="rounded-full size-[3rem] ring-2 ring-offset-1 ring-slate-500 -mr-[1rem]"
          style={{ transform: "rotateY(15deg)" }}
          src={`http://localhost:5050/uploads/users/profiles/${team?.creator?.profile}`}
          alt="profile"
        />

        {team.members
          .filter((member) => member.status === MEMBER_STATUS.MEMBER)
          ?.slice(0, 4)
          .map((member) => (
            <img
              key={member.user._id}
              className="rounded-full size-[3rem] ring-1 ring-slate-300 -mr-[1rem]"
              style={{ transform: "rotateY(15deg)" }}
              src={`http://localhost:5050/uploads/users/profiles/${member.user?.profile}`}
              alt="profile"
            />
          ))}
      </div>

      {showTeamUpdator && (
        <Overlay
          showOverlay={showTeamUpdator}
          overlayClickHandler={() => {
            setShowTeamUpdator(false);
          }}
        >
          <TeamUpdator
            inital={team}
            onUpdateTeam={(updatedTeam: ITeam) => {
              console.log("🚀 ~ TeamBox ~ updatedTeam:", updatedTeam);
              setTeams((prev) =>
                prev.map((tm) =>
                  tm._id === team._id ? { ...tm, ...updatedTeam } : tm
                )
              );
            }}
            showTeamUpdator={showTeamUpdator}
            showTeamUpdatorHandler={(showTeamCreator?: boolean | undefined) => {
              setShowTeamUpdator((prev) =>
                showTeamCreator === undefined ? !prev : showTeamCreator
              );
            }}
          />
        </Overlay>
      )}
    </div>
  );
};
