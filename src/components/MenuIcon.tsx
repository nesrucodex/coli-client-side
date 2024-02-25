type IProp = {
  showOptionsHandler: (showOption: boolean | undefined) => void;
  showOptions: boolean;
};

const MenuIcon = ({ showOptionsHandler, showOptions }: IProp) => {
  return (
    <div className="">
      <ul
        className="flex flex-col gap-1 transition-all duration-200 hover:scale-[1.1] active:scale-1 cursor-pointer"
        onClick={() => showOptionsHandler(undefined)}
      >
        <li
          className={`w-[26px] h-[2.5px] bg-slate-700 rounded-md relative ${
            showOptions
              ? "rotate-[45deg] -translate-x-[1px] translate-y-[2px]"
              : ""
          }`}
        ></li>
        {!showOptions && (
          <li className="w-[26px] h-[2.5px] bg-slate-700 rounded-md"></li>
        )}
        <li
          className={`w-[26px] h-[2.5px] bg-slate-700 rounded-md relative ${
            showOptions ? "rotate-[-45deg] -translate-y-1" : ""
          }`}
        ></li>
      </ul>
    </div>
  );
};

export default MenuIcon;
