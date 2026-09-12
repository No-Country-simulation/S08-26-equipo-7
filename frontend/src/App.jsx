import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/features/auth/context/AuthContextProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import AppRoutes from "@/routes/AppRoutes";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}