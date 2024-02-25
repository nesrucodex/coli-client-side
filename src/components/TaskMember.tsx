import { FaModx } from "react-icons/fa";
import { IUser } from "../types/global";

export const TaskMember = ({ member }: { member: IUser }) => {
  return (
    <div className="flex items-center gap-2">
      <img
            className="rounded-full size-[4rem] ring-1 ring-slate-200"
            src={`http://localhost:5050/uploads/users/profiles/${member.profile}`}
            alt="profile"
          />
      <p className="font-semibold text-slate-700 text-[1rem] flex items-center gap-1">
        <span className="">{member.name}</span>
        <span className="relative top-[-.4rem]">
          <FaModx />
        </span>
      </p>
    </div>
  );
};
