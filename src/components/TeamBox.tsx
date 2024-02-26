import { NavLink } from "react-router-dom";
import { ITeam } from "../types/global";

type TeamBoxProp = {
  team: ITeam;
};
export const TeamBox = ({ team }: TeamBoxProp) => {
  return (
    <NavLink
      to={`/${team._id}`}
      key={team._id}
      className="relative w-full max-sm:w-[70%] mx-auto border-2 rounded-[.3rem] border-gray-400 flex flex-col"
    >
      <div className="flex items-center py-2 px-2 mb-1 justify-between">
        <div className="flex items-center gap-4">
          <img
            src={`http://localhost:5050/uploads/teams/profiles/${team?.profile}`}
            alt="profile"
            className="size-[3rem] rounded-full drop-shadow-md"
          />
          <span className="font-semibold text-slate-600">{team?.name}</span>
        </div>
      </div>
      <p className="h-[.02rem] bg-slate-100 mx-2"></p>

      <div className="min-h-[4rem]">
        <div
          className="px-2 text-slate-700 line-clamp-4"
          dangerouslySetInnerHTML={{ __html: team.description || "234" }}
        />
      </div>
      <div className="border-t-[.1rem] border-t-gray-100 w-full flex gap-0 items-center mt-2 py-2 px-2 ">
        <img
          className="rounded-full size-[3rem] ring-2 ring-offset-1 ring-slate-500 -mr-[1rem]"
          style={{ transform: "rotateY(15deg)" }}
          src={`http://localhost:5050/uploads/users/profiles/${team?.creator?.profile}`}
          alt="profile"
        />

        {team.members?.slice(0, 4).map((memeber) => (
          <img
            key={memeber._id}
            className="rounded-full size-[3rem] ring-1 ring-slate-300 -mr-[1rem]"
            style={{ transform: "rotateY(15deg)" }}
            src={`http://localhost:5050/uploads/users/profiles/${memeber?.profile}`}
            alt="profile"
          />
        ))}
      </div>
    </NavLink>
  );
};
