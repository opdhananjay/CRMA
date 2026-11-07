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
  ClipboardList,
  Activity,
  UserCog,
} from "lucide-react";

import { useAuth } from "../component/auth/AuthContext";

const Sidebar = ({ onNavigate }) => {
  const { role } = useAuth();

  // Super Admin Menus
  const superAdminMenu = [
    {
      name: "Dashboard",
      path: "/super-admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Organizations",
      path: "/organizations",
      icon: Building2,
    },
    {
      name: "Subscriptions",
      path: "/subscriptions",
      icon: CreditCard,
    },
    {
      name: "Platform Users - (Future Scope)",
      path: "/platform-users",
      icon: Users,
    },
    {
      name: "Platform Settings",
      path: "/platform-settings",
      icon: Settings,
    },
    {
      name: "My Profile",
      path: "/my-profile",
      icon: UserCircle,
    },
  ];

  // Organization Owner Menus
  const ownerMenu = [
    {
      name: "Dashboard",
      path: "/manager/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Leads",
      path: "/leads",
      icon: Users,
    },
    {
      name: "Pipeline",
      path: "/pipeline",
      icon: Kanban,
    },
    {
      name: "Follow-ups",
      path: "/follow-ups",
      icon: CalendarClock,
    },
    {
      name: "Meetings",
      path: "/meetings",
      icon: CalendarDays,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: ChartNoAxesCombined,
    },
  ];

  const ownerAdministration = [
    {
      name: "Team Members",
      path: "/team",
      icon: UsersRound,
    },
    {
      name: "Roles & Permissions",
      path: "/roles-permissions",
      icon: ShieldCheck,
    },
    {
      name: "Organization Settings",
      path: "/organization-settings",
      icon: Settings,
    },
    {
      name: "My Profile",
      path: "/my-profile",
      icon: UserCircle,
    }
  ];

  // Manager Menus
  const managerMenu = [
    {
      name: "Dashboard",
      path: "/manager/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Leads",
      path: "/leads",
      icon: Users,
    },
    {
      name: "Pipeline",
      path: "/pipeline",
      icon: Kanban,
    },
    {
      name: "Follow-ups",
      path: "/follow-ups",
      icon: CalendarClock,
    },
    {
      name: "Meetings",
      path: "/meetings",
      icon: CalendarDays,
    },
    {
      name: "Team Members",
      path: "/team",
      icon: UsersRound,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: ChartNoAxesCombined,
    },
  ];

  // Agent Menus
  const agentMenu = [
    {
      name: "Dashboard",
      path: "/agent/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Leads",
      path: "/my-leads",
      icon: Users,
    },
    {
      name: "My Follow-ups",
      path: "/my-follow-ups",
      icon: CalendarClock,
    },
    {
      name: "My Meetings",
      path: "/my-meetings",
      icon: CalendarDays,
    },
    {
      name: "My Activities",
      path: "/my-activities",
      icon: Activity,
    },
  ];

  // Profile menu shared by organization users
  const profileMenu = [
    {
      name: "My Profile",
      path: "/my-profile",
      icon: UserCircle,
    },
  ];

  // Select menus according to role
  const getMenuConfiguration = () => {
    switch (role) {
      case "SuperAdmin":
        return {
          mainTitle: "Platform Menu",
          main: superAdminMenu,
          administration: [],
        };

      case "OrganizationOwner":
        return {
          mainTitle: "Main Menu",
          main: ownerMenu,
          administration: ownerAdministration,
        };

      case "Manager":
        return {
          mainTitle: "Main Menu",
          main: managerMenu,
          administration: profileMenu,
        };

      case "Agent":
        return {
          mainTitle: "My Workspace",
          main: agentMenu,
          administration: profileMenu,
        };

      default:
        return {
          mainTitle: "Main Menu",
          main: [],
          administration: [],
        };
    }
  };

  const menuConfig = getMenuConfiguration();

  const renderMenu = (items) => (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                            ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : "text-slate-300 hover:bg-slate-700 hover:text-white"
                            }`
            }
          >
            <Icon size={19} />
            {item.name}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <aside className="w-64 shrink-0 bg-[#172B4D] text-white p-4 flex flex-col h-screen">
      {/* Main Menu */}
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        {menuConfig.mainTitle}
      </p>

      {renderMenu(menuConfig.main)}

      {/* Administration */}
      {menuConfig.administration.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            {role === "OrganizationOwner"
              ? "Administration"
              : role === "Manager"
                ? "Account"
                : "Personal"}
          </p>

          {renderMenu(menuConfig.administration)}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-400">Anjaya CRM v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
