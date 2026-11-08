/**
 * ProtectedRoute.jsx
 * 
 * Route Guard Component for Authenticated & Role-Restricted Pages.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. HOW ROUTE PROTECTION WORKS IN REACT ROUTER V7:
 *    - In React Router, we use "Layout Routes" or wrapper routes.
 *    - If a user passes the security check, `<Outlet />` renders the nested child route.
 *    - If a user fails the security check, `<Navigate />` redirects them away.
 * 
 * 2. WHAT IS `replace` IN `<Navigate to="..." replace />`?
 *    By default, redirecting pushes a new entry into the browser's history stack.
 *    Using `replace` overwrites the current history entry. This prevents an annoying loop
 *    where clicking the browser "Back" button immediately bounces the user forward again.
 * 
 * 3. TWO LAYERS OF ROUTE CHECKS:
 *    - Check 1: Is user logged in? If not, redirect to `/login`.
 *    - Check 2: If `allowedRoles` array is passed (e.g. `["SuperAdmin"]`), does `user.role`
 *      match one of them? If not, redirect to their own role's home dashboard.
 * 
 * 4. IMPORTANT SECURITY NOTE:
 *    Frontend route protection is for User Experience (UX)—it prevents users from 
 *    seeing blank or irrelevant screens. 
 *    Actual security MUST be enforced by the ASP.NET Core backend API (via `[Authorize(Roles = "...")]`).
 *    Never assume that hiding a route in React makes the data secure!
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";
import { getDashboardPath } from "../../utils/navigation";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  // 1. If user is not authenticated, redirect to login page.
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If this route is restricted to specific roles, verify the user's role.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User does not have permission; redirect to their appropriate dashboard.
    const redirectPath = getDashboardPath(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  // 3. User is authorized; render the requested child route content.
  return <Outlet />;
}
