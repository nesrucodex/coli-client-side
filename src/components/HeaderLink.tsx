import { NavLink } from "react-router-dom";

type Props = {
  text: string;
  path: string;
  type: "desktop" | "mobile";
  showOptionsHandler?: (showOption: boolean) => void;
};

const HeaderLink = ({ text, path, type, showOptionsHandler }: Props) => {
  return (
    <NavLink
      to={path}
      className={`${
        type === "desktop"
          ? "transition-all duration-300 hover:text-slate-600 active:text-slate-900"
          : "border-b-[.2rem] border-b-gray-200 bg-white indent-3 py-2 rounded-sm transition-all duration-200 hover:ml-2 active:ml-0"
      } text-slate-700 font-semibold`}
      onClick={() => {
        showOptionsHandler?.(false);
      }}
    >
      {text}
    </NavLink>
  );
};

export default HeaderLink;
