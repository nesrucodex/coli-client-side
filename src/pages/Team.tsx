import axios, { AxiosError } from "axios";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ITeam, ITodo, IUser } from "../types/global";
import { useSelector } from "react-redux";
import { RootState } from "../hooks/store";
import { BACKEND_URL } from "../constants/data";
import { TeamMember } from "../components/TeamMember";
import { TaskManagementSection } from "../components/TaskManagementSection";
import { motion } from "framer-motion";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";
const Team = () => {
  const location = useLocation();
  const userState = useSelector((state: RootState) => state.user);
  const [team, setTeam] = useState<ITeam>({
    name: "",
    _id: "",
    creator: userState,
    members: [],
    todos: [],
  });
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<IUser[]>([]);

  const [showMemebers, setShowMembers] = useState(false);
  const [showTodoCreatorArea, setShowTodoCreatorArea] = useState(true);

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

        setTeam((prev) => ({ ...prev, members: [...prev.members, member] }));
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
          members: prev.members.filter((mem) => mem._id !== member._id),
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

  if (!localStorage.getItem("token")) return <Navigate to="/sign-in" />;
  const members = search.trim().length > 0 ? searchResult : team.members;

  const dragStartHandler = (result: DragStart) => {
    result;
  };
  const dragEndHandler = (result: DropResult) => {
    const { draggableId, source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const { droppableId: dDroppableId, index: dIndex } = destination;
    const [dMemberId, dTodoStatus] = dDroppableId.split("-");
    const [sMemberId, sTodoStatus] = source.droppableId.split("-");
    const { index: sIndex } = source;

    const dStartingIndex = team.todos.findIndex(
      (todo) => (todo.status = dTodoStatus)
    );

    console.log(
      { draggableId },
      { sIndex },
      { sMemberId },
      { sTodoStatus },
      { dIndex },
      { dStartingIndex },
      {dMemberId},
      {dTodoStatus}
    );

    const updatedTodos: ITodo[] = team.todos.map((todo) => {
      if (todo._id === draggableId) {
        return {
          ...todo,
          status: dTodoStatus,
          assignee: team.members.find((member) => member._id === dMemberId),
        };
      }
      return todo;
    });

    // Remove the dragged todo item from its original position
    const [removedTodo] = updatedTodos.splice(sIndex, 1);

    // Insert the dragged todo item into its new position
    updatedTodos.splice(dIndex, 0, removedTodo);

    setTeam((prev) => ({ ...prev, todos: updatedTodos }));
    asyncTodosReordering(
      updatedTodos.map(
        (todo, index) =>
          ({ ...todo, order: index } as ITodo & { order: number })
      )
    );
  };

  const asyncTodosReordering = async (todos: (ITodo & { order: number })[]) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.patch(`${BACKEND_URL}/teams/todos/${team._id}`, todos, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) console.warn(error.response?.data);
    }
  };

  console.log("");
  console.log(...team.todos.map((todo) => todo.content));

  return (
    <div className="flex">
      <div className={`relative bg-gray-200 grid place-items-center w-[65px]`}>
        <button
          className="absolute top-[1rem] text-[2rem] text-slate-700  translation-all duration-200 hover:scale-110 active:scale-100"
          onClick={() => setShowMembers((prev) => !prev)}
        >
          {showMemebers ? <MdArrowDropUp /> : <MdArrowDropDown />}
        </button>
        <button
          className="absolute top-[3.4rem] text-[2rem] text-slate-700  translation-all duration-200 hover:scale-110 active:scale-100"
          onClick={() => setShowTodoCreatorArea((prev) => !prev)}
        >
          {showTodoCreatorArea ? <MdChevronLeft /> : <MdChevronRight />}
        </button>
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
          initial={{ y: "-38rem" }}
          animate={{
            y: showMemebers ? "-.1rem" : "-38rem",
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
                {members.map((user) => (
                  <TeamMember
                    key={user._id}
                    onAddMember={addMemberHandler}
                    user={user}
                    showAddBtn={
                      !team.members.find((member) => member._id === user._id)
                    }
                    showRemoveBtn={
                      !!team.members.find((member) => member._id === user._id)
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
          />
        </DragDropContext>
      </div>
    </div>
  );
};

export default Team;
