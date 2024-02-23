import { FaPlus } from "react-icons/fa";

type ITeamItem = {
  showTeamCreatorHandler: (showColiCreation?: boolean) => void;
};

const TeamItem = ({ showTeamCreatorHandler }: ITeamItem) => {
  return (
    <div className="grid place-items-center w-full max-sm:w-[70%] mx-auto aspect-[4/3] border-2 rounded-[.3rem] border-gray-400">
      <span
        className="grid place-items-center text-2xl text-slate-600 border-2 border-slate-400 rounded-full size-12 transition-all duration-200 hover:scale-[1.2] active:scale-[1] cursor-pointer"
        onClick={() => showTeamCreatorHandler(true)}
      >
        <FaPlus />
      </span>
    </div>
  );
};

export default TeamItem;
