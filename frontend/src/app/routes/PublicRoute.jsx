// PublicRoute.jsx
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children;
}