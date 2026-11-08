/**
 * AuthProvider.jsx
 * 
 * Global Authentication Context Provider.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. SEPARATION OF CONCERNS:
 *    - `AuthContext.js`: Defines the Context container.
 *    - `AuthProvider.jsx`: Manages the authentication state (`user`) and methods (`login`, `logout`).
 *    - `useAuth.js`: The custom hook to access this state anywhere in the component tree.
 *    This separation adheres to Vite Fast Refresh rules and keeps code clean and modular.
 * 
 * 2. LAZY INITIAL STATE:
 *    `useState(() => getStorageItem(STORAGE_KEYS.USER, null))`
 *    React evaluates this function ONLY during the initial mount, preventing unnecessary
 *    disk/storage reads on subsequent re-renders.
 */

import { useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  getStorageItem,
  setStorageItem,
  clearAuthStorage,
  STORAGE_KEYS,
} from "../../utils/storage";

export function AuthProvider({ children }) {
  // Read any saved user from localStorage when the application loads.
  const [user, setUser] = useState(() => {
    return getStorageItem(STORAGE_KEYS.USER, null);
  });

  // Extract the user's role (SuperAdmin, OrganizationOwner, Manager, Agent)
  const role = user?.role || null;

  // Boolean helper indicating if someone is logged in
  const isAuthenticated = Boolean(user);

  /**
   * Log in a user.
   * Updates React state and persists user data to storage.
   * 
   * @param {Object} userData - User details (name, email, role, organizationId)
   * @param {string} [token] - Optional JWT token from ASP.NET Core backend
   */
  const login = (userData, token = null) => {
    setUser(userData);
    setStorageItem(STORAGE_KEYS.USER, userData);

    if (token) {
      setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
  };

  /**
   * Log out the current user.
   * Clears state and removes sensitive items from storage.
   */
  const logout = () => {
    setUser(null);
    clearAuthStorage();
  };

  // The value object holds all state & methods exposed to the application.
  const value = {
    user,
    role,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

