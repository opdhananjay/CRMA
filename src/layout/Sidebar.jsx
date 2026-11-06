import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    CalendarClock,
    CalendarDays,
    Kanban,
    ChartNoAxesCombined,
    Settings,
    UsersRound
} from "lucide-react";

const Sidebar = ({ onNavigate }) => {

    const menuItems = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Leads", path: "/leads", icon: Users },
        { name: "Follow-ups", path: "/follow-ups", icon: CalendarClock },
        { name: "Meetings", path: "/meetings", icon: CalendarDays },
        { name: "Pipeline", path: "/pipeline", icon: Kanban },
        { name: "Reports", path: "/reports", icon: ChartNoAxesCombined },
    ];

    const settingsItems = [
        { name: "Team Members", path: "/team", icon: UsersRound },
        { name: "Settings", path: "/settings", icon: Settings },
    ];

    const renderMenu = (items) => (
        <div className="space-y-1">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/"}
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
        <aside className="w-64 shrink-0 bg-[#172B4D] text-white p-4 flex flex-col">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Main Menu
            </p>

            {renderMenu(menuItems)}

            <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Administration
                </p>

                {renderMenu(settingsItems)}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                    Anjaya CRM v1.0
                </p>
            </div>

        </aside>
    );
};

export default Sidebar;