// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import LoadingState from "@/components/LoadingState";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingState />;
  }
  
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}