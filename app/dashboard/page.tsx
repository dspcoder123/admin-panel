"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import HomeTab from "@/components/HomeTab";
import TelegramTab from "@/components/TelegramTab";
import UsersTab from "@/components/UsersTab";
import VisitsTab from "@/components/VisitsTab";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("home");
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            {/* Main Content - Add margin to account for fixed sidebar */}
            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
                {/* Top Navigation Bar */}
                <div className="bg-white shadow-md sticky top-0 z-40">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {activeTab === "home" && "Dashboard"}
                            {activeTab === "telegram" && "Telegram Channel"}
                            {activeTab === "users" && "Users"}
                            {activeTab === "visits" && "Visits"}
                        </h1>
                        <div className="text-sm text-gray-600">
                            Welcome to Admin Panel • {new Date().toISOString().slice(0, 10)}
                        </div>
                    </div>
                </div>

                {/* Page Content - Add overflow handling for wide content */}
                <div className="p-8 w-full overflow-x-auto">
                    {activeTab === "home" && <HomeTab />}
                    {activeTab === "telegram" && <TelegramTab />}
                    {activeTab === "users" && <UsersTab />}
                    {activeTab === "visits" && <VisitsTab />}
                </div>
            </div>
        </div>
    );
}
