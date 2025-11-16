"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

// ---------- Types ----------
interface WidgetCategory {
  _id?: string;
  visitCategory: string;
  description?: string;
}
interface Widget {
  _id?: string;
  visitId: number | string; // Accept string for controlled input
  visitCategory: string;
  visitName: string;
  widgetName: string;
  widgetVendor?: string;
  widgetPaidOrFree: "free" | "paid";
  visitCostPerUnit: number;
  visitUnit?: string | null;
  visitAgeLimit: number;
  visitStatus: "active" | "inactive";
}

// Default form state for a new widget
const DEFAULT_FORM: Partial<Widget> = {
  visitId: "",
  widgetName: "",
  visitName: "",
  widgetVendor: "",
  widgetPaidOrFree: "free",
  visitCostPerUnit: 0,
  visitUnit: "",
  visitAgeLimit: 0,
  visitStatus: "active",
  visitCategory: ""
};

// ---------- Component ----------
export default function WidgetsTab() {
  const [categories, setCategories] = useState<WidgetCategory[]>([]);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string>("");
  const [query, setQuery] = useState("");

  // Add & Edit Forms state
  const [form, setForm] = useState<Partial<Widget>>(DEFAULT_FORM);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Widget | null>(null);

  // Category addition UI state
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  // Fetch all categories
  const fetchCategories = async () => {
    const res = await fetch(`${apiUrl}/widgets/categories`);
    const data = await res.json();
    setCategories(data);
  };

  // Fetch widgets for selected category
  const fetchWidgets = async (category = "") => {
    setLoading(true);
    let url = `${apiUrl}/widgets/widgets`;
    if (category) url += `?category=${encodeURIComponent(category)}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setWidgets(data);
    } catch (err) {
      toast.error("Failed to fetch widgets");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, []);

  // Reload widgets when selectedCat changes
  useEffect(() => {
    fetchWidgets(selectedCat);
  }, [selectedCat]);

  // ----- Handlers -----
  const handleStatusToggle = async (wid: Widget) => {
    const url = `${apiUrl}/widgets/widgets/${wid._id}/status`;
    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitStatus: wid.visitStatus === "active" ? "inactive" : "active",
        }),
      });
      if (!res.ok) throw new Error("Status toggle failed");
      toast.success("Status updated");
      fetchWidgets(selectedCat);
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `${apiUrl}/widgets/widgets`;

    // Fill all default fields to guarantee complete payload
    const payload = {
      ...DEFAULT_FORM,
      ...form,
      visitCategory: form.visitCategory ?? selectedCat,
      visitId: Number(form.visitId) // Always submit as number!
    };
    

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add widget");
      toast.success("Widget added");
      setForm(DEFAULT_FORM);
      setShowAddForm(false);
      fetchWidgets(selectedCat);
    } catch (err) {
      toast.error("Add failed");
    }
  };

  const handleEdit = (w: Widget) => {
    setEditTarget(w);
    setForm({ ...DEFAULT_FORM, ...w });
    setShowAddForm(false);
    setSelectedCat(w.visitCategory);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    const url = `${apiUrl}/widgets/widgets/${editTarget._id}`;
    const payload = {
      ...DEFAULT_FORM,
      ...form,
      visitId: Number(form.visitId)
    };
    console.log("Updating Widget Payload:", payload);
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update widget");
      toast.success("Widget updated");
      setEditTarget(null);
      setForm(DEFAULT_FORM);
      fetchWidgets(selectedCat);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // Category add
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return toast.error("Category name required!");
    try {
      const res = await fetch(`${apiUrl}/widgets/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitCategory: newCatName, description: newCatDesc })
      });
      if (!res.ok) throw new Error("Failed to add category");
      toast.success("Category added!");
      setNewCatName("");
      setNewCatDesc("");
      setShowAddCat(false);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  // Filtered widgets table (simple search by widgetName/vendor)
  const filteredWidgets = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return widgets;
    return widgets.filter((w) =>
      w.widgetName.toLowerCase().includes(q) ||
      (w.widgetVendor && w.widgetVendor.toLowerCase().includes(q))
    );
  }, [widgets, query]);

  // ---------- UI ----------
  return (
    <div className="space-y-6">

      {/* Category Add UI */}
      {showAddCat ? (
        <div className="flex gap-2 mb-4">
          <input
            className="px-3 py-2 border rounded-md"
            placeholder="Category Name"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
          />
          <input
            className="px-3 py-2 border rounded-md"
            placeholder="Description"
            value={newCatDesc}
            onChange={e => setNewCatDesc(e.target.value)}
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAddCategory}>
            Add Category
          </button>
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded" onClick={() => setShowAddCat(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="px-4 py-2 bg-purple-600 text-white rounded mb-4" onClick={() => setShowAddCat(true)}>
          + Add Main Category
        </button>
      )}

      {/* Widget Management Header */}
      <div className="bg-white rounded-lg p-6 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Widget Management</h2>
          <p className="text-sm text-gray-500">Manage your AI widget catalog and availability</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.visitCategory}>
                {c.visitCategory}
              </option>
            ))}
          </select>
          <input
            type="search"
            placeholder="Search widget name/vendor..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="px-3 py-2 border rounded-md w-48 text-sm"
          />
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => {
              setShowAddForm(true);
              setEditTarget(null);
              setForm({ ...DEFAULT_FORM, visitCategory: selectedCat });
            }}
          >
            {showAddForm ? "Cancel" : "Add Widget"}
          </button>
        </div>
      </div>

      {/* Add/Edit Widget Form */}
      {(showAddForm || editTarget) && (
        <form
          onSubmit={editTarget ? handleUpdate : handleAddNew}
          className="bg-white rounded-lg p-6 shadow-md space-y-4"
        >
          <div className="flex flex-wrap gap-4">

            <input
              required
              type="number"
              className="px-3 py-2 border rounded-md w-40"
              placeholder="Visit ID"
              value={form.visitId ?? ""}
              onChange={e =>
                setForm(f => ({ ...f, visitId: e.target.value }))
              }
              disabled={!!editTarget}
            />
            <input
              required
              className="px-3 py-2 border rounded-md w-40"
              placeholder="Widget Name"
              value={form.widgetName ?? ""}
              onChange={e =>
                setForm(f => ({ ...f, widgetName: e.target.value }))
              }
            />
            <input
              required
              className="px-3 py-2 border rounded-md w-40"
              placeholder="Visit Name"
              value={form.visitName ?? ""}
              onChange={e =>
                setForm(f => ({ ...f, visitName: e.target.value }))
              }
            />
            <select
              required
              className="px-3 py-2 border rounded-md w-40"
              value={form.visitCategory ?? selectedCat ?? ""}
              onChange={e => {
                setForm(f => ({ ...f, visitCategory: e.target.value }));
                setSelectedCat(e.target.value);
              }}
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c._id} value={c.visitCategory}>
                  {c.visitCategory}
                </option>
              ))}
            </select>
            <input
              className="px-3 py-2 border rounded-md w-40"
              placeholder="Vendor"
              value={form.widgetVendor ?? ""}
              onChange={e =>
                setForm(f => ({ ...f, widgetVendor: e.target.value }))
              }
            />
            <select
              required
              className="px-3 py-2 border rounded-md w-40"
              value={form.widgetPaidOrFree ?? "free"}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  widgetPaidOrFree: e.target.value as "free" | "paid"
                }))
              }
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>

            <input
              className="px-3 py-2 border rounded-md w-40"
              type="number"
              placeholder="Cost per Unit"
              value={form.visitCostPerUnit ?? 0}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  visitCostPerUnit: Number(e.target.value)
                }))
              }
            />
            <input
              className="px-3 py-2 border rounded-md w-40"
              placeholder="Unit"
              value={form.visitUnit ?? ""}
              onChange={e =>
                setForm(f => ({ ...f, visitUnit: e.target.value }))
              }
            />
            <input
              className="px-3 py-2 border rounded-md w-40"
              type="number"
              placeholder="Age Limit"
              value={form.visitAgeLimit ?? 0}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  visitAgeLimit: Number(e.target.value)
                }))
              }
            />
            <select
              required
              className="px-3 py-2 border rounded-md w-40"
              value={form.visitStatus ?? "active"}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  visitStatus: e.target.value as "active" | "inactive"
                }))
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              type="submit"
            >
              {editTarget ? "Update Widget" : "Add Widget"}
            </button>
            {(editTarget || showAddForm) && (
              <button
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded"
                type="button"
                onClick={() => {
                  setEditTarget(null);
                  setShowAddForm(false);
                  setForm(DEFAULT_FORM);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Widget Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Widget Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {filteredWidgets.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-gray-500">No widgets found</td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-gray-500">Loading widgets...</td>
              </tr>
            )}
            {filteredWidgets.map((w, idx) => (
              <tr key={w._id ?? idx} className="border-t">
                <td className="px-4 py-4">{w.visitId}</td>
                <td className="px-4 py-4">{w.widgetName}</td>
                <td className="px-4 py-4">{w.visitCategory}</td>
                <td className="px-4 py-4">{w.widgetVendor}</td>
                <td className="px-4 py-4">{w.widgetPaidOrFree}</td>
                <td className="px-4 py-4">{w.visitCostPerUnit}</td>
                <td className="px-4 py-4">
                  <button
                    className={`px-2 py-1 rounded text-xs ${w.visitStatus === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    onClick={() => handleStatusToggle(w)}
                  >
                    {w.visitStatus}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                    onClick={() => handleEdit(w)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
