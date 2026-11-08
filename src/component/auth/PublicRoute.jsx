/**
 * PublicRoute.jsx
 * 
 * Route Guard for Public-Only Pages (e.g., Login, Forgot Password).
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. PURPOSE:
 *    When a user is ALREADY logged in and visits `/login`, we do not want to show 
 *    them the login form again. Instead, we automatically redirect them to their 
 *    role-specific dashboard.
 * 
 * 2. HOW IT WORKS:
 *    - Check if `user` exists in AuthContext.
 *    - If YES: Redirect to their dashboard using `getDashboardPath(user.role)`.
 *    - If NO: Render the requested public page using `<Outlet />`.
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";
import { getDashboardPath } from "../../utils/navigation";

export default function PublicRoute() {
  const { user, isAuthenticated } = useAuth();

  // If already authenticated, redirect to the user's role dashboard.
  if (isAuthenticated && user) {
    const dashboardPath = getDashboardPath(user.role);
    return <Navigate to={dashboardPath} replace />;
  }

  // Not logged in; render the public route (e.g. Login page).
  return <Outlet />;
}
