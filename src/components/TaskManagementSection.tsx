import { useState } from "react";
import { ITeam } from "../types/global";
import AdvancedEditor from "./Froala/AdvancedEditor";

import { FaEdit, FaMinus, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import axios, { AxiosError } from "axios";
import { BACKEND_URL, TODO_STATUS } from "../constants/data";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { TaskMember } from "./TaskMember";
import { TodoStatusComponent } from "./TodoStatusComponent";
import { TodoBox } from "./TodoBox";

type PropType = {
  team: ITeam;
  showTodoCreatorArea?: boolean;
  setTeam: React.Dispatch<React.SetStateAction<ITeam>>;
};

export const TaskManagementSection = ({
  team,
  showTodoCreatorArea = true,
  setTeam,
}: PropType) => {
  const [showTodoCreator, setShowTodoCreator] = useState(false);
  const [todo, setTodo] = useState("Todo");
  const [updateTodo, setUpdateTodo] = useState<undefined | string>(undefined);

  const createTodoHandler = async (todo: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.post(
        `${BACKEND_URL}/todos`,
        {
          content: todo,
          team: team._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setTeam((prev) => ({ ...prev, todos: [...prev.todos, data.data.todo] }));
    } catch (error) {
      if (error instanceof AxiosError) console.warn(error.response?.data);
    }
  };
  const updateTodoHandler = async (todoId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.patch(
        `${BACKEND_URL}/todos/${todoId}`,
        {
          content: todo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeam((prev) => ({
        ...prev,
        todos: prev.todos.map((Todo) =>
          Todo._id === updateTodo ? { ...Todo, content: todo } : Todo
        ),
      }));
    } catch (error) {
      if (error instanceof AxiosError) console.warn(error.response?.data);
    }
  };
  const deleteTodoHandler = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(`${BACKEND_URL}/todos/${id}/${team._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeam((prev) => ({
        ...prev,
        todos: prev.todos.filter((todo) => todo._id !== id),
      }));
    } catch (error) {
      if (error instanceof AxiosError) console.warn(error.response?.data);
    }
  };

  return (
    <section className="bg-gray-100 h-[calc(100vh-80px)] w-[calc(100vw-67px)] overflow-x-scroll  scroll-bar-none flex items-center gap-2">
      {showTodoCreatorArea && (
        <div className="relative min-w-[18rem] max-w-[25rem] h-[calc(100vh-90px)] overflow-y-scroll scroll-bar-none px-1 pt-4 ">
          <TaskMember member={team.creator} />
          <section className="mt-4">
            <div className=" flex flex-col items-end gap-2">
              <AdvancedEditor
                initial={todo}
                hMin={200}
                hMax={300}
                wMax="34rem"
                onTextareaChangeHandler={(content: string) => {
                  setTodo(content);
                }}
                hideEditor={!showTodoCreator}
              />
              <div className=" text-slate-600 text-[1.4rem] flex items-center cursor-pointer">
                {showTodoCreator ? (
                  <div className="flex gap-6">
                    {updateTodo ? (
                      <span
                        className="text-[1rem] px-4 py-2 rounded-sm font-semibold tracking-wide border-[.1rem] border-red-400 text-red-700 transition-all duration-200 hover:border-red-400/95 active:border-red-400 grid place-items-center"
                        onClick={() => {
                          setShowTodoCreator((prev) => !prev);
                          setTodo("Todo");
                          setUpdateTodo(undefined);
                        }}
                      >
                        <FaTimes />
                      </span>
                    ) : (
                      <span
                        className="text-[1rem] px-4 py-2 rounded-sm font-semibold tracking-wide border-[.1rem] border-red-400 text-red-700 transition-all duration-200 hover:border-red-400/95 active:border-red-400 grid place-items-center"
                        onClick={() => setShowTodoCreator((prev) => !prev)}
                      >
                        <FaMinus />
                      </span>
                    )}
                    {updateTodo ? (
                      <span
                        className="text-[1rem] px-4 py-2 rounded-sm font-semibold tracking-wide bg-slate-700 text-white transition-all duration-200 hover:bg-slate-700/95 active:bg-slate-700 grid place-items-center"
                        onClick={() => {
                          updateTodoHandler(updateTodo);
                        }}
                      >
                        <FaSave />
                      </span>
                    ) : (
                      <span
                        className="text-[1rem] px-4 py-2 rounded-sm font-semibold tracking-wide bg-slate-700 text-white transition-all duration-200 hover:bg-slate-700/95 active:bg-slate-700 grid place-items-center"
                        onClick={() => {
                          createTodoHandler(todo);
                        }}
                      >
                        <FaSave />
                      </span>
                    )}
                  </div>
                ) : (
                  <span
                    className="text-[1rem] px-4 py-2 rounded-sm font-semibold tracking-wide bg-slate-700 text-white transition-all duration-200 hover:bg-slate-700/95 active:bg-slate-700 grid place-items-center"
                    onClick={() => setShowTodoCreator((prev) => !prev)}
                  >
                    <FaPlus />
                  </span>
                )}
              </div>
            </div>
            <Droppable
              droppableId={team.creator._id + "-" + TODO_STATUS.CREATED}
            >
              {(provided, snapShot) => (
                <section
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`relative divide-y-[.1rem] divide-slate-200 mt-[2rem] ${
                    snapShot.isDraggingOver
                      ? "ring-2 ring-sky-500 bg-sky-200"
                      : team.todos.filter(
                          (todo) => todo?.status === TODO_STATUS.CREATED
                        ).length === 0 &&
                        "bg-white min-h-[12rem] drop-shadow-sm"
                  }`}
                >
                  {team.todos
                    .filter((todo) => todo?.status === TODO_STATUS.CREATED)
                    .map((todo, index) => (
                      <Draggable
                        index={index}
                        draggableId={todo._id}
                        key={todo._id}
                      >
                        {(provided, snapShot) => (
                          <section
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            className={`z-[99] ${
                              updateTodo === todo._id
                                ? "ring-2 ring-blue-300"
                                : ""
                            } ${
                              snapShot.isDragging && "ring-2 ring-sky-400"
                            } bg-white px-2 py-2 rounded-sm mb-1 drop-shadow-sm`}
                          >
                            <div className="flex justify-between items-center gap-3 border-b-[.1rem] border-b-gray-100 py-1">
                              <div {...provided.dragHandleProps}>
                                <h2 className="text-slate-600 text-sm font-semibold">
                                  <span className="text-lg">#</span>
                                  {todo._id}
                                </h2>
                              </div>
                              {updateTodo !== todo._id && (
                                <div className="flex gap-3 items-center">
                                  <span
                                    className="text-red-600  transition-all duration-200 hover:scale-110 active:scale-100 cursor-pointer"
                                    onClick={() => deleteTodoHandler(todo._id)}
                                  >
                                    <FaTimes />
                                  </span>
                                  <span
                                    className="text-slate-600 transition-all duration-200 hover:scale-110 active:scale-100 cursor-pointer"
                                    onClick={() => {
                                      setShowTodoCreator(true);
                                      setUpdateTodo(todo._id);
                                      setTodo(todo.content);
                                    }}
                                  >
                                    <FaEdit />
                                  </span>
                                </div>
                              )}
                            </div>
                            <TodoBox content={todo.content} />
                          </section>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  {team.todos.filter(
                    (todo) => todo?.status === TODO_STATUS.CREATED
                  ).length === 0 && (
                    <h2 className="text-center relative top-[5rem]  text-slate-300">
                      Empty Todo
                    </h2>
                  )}
                </section>
              )}
            </Droppable>
          </section>
        </div>
      )}
      <div className="flex flex-col space-y-[4rem] h-[calc(100vh-84px)] pt-4 pl-[2rem] overflow-y-scroll scroll-bar-none">
        {team.members.map((member) => (
          <section key={member._id} className="w-full">
            <div className="mb-4">
              <TaskMember member={member} />
            </div>
            <section className="flex gap-[4rem] items-start mb-4">
              <TodoStatusComponent
                team={team}
                header="Todo"
                statusId={member._id + "-" + TODO_STATUS.TODO}
                todos={team.todos.filter(
                  (todo) =>
                    todo?.assignee?._id === member._id &&
                    todo.status === TODO_STATUS.TODO
                )}
              />
              <TodoStatusComponent
                team={team}
                header="In Progress"
                width="4rem"
                statusId={member._id + "-" + TODO_STATUS.IN_PROGRESS}
                todos={team.todos.filter(
                  (todo) =>
                    todo?.assignee?._id === member._id &&
                    todo.status === TODO_STATUS.IN_PROGRESS
                )}
              />
              <TodoStatusComponent
                team={team}
                header="Completed"
                width="4rem"
                statusId={member._id + "-" + TODO_STATUS.COMPLETED}
                todos={team.todos.filter(
                  (todo) =>
                    todo?.assignee?._id === member._id &&
                    todo.status === TODO_STATUS.COMPLETED
                )}
              />
              <TodoStatusComponent
                team={team}
                header="Approved"
                width="3rem"
                statusId={member._id + "-" + TODO_STATUS.APPROVED}
                todos={team.todos.filter(
                  (todo) =>
                    todo?.assignee?._id === member._id &&
                    todo.status === TODO_STATUS.APPROVED
                )}
              />

              <div className="min-w-[.1rem]  min-h-[10rem] bg-transparent mr-4"></div>
            </section>
          </section>
        ))}
      </div>
    </section>
  );
};


