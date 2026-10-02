import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App.jsx";
import { initializeTheme } from "./lib/theme";
import { initializeCsrfToken } from "./services/apiService";

initializeTheme();

initializeCsrfToken().catch(() => null);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
