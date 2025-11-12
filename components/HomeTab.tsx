"use client";

export default function HomeTab() {
    const stats = [
        { label: "Total Messages", value: "0", icon: "💬" },
        { label: "Telegram Channel", value: "Connected", icon: "📱" },
        { label: "System Status", value: "Online", icon: "✅" },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white shadow-lg">
                <h1 className="text-4xl font-bold mb-2">Welcome to Admin Panel</h1>
                <p className="text-blue-100 text-lg">
                    Manage your Telegram channel messages directly from here
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-4xl">{stat.icon}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Features Overview */}
            <div className="bg-white rounded-lg p-8 shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                        <div className="text-3xl">📱</div>
                        <div>
                            <h3 className="font-bold text-gray-800 mb-2">
                                Send Messages to Telegram
                            </h3>
                            <p className="text-gray-600">
                                Post messages directly to your Telegram channel with just a few
                                clicks
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-3xl">⚡</div>
                        <div>
                            <h3 className="font-bold text-gray-800 mb-2">Real-time Updates</h3>
                            <p className="text-gray-600">
                                Get instant notifications when messages are posted successfully
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-3xl">🔒</div>
                        <div>
                            <h3 className="font-bold text-gray-800 mb-2">Secure & Protected</h3>
                            <p className="text-gray-600">
                                Your data is secure with authentication and encrypted
                                communication
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-3xl">📊</div>
                        <div>
                            <h3 className="font-bold text-gray-800 mb-2">
                                Easy Management
                            </h3>
                            <p className="text-gray-600">
                                Intuitive interface for managing all your messaging needs
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Start Guide */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Quick Start</h3>
                <ol className="space-y-3 text-blue-800">
                    <li className="flex gap-3">
                        <span className="font-bold">1.</span>
                        <span>Go to Telegram Channel tab from the sidebar</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold">2.</span>
                        <span>Enter your message in the text area</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold">3.</span>
                        <span>Click Submit to post the message</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold">4.</span>
                        <span>You&apos;ll receive a confirmation notification</span>
                    </li>
                </ol>
            </div>
        </div>
    );
}
