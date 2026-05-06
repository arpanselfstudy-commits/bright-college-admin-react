import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User, LoginRequest, UpdateProfileRequest } from "../types/authTypes";
import AuthApi from "../service/apis/Auth.api";

interface IAuthState {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  sessionExpiredMessage: string;
}

const initialState: IAuthState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  sessionExpiredMessage: "",
};

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const loginThunk = createAsyncThunk(
  "authSlice/login",
  async (data: LoginRequest, { rejectWithValue }) => {
    const response = await AuthApi.login(data);
    if (!response.success && response.code !== 200) {
      return rejectWithValue(response.message || "Login failed");
    }
    if (response.data?.role !== "ADMIN") {
      return rejectWithValue("Access denied. Please use admin credentials to login.");
    }
    return response.data;
  }
);

export const logoutThunk = createAsyncThunk(
  "authSlice/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AuthApi.logout();
    } catch {
      // Even if the API call fails, we still clear local state
      return rejectWithValue("Logout request failed");
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "authSlice/updateProfile",
  async (data: UpdateProfileRequest, { rejectWithValue }) => {
    const response = await AuthApi.updateProfile(data);
    if (!response.success) {
      return rejectWithValue(response.message || "Profile update failed");
    }
    return response.data;
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    // Dispatched directly by the axios interceptor (via store.dispatch)
    // when a 401 refresh fails or TOKEN_REUSE is detected.
    forceLogout: (state, action: { payload: string }) => {
      state.isLoggedIn = false;
      state.user = null;
      state.sessionExpiredMessage = action.payload;
      state.loading = false;
    },
    // Clears the expired message after the toast has been shown
    clearSessionMessage: (state) => {
      state.sessionExpiredMessage = "";
    },
  },
  extraReducers: (builder) => {
    // ── login ──
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload as User;
        state.sessionExpiredMessage = "";
      })
      .addCase(loginThunk.rejected, (state) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.user = null;
      });

    // ── logout ──
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.sessionExpiredMessage = "";
      })
      .addCase(logoutThunk.rejected, (state) => {
        // Clear local state regardless of API failure
        state.loading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.sessionExpiredMessage = "";
      });

    // ── updateProfile ──
    builder
      .addCase(updateProfileThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload as User;
      })
      .addCase(updateProfileThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { forceLogout, clearSessionMessage } = authSlice.actions;
export { authSlice };
export default authSlice.reducer;
