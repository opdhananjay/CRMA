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

import { useAuth } from "../component/auth/AuthContext";

const Topbar = ({ onMenuClick }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            {import.meta.env.VITE_COMPANYNAME?.charAt(0) || "A"}
          </div>

          <span className="text-lg font-bold text-gray-800">
            {import.meta.env.VITE_COMPANYNAME || "Anjaya Systems"}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 md:gap-5">
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Search className="w-5 h-5 text-gray-500" />
        </button>

        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-500" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg"
          >
            <UserCircle className="w-8 h-8 text-gray-500" />

            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-gray-500">{role || "Guest"}</p>
            </div>

            <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <>
              {/* Close dropdown when clicking outside */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileOpen(false)}
              />

              <div className="absolute right-0 top-14 z-20 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">{user?.email}</p>

                  <p className="text-xs text-blue-600 mt-1">{role}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Logout
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
