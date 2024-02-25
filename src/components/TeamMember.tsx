import { FaMinus, FaPlus } from "react-icons/fa";
import { IUser } from "../types/global";

type TeamMemberProps = {
  user: IUser;
  showAddBtn: boolean;
  showRemoveBtn: boolean;
  onAddMember: (user: IUser) => void;
  onRemoveMember: (user: IUser) => void;
};
export const TeamMember = ({
  user,
  onAddMember,
  showAddBtn,
  showRemoveBtn,
  onRemoveMember,
}: TeamMemberProps) => {
  return (
    <div className="relative flex items-center gap-3 py-2">
      <img
        className="rounded-full size-[3.4rem] ring-1 ring-slate-200"
        src={`http://localhost:5050/uploads/users/profiles/${user.profile}`}
        alt="profile"
      />
      <p className="flex flex-col">
        <span className="text-slate-700 text-[.9rem] font-semibold">
          {user.name.length < 25 ? user.name : user.name.slice(0, 22) + "..."}
        </span>
        <span className="text-[.7rem] text-slate-600">
          {user.email.length < 25
            ? user.email
            : user.email.slice(0, 22) + "..."}
        </span>
      </p>
      {showAddBtn && (
        <button
          className="absolute right-1 font-extrabold text-md text-slate-600 transition-all duration-200 hover:scale-[1.1] active:scale-[1]"
          onClick={() => onAddMember(user)}
        >
          <FaPlus />
        </button>
      )}
      {showRemoveBtn && (
        <button
          className="absolute right-1 font-extrabold text-md text-red-600 transition-all duration-200 hover:scale-[1.1] active:scale-[1]"
          onClick={() => onRemoveMember(user)}
        >
          <FaMinus />
        </button>
      )}
    </div>
  );
};
