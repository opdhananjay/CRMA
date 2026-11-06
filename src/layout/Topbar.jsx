import {
    Search,
    Bell,
    UserCircle,
    Menu
} from "lucide-react";

const Topbar = ({ onMenuClick }) => {

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between">

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
                        A
                    </div>

                    <span className="text-lg font-bold text-gray-800">
                        ANJAYA CRM
                    </span>
                </div>

            </div>

            <div className="flex items-center gap-3 md:gap-5">

                <Search className="w-5 h-5 text-gray-500" />

                <Bell className="w-5 h-5 text-gray-500" />

                <div className="flex items-center gap-2">
                    <UserCircle className="w-8 h-8 text-gray-500" />

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800">
                            Admin
                        </p>
                        <p className="text-xs text-gray-500">
                            Manager
                        </p>
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Topbar;