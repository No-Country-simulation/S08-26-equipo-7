import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AuthContext } from "@/features/auth/context/authContext";
import { getCurrentUser, logout } from "@/features/auth/services/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validamos si hay cookie activa al montar la app
  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const loginContext = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logoutContext = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      toast.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      loginContext,
      logoutContext,
    }),
    [user, loading, loginContext, logoutContext],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
