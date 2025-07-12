"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth as useAuthApi } from "@/hooks/useStackitApi";
import { useLoginMutation } from "@/redux/rtk-query/Query";
import type { User } from "@/types/apis";

interface AuthContextType {
  user: User | null;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginApi, loginState] = useLoginMutation();
  const {
    register: registerApi,
    logout: logoutApi,
    registerState,
  } = useAuthApi();

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const isEmail = (input: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const login = async (emailOrUsername: string, password: string) => {
    try {
      let loginPayload: any = { password };
      if (isEmail(emailOrUsername)) {
        loginPayload.email = emailOrUsername;
      } else {
        loginPayload.username = emailOrUsername;
      }
      console.log("LOGIN PAYLOAD:", loginPayload); // Debug log
      const result = await loginApi(loginPayload); // No .unwrap() needed here
      console.log("LOGIN RESULT:", result); // Debug log
      if (
        result.data &&
        result.data.success &&
        result.data.data &&
        result.data.data.user
      ) {
        setUser(result.data.data.user);
        localStorage.setItem("user", JSON.stringify(result.data.data.user));
        localStorage.setItem("token", result.data.data.token);
      }
    } catch (error) {
      console.error("Login error:", error); // Debug log
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    name: string
  ) => {
    try {
      const result = await registerApi({ username, email, password, name });
      if (result.success && result.data.user) {
        setUser(result.data.user);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        localStorage.setItem("token", result.data.token);
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    logoutApi();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading: loginState.isLoading || registerState.isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
