import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const MainLayout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden bg-[#F5F7FB]">

            <Topbar
                onMenuClick={() => setIsSidebarOpen(true)}
            />

            <div className="flex h-[calc(100vh-64px)]">

                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                    <Sidebar />
                </div>

                {/* Mobile Sidebar */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">

                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setIsSidebarOpen(false)}
                        />

                        {/* Sidebar */}
                        <div className="absolute left-0 top-0 h-full w-64">
                            <Sidebar
                                onNavigate={() => setIsSidebarOpen(false)}
                            />
                        </div>

                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default MainLayout;