/**
 * main.jsx
 * 
 * Entry point of the React Application.
 * 
 * Hierarchy:
 * 1. StrictMode: React dev-mode checks for detecting side-effects and deprecated APIs.
 * 2. BrowserRouter: Enables client-side URL routing via React Router DOM.
 * 3. AuthProvider: Provides global authentication state across all routes.
 * 4. App: Mounts the main App component and route hierarchy.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./component/auth/AuthProvider";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
