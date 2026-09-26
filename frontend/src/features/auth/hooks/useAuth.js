import { useContext } from "react";

import { AuthContext } from "@/features/auth/context/authContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Extraemos tanto el estado como las acciones del Provider
  const { user, loading, loginContext, logoutContext } = context;

  const isAdmin = user?.rol === "ADMIN";
  const isSupervisor = user?.rol === "SUPERVISOR";
  const isAgent = user?.rol === "AGENT";
  const isUser = user?.rol === "USER" || user?.rol === "varios";

  return {
    user,
    loading,
    loginContext,
    logoutContext,
    isAdmin,
    isSupervisor,
    isAgent,
    isUser,
  };
};