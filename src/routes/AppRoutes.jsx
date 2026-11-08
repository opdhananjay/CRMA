/**
 * AppRoutes.jsx
 * 
 * Central Routing Table for Anjaya CRM.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. NESTED ROUTING IN REACT ROUTER V7:
 *    - `<Route element={<ProtectedRoute />}>` wraps all authenticated pages.
 *      If not authenticated, it automatically redirects to `/login`.
 *    - Inside it, `<Route element={<MainLayout />}>` wraps pages that share the 
 *      application shell (Topbar + Sidebar + Content area).
 *    - `<Outlet />` inside `MainLayout` determines where the page component renders.
 * 
 * 2. SHARED-PAGE ARCHITECTURE (Section 6 of requirements):
 *    - Instead of duplicating code into separate AgentLeads and ManagerLeads pages,
 *      both roles share the same `<Leads />`, `<FollowUps />`, and `<Meetings />` pages.
 *    - For backward compatibility and natural URL matching, both `/leads` and `/my-leads`
 *      render the shared `<Leads />` component.
 * 
 * 3. ROLE GUARDS:
 *    - Specific sub-trees are guarded using `<ProtectedRoute allowedRoles={[...]} />`.
 *    - If an Agent attempts to visit `/organizations`, `ProtectedRoute` intercepts 
 *      and bounces them to their own dashboard (`/agent/dashboard`).
 */

import { Route, Routes, Navigate } from "react-router-dom";

// Layout
import MainLayout from "../layout/MainLayout";

// Route Guards
import PublicRoute from "../component/auth/PublicRoute";
import ProtectedRoute from "../component/auth/ProtectedRoute";

// Auth Pages
import Login from "../pages/Auth/Login";

// Dashboards
import SuperAdminDashboard from "../pages/dashboards/SuperAdminDashboard";
import ManagerDashboard from "../pages/dashboards/ManagerDashboard";
import AgentDashboard from "../pages/dashboards/AgentDashboard";

// Shared CRM Pages
import Leads from "../pages/Leads/Leads";
import FollowUps from "../pages/FollowUp/FollowUps";
import Meetings from "../pages/Meetings/Meetings";
import Pipeline from "../pages/Pipeline/Pipeline";
import MyActivities from "../pages/MyActivities/MyActivities";

// Tenant Administration Pages
import TeamMembers from "../pages/TeamMembers/TeamMembers";
import OrganizationSettings from "../pages/OrganizationSettings/OrganizationSettings";
import RolesPermissions from "../pages/RolesPermissions/RolesPermissions";
import Reports from "../pages/Reports/Reports";

// Platform SuperAdmin Pages
import Organizations from "../pages/Organizations/Organizations";
import Subscriptions from "../pages/Subscriptions/Subscriptions";
import PlatformUsers from "../pages/PlatformUsers/PlatformUsers";
import PlatformSettings from "../pages/PlatformSettings/PlatformSettings";

// Common User Pages
import MyProfile from "../pages/MyProfile/MyProfile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ------------------------------------------------------------------ */}
      {/* Public Routes (Accessible only when logged out)                     */}
      {/* ------------------------------------------------------------------ */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ------------------------------------------------------------------ */}
      {/* Protected Routes (Require active authentication)                    */}
      {/* ------------------------------------------------------------------ */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          {/* 1. SuperAdmin Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
            <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/platform-users" element={<PlatformUsers />} />
            <Route path="/platform-settings" element={<PlatformSettings />} />
          </Route>

          {/* 2. Organization Owner & Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={["OrganizationOwner", "Manager"]} />}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/team" element={<TeamMembers />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

          {/* 3. Organization Owner Only (Administration Settings) */}
          <Route element={<ProtectedRoute allowedRoles={["OrganizationOwner"]} />}>
            <Route path="/organization-settings" element={<OrganizationSettings />} />
            <Route path="/roles-permissions" element={<RolesPermissions />} />
          </Route>

          {/* 4. Agent Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Agent"]} />}>
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/my-activities" element={<MyActivities />} />
          </Route>

          {/* 5. Shared CRM Routes (Accessible by Owner, Manager, and Agent) */}
          <Route element={<ProtectedRoute allowedRoles={["OrganizationOwner", "Manager", "Agent"]} />}>
            {/* Standard shared paths */}
            <Route path="/leads" element={<Leads />} />
            <Route path="/follow-ups" element={<FollowUps />} />
            <Route path="/meetings" element={<Meetings />} />

            {/* Agent URL aliases for backward compatibility */}
            <Route path="/my-leads" element={<Leads />} />
            <Route path="/my-follow-ups" element={<FollowUps />} />
            <Route path="/my-meetings" element={<Meetings />} />
          </Route>

          {/* 6. User Profile (Shared by all logged-in roles) */}
          <Route path="/my-profile" element={<MyProfile />} />

        </Route>
      </Route>

      {/* ------------------------------------------------------------------ */}
      {/* Default Fallback Redirects                                         */}
      {/* ------------------------------------------------------------------ */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
