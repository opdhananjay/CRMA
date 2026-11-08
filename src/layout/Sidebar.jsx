/**
 * Sidebar.jsx
 * 
 * Role-Based Navigation Sidebar for Anjaya CRM.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. HOW ROLE-BASED MENUS WORK:
 *    - We obtain the currently logged-in user's role from `useAuth()`.
 *    - Each role has an array of menu items: `{ name, path, icon }`.
 *    - `getMenuConfiguration(role)` selects which navigation groups to render.
 * 
 * 2. WHAT IS `NavLink` VS `Link`?
 *    In React Router, `NavLink` knows whether its `to` path matches the current URL.
 *    It accepts a function for `className`: `({ isActive }) => ...`
 *    This makes it trivial to apply active highlights (e.g. blue background for the active link).
 *    Notice the `end` prop on `NavLink`: it ensures an exact match so that "/" doesn't 
 *    remain highlighted when visiting a subpath.
 * 
 * 3. CLOSING ON NAVIGATION:
 *    When on mobile, the parent component passes `onNavigate`.
 *    Clicking any link triggers `onNavigate()`, which closes the slide-over drawer.
 */

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  CalendarDays,
  Kanban,
  ChartNoAxesCombined,
  Settings,
  UsersRound,
  Building2,
  CreditCard,
  ShieldCheck,
  UserCircle,
  Activity,
} from "lucide-react";
import { useAuth } from "../component/auth/useAuth";

// ----------------------------------------------------------------------------
// Menu Configurations by Role
// ----------------------------------------------------------------------------

// 1. SuperAdmin (Platform Administration)
const superAdminMenu = [
  { name: "Dashboard", path: "/super-admin/dashboard", icon: LayoutDashboard },
  { name: "Organizations", path: "/organizations", icon: Building2 },
  { name: "Subscriptions", path: "/subscriptions", icon: CreditCard },
  { name: "Platform Users", path: "/platform-users", icon: Users },
  { name: "Platform Settings", path: "/platform-settings", icon: Settings },
  { name: "My Profile", path: "/my-profile", icon: UserCircle },
];

// 2. Organization Owner (Executive CRM & Settings)
const ownerMainMenu = [
  { name: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
  { name: "Leads", path: "/leads", icon: Users },
  { name: "Pipeline", path: "/pipeline", icon: Kanban },
  { name: "Follow-ups", path: "/follow-ups", icon: CalendarClock },
  { name: "Meetings", path: "/meetings", icon: CalendarDays },
  { name: "Reports", path: "/reports", icon: ChartNoAxesCombined },
];

const ownerAdminMenu = [
  { name: "Team Members", path: "/team", icon: UsersRound },
  { name: "Roles & Permissions", path: "/roles-permissions", icon: ShieldCheck },
  { name: "Organization Settings", path: "/organization-settings", icon: Settings },
  { name: "My Profile", path: "/my-profile", icon: UserCircle },
];

// 3. Manager (Sales Operations & Team Management)
const managerMainMenu = [
  { name: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
  { name: "Leads", path: "/leads", icon: Users },
  { name: "Pipeline", path: "/pipeline", icon: Kanban },
  { name: "Follow-ups", path: "/follow-ups", icon: CalendarClock },
  { name: "Meetings", path: "/meetings", icon: CalendarDays },
  { name: "Team Members", path: "/team", icon: UsersRound },
  { name: "Reports", path: "/reports", icon: ChartNoAxesCombined },
];

// 4. Agent (Assigned Sales Tasks)
const agentMainMenu = [
  { name: "Dashboard", path: "/agent/dashboard", icon: LayoutDashboard },
  { name: "My Leads", path: "/my-leads", icon: Users },
  { name: "My Follow-ups", path: "/my-follow-ups", icon: CalendarClock },
  { name: "My Meetings", path: "/my-meetings", icon: CalendarDays },
  { name: "My Activities", path: "/my-activities", icon: Activity },
];

const profileOnlyMenu = [
  { name: "My Profile", path: "/my-profile", icon: UserCircle },
];

// ----------------------------------------------------------------------------
// Helper: Select menu structure for the active role
// ----------------------------------------------------------------------------
function getMenuConfig(role) {
  switch (role) {
    case "SuperAdmin":
      return {
        mainTitle: "Platform Menu",
        main: superAdminMenu,
        secondaryTitle: null,
        secondary: [],
      };

    case "OrganizationOwner":
      return {
        mainTitle: "Main Menu",
        main: ownerMainMenu,
        secondaryTitle: "Administration",
        secondary: ownerAdminMenu,
      };

    case "Manager":
      return {
        mainTitle: "Main Menu",
        main: managerMainMenu,
        secondaryTitle: "Account",
        secondary: profileOnlyMenu,
      };

    case "Agent":
      return {
        mainTitle: "My Workspace",
        main: agentMainMenu,
        secondaryTitle: "Personal",
        secondary: profileOnlyMenu,
      };

    default:
      return {
        mainTitle: "Main Menu",
        main: [],
        secondaryTitle: null,
        secondary: [],
      };
  }
}

// ----------------------------------------------------------------------------
// Main Sidebar Component
// ----------------------------------------------------------------------------
const Sidebar = ({ onNavigate }) => {
  const { role } = useAuth();
  const menuConfig = getMenuConfig(role);

  /**
   * Helper to render a group of navigation links.
   */
  const renderMenuItems = (items) => (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <aside className="w-64 bg-[#172B4D] text-white p-4 flex flex-col h-full overflow-y-auto">
      {/* Primary Section */}
      <div className="mb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
          {menuConfig.mainTitle}
        </p>
        {renderMenuItems(menuConfig.main)}
      </div>

      {/* Secondary Administration / Account Section */}
      {menuConfig.secondary && menuConfig.secondary.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-700/70">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
            {menuConfig.secondaryTitle}
          </p>
          {renderMenuItems(menuConfig.secondary)}
        </div>
      )}

      {/* App Version Info Footer */}
      <div className="mt-auto pt-6 border-t border-slate-700/70">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Anjaya CRM</span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono">v1.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
