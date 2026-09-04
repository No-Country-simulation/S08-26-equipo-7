import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta directa para el inicio de sesión */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Al ser un sistema cerrado, la raíz y cualquier ruta inválida redirigen al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}