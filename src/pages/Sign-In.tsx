import { FormEvent, useId, useReducer, useState } from "react";
import Input from "../components/Input";
import { FaGoogle } from "react-icons/fa";
import { NavLink, Navigate } from "react-router-dom";
import { ASYNC_STATE, IUser } from "../types/global";
import { useDispatch, useSelector } from "react-redux";
import { signInUser } from "../hooks/user.slice";
import axios, { AxiosError } from "axios";
import { RootState } from "../hooks/store";

interface IError {
  type: SignInActions | undefined;
  message: string;
  status: boolean;
}

type ISignInUser = Omit<IUser, "_id" | "name" | "profile"> & {
  password: string;
  error: IError;
};

enum SignInActions {
  SET_EMAIL,
  SET_PASSWORD,
  SET_ERROR,
}

const initial: ISignInUser = {
  email: "",
  password: "",
  error: { type: undefined, message: "", status: false },
};

const reducer = (
  state: ISignInUser,
  action: {
    type: SignInActions;
    payload: string | IError;
  }
) => {
  const { type } = action;
  switch (type) {
    case SignInActions.SET_EMAIL: {
      const { payload } = action;
      if (typeof payload !== "string") return state;

      const email = payload;
      return { ...state, email };
    }

    case SignInActions.SET_PASSWORD: {
      const { payload } = action;
      if (typeof payload !== "string") return state;

      const password = payload;
      return { ...state, password };
    }

    case SignInActions.SET_ERROR: {
      const { payload } = action;
      if (typeof payload === "string") return state;

      const error = payload;
      return { ...state, error };
    }

    default:
      throw new Error("Unimplemented method");
  }
};

const SignIn = () => {
  const emailId = useId();
  const passwordId = useId();

  const [state, dispatch] = useReducer(reducer, initial);
  const userDispatch = useDispatch();
  const [asyncState, setAsyncState] = useState(ASYNC_STATE.IDEL);
  const userData = useSelector((state: RootState) => state.user);

  if (userData.loggedIn) return <Navigate to="/" />;

  const SignInHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = state;

    if (!/\b\D+\w*@gmail.com/.test(email) || !email)
      return dispatch({
        type: SignInActions.SET_ERROR,
        payload: {
          status: true,
          message: "Please provide valid email!",
          type: SignInActions.SET_EMAIL,
        },
      });

    if (password.trim().length < 6)
      return dispatch({
        type: SignInActions.SET_ERROR,
        payload: {
          status: true,
          message: "Please provide strong password greater than 5 symbols!",
          type: SignInActions.SET_PASSWORD,
        },
      });

    const user: Omit<IUser, "_id" | "name" | "profile"> & { password: string } =
      {
        email,
        password,
      };

    try {
      setAsyncState(ASYNC_STATE.LOADING);
      const response = await axios.post(
        "http://localhost:5050/api/v1/users/sign-in",
        user
      );
      const {
        data: { user: userData },
        token,
      } = response.data as { data: { user: IUser }; token: string };
      localStorage.setItem("token", token);
      userDispatch(signInUser(userData));
    } catch (error) {
      if (error instanceof AxiosError) console.warn(error.response?.data);
      setAsyncState(ASYNC_STATE.ERROR);
    }
  };

  return (
    <div className="h-screen grid place-items-center">
      <section className="min-w-[16rem] max-w-[30rem]">
        <h1
          className="font-bold text-3xl mb-4 text-center text-slate-700"
          style={{ lineHeight: "150%" }}
        >
          Supercharge Your
          <span className="text-red-400"> Productivity </span>
          with COLI - Sign In Now!
        </h1>
        <form className="flex flex-col gap-3 px-3" onSubmit={SignInHandler}>
          <p className="text-slate-500 text-sm font-semibold">
            If you already have an account,{" "}
            <NavLink className="text-slate-600" to="/sign-up">
              Sign Up
            </NavLink>
          </p>
          <Input
            id={emailId}
            type="email"
            labelText={
              state.error.status && state.error.type === SignInActions.SET_EMAIL
                ? state.error.message
                : "Email"
            }
            color={
              state.error.status && state.error.type === SignInActions.SET_EMAIL
                ? "red"
                : ""
            }
            borderBottomColor={
              state.error.status && state.error.type === SignInActions.SET_EMAIL
                ? "border-b-red-400"
                : ""
            }
            initial={state.email}
            onInputChangeHandler={(value: string) => {
              dispatch({
                type: SignInActions.SET_ERROR,
                payload: {
                  status: false,
                  message: "",
                  type: undefined,
                },
              });
              dispatch({ type: SignInActions.SET_EMAIL, payload: value });
            }}
          />

          <Input
            id={passwordId}
            type="password"
            labelText={
              state.error.status &&
              state.error.type === SignInActions.SET_PASSWORD
                ? state.error.message
                : "Password"
            }
            color={
              state.error.status &&
              state.error.type === SignInActions.SET_PASSWORD
                ? "red"
                : ""
            }
            borderBottomColor={
              state.error.status &&
              state.error.type === SignInActions.SET_PASSWORD
                ? "border-b-red-400"
                : ""
            }
            initial={state.password}
            onInputChangeHandler={(value: string) => {
              dispatch({
                type: SignInActions.SET_ERROR,
                payload: {
                  status: false,
                  message: "",
                  type: undefined,
                },
              });
              dispatch({ type: SignInActions.SET_PASSWORD, payload: value });
            }}
          />

          <div className="mt-4">
            <button
              disabled={asyncState === ASYNC_STATE.LOADING && true}
              className={`block w-full py-2 rounded-sm font-semibold ${
                asyncState !== ASYNC_STATE.LOADING
                  ? "bg-slate-700 text-white hover:bg-slate-700/95 active:bg-slate-700"
                  : " bg-gray-100 text-slate-700"
              } tracking-wide transition-all duration-200 `}
            >
              {asyncState !== ASYNC_STATE.LOADING ? "Sign In" : "Waiting..."}
            </button>
          </div>
        </form>

        <p className="text-center my-2 font-semibold">Or</p>
        <div className="px-3">
          <button
            disabled={asyncState === ASYNC_STATE.LOADING && true}
            className="flex items-center justify-center w-full mb-4 ring-1 ring-slate-600 py-2  rounded-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 active:opacity-100 "
          >
            {asyncState !== ASYNC_STATE.LOADING ? (
              <>
                {" "}
                <span className="text-xl text-orange-500">
                  <FaGoogle />
                </span>
                <span className="ml-4 text-slate-700">Sign In with Google</span>
              </>
            ) : (
              "Waiting..."
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default SignIn;
