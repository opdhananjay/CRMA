/**
 * PlatformUsers.jsx
 * 
 * Platform Administrator Users Management Page for SuperAdmin.
 * 
 * Accessible by: SuperAdmin
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. FIXED CRITICAL REACT 19 LINT ERROR:
 *    Previously, this file had `useMemo(() => { if (open) setForm(...); }, [open])`.
 *    `useMemo` is strictly for computing pure values during render (e.g. filtered lists).
 *    Calling `setState()` inside `useMemo` can cause infinite render loops!
 *    SOLUTION: Form initialization is handled via `useEffect` or when opening the drawer.
 * 
 * 2. SEPARATION OF CONCERNS:
 *    Platform users (SuperAdmin platform operators) are distinct from Tenant Organization
 *    users (Managers, Agents). This separation prevents security leaks across tenants.
 * 
 * 3. COMPONENT REUSE:
 *    Replaced local `SummaryCard` and custom backdrop divs with shared `<StatCard>`
 *    and `<Drawer>`.
 */

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  Pencil,
  Eye,
  Mail,
  UserRound,
  CalendarDays,
  Save,
} from "lucide-react";

import PageHeader from "../../component/common/PageHeader";
import StatCard from "../../component/common/StatCard";
import StatusBadge from "../../component/common/StatusBadge";
import Drawer from "../../component/common/Drawer";

const initialPlatformUsers = [
  {
    id: 1,
    name: "Dhananjay Sharma",
    email: "superadmin@anjaya.com",
    phone: "+91 98765 43210",
    role: "SuperAdmin",
    status: "Active",
    createdAt: "2026-10-10",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    email: "rahul@anjaya.com",
    phone: "+91 98765 12345",
    role: "SuperAdmin",
    status: "Active",
    createdAt: "2026-10-15",
  },
  {
    id: 3,
    name: "Priya Shah",
    email: "priya@anjaya.com",
    phone: "+91 99887 66554",
    role: "SuperAdmin",
    status: "Inactive",
    createdAt: "2026-10-20",
  },
];

const emptyUserForm = {
  name: "",
  email: "",
  phone: "",
  role: "SuperAdmin",
};

export default function PlatformUsers() {
  const [users, setUsers] = useState(initialPlatformUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  const [form, setForm] = useState(emptyUserForm);
  const [saving, setSaving] = useState(false);

  // Compute platform user stats
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === "Active").length,
      inactive: users.filter((u) => u.status === "Inactive").length,
    };
  }, [users]);

  // Filter users by search and status
  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(term);

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setForm(emptyUserForm);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "SuperAdmin",
    });
    setDrawerOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u))
      );
    } else {
      const newUser = {
        ...form,
        id: Date.now(),
        status: "Active",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setUsers((prev) => [newUser, ...prev]);
    }

    setSaving(false);
    setDrawerOpen(false);
  };

  const handleToggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Page Header                                                        */}
      {/* ------------------------------------------------------------------ */}
      <PageHeader
        title="Platform Users"
        description="Manage SuperAdmin administrators who maintain the SaaS multi-tenant infrastructure."
        action={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={18} />
            <span>Add Platform Admin</span>
          </button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* KPI Cards                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Admins"
          value={stats.total}
          subtitle="Platform SuperAdmins"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Operators"
          value={stats.active}
          subtitle="Can access platform settings"
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Deactivated"
          value={stats.inactive}
          subtitle="Suspended administrative access"
          icon={UserX}
          color="red"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Search & Filter Toolbar                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Platform Users Table                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-5 py-3.5 font-medium">Administrator</th>
                <th className="px-5 py-3.5 font-medium">Platform Role</th>
                <th className="px-5 py-3.5 font-medium">Phone</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium">Created Date</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-800">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Mail size={12} />
                      <span>{user.email}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-xs font-semibold text-blue-700">
                    <span className="bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-gray-600 font-mono">
                    {user.phone || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={user.status} dot />
                  </td>

                  <td className="px-5 py-4 text-xs text-gray-500 font-mono">
                    {user.createdAt}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingUser(user)}
                        title="View Details"
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(user)}
                        title="Edit Administrator"
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user.id)}
                        title={user.status === "Active" ? "Deactivate" : "Activate"}
                        className={`rounded-lg p-1.5 transition ${
                          user.status === "Active"
                            ? "text-red-500 hover:bg-red-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                      >
                        {user.status === "Active" ? (
                          <UserX size={15} />
                        ) : (
                          <UserCheck size={15} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Create / Edit User Drawer                                          */}
      {/* ------------------------------------------------------------------ */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingUser ? "Edit Platform Admin" : "Add Platform Admin"}
        description="Configure SuperAdmin credentials and authorization."
        icon={ShieldCheck}
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="platform-user-form"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              <Save size={16} />
              <span>{saving ? "Saving..." : "Save Admin"}</span>
            </button>
          </div>
        }
        maxWidth="max-w-[520px]"
      >
        <form id="platform-user-form" onSubmit={handleSaveUser} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Full Name *
            </label>
            <input
              required
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="e.g. Dhananjay Sharma"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email Address *
            </label>
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              placeholder="admin@anjaya.com"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleFormChange}
              placeholder="+91 98765 43210"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Platform Role
            </label>
            <input
              disabled
              type="text"
              value="SuperAdmin (Platform Access)"
              className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-600 cursor-not-allowed"
            />
          </div>
        </form>
      </Drawer>

      {/* ------------------------------------------------------------------ */}
      {/* View User Details Drawer                                           */}
      {/* ------------------------------------------------------------------ */}
      {viewingUser && (
        <Drawer
          isOpen={Boolean(viewingUser)}
          onClose={() => setViewingUser(null)}
          title={viewingUser.name}
          description="Platform Operator Details"
          maxWidth="max-w-[480px]"
        >
          <div className="space-y-4 pt-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold">
                  {viewingUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{viewingUser.name}</h4>
                  <p className="text-xs text-slate-500">{viewingUser.role}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} className="text-slate-400" />
                  <span>{viewingUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <UserRound size={14} className="text-slate-400" />
                  <span>{viewingUser.phone || "No phone provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CalendarDays size={14} className="text-slate-400" />
                  <span>Created: {viewingUser.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
