import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth";
import NotFoundPage from "@/pages/NotFoundPage";

export default function RoleRoute({ adminOnly = false }) {
  const { isAdmin, isOperationalUser } = useAuth();

  if (adminOnly && !isAdmin) {
    return isOperationalUser ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <NotFoundPage />
    );
  }

  if (!adminOnly && !isAdmin && !isOperationalUser) {
    return <NotFoundPage />;
  }

  return <Outlet />;
}
