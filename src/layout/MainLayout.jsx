/**
 * MainLayout.jsx
 * 
 * Application Shell Layout.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. LAYOUT STRUCTURE:
 *    - Topbar (64px fixed height) sits at the top of the viewport.
 *    - The remaining viewport height (`calc(100vh-64px)`) is split between:
 *      a) Left Sidebar (fixed width: 256px / w-64).
 *      b) Main Content Area (flex-1: takes up all remaining width, with its own scrollbar).
 * 
 * 2. RESPONSIVE DESIGN (DESKTOP VS MOBILE):
 *    - On desktop (`md:` breakpoint and above), the Sidebar is continuously visible (`hidden md:block`).
 *    - On mobile (< 768px), the sidebar is hidden by default. Tapping the hamburger button
 *      in the Topbar toggles `isSidebarOpen = true`, opening a slide-over drawer with a dark backdrop.
 *    - Tapping the backdrop or navigating to any link automatically closes the mobile drawer.
 * 
 * 3. WHAT IS `<Outlet />`?
 *    `<Outlet />` is a placeholder provided by React Router.
 *    Whatever child page matches the current URL (e.g. `<Leads />`, `<Pipeline />`)
 *    will be rendered right inside `<main className="...">`.
 */

import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  // Tracks whether the mobile drawer sidebar is open.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close mobile sidebar on "Escape" key press for accessibility.
  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  return (
    <div className="h-screen overflow-hidden bg-[#F5F7FB] flex flex-col">
      {/* Top Navigation Bar */}
      <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Main Container below Topbar */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar (visible on md screens and up) */}
        <div className="hidden md:block shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Slide-Over Sidebar Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            {/* Dark Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu backdrop"
            />

            {/* Sidebar drawer content */}
            <div className="absolute left-0 top-0 h-full w-64 shadow-2xl">
              <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Dynamic Page Content Rendered Here */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
