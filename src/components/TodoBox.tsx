import { useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

type ITodoBox = {
  content: string;
  showTodoInitail?: boolean;
};
export const TodoBox = ({ content, showTodoInitail = false }: ITodoBox) => {
  const [showTodoDetail, setShowTodoDetail] = useState(showTodoInitail);
  return (
    <div className="relative">
      <div
        className={`${showTodoDetail ? "line-clamp-20" : "line-clamp-3"} py-2`}
        dangerouslySetInnerHTML={{ __html: content }} />

      <button
        className="absolute top-1 right-0 text-[2rem] text-slate-700 translation-all duration-200 hover:scale-110 active:scale-100"
        onClick={() => {
          setShowTodoDetail((prev) => !prev);
        }}
      >
        {showTodoDetail ? <MdArrowDropUp /> : <MdArrowDropDown />}
      </button>
    </div>
  );
};
