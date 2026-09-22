import { BrowserRouter } from "react-router-dom";

import AppRoutes from "@/app/routes/AppRoutes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/features/auth/context/AuthContextProvider";

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
