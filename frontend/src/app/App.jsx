import { RouterProvider } from "react-router-dom";

import appRouter from "@/app/routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/features/auth/context/AuthContextProvider";

export default function App() {
  return (
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={appRouter} />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
}
