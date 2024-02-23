import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import Layout from "./components/Layout";
import Teams from "./pages/Teams";
import Todos from "./pages/Todos";
import MyTask from "./pages/My-Task";
import Profile from "./pages/Profile";
import SignUp from "./pages/Sign-Up";
import SignIn from "./pages/Sign-In";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios, { AxiosError } from "axios";
import { signInUser } from "./hooks/user.slice";
import { IUser } from "./types/global";
import Team from "./pages/Team";
import { RootState } from "./hooks/store";

const App = () => {
  const userDispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get(
          "http://localhost:5050/api/v1/users/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const {
          data: { user },
        } = response.data as { data: { user: IUser } };
        userDispatch(signInUser(user));
      } catch (error) {
        if (error instanceof AxiosError) console.warn(error.response?.data);
      }
    };

    getUser();
  }, [userDispatch]);
  return (
    <main className="relative">
      <Routes>
        <Route path="/" element={<Layout user={userData} />}>
          <Route index element={<Home user={userData} />} />
          <Route index element={<Teams />} />
          <Route path="teams/:id" element={<Team />} />
          <Route path="my-task" element={<MyTask />} />
          <Route path="todos" element={<Todos />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </main>
  );
};

export default App;
