import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../types/global";

const initialState: IUser & { loggedIn: boolean } = {
  _id: "",
  name: "",
  email: "",
  profile: "",
  loggedIn: false,
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      const { _id, name, email, profile } = action.payload;

      state._id = _id;
      state.name = name;
      state.email = email;
      state.profile = profile;
    },
    signInUser: (state, action: PayloadAction<IUser>) => {
      const { _id, name, email, profile } = action.payload;
      state._id = _id;
      state.name = name;
      state.email = email;
      state.profile = profile;
      state.loggedIn = true;
    },

    logoutUser: (state) => {
      const { _id, name, email, profile } = initialState;
      state._id = _id;
      state.name = name;
      state.email = email;
      state.profile = profile;
      state.loggedIn = false;
    },
  },
});

export const { setUser, logoutUser, signInUser } = userSlice.actions;

export { userSlice };
