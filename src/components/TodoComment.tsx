import { useState } from "react";
import { IComment, ITeam, ITodo } from "../types/global";

import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import AdvancedEditor from "./Froala/AdvancedEditor";
import { useSelector } from "react-redux";
import { RootState } from "../hooks/store";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../constants/data";
import { CommentMessage } from "./CommentMessage";

type ITodoComment = {
  team: ITeam;
  todo: ITodo;
  comments: IComment[];
  setTeamComments: React.Dispatch<React.SetStateAction<IComment[]>>;
};

export const TodoComment = ({
  team,
  todo,
  comments,
  setTeamComments,
}: ITodoComment) => {
  const [showTodoComment, setShowTodoComment] = useState(false);
  const [commentContent, setCommentContent] = useState("comment...");
  const [reply, setReply] = useState<IComment | undefined>(undefined);
  const user = useSelector((state: RootState) => state.user);

  const postCommentHandler = async () => {
    const comment = {
      content: commentContent,
      sender: user._id,
      todoId: todo._id,
      teamId: team._id,
      reply,
    };

    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.post(`${BACKEND_URL}/comments`, comment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      setTeamComments((prev) => [...prev, data.data.comment]);
    } catch (err) {
      if (err instanceof AxiosError) console.warn(err.response?.data);
    }
  };

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
          <div className="flex flex-col gap-[1.8rem] max-h-[20rem] overflow-y-scroll scroll-bar-none px-1 py-2">
            {comments
              .filter((comment) => comment.todo._id === todo._id)
              .map((comment) => (
                // ! COMMENT
                <CommentMessage
                  key={comment._id}
                  comment={comment}
                  reply={reply}
                  setReply={setReply}
                  user={user}
                />
              ))}
          </div>
          <div className="flex flex-col mt-4 border-t-[.05rem] border-b-gray-100 pt-2">
            {reply && (
              <div className="text-sm text-slate-700 mb-2 bg-sky-50 px-3 py-2 rounded-md">
                <span>
                  Your are replying to{" "}
                  <span className="font-semibold text-slate-700">
                    `{reply.sender.name}`
                  </span>{" "}
                  on the message:
                </span>{" "}
                <div
                  className="italic"
                  dangerouslySetInnerHTML={{
                    __html:
                      reply.content.split(" ").length > 4
                        ? reply.content.split(" ").slice(0, 4).join(" ") + "..."
                        : reply.content,
                  }}
                />
              </div>
            )}
            <AdvancedEditor
              initial={commentContent}
              onTextareaChangeHandler={(content: string) => {
                setCommentContent(content);
              }}
              wMax="24rem"
              hMin={100}
              hMax={150}
            />
            <button
              className="font-semibold text-white tracking-wide bg-slate-600 py-[.37rem] rounded-sm mt-1 duration-200 transition-all hover:bg-slate-600/95  active:bg-slate-600"
              onClick={postCommentHandler}
            >
              Post Comment
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
