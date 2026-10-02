import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AuthContext } from "@/features/auth/context/authContext";
import { getCurrentUser, logout } from "@/features/auth/services/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

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
    setLogoutLoading(true);
    try {
      await logout();
    } catch (error) {
      toast.error(error?.message || "No se pudo cerrar la sesión.");
    } finally {
      setUser(null);
      setLogoutLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      logoutLoading,
      loginContext,
      logoutContext,
    }),
    [user, loading, logoutLoading, loginContext, logoutContext],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {logoutLoading && (
        <div
          className="bg-background/75 fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <div className="bg-card flex items-center gap-3 rounded-xl border px-5 py-4 shadow-lg">
            <Loader2
              className="text-primary size-5 animate-spin"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">Cerrando sesión…</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}
