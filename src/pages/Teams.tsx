import { useEffect, useState } from "react";
import Overlay from "../components/Overlay";
import TeamCreator from "../components/Teams/TeamCreator";
import TeamItem from "../components/Teams/TeamItem";
import Hline from "../components/Hline";
import axios, { AxiosError } from "axios";
import { ITeam } from "../types/global";
import { NavLink } from "react-router-dom";

import { FaRegEdit } from "react-icons/fa";

const Teams = () => {
  const [showTeamCreator, setShowTeamCreator] = useState(false);
  const [teams, setTeams] = useState<ITeam[]>([]);
  console.log("🚀 ~ Teams ~ teams:", teams);

  const addTeamHandler = (team: ITeam) => {
    setTeams((prev) => [...prev, team]);
  };
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get(
          "http://localhost:5050/api/v1/teams",

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        setTeams(data.data.teams);
      } catch (error) {
        if (error instanceof AxiosError) console.warn(error.response?.data);
      }
    };

    getUser();
  }, []);

  const showTeamCreatorHandler = (showTeamCreator?: boolean) => {
    if (showTeamCreator === undefined) setShowTeamCreator((prev) => !prev);
    else setShowTeamCreator(showTeamCreator);
  };
  return (
    <section className="relative h-[calc(100vh-80px)] w-screen overflow-hidden">
      <header className="my-4">
        <h1 className="text-4xl uppercase indent-4 font-semibold text-slate-700">
          Create Team
        </h1>
        <Hline w="7.7rem" h=".2rem" mt=".4rem" lf="1rem" />
      </header>
      <section className="grid grid-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-[2rem] sm:px-[1rem] py-[2rem] h-[70vh] overflow-x-hidden scroll-bar-none ">
        <TeamItem showTeamCreatorHandler={showTeamCreatorHandler} />

        {teams.map((team) => (
          <TeamBox team={team} key={team._id} />
        ))}
      </section>

      <Overlay
        showOverlay={showTeamCreator}
        overlayClickHandler={showTeamCreatorHandler}
        minHeight="100vh"
      >
        <TeamCreator
          onAddTeam={addTeamHandler}
          showTeamCreator={showTeamCreator}
          showTeamCreatorHandler={showTeamCreatorHandler}
        />
      </Overlay>
    </section>
  );
};

type TeamBoxProp = {
  team: ITeam;
};
export const TeamBox = ({ team }: TeamBoxProp) => {
  return (
    <NavLink
      to={`/teams/${team._id}`}
      key={team._id}
      className="relative w-full max-sm:w-[70%] mx-auto aspect-[4/3] border-2 rounded-[.3rem] border-gray-400 flex flex-col"
    >
      <div className="flex items-center py-2 px-2 mb-1 justify-between">
        <div className="flex items-center gap-4">
          <img
            src={`http://localhost:5050/uploads/teams/profiles/${team.profile}`}
            alt="profile"
            className="size-[3rem] rounded-full drop-shadow-md"
          />
          <span className="font-semibold text-slate-600">{team.name}</span>
        </div>
        <span className="text-slate-600 text-[1.2rem] cursor-pointer">
          <FaRegEdit />
        </span>
      </div>
      <p className="h-[.02rem] bg-slate-100 mx-2"></p>

      <div className="absolute bottom-0 border-t-[.1rem] border-t-gray-100 w-full py-1 flex items-center justify-center">
        <span className="text-4xl">{team.creator.profile}</span>
        {team.members.map((memeber) => (
          <span key={memeber._id} className="text-4xl">
            {memeber.profile}
          </span>
        ))}
      </div>
    </NavLink>
  );
};

export default Teams;
