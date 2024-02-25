/* eslint-disable no-case-declarations */
import { useReducer } from "react";
export const enum CreateTeamActions {
  SET_NAME,
  SET_PROFILE,
  SET_DESCRIPTION,
  SET_ERROR,
  CLEAR_DATA,
}

type ITeam = {
  name: string;
  profile: File | null;
 
  description: string;
  error: {
    type: CreateTeamActions | undefined;
    message: string;
  };
};
const initial: ITeam = {
  name: "",
  profile: null,
 
  description: "",
  error: {
    type: undefined,
    message: "",
  },
};
const reducer = (
  state: ITeam,
  action: {
    type: CreateTeamActions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
  }
) => {
  const { type } = action;
  switch (type) {
    case CreateTeamActions.SET_NAME:
      const name = action.payload;
      if (typeof name !== "string") return state;
      return { ...state, name };
    case CreateTeamActions.SET_PROFILE:
      const profile = action.payload;
      if (typeof profile !== "object") return state;
      return { ...state, profile };

    case CreateTeamActions.SET_DESCRIPTION:
      const description = action.payload;
      if (typeof description !== "string") return state;
      return { ...state, description };
    case CreateTeamActions.CLEAR_DATA:
      return initial;
    case CreateTeamActions.SET_ERROR:
      const error = action.payload;
      return { ...state, error };

    default:
      throw Error("UnImplemented dispach");
  }
};

const useCreateTeam = () => {
  const [state, dispatch] = useReducer(reducer, initial);
  return { teamState: state, teamDispatch: dispatch };
};

export default useCreateTeam;
