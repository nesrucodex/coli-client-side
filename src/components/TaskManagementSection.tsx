import { useEffect, useState } from "react";
import { ITeam, ITodo } from "../types/global";
import AdvancedEditor from "./Froala/AdvancedEditor";

import { FaEdit, FaMinus, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../constants/data";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { TaskMember } from "./TaskMember";

type PropType = {
  team: ITeam;
};

export const TaskManagementSection = ({ team }: PropType) => {
  const [showTodoCreator, setShowTodoCreator] = useState(true);
  const [todo, setTodo] = useState("Todo");
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [updateTodo, setUpdateTodo] = useState<undefined | string>(undefined);
  useEffect(() => {
    setTodos(team.todos);
  }, [team]);

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
      setTodos((prev) => [...prev, data.data.todo]);
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

      setTodos((prev) =>
        prev.map((Todo) =>
          Todo._id === updateTodo ? { ...Todo, content: todo } : Todo
        )
      );
    } catch (error) {
      if (error instanceof AxiosError) console.warn(error.response?.data);
    }
  };
  const deleteTodoHandler = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${BACKEND_URL}/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (error) {
      if (error instanceof AxiosError) console.warn(error.response?.data);
    }
  };

  return (
    <section className="bg-gray-100 h-[calc(100vh-80px)] w-[calc(100vw-67px)] overflow-x-scroll  scroll-bar-none flex items-center gap-2">
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
                      className="text-[1rem] px-4 py-2 rounded-sm font-semibold tracking-wide bg-red-600 text-white transition-all duration-200 hover:bg-red-600/95 active:bg-red-600 grid place-items-center"
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
                      className="text-[1rem] px-4 py-2 rounded-sm font-semibold tracking-wide bg-red-600 text-white transition-all duration-200 hover:bg-red-600/95 active:bg-red-600 grid place-items-center"
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
          <Droppable droppableId="creator">
            {(provided) => (
              <section
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="divide-y-[.1rem] divide-slate-200 mt-[2rem] "
              >
                {todos.map((todo, index) => (
                  <Draggable
                    index={index}
                    draggableId={todo._id}
                    key={todo._id}
                  >
                    {(provided) => (
                      <section
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className={`${
                          updateTodo === todo._id ? "ring-2 ring-blue-300" : ""
                        } bg-white px-2 py-2 rounded-sm mb-1 drop-shadow-sm`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="flex justify-between items-center gap-3 border-b-[.1rem] border-b-gray-100 py-1"
                        >
                          <div>
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
                        <div
                          className="line-clamp-3"
                          key={todo._id}
                          dangerouslySetInnerHTML={{ __html: todo.content }}
                        />
                      </section>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </section>
            )}
          </Droppable>
        </section>
      </div>
      <div className="flex flex-col space-y-[4rem] h-[calc(100vh-84px)] pt-4 pl-[2rem] overflow-y-scroll scroll-bar-none">
        {team.members.map((member) => (
          <section key={member._id} className="w-full">
            <div className="mb-4">
              <TaskMember member={member} />
            </div>
            <section className="flex gap-[4rem] items-start mb-4">
              <TodoStatusComponent
                header="Todo"
                statusId={member._id + "-" + "Todo"}
              />
              <TodoStatusComponent
                header="In Progress"
                width="4rem"
                statusId={member._id + "-" + "Progress"}
              />
              <TodoStatusComponent
                header="Completed"
                width="4rem"
                statusId={member._id + "-" + "Completed"}
              />
              <TodoStatusComponent
                header="Approved"
                width="3rem"
                statusId={member._id + "-" + "Approved"}
              />

              <div className="min-w-[.1rem]  min-h-[10rem] bg-transparent mr-4"></div>
            </section>
          </section>
        ))}
      </div>
    </section>
  );
};

type ITodoStatusComponent = {
  header: string;
  width?: string;
  statusId: string;
};
const TodoStatusComponent = ({
  header,
  statusId,
  width = "2rem",
}: ITodoStatusComponent) => {
  return (
    <div className="">
      <h1 className="text-[1.6rem] font-bold text-slate-700 indent-1">
        {header}
      </h1>
      <p
        className="h-[.15rem] bg-red-400 mb-5 ml-1"
        style={{ width: width }}
      ></p>
      <Droppable droppableId={statusId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-w-[25rem] max-w-[30rem] min-h-[16rem] bg-white rounded-sm drop-shadow border-b-[.15rem] border-b-slate-500"
          >
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
