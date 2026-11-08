/**
 * useAuth.js
 * 
 * Custom hook to easily consume the AuthContext in any component.
 * 
 * Usage:
 *   const { user, role, logout } = useAuth();
 */

import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

