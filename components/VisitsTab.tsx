"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import "../components/styles/pagination.css";

interface Visit {
  id?: string;
  _id?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  page?: string;
  path?: string;
  duration?: number;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: string;
  createdAt?: string;
  referrer?: string;
  deviceType?: string;
  referer?: string;
  location?: {
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    org?: string;
    timezone?: string;
    postal?: string;
  };
  locationSummary?: string;
}

export default function VisitsTab() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const localApi = process.env.NEXT_LOCAL_API_URL;
      const publicApi = process.env.NEXT_PUBLIC_API_URL;
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? localApi || "http://localhost:4000/api"
          : publicApi || "/api";

      const res = await fetch(`${baseUrl}/visits`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);
      const data = await res.json();

      let visitsArray: Visit[] = [];
      if (Array.isArray(data)) visitsArray = data;
      else if (Array.isArray(data.visits)) visitsArray = data.visits;
      else if (Array.isArray(data.data)) visitsArray = data.data;

      const enriched = visitsArray.map((v) => {
        const loc = v.location || {};
        const locationSummary = [loc.city, loc.region, loc.country]
          .filter(Boolean)
          .join(", ");
        const ipAddress =
          v.ipAddress || loc.ip || loc.loc?.split(",")[0] || "-";
        const referer = v.referer || v.referrer;

        return {
          ...v,
          id: v.id || v._id || "",
          ipAddress,
          referer,
          locationSummary: locationSummary || "-",
        };
      });

      setVisits(enriched);
    } catch (err: any) {
      toast.error(err.message || "Failed to load visits");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return visits;
    return visits.filter((v) =>
      [
        v.userName,
        v.userEmail,
        v.page,
        v.path,
        v.id,
        v.ipAddress,
        v.referer,
        v.userAgent,
        v.locationSummary,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [visits, query]);

  const offset = currentPage * itemsPerPage;
  const currentItems = filtered.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const handlePageClick = ({ selected }: { selected: number }) =>
    setCurrentPage(selected);

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  const mostVisited = useMemo(() => {
    const counts: Record<string, number> = {};
    visits.forEach((v) => {
      const key = v.page || v.path || "unknown";
      counts[key] = (counts[key] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "-";
  }, [visits]);

  return (
    <div className="flex flex-col h-[90vh] bg-gray-50 p-3">
      {/* ===== Fixed Header Section ===== */}
      <div className="flex-none space-y-3 bg-white rounded-lg shadow-sm p-4 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Visits Dashboard</h2>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <input
              type="search"
              placeholder="Search..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(0);
              }}
              className="px-3 py-1.5 border rounded-md text-sm w-48"
            />
            <button
              onClick={fetchVisits}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-600">Total Visits</p>
            <p className="text-lg font-semibold">{visits.length}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-600">Unique Users</p>
            <p className="text-lg font-semibold">
              {new Set(visits.map((v) => v.userId)).size}
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-600">Most Visited</p>
            <p className="text-lg font-semibold">{mostVisited}</p>
          </div>
        </div>
      </div>

      {/* ===== Scrollable Table Section ===== */}
      <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 max-h-full">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {[
                  "ID",
                  "IP",
                  "Location",
                  "Page",
                  "Referer",
                  "User Agent",
                  "Time",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-gray-500 py-4"
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && currentItems.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-gray-500 py-4"
                  >
                    No visits found
                  </td>
                </tr>
              )}
              {currentItems.map((v, idx) => (
                <tr
                  key={v.id ?? idx}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 font-mono text-gray-800">
                    {(v.id || "-").slice(0, 8)}
                  </td>
                  <td className="px-4 py-2">{v.ipAddress || "-"}</td>
                  <td className="px-4 py-2">{v.locationSummary}</td>
                  <td className="px-4 py-2">{v.page || v.path || "-"}</td>
                  <td className="px-4 py-2 text-gray-600 max-w-xs truncate">
                    {v.referer || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-600 max-w-xs truncate">
                    {v.userAgent || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    {formatDate(v.timestamp || v.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== Pagination (fixed bottom) ===== */}
        {pageCount > 1 && (
          <div className="flex-none border-t p-2 flex justify-center bg-white">
            <ReactPaginate
              previousLabel={"← Prev"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              onPageChange={handlePageClick}
              pageCount={pageCount}
              forcePage={currentPage}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
