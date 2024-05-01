import { useState } from "react";
import { Navigate } from "react-router-dom";
import { logoutUser } from "../hooks/user.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../hooks/store";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profile = () => {
  const userDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const logoutHandler = () => {
    localStorage.removeItem("token");
    userDispatch(logoutUser());
    setRedirect("/sign-in");
  };

  const [showOldPassword, setShowOldPassowrd] = useState(false);
  const [showNewPassword, setShowNewPassowrd] = useState(false);

  // const [userState, setUserState] = useState({
  //   name: user.name,
  //   email: user.email,
  //   profile: user.profile,
  //   password: "",
  //   newPassword: "",
  // });

  const [redirect, setRedirect] = useState("");
  if (redirect) return <Navigate to={redirect} />;

  return (
    <div className="h-[calc(100vh-140px)] overflow-y-scroll scroll-bar-none">
      <section className="flex items-center max-sm:flex-col justify-between gap-[4rem] mt-[2rem] max-w-5xl mx-auto">
        {/* CONTENT */}
        <div className="w-[50%] max-sm:w-full">
          <h1
            style={{ lineHeight: "140%" }}
            className="text-center text-3xl sm:text-4xl font-semibold text-slate-700 mt-6 mb-4 px-4 uppercase max-w-xl mx-auto"
          >
            Welcome{" "}
            <span className="text-sky-800">{user.name.split(" ")[0]},</span>
            <span> here you can update your profile 😁</span>
          </h1>
        </div>

        {/* //! updating form*/}
        <section className="flex flex-col gap-[2rem] justify-center px-2 w-[50%] max-sm:w-[70%]">
          {/* <p className="text-center text-lg text-slate-700">stupid messages</p> */}
          <div>
            <label htmlFor="upload-image">
              <div className="grid place-items-center">
                {user.profile ? (
                  <img
                    className="rounded-full size-[5rem] ring-[.3rem] ring-offset-4 ring-slate-400"
                    src={`http://localhost:5050/uploads/users/profiles/${user.profile}`}
                    alt="profile"
                  />
                ) : (
                  <p className="rounded-full size-[5rem] ring-1 ring-slate-200 bg-gray-100 animate-pulse"></p>
                )}
              </div>
            </label>
            <input type="file" className="hidden" id="upload-image" />
          </div>

          <div className="flex flex-col w-full relative">
            <span className="absolute text-[.7rem] uppercase -top-[.4rem] text-slate-500">
              Full name
            </span>
            <input
              type="text"
              value={user.name}
              className="bg-gray-50 px-1 pt-3 pb-1 font-slate-700 tracking-wide border-b-[.14rem] border-b-slate-200 rounded-sm transition-all duration-200 hover:bg-white focus:bg-gray-100 outline-none"
            />
          </div>
          <div className="flex flex-col w-full relative">
            <span className="absolute text-[.7rem] uppercase -top-[.4rem] text-slate-500">
              Email
            </span>
            <input
              type="email"
              value={user.email}
              className="bg-gray-50 px-1 pt-3 pb-1 font-slate-700 tracking-wide border-b-[.14rem] border-b-slate-200 rounded-sm transition-all duration-200 hover:bg-white focus:bg-gray-100 outline-none"
            />
          </div>
          <div className="flex flex-col w-full relative">
            <span
              className="absolute right-[.4rem] top-[.6rem] text-slate-600 text-lg transition-all duration-200 hover:scale-[1.1] active:scale-[1] cursor-pointer"
              onClick={() => setShowOldPassowrd((prev) => !prev)}
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            <span className="absolute text-[.7rem] uppercase -top-[.4rem] text-slate-500">
              Old Password
            </span>
            <input
              type={showOldPassword ? "text" : "password"}
              className="bg-gray-50 px-1 pt-3 pb-1 font-slate-700 tracking-wide border-b-[.14rem] border-b-slate-200 rounded-sm transition-all duration-200 hover:bg-white focus:bg-gray-100 outline-none"
            />
          </div>
          <div className="flex flex-col w-full relative">
            <span className="absolute text-[.7rem] uppercase -top-[.4rem] text-slate-500">
              New Password
            </span>

            <span
              className="absolute right-[.4rem] top-[.6rem] text-slate-600 text-lg transition-all duration-200 hover:scale-[1.1] active:scale-[1] cursor-pointer"
              onClick={() => setShowNewPassowrd((prev) => !prev)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            <input
              type={showNewPassword ? "text" : "password"}
              className="bg-gray-50 px-1 pt-3 pb-1 font-slate-700 tracking-wide border-b-[.14rem] border-b-slate-200 rounded-sm transition-all duration-200 hover:bg-white focus:bg-gray-100 outline-none"
            />
          </div>

          <button className="bg-green-200 font-bold text-slate-700 py-2 rounded-sm tracking-wide mt-4 transition-all duration-200 hover:bg-green-300/70 active:bg-green-300">
            Update
          </button>
        </section>
      </section>
      <button
        className={` absolute left-[2rem] -bottom-[2rem] transition-all duration-300 hover:text-slate-600 active:text-slate-900 text-slate-700 font-semibold underline underline-offset-[.34rem]`}
        onClick={logoutHandler}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
