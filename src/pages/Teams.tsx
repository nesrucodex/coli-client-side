import { useEffect, useState } from "react";
import Overlay from "../components/Overlay";
import TeamCreator from "../components/Teams/TeamCreator";
import TeamItem from "../components/Teams/TeamItem";
import Hline from "../components/Hline";
import axios, { AxiosError } from "axios";
import { ITeam } from "../types/global";
import { TeamBox } from "./TeamBox";

const Teams = () => {
  const [showTeamCreator, setShowTeamCreator] = useState(false);
  const [teams, setTeams] = useState<ITeam[]>([]);

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
    <section className="h-[calc(100vh-80px)] w-screen overflow-hidden z-[10]">
      <header className="my-4">
        <h1 className="text-4xl uppercase indent-4 font-semibold text-slate-700">
          Create Team
        </h1>
        <Hline w="7.7rem" h=".2rem" mt=".4rem" lf="1rem" />
      </header>
      <section className="grid grid-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-4 px-[2rem] sm:px-[1rem] py-[2rem] h-[70vh] overflow-x-hidden scroll-bar-none ">
        <TeamItem showTeamCreatorHandler={showTeamCreatorHandler} />

        {teams.map((team) => {
          return <TeamBox team={team} key={team._id} />;
        })}
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

export default Teams;
