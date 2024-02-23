import { Navigate } from "react-router-dom";
import { IUser } from "../types/global";

const Home = ({ user }: { user: IUser }) => {
  if (!user._id) {
    return <Navigate to="/sign-in" />;
  }
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
