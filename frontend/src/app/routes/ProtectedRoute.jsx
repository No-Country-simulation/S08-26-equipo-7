// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

import LoadingState from "@/components/LoadingState";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
