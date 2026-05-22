import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EditorApp } from "./EditorApp.tsx";
import { SidebarLayout } from "./layout/sidebarLayout/SidebarLayout.tsx";
import { ThemeProvider } from "./provider/ThemeProvider.tsx";
import { ModalManager } from "./components/modals/modalManager/ModalManager.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <SidebarLayout>
        <EditorApp />
        <ModalManager />
      </SidebarLayout>
    </ThemeProvider>
  </StrictMode>,
);
