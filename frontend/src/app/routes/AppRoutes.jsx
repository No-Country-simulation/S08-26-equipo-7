import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";

import ProtectedRoute from "@/app/routes/ProtectedRoute";
import PublicRoute from "@/app/routes/PublicRoute";
import RoleRoute from "@/app/routes/RoleRoute";
import AppLayout from "@/layout/AppLayout";
import ApprovalsPage from "@/pages/ApprovalsPage";
import DashboardPage from "@/pages/DashboardPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import ForgotPassPage from "@/pages/ForgotPassPage";
import KnowledgeDetailPage from "@/pages/KnowledgeDetailPage";
import KnowledgePage from "@/pages/KnowledgePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import TicketDetailPage from "@/pages/TicketDetailPage";
import TicketsPage from "@/pages/TicketsPage";
import UsersPage from "@/pages/UsersPage";

const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
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
          <Route element={<RoleRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/knowledge/new" element={<KnowledgeDetailPage />} />
            <Route path="/knowledge/:id" element={<KnowledgeDetailPage />} />
          </Route>
          <Route element={<RoleRoute adminOnly />}>
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </>,
  ),
);

export default appRouter;
