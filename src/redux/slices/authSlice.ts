"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, LoginCredentials } from "@/types";
import { loginUserApi as loginApi, getCurrentUserProfile } from "@/lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const user = await loginApi(credentials);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to log in");
    }
  }
);

export const refreshUserProfile = createAsyncThunk(
  "auth/refreshUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      if (!token) return null;
      const updatedUser = await getCurrentUserProfile(token);
      return updatedUser;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to refresh profile");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      if (typeof window !== "undefined") {
        try {
          const storedToken = localStorage.getItem("auth_token");
          const storedUser = localStorage.getItem("auth_user");
          if (storedToken && storedUser) {
            state.token = storedToken;
            state.user = JSON.parse(storedUser);
          }
        } catch (e) {
          console.error("Failed to initialize auth from storage", e);
        }
      }
      state.isLoading = false;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", action.payload.token);
        localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
        document.cookie = `auth_token=${action.payload.token}; path=/; max-age=86400; SameSite=Lax`;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        document.cookie = "auth_token=; path=/; max-age=0";
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token || "dummy-jwt-token";
        state.error = null;
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", state.token);
          localStorage.setItem("auth_user", JSON.stringify(action.payload));
          document.cookie = `auth_token=${state.token}; path=/; max-age=86400; SameSite=Lax`;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshUserProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = { ...state.user, ...action.payload };
          if (typeof window !== "undefined") {
            localStorage.setItem("auth_user", JSON.stringify(state.user));
          }
        }
      });
  },
});

export const { initializeAuth, setCredentials, logout, clearAuthError } =
  authSlice.actions;

export default authSlice.reducer;
