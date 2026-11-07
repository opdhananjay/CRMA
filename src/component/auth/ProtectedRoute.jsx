
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User does not have permission for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
}

function getDashboardPath(role) {
  const paths = {
    SuperAdmin: "/super-admin/dashboard",
    OrganizationOwner: "/manager/dashboard",
    Manager: "/manager/dashboard",
    Agent: "/agent/dashboard",
  };

  return paths[role] || "/login";
}
