import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "../shared/theme/ThemeContext";
import { bootstrapI18n } from "../shared/i18n";
import "../shared/theme/theme.css";
import "./options.css";

void bootstrapI18n().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>,
  );
});
