import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/authTypes";

interface IAuthState {
  isLoggedIn: boolean;
  user: User | null;
}

const initialState: IAuthState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export { authSlice };
export default authSlice.reducer;
