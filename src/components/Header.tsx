import { NavLink } from "react-router-dom";
import { useState } from "react";

import { FaModx } from "react-icons/fa";
import { IUser } from "../types/global";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../hooks/user.slice";

const Header = ({ user }: { user: IUser }) => {
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
        <ul className="flex gap-6 items-center lato-regular">
          <button
            className={`transition-all duration-300 hover:text-slate-600 active:text-slate-900 text-slate-700 font-semibold`}
            onClick={logoutHandler}
          >
            Logout
          </button>

          <NavLink
            to="/profile"
            className="rounded-full h-[4rem] grid place-items-center"
          >
            <img
              className="rounded-full size-[3.6rem] ring-1 ring-slate-200"
              src={`http://localhost:5050/uploads/users/profiles/${user.profile}`}
              alt="profile"
            />
          </NavLink>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
