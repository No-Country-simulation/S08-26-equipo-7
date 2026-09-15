import { Navigate,Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/app/routes/ProtectedRoute";
import PublicRoute from "@/app/routes/PublicRoute";
import AppLayout from "@/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import ForgotPassPage from "@/pages/ForgotPassPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import TicketsPage from "@/pages/TicketsPage"; 

export default function AppRoutes() {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <PublicRoute>
            <ForgotPassPage />
          </PublicRoute>
        } 
      />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}