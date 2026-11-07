
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PublicRoute() {
  const { user } = useAuth();

  if (user) {
    const paths = {
      SuperAdmin: "/super-admin/dashboard",
      OrganizationOwner: "/manager/dashboard",
      Manager: "/manager/dashboard",
      Agent: "/agent/dashboard",
    };

    return <Navigate to={paths[user.role] || "/login"} replace />;
  }

  return <Outlet />;
}
