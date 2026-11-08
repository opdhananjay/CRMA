/**
 * Topbar.jsx
 * 
 * Application Header / Top Navigation Bar.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. COMPONENT RESPONSIBILITIES:
 *    - Left: Mobile sidebar hamburger button & dynamic Company branding.
 *    - Center/Right: Quick actions (Search, Notifications) and User Profile.
 *    - User Menu Dropdown: Displays authenticated user details and handles Logout.
 * 
 * 2. HANDLING DROPDOWNS & CLICK OUTSIDE:
 *    When `profileOpen` is true, we render an invisible fixed backdrop (`<div className="fixed inset-0 z-10" />`).
 *    Clicking anywhere outside the dropdown menu triggers `onClick={() => setProfileOpen(false)}`,
 *    which cleanly closes the dropdown without needing complex document event listeners.
 * 
 * 3. LOGOUT FLOW:
 *    - Calling `logout()` triggers `clearAuthStorage()` and resets the `user` state to null in `AuthContext`.
 *    - `navigate("/login", { replace: true })` redirects to the login screen and replaces
 *      the current history entry so pressing browser "Back" doesn't return to protected pages.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  UserCircle,
  Menu,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../component/auth/useAuth";

const Topbar = ({ onMenuClick }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  // Controls user profile dropdown visibility
  const [profileOpen, setProfileOpen] = useState(false);

  // Handle user logout
  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  // Company name from environment variable with fallback
  const companyName = import.meta.env.VITE_COMPANYNAME || "Anjaya Systems";
  const brandInitial = companyName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between shrink-0 z-30">
      {/* ------------------------------------------------------------------ */}
      {/* Left: Mobile Menu Button & Brand Logo                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle mobile menu"
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
        >
          <Menu size={22} />
        </button>

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
            {brandInitial}
          </div>

          <span className="text-lg font-bold text-gray-800 tracking-tight hidden sm:inline-block">
            {companyName}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right: Search, Notifications & User Profile                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Global Search Button */}
        <button
          type="button"
          aria-label="Search"
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications Button */}
        <button
          type="button"
          aria-label="Notifications"
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition relative"
        >
          <Bell className="w-5 h-5" />
          {/* Notification Indicator Dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 hover:bg-gray-50 p-1.5 sm:px-2.5 rounded-lg transition"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <UserCircle className="w-8 h-8 text-slate-500" />

            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 leading-tight mt-0.5">
                {role || "Guest"}
              </p>
            </div>

            <ChevronDown size={15} className="text-gray-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <>
              {/* Invisible Click-Outside Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileOpen(false)}
              />

              {/* Dropdown Content */}
              <div className="absolute right-0 top-14 z-20 w-60 bg-white border border-gray-200 rounded-xl shadow-lg py-2 animate-in fade-in zoom-in-95 duration-100">
                {/* User Details */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || "Signed-in User"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {user?.email || "No email"}
                  </p>
                  <div className="mt-2 inline-block">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-medium">
                      {role}
                    </span>
                  </div>
                </div>

                {/* Profile Link */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/my-profile");
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  My Profile
                </button>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
