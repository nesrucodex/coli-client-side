import axios, { AxiosError } from "axios";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { IComment, IMemberStatus, ITeam, IUser } from "../types/global";
import { useSelector } from "react-redux";
import { RootState } from "../hooks/store";
import {
  BACKEND_URL,
  MEMBER_STATUS,
  NOTIFICATION_TYPES,
} from "../constants/data";
import { TeamMember } from "../components/TeamMember";
import { TaskManagementSection } from "../components/TaskManagementSection";
import { motion } from "framer-motion";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";

const Team = () => {
  const location = useLocation();
  const userState = useSelector((state: RootState) => state.user);
  const [team, setTeam] = useState<ITeam>({
    name: "",
    _id: "",
    creator: userState,
    members: [],
    unassignedTodos: [],
  });

  const [teamComments, setTeamComments] = useState<IComment[]>([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<IUser[]>([]);

  const [showMembers, setShowMembers] = useState(false);
  const [showTodoCreatorArea, setShowTodoCreatorArea] = useState(true);
  const [showTeamChat, setShowTeamChat] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
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

        setTeam((prev) => ({
          ...prev,
          members: [
            ...prev.members,
            {
              user: member,
              todos: [],
              status: MEMBER_STATUS.PENDING as IMemberStatus,
            },
          ],
        }));
      } catch (error) {
        if (error instanceof AxiosError) console.warn(error.response?.data);
      }
    },
    [team._id]
  );
  const removeMemberHandler = useCallback(
    async (member: IUser) => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        await axios.delete(
          `${BACKEND_URL}/teams/members/${team._id}/${member._id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTeam((prev) => ({
          ...prev,
          members: prev.members.filter((mem) => mem.user._id !== member._id),
        }));
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
      if (!token) return;
      try {
        const response = await axios.get(`${BACKEND_URL}/teams/${teamId}`, {
          headers: {
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
    const getTeamComments = async () => {
      const teamId = location.pathname.split("/").at(-1);
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get(`${BACKEND_URL}/comments/${teamId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setTeamComments(data.data.comments);
      } catch (error) {
        if (error instanceof AxiosError) console.warn(error.response?.data);
      }
    };

    getTeamComments();
  }, [location.pathname]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getSearchedUsers(search);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [search, getSearchedUsers]);

  if (!localStorage.getItem("token")) return <Navigate to="/sign-in" />;

  const dragStartHandler = (result: DragStart) => {
    result;
  };

  const dragEndHandler = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    // If the source and destination are the same and the position hasn't changed, return
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const { droppableId: dDroppableId, index: dIndex } = destination;
    const [dUserId, dTodoStatus] = dDroppableId.split("-");
    const [sUserId, sTodoStatus] = source.droppableId.split("-");
    const { index: sIndex } = source;

    const notification = {
      teamId: team._id,
      type: NOTIFICATION_TYPES.TODO_STATUS_CHANGED,
      data: {
        dUserId,
        sUserId,
        sTodoStatus,
        dTodoStatus,
      },
    };

    let updateTeam = { ...team };

    // * Reshuffling of todos on the same `STATUS`
    if (sTodoStatus === dTodoStatus) {
      // console.log(`Reshuffling of todos on the same STATUS`);
      // * On the same member
      if (sUserId === dUserId) {
        // console.log(`On the same member`);
        // * On member is Creator
        if (sUserId === updateTeam.creator._id) {
          console.log(`On member is Creator`);
          const updatedUnassignedTodos = updateTeam.unassignedTodos.slice();
          updatedUnassignedTodos.splice(sIndex, 1);
          updatedUnassignedTodos.splice(
            dIndex,
            0,
            updateTeam.unassignedTodos[sIndex]
          );

          updateTeam = {
            ...updateTeam,
            unassignedTodos: updatedUnassignedTodos,
          };
        } else {
          // * On member other than Creator
          // console.log(`On member other than Creator`);
          const member = updateTeam.members.find(
            (member) => member.user._id === sUserId
          );
          if (!member) return;

          const todos = member.todos.slice();

          todos.splice(sIndex, 1);
          todos.splice(dIndex, 0, member.todos[sIndex]);

          updateTeam = {
            ...updateTeam,
            members: updateTeam.members.map((mem) =>
              mem.user._id === sUserId ? { ...member, todos } : mem
            ),
          };
        }
      } else {
        // * On the different member
        // console.log(`On the different member`);
        const sMember = updateTeam.members.find(
          (member) => member.user._id === sUserId
        );
        const dMember = updateTeam.members.find(
          (member) => member.user._id === dUserId
        );

        console.log({ sMember }, { dMember });

        if (!sMember || !dMember) return;

        dMember.todos.splice(dIndex, 0, sMember.todos[sIndex]);
        sMember.todos.splice(sIndex, 1);

        console.log({ sMember }, { dMember });
        updateTeam = {
          ...updateTeam,
          members: updateTeam.members.map((mem) =>
            mem.user._id === sUserId
              ? sMember
              : mem.user._id === dUserId
              ? dMember
              : mem
          ),
        };
      }
    } else {
      // * Reshuffling of todos on the different `STATUS`
      // console.log(`Reshuffling of todos on the different STATUS`);
      if (updateTeam.creator._id === sUserId) {
        // * When the source is creator
        // console.log(` When the source is creator`);
        const updateUnassignedTodos = updateTeam.unassignedTodos;
        const dMember = updateTeam.members.find(
          (member) => member.user._id === dUserId
        );
        if (!dMember) return;

        dMember.todos.splice(dIndex, 0, updateUnassignedTodos[sIndex]);
        updateUnassignedTodos.splice(sIndex, 1);

        dMember.todos[dIndex].status = dTodoStatus;

        updateTeam = {
          ...updateTeam,
          members: updateTeam.members.map((mem) =>
            mem.user._id === dUserId ? dMember : mem
          ),
          unassignedTodos: updateUnassignedTodos,
        };
      } else if (updateTeam.creator._id === dUserId) {
        // * When the destination is creator
        // console.log(` When the destination is creator`);
        const updateUnassignedTodos = updateTeam.unassignedTodos;
        const sMember = updateTeam.members.find(
          (member) => member.user._id === sUserId
        );
        if (!sMember) return;

        updateUnassignedTodos.splice(dIndex, 0, sMember.todos[sIndex]);
        sMember.todos.splice(sIndex, 1);

        updateUnassignedTodos.map((todo) => ({ ...todo, status: dTodoStatus }));

        updateTeam = {
          ...updateTeam,
          members: updateTeam.members.map((mem) =>
            mem.user._id === sUserId ? sMember : mem
          ),
          unassignedTodos: updateUnassignedTodos,
        };
      } else {
        // * When the source nor destination is creator
        // console.log(`When the source nor destination is creator`);
        const sMember = updateTeam.members.find(
          (member) => member.user._id === sUserId
        );
        const dMember = updateTeam.members.find(
          (member) => member.user._id === dUserId
        );
        if (!sMember || !dMember) return;

        dMember.todos.splice(dIndex, 0, sMember.todos[sIndex]);
        sMember.todos.splice(sIndex, 1);

        dMember.todos[dIndex].status = dTodoStatus;
        updateTeam = {
          ...updateTeam,
          members: updateTeam.members.map((mem) =>
            mem.user._id === sUserId
              ? sMember
              : mem.user._id === dUserId
              ? dMember
              : mem
          ),
        };
      }
    }

    setTeam(updateTeam);
    asyncTodosReordering({
      ...updateTeam,
      unassignedTodos: updateTeam.unassignedTodos.map((todo, index) => ({
        ...todo,
        order: index,
      })),
      members: updateTeam.members.map((member) => ({
        ...member,
        todos: member.todos.map((todo, index) => ({ ...todo, order: index })),
      })),
    });
    if (source.droppableId !== destination.droppableId)
      asyncTodosReorderingNotificationHandler(notification);
  };

  const asyncTodosReordering = async (team: ITeam) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.patch(`${BACKEND_URL}/teams/dnd/${team._id}`, team, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) console.warn(error.response?.data);
    }
  };
  const asyncTodosReorderingNotificationHandler = async (
    notification: unknown
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/notifications`,
        notification,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("🚀 ~ Team ~ data:", data);
    } catch (error) {
      if (error instanceof AxiosError) console.warn(error.response?.data);
    }
  };

  // ! For Searching

  const members =
    search.trim().length > 0
      ? searchResult
      : team.members.map((member) => member.user);

  return (
    <div className="flex">
      <div className={`relative bg-gray-200 grid place-items-center w-[65px]`}>
        {user._id && team.creator._id === user._id && (
          <>
            <button
              className="absolute top-[1rem] text-[2rem] text-slate-700  translation-all duration-200 hover:scale-110 active:scale-100"
              onClick={() => setShowMembers((prev) => !prev)}
            >
              {showMembers ? <MdChevronLeft /> : <MdChevronRight />}
            </button>
            <button
              className="absolute top-[3.4rem] text-[2rem] text-slate-700  translation-all duration-200 hover:scale-110 active:scale-100"
              onClick={() => setShowTodoCreatorArea((prev) => !prev)}
            >
              {showTodoCreatorArea ? <MdChevronLeft /> : <MdChevronRight />}
            </button>
          </>
        )}
        <div
          className="flex flex-col items-center
        justify-center gap-3 w-[3rem]"
        >
          <img
            src={`${
              team.profile
                ? `http://localhost:5050/uploads/teams/profiles/${team.profile}`
                : ""
            }`}
            alt="profile"
            className="size-[2.8rem] rounded-full drop-shadow-md"
          />

          <span
            className="font-semibold text-slate-600"
            style={{ writingMode: "vertical-rl" }}
          >
            {team.name}
          </span>
        </div>
      </div>

      <div className="">
        <motion.section
          initial={{ x: "-20rem" }}
          animate={{
            x: showMembers ? 0 : "-20rem",
          }}
          transition={{ duration: 0.7, type: "tween" }}
          className={`absolute z-[999] min-w-[16rem] bg-white border-t-[.1rem] border-t-gray-100`}
        >
          <div>
            <div className="flex mb-1">
              <input
                type="text"
                placeholder=" Search & add member"
                className="py-2 w-full text-slate-700 font-semibold tracking-wide placeholder:font-normal indent-2 outline-none border-b-[.1rem] border-b-slate-400 rounded-sm transition-all duration-200  focus:bg-gray-50"
                value={search}
                onChange={searchHandler}
              />
            </div>

            <section className="relative w-full">
              <div className="absolute z-[99] w-full px-2 divide-y-[.05rem] divide-slate-200 h-[78.4vh] bg-gray-50 border-b-[.1rem] border-b-gray-200  overflow-y-scroll scroll-bar-none">
                {members.map((member) => (
                  <TeamMember
                    key={member._id}
                    onAddMember={addMemberHandler}
                    user={member}
                    memberStatus={
                      team.members.find((mem) => mem.user._id === member._id)
                        ?.status || (MEMBER_STATUS.PENDING as IMemberStatus)
                    }
                    showAddBtn={
                      !team.members.find((mem) => mem.user._id === member._id)
                    }
                    showRemoveBtn={
                      !!team.members.find((mem) => mem.user._id === member._id)
                    }
                    onRemoveMember={removeMemberHandler}
                  />
                ))}
              </div>
            </section>
          </div>
        </motion.section>

        <DragDropContext
          onDragStart={dragStartHandler}
          onDragEnd={dragEndHandler}
        >
          <TaskManagementSection
            team={team}
            showTodoCreatorArea={showTodoCreatorArea}
            setTeam={setTeam}
            teamComments={teamComments}
            setTeamComments={setTeamComments}
            showTeamChat={showTeamChat}
            setShowTeamChat={setShowTeamChat}
          />
        </DragDropContext>
      </div>
    </div>
  );
};

export default Team;
