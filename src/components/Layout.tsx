import { Outlet } from "react-router-dom";
import Header from "./Header";
import { IUser } from "../types/global";

const Layout = ({user}: {user:IUser}) => {
  return (
    <section>
      <Header user={user}/>
      <Outlet />
    </section>
  );
};

export default Layout;
