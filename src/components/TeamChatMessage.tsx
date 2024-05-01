import {  ITeamChat, IUser } from "../types/global";
import { FaReply } from "react-icons/fa";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

type ITeamChatMessage = {
  chat: ITeamChat;
  reply: ITeamChat | undefined;
  setReply: React.Dispatch<React.SetStateAction<ITeamChat | undefined>>;
  user: IUser;
};
export const TeamChatMessage = ({ chat, reply, setReply, user }: ITeamChatMessage) => {
  return (
    <div
      key={chat.sender._id}
      className={`flex ${
        chat.sender._id === user._id ? "flex-row-reverse" : ""
      }  items-start gap-4 pr-2`}
    >
      <img
        className={`rounded-full size-[2.5rem] ring-1 ring-slate-200 ${
          chat.reply ? "relative top-2" : ""
        }`}
        src={`http://localhost:5050/uploads/users/profiles/${chat.sender.profile}`}
        alt="profile"
      />

      <div className="">
        {/* //! For displaying reply */}
        {chat.reply && (
          <div
            className={`text-[.7rem] border-t-[.2rem] border-t-sky-500 pl-2 py-2 pr-4 bg-sky-200 ${
              chat.sender._id === user._id ? "" : ""
            }`}
          >
            <span className="font-semibold tracking-wide">
              <span className="text-blue-700">Reply to </span>{" "}
              {chat.reply.sender.name}
            </span>
            <div
              className="italic"
              dangerouslySetInnerHTML={{
                __html: chat.reply.content.split(" ").slice(0, 5),
              }}
            />
          </div>
        )}
        <div
          className={`text-[.88rem] ${
            reply?._id === chat._id ? `ring-[.2rem] ring-sky-300` : ``
          } ${
            chat.sender._id === user._id ? "bg-gray-100" : "bg-sky-100"
          } py-5 px-6 flex flex-col`}
          style={{ borderRadius: " 0 0 1rem 1rem" }}
        >
          <span
            className={` ${
              chat.sender._id === user._id
                ? "self-start relative -left-[.8rem] -top-[.7rem]"
                : "self-end relative left-[.8rem] -top-[.6rem]"
            }  duration-200 transition-all cursor-pointer ${
              reply?._id === chat._id
                ? "text-blue-500 hover:text-blue-700 active:text-blue-600"
                : "text-slate-700 hover:text-slate-800 active:text-slate-700"
            }`}
            style={{
              transform:
                chat.sender._id === user._id ? "" : "rotateY(180deg)",
            }}
            onClick={() =>
              setReply((prev) =>
                prev
                  ? prev._id === chat._id
                    ? undefined
                    : chat
                  : chat
              )
            }
          >
            <FaReply />
          </span>
          <div
            className={`text-slate-800 ${
              chat.sender._id === user._id ? "" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: chat.content }}
          />
          <span className="self-end text-[.7rem] font-semibold text-slate-600 mt-2 italic">
            {timeAgo.format(new Date(chat.createdAt))}
          </span>
        </div>
      </div>
    </div>
  );
};
