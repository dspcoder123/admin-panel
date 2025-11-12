"use client";

import { useRouter } from "next/navigation";

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ activeTab, onTabChange, isCollapsed, setIsCollapsed }: SidebarProps) {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = "isLoggedIn=; path=/; max-age=0";
        router.push("/login");
    };

    const menuItems = [
        { id: "home", label: "Home", icon: "🏠" },
        { id: "telegram", label: "Telegram Channel", icon: "📱" },
        { id: "users", label: "Users", icon: "👥" },
        { id: "visits", label: "Visits", icon: "📊" },
    ];

    return (
        <div
            className={`fixed left-0 top-0 h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
                } flex flex-col shadow-2xl z-50`}
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                {!isCollapsed && (
                    <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-white hover:bg-slate-700 p-2 rounded transition"
                    title={isCollapsed ? "Expand" : "Collapse"}
                >
                    {isCollapsed ? "→" : "←"}
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                            ? "bg-blue-600 text-white shadow-lg"
                            : "text-slate-300 hover:bg-slate-700 hover:text-white"
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-200 font-medium"
                >
                    <span className="text-xl">🚪</span>
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}
