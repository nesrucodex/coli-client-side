import { NavLink } from "react-router-dom";
import MenuIcon from "./MenuIcon";
import { useState } from "react";
import { motion } from "framer-motion";
import HeaderLink from "./HeaderLink";

import { FaModx } from "react-icons/fa";
import { IUser } from "../types/global";

import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../hooks/user.slice";

const Header = ({ user }: { user: IUser }) => {
  const [showOptions, setShowOptions] = useState(false);
  const showOptionsHandler = (showOption: boolean | undefined) => {
    if (showOption === undefined) return setShowOptions((prev) => !prev);
    setShowOptions(showOption);
  };
  const userDispatch = useDispatch();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    userDispatch(logoutUser());
    setRedirect("/sign-in");
  };

  const [redirect, setRedirect] = useState("");
  if (redirect) return <Navigate to={redirect} />;

  return (
    <header className="px-6 h-[80px] flex items-center drop-shadow-[0_0_1px_#dddddd] bg-white">
      <nav className="flex justify-between items-center relative flex-1">
        <h1 className="lato-black text-slate-700 text-2xl relative">
          <NavLink to="/">
            <span className="absolute -right-[1.4rem] -top-[.5rem]">
              <FaModx />
            </span>
            <span>Coli</span>
          </NavLink>
        </h1>
        <ul className="flex gap-6 items-center lato-regular max-sm:hidden">
          <HeaderLink text="Teams" path="/teams" type="desktop" />
          <HeaderLink text="My Task" path="/my-task" type="desktop" />
          <HeaderLink text="Todos" path="/todos" type="desktop" />
          <button
            className={`transition-all duration-300 hover:text-slate-600 active:text-slate-900 text-slate-700 font-semibold`}
            onClick={logoutHandler}
          >
            Logout
          </button>

          <NavLink
            to="/profile"
            className="rounded-full h-[4rem] grid place-items-center drop-shadow-md"
          >
            <span className="text-[2.4rem]">{user.profile}</span>
          </NavLink>
        </ul>
        <motion.ul
          initial={{ y: "-27rem" }}
          animate={{
            y: showOptions ? 0 : "-27rem",
          }}
          transition={{ duration: 2, type: "spring" }}
          className="flex flex-col pl-1 pt-4 bg-gray-100 lato-regular sm:hidden absolute top-[3.4rem] -right-[1rem] w-[60%] rounded-md ring-1 ring-gray-200 z-[9999]"
        >
          <HeaderLink
            text="Teams"
            path="/teams"
            type="mobile"
            showOptionsHandler={showOptionsHandler}
          />
          <HeaderLink
            text="My Task"
            path="/my-task"
            type="mobile"
            showOptionsHandler={showOptionsHandler}
          />
          <HeaderLink
            text="Todos"
            path="/todos"
            type="mobile"
            showOptionsHandler={showOptionsHandler}
          />

          <div
            className={`border-b-[.2rem] border-b-gray-200 bg-white indent-3 py-2 rounded-sm  transition-all duration-200 hover:ml-2 active:ml-0 text-slate-700 font-semibold`}
            onClick={logoutHandler}
          >
            Logout
          </div>

          <NavLink
            to="/profile"
            className="flex h-[2.8rem] items-center gap-2 border-b-[.2rem] border-b-gray-200 bg-white pl-2 py-2 rounded-sm transition-all duration-200 hover:ml-2 active:ml-0"
          >
            <span className="text-[1.6rem] rounded-full">{user.profile}</span>
            <span className="text-sm font-semibold  text-slate-600">
              {user.name}
            </span>
          </NavLink>
        </motion.ul>
        <MenuIcon
          showOptionsHandler={showOptionsHandler}
          showOptions={showOptions}
        />
      </nav>
    </header>
  );
};

export default Header;
