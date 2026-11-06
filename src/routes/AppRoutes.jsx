import { Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import SuperAdminDashboard from "../pages/dashboards/SuperAdminDashboard";
import ManagerDashboard from "../pages/dashboards/ManagerDashboard";
import AgentDashboard from "../pages/dashboards/AgentDashboard";
import Leads from "../pages/Leads/Leads";

const AppRoutes = () => {

    return (
        <>
            <Routes>

                <Route element={<MainLayout/>}>


                    <Route
                        path="/leads"
                        element={<Leads />}
                    />

                    {/* <Route path="/" element={<Dashboard/>} /> */}

                    {/* /super-admin/dashboard */}
                    <Route
                        path="/1"
                        element={<SuperAdminDashboard />}
                    />
                    
                    {/* // /manager/dashboard */}
                    <Route
                        path="/2"
                        element={<ManagerDashboard />}
                    />

                    {/* /agent/dashboard */}
                    <Route
                        path="/"
                        element={<AgentDashboard />}
                    />

                </Route>

            </Routes>
        </>
    )
}

export default AppRoutes;