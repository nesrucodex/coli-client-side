import { useState } from "react";
import { ITeam } from "../types/global";
import { FaTelegramPlane } from "react-icons/fa";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

type ITodoComment = {
  team: ITeam;
};

export const TodoComment = ({ team }: ITodoComment) => {
  const [showTodoComment, setShowTodoComment] = useState(false);
  return (
    <div className="flex flex-col border-t-[.05rem] mt-3">
      <button
        className="mt-1 text-[2rem] text-slate-700  translation-all duration-200 hover:scale-110 active:scale-100 self-end"
        onClick={() => setShowTodoComment((prev) => !prev)}
      >
        {showTodoComment ? <MdArrowDropUp /> : <MdArrowDropDown />}
      </button>

      {showTodoComment && (
        <section className="">
          {/* // ! COMMENTS  */}
          <div className="flex flex-col gap-4 max-h-[20rem] overflow-y-scroll scroll-bar-none px-1 py-2">
            {team.members.map((user) => (
              // ! COMMENT
              <div
                key={user._id}
                className=" flex `flex-row-reverse` items-start gap-4 pr-2"
              >
                <img
                  className="rounded-full size-[2.5rem] ring-1 ring-slate-200"
                  src={`http://localhost:5050/uploads/users/profiles/${user.profile}`}
                  alt="profile"
                />
                <p className="text-[.88rem] bg-blue-100 py-2 pl-2 pr-3 rounded-md flex flex-col">
                  <span className="text-slate-800 ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Culpa, facilis. Repudiandae ipsum ?
                  </span>
                  <span className="self-end text-[.7rem] font-semibold text-slate-600">
                    12/12/34
                  </span>
                </p>
              </div>
            ))}
          </div>
          <form className="flex">
            <input
              className="resize-none outline-none w-full px-1 py-2 bg-gray-50 font-semibold placeholder:font-normal text-slate-700 text-sm border-b-[.1rem] border-b-slate-200 translation-all duration-300  hover:border-b-slate-400  focus:border-b-slate-400 pr-1"
              placeholder=" Write comment..."
            />
            <button className="text-2xl w-[3rem] grid place-items-center translation-all duration-200 text-slate-700 hover:text-slate-700/90 active:text-slate-700">
              <FaTelegramPlane />
            </button>
          </form>
        </section>
      )}
    </div>
  );
};
