import { useState, useEffect } from 'react';
import { getCurrentUser, logout } from '@/features/auth/services/authService';
import { AuthContext } from './authContext';

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

  useEffect(() => {
    async function handleAuthExpired() {
      setUser(null);

      if (["/login", "/forgot-password"].includes(window.location.pathname)) {
        return;
      }

      try {
        await logout();
      } catch {
        // The access token is already invalid; local cleanup still proceeds.
      } finally {
        window.location.assign("/login");
      }
    }

    window.addEventListener("auth:expired", handleAuthExpired);
    return () => window.removeEventListener("auth:expired", handleAuthExpired);
  }, []);

  const loginContext = (userData) => {
    setUser(userData);
  };

  const logoutContext = async () => {
    try {
      // 1. Llamamos a la API para limpiar la cookie HttpOnly en el backend
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      // 2. Independientemente de si la API falló o no, limpiamos el usuario localmente
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
}