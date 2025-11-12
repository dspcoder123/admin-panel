"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const hardcodedUsername = "admin";
    const hardcodedPassword = "password123";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (username === hardcodedUsername && password === hardcodedPassword) {
            // Set auth cookie
            document.cookie = "isLoggedIn=true; path=/; max-age=86400"; // 24 hours
            setError("");
            router.push("/dashboard");
        } else {
            setError("Invalid username or password");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }}></div>
            </div>

            {/* Main container */}
            <div className="relative z-10 w-full max-w-md">
                {/* Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-3xl">🔐</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-center text-white mb-2">Admin Panel</h1>
                        <p className="text-center text-blue-100 text-sm">Welcome back! Please login to continue</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3 animate-shake">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                    <p className="text-red-200 font-semibold text-sm">{error}</p>
                                    <p className="text-red-100/60 text-xs mt-1">Try: admin / password123</p>
                                </div>
                            </div>
                        )}

                        {/* Username Input */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-white font-semibold text-sm">
                                👤 Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition backdrop-blur"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-white font-semibold text-sm">
                                🔑 Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition backdrop-blur"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !username || !password}
                            className="w-full mt-6 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>→</span>
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-4">
                            <p className="text-white/70 text-xs text-center">
                                <span className="font-semibold">Demo Credentials:</span><br />
                                Username: <span className="font-mono text-blue-300">admin</span><br />
                                Password: <span className="font-mono text-blue-300">password123</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom text */}
                <p className="text-center text-white/50 text-xs mt-6">
                    Secure Admin Portal • {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
