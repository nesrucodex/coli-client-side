import { useId, MouseEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import Input from "../Input";
import ImageUploader from "../ImageUploader";
import Hline from "../Hline";
import useCreateTeam, {
  CreateTeamActions,
} from "../../hooks/create team/useCreateTeam";
import BasicEditor from "../Froala/BasicEditor";
import InputLabel from "../InputLabel";
import axios, { AxiosError } from "axios";
import { ITeam } from "../../types/global";

type ITeamCreator = {
  showTeamCreator: boolean;
  showTeamCreatorHandler: (showTeamCreator?: boolean) => void;
  onAddTeam: (team: ITeam) => void;
};
const TeamCreator = ({
  showTeamCreator,
  showTeamCreatorHandler,
  onAddTeam,
}: ITeamCreator) => {
  const nameId = useId();
  const profileId = useId();
  const bioId = useId();
  const { teamState, teamDispatch } = useCreateTeam();

  const CreateTeamHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (teamState.name.trim().length < 1) {
      return teamDispatch({
        type: CreateTeamActions.SET_ERROR,
        payload: {
          type: CreateTeamActions.SET_NAME,
          message: "Group name is required",
        },
      });
    }

    const formData = new FormData();
    formData.append("name", teamState.name);
    formData.append("profile", teamState.profile);

    formData.append("bio", teamState.bio);
    formData.append("description", teamState.description);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5050/api/v1/teams",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;

      onAddTeam(data.data.team);
      showTeamCreatorHandler(false);
    } catch (error) {
      if (error instanceof AxiosError) console.warn(error.response?.data);
    }
  };

  return (
    <motion.section
      initial={{ y: "-60rem", x: "-50%" }}
      animate={{
        y: showTeamCreator ? "0" : "-60rem",
      }}
      transition={{ duration: 1 }}
      className="absolute z-[9999] min-w-[10rem] w-[90%] max-w-[40rem] left-1/2 top-[1rem]"
      onClick={(e: MouseEvent) => e.stopPropagation()}
    >
      <div className="lato-regular bg-white rounded-sm border-2 border-gray-200 flex flex-col">
        <h2 className="font-bold text-2xl uppercase text-slate-700 indent-4 mt-6">
          Create Team
        </h2>
        <Hline z="999" mb="1rem" ml="1rem" lf=".2rem" w="5.4rem" h=".2rem" />
        <form
          className="px-6 pb-4 flex flex-col gap-2 h-[76vh] overflow-x-hidden overflow-y-scroll scroll-bar-none"
          onSubmit={CreateTeamHandler}
        >
          <Input
            id={nameId}
            labelText={
              teamState.error.type === CreateTeamActions.SET_NAME
                ? teamState.error.message
                : "Group name"
            }
            color={
              teamState.error.type === CreateTeamActions.SET_NAME ? "red" : ""
            }
            borderBottomColor={
              teamState.error.type === CreateTeamActions.SET_NAME
                ? "border-b-red-400"
                : ""
            }
            initial={teamState.name}
            onInputChangeHandler={(value) => {
              if (teamState.error.message)
                teamDispatch({
                  type: CreateTeamActions.SET_ERROR,
                  payload: {
                    type: undefined,
                    message: "",
                  },
                });
              teamDispatch({
                type: CreateTeamActions.SET_NAME,
                payload: value,
              });
            }}
          />
          <ImageUploader
            id={profileId}
            labelText="Upload group profile image [Optional]"
            initial={teamState.profile}
            imageUploadHandler={(file: File) =>
              teamDispatch({
                type: CreateTeamActions.SET_PROFILE,
                payload: file,
              })
            }
          />
          <Input
            id={bioId}
            labelText="Bio [Optional]"
            initial={teamState.bio}
            onInputChangeHandler={(value) =>
              teamDispatch({ type: CreateTeamActions.SET_BIO, payload: value })
            }
          />
          <div>
            <InputLabel id="" labelText="Description [Optional]" />
            <BasicEditor
              hMin={100}
              hMax={200}
              initial={teamState.description}
              onTextareaChangeHandler={(value) =>
                teamDispatch({
                  type: CreateTeamActions.SET_DESCRIPTION,
                  payload: value,
                })
              }
            />
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              className="font-semibold bg-red-200 text-red-500 text-md px-6 py-2 rounded-md transition-all duration-200 hover:bg-red-100 active:bg-red-200 cursor-pointer"
              type="reset"
              onClick={() => {
                teamDispatch({
                  type: CreateTeamActions.CLEAR_DATA,
                  payload: "",
                });
                showTeamCreatorHandler(false);
              }}
            >
              Cancel
            </button>
            <button
              className="font-semibold bg-blue-200 text-blue-500 text-md px-6 py-2 rounded-md transition-all duration-200 hover:bg-blue-100 active:bg-blue-200 cursor-pointer"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  );
};

export default TeamCreator;
