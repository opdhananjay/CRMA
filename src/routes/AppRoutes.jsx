import { Route, Routes, Navigate } from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import SuperAdminDashboard from "../pages/dashboards/SuperAdminDashboard";
import ManagerDashboard from "../pages/dashboards/ManagerDashboard";
import AgentDashboard from "../pages/dashboards/AgentDashboard";

import Leads from "../pages/Leads/Leads";
import FollowUps from "../pages/FollowUp/FollowUps";
import Meetings from "../pages/Meetings/Meetings";
import Pipeline from "../pages/Pipeline/Pipeline";
import TeamMembers from "../pages/TeamMembers/TeamMembers";

import Login from "../pages/Auth/Login";

import PublicRoute from "../component/auth/PublicRoute";
import ProtectedRoute from "../component/auth/ProtectedRoute";
import MyProfile from "../pages/MyProfile/MyProfile";
import Organizations from "../pages/Organizations/Organizations";
import Subscriptions from "../pages/Subscriptions/Subscriptions";
import PlatformUsers from "../pages/PlatformUsers/PlatformUsers";
import PlatformSettings from "../pages/PlatformSettings/PlatformSettings";
import OrganizationSettings from "../pages/OrganizationSettings/OrganizationSettings";
import RolesPermissions from "../pages/RolesPermissions/RolesPermissions";
import MyLeads from "../pages/MyLeads/MyLeads";
import MyFollowUps from "../pages/MyFollowUps/MyFollowUps";
import MyMeetings from "../pages/MyMeetings/MyMeetings";
import MyActivities from "../pages/MyActivities/MyActivities";

const AppRoutes = () => {
    return (
        <Routes>

            {/* Public Routes */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>

                <Route element={<MainLayout />}>

                    {/* Super Admin Routes */}
                    <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
                        <Route
                            path="/super-admin/dashboard"
                            element={<SuperAdminDashboard />}
                        />
                        <Route path="/organizations" element={<Organizations />} />

                        <Route path="/subscriptions" element={<Subscriptions />} />

                        <Route path="/platform-users" element={<PlatformUsers />} />

                        <Route path="/platform-settings" element={<PlatformSettings />} />

                    </Route>

                    {/* Manager / Organization Owner Routes */}
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={["OrganizationOwner", "Manager"]}
                            />
                        }
                    >
                        <Route
                            path="/manager/dashboard"
                            element={<ManagerDashboard />}
                        />

                        <Route path="/leads" element={<Leads />} />

                        <Route path="/follow-ups" element={<FollowUps />} />

                        <Route path="/meetings" element={<Meetings />} />

                        <Route path="/pipeline" element={<Pipeline />} />

                        <Route path="/team" element={<TeamMembers />} />

                        <Route
                            path="/organization-settings"
                            element={
                                <OrganizationSettings />
                            }
                        />

                        <Route
                            path="/roles-permissions"
                            element={
                                <RolesPermissions />
                            }
                        />

                    </Route>

                    {/* Agent Routes */}
                    <Route element={<ProtectedRoute allowedRoles={["Agent"]} />}>
                        <Route
                            path="/agent/dashboard"
                            element={<AgentDashboard />}
                        />

                        <Route
                            path="/my-leads"
                            element={<MyLeads />}
                            />
                        
                        <Route path="/my-follow-ups" element={<MyFollowUps />} />

                        <Route path="/my-meetings" element={<MyMeetings />} />

                        <Route path="/my-activities" element={<MyActivities />} />

                    </Route>

                    <Route path="/my-profile" element={<MyProfile />} />

                </Route>
            </Route>

            {/* Default Route */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* Unknown Route */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
};

export default AppRoutes;
