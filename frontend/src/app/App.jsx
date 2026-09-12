import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/features/auth/context/AuthContextProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import AppRoutes from "@/app/routes/AppRoutes";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
  return (
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
}