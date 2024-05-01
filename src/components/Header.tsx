import { NavLink } from "react-router-dom";

import { FaModx } from "react-icons/fa";
import { IUser } from "../types/global";

const Header = ({ user }: { user: IUser }) => {
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
          <NavLink
            to="/profile"
            className="rounded-full h-[4rem] grid place-items-center"
          >
            {user.profile ? (
              <img
                className="rounded-full size-[3.6rem] ring-1 ring-slate-200"
                src={`http://localhost:5050/uploads/users/profiles/${user.profile}`}
                alt="profile"
              />
            ) : (
              <p className="rounded-full size-[3.6rem] ring-1 ring-slate-200 bg-gray-100 animate-pulse"></p>
            )}
          </NavLink>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
