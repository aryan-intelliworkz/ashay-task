"use client";

/**
 * =========================================================================
 * AUTHENTICATION CONTEXT (Client-Side State Management)
 * =========================================================================
 * How this works for beginners:
 * 1. "use client" directive indicates this runs in the browser.
 * 2. React Context provides global state (user, token, login, logout)
 *    to any component without prop-drilling.
 * 3. We persist user data in `localStorage` & `document.cookie` so the user
 *    stays logged in even after page refresh.
 * 4. We export a custom hook `useAuth()` for easy access.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginCredentials } from "@/types";
import { loginUserApi, getCurrentUserProfile } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from localStorage on initial browser mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to load auth state from localStorage", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login handler
  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const loggedInUser = await loginUserApi(credentials);
      
      const authToken = loggedInUser.token || "dummy-jwt-token";
      setUser(loggedInUser);
      setToken(authToken);

      // Persist in localStorage for CSR state
      localStorage.setItem("auth_token", authToken);
      localStorage.setItem("auth_user", JSON.stringify(loggedInUser));

      // Also set standard cookie so server/middleware can access it if needed
      document.cookie = `auth_token=${authToken}; path=/; max-age=86400; SameSite=Lax`;

      return loggedInUser;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    document.cookie = "auth_token=; path=/; max-age=0";
  };

  // Refresh profile from API
  const refreshProfile = async () => {
    if (!token) return;
    try {
      const updatedUser = await getCurrentUserProfile(token);
      if (updatedUser) {
        setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
        localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.warn("Failed to refresh profile", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for convenient consumption
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
