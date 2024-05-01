import { IComment, ITeam, ITodo } from "../types/global";
import { TODO_STATUS } from "../constants/data";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { TodoComment } from "./TodoComment";
import { TodoBox } from "./TodoBox";

type ITodoStatusComponent = {
  header: string;
  team: ITeam;
  width?: string;
  statusId: string;
  todos: ITodo[];
  comments: IComment[];
  setTeamComments: React.Dispatch<React.SetStateAction<IComment[]>>;
};
export const TodoStatusComponent = ({
  header,
  statusId,
  width = "2rem",
  todos,
  team,
  comments,
  setTeamComments,
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
        {(provided, snapShot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-w-[25rem] max-w-[30rem] min-h-[16rem] rounded-sm drop-shadow ${
              snapShot.isDraggingOver
                ? "ring-2 ring-sky-500 bg-sky-200"
                : "bg-gray-100/90 border-b-[.15rem] border-b-slate-50 gap-[.15rem]"
            } flex flex-col`}
          >
            {todos.map((todo, index) => (
              <Draggable index={index} draggableId={todo._id} key={todo._id}>
                {(provided, snapShot) => (
                  <section
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className={`bg-white px-2 py-2 rounded-sm mb-1 ${
                      snapShot.isDragging
                        ? "ring-2 ring-sky-500 z-[9999]"
                        : "drop-shadow"
                    } `}
                  >
                    <div className="flex justify-between items-center gap-3 border-b-[.1rem] border-b-gray-100 py-1">
                      <div {...provided.dragHandleProps}>
                        <h2 className="text-slate-600 text-sm font-semibold">
                          <span className="text-lg">#</span>
                          {todo._id}
                        </h2>
                      </div>
                    </div>

                    <TodoBox content={todo.content} />
                    {todo.status !== TODO_STATUS.CREATED && (
                      <TodoComment
                        team={team}
                        todo={todo}
                        comments={comments}
                        setTeamComments={setTeamComments}
                      />
                    )}
                  </section>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
