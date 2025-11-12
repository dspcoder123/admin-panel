"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function TelegramTab() {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }

        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${apiUrl}/telegram/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message.trim() }),
            });

            if (response.ok) {
                await response.json();
                toast.success("Message sent to Telegram successfully! ✨");
                setMessage("");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error sending message. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white shadow-lg">
                <h1 className="text-4xl font-bold mb-2">Telegram Channel</h1>
                <p className="text-purple-100 text-lg">
                    Send messages directly to your Telegram channel
                </p>
            </div>

            {/* Main Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Message Label */}
                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-semibold text-gray-700 mb-3"
                                >
                                    📝 Compose Your Message
                                </label>
                                <p className="text-xs text-gray-500 mb-3">
                                    Share updates, announcements, or important information with your
                                    channel
                                </p>

                                {/* Textarea */}
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here... (max 4096 characters)"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 resize-none h-64 font-medium text-gray-700"
                                    disabled={isLoading}
                                />

                                {/* Character Count */}
                                <div className="mt-2 text-right text-sm text-gray-500">
                                    {message.length} / 4096 characters
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isLoading || !message.trim()}
                                    className={`flex-1 px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${isLoading || !message.trim()
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-purple-600 hover:bg-purple-700 active:scale-95 shadow-lg hover:shadow-xl"
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>📤</span>
                                            <span>Send to Telegram</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMessage("")}
                                    disabled={isLoading}
                                    className="px-6 py-3 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200"
                                >
                                    ❌ Clear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Info Column */}
                <div className="space-y-6">
                    {/* Tips Card */}
                    <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-blue-900 mb-4">💡 Tips</h3>
                        <ul className="space-y-3 text-sm text-blue-800">
                            <li className="flex gap-2">
                                <span>✓</span>
                                <span>Keep messages clear and concise</span>
                            </li>
                            <li className="flex gap-2">
                                <span>✓</span>
                                <span>Use emojis to make it engaging</span>
                            </li>
                            <li className="flex gap-2">
                                <span>✓</span>
                                <span>Max 4096 characters per message</span>
                            </li>
                            <li className="flex gap-2">
                                <span>✓</span>
                                <span>Messages are sent instantly</span>
                            </li>
                        </ul>
                    </div>

                    {/* Status Card */}
                    <div className="bg-green-50 border-l-4 border-green-600 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-green-900 mb-4">
                            ✅ Status
                        </h3>
                        <div className="space-y-2 text-sm text-green-800">
                            <p className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                System: Online
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                Telegram: Connected
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                API: Ready
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Message Format</h2>
                <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm text-gray-700 border border-gray-200">
                    <p className="mb-4 font-bold text-gray-800">Example message format:</p>
                    <pre className="whitespace-pre-wrap wrap-break-word">
                        {`🎉 New Announcement!

Your message content goes here.
You can use multiple lines.
Add emojis to make it more engaging! 🚀

---
Sent from Admin Panel`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
