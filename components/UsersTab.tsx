"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface User {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    mobile?: string;
    profilePicture?: string | null;
    authProvider?: string;
    verified: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export default function UsersTab() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL as string) || "";
            const base = apiUrl || "/api";
            const fetchUrl = `${base}/users?verified=true`;
            const res = await fetch(fetchUrl);
            if (!res.ok) throw new Error(`Failed to fetch users (${res.status}) from ${fetchUrl}`);
            const data = await res.json();

            // Normalize response into an array of users.
            let usersArray: User[] = [];
            if (Array.isArray(data)) {
                usersArray = data;
            } else if (Array.isArray(data.users)) {
                usersArray = data.users;
            } else if (Array.isArray(data.data)) {
                usersArray = data.data;
            } else if (data.users && Array.isArray(data.users.data)) {
                usersArray = data.users.data;
            } else {
                // If response contains single user object, wrap it, otherwise fallback to empty
                usersArray = data && typeof data === 'object' && (data.id || data._id || data.email) ? [data] : [];
            }

            // Normalize _id to id for consistent display
            const normalized = usersArray.map((u) => ({
                ...u,
                id: u.id || u._id || "", // Use id if present, fallback to _id, then empty string
            })) as User[];

            setUsers(normalized);
        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : String(error);
            toast.error(message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return users;
        return users.filter((u) => {
            const name = typeof u.name === "string" ? u.name.toLowerCase() : "";
            const email = typeof u.email === "string" ? u.email.toLowerCase() : "";
            const idStr = typeof u.id === "string" ? u.id.toLowerCase() : "";
            const mongoIdStr = typeof u._id === "string" ? u._id.toLowerCase() : "";
            return (
                name.includes(q) ||
                email.includes(q) ||
                idStr.includes(q) ||
                mongoIdStr.includes(q)
            );
        });
    }, [users, query]);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Users</h2>
                    <p className="text-sm text-gray-500">Verified users registered in the system</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="search"
                        placeholder="Search by name, email or id..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="px-3 py-2 border rounded-md w-56 text-sm"
                    />
                    <button
                        onClick={fetchUsers}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auth Provider</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No users found</td>
                            </tr>
                        )}
                        {loading && (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading users...</td>
                            </tr>
                        )}

                        {filtered.map((u, idx) => (
                            <tr key={u.id ?? `user-${idx}`} className="border-t">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.id || "-"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name || "-"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email || "-"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.verified ? "Yes" : "No"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.createdAt || "-"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.authProvider || "local"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
