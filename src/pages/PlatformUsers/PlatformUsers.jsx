import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  MoreHorizontal,
  Eye,
  Pencil,
  Power,
  X,
  Mail,
  UserRound,
  CalendarDays,
  Save,
} from "lucide-react";

const initialUsers = [
  {
    id: 1,
    name: "Dhananjay Sharma",
    email: "admin@anjaya.com",
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

const statusStyles = {
  Active: "bg-green-50 text-green-700",
  Inactive: "bg-slate-100 text-slate-600",
};

function SummaryCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
        >
          <Icon size={20} />
        </div>
      </div>
      <h2 className="mt-3 text-2xl font-bold text-slate-800">{value}</h2>
    </div>
  );
}

function UserDrawer({ open, onClose, onSave, user }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "SuperAdmin",
  });

  const [saving, setSaving] = useState(false);

  // Load selected user when editing, otherwise reset the form.
  useMemo(() => {
    if (open) {
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role: user?.role || "SuperAdmin",
      });
    }
  }, [open, user]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      await onSave(form);
      onClose();
    } catch (error) {
      alert(error?.message || "Unable to save platform user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />

      <div className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck size={21} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">
                {user ? "Edit Platform User" : "Add Platform User"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Manage Anjaya platform administrator accounts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          id="platform-user-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto p-5"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="user@anjaya.com"
              required
              disabled={!!user}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
            />
            {user && (
              <p className="mt-1 text-xs text-slate-400">
                Email cannot be changed here.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Platform Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="SuperAdmin">Super Admin</option>
            </select>
          </div>

          {!user && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <div className="flex gap-2">
                <Mail size={18} className="shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">
                    Account Invitation
                  </p>
                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    The new platform user should receive an invitation to set
                    their password and activate their account. No password will
                    be created in this form.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="platform-user-form"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : user ? "Save Changes" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlatformUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const term = search.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const counts = {
    total: users.length,
    active: users.filter((user) => user.status === "Active").length,
    inactive: users.filter((user) => user.status === "Inactive").length,
  };

  const handleSaveUser = async (data) => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, ...data } : user,
        ),
      );
    } else {
      const newUser = {
        id: crypto.randomUUID(),
        ...data,
        status: "Inactive",
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setUsers((prev) => [newUser, ...prev]);
    }

    setSelectedUser(null);
  };

  const handleToggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user,
      ),
    );

    setOpenMenu(null);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowDrawer(true);
    setOpenMenu(null);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setShowDrawer(true);
  };

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Platform Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage administrators who have access to the Anjaya platform.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Platform User
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Platform Users"
          value={counts.total}
          icon={Users}
          color="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          title="Active Users"
          value={counts.active}
          icon={UserCheck}
          color="bg-green-50 text-green-600"
        />
        <SummaryCard
          title="Inactive Users"
          value={counts.inactive}
          icon={UserX}
          color="bg-slate-100 text-slate-600"
        />
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">All Platform Users</h2>
            <p className="mt-1 text-xs text-slate-500">
              Platform-level accounts only.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Platform User</th>
                <th className="px-5 py-4 font-semibold">Phone</th>
                <th className="px-5 py-4 font-semibold">Role</th>
                <th className="px-5 py-4 font-semibold">Created Date</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                        {user.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {user.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {user.phone || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[user.status]}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="relative px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === user.id ? null : user.id)
                      }
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                      <MoreHorizontal size={19} />
                    </button>

                    {openMenu === user.id && (
                      <div className="absolute right-8 top-12 z-20 w-44 rounded-lg border border-slate-200 bg-white py-1 text-left shadow-lg">
                        <button
                          onClick={() => {
                            setViewUser(user);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Eye size={15} /> View Details
                        </button>

                        <button
                          onClick={() => handleEdit(user)}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil size={15} /> Edit
                        </button>

                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={user.id === 1}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Power size={15} />
                          {user.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <ShieldCheck
                      size={32}
                      className="mx-auto mb-3 text-slate-300"
                    />
                    <p className="text-sm font-semibold text-slate-700">
                      No platform users found
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Try changing your search or status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-5 py-3">
          <p className="text-xs text-slate-500">
            Showing {filteredUsers.length} of {users.length} platform users
          </p>
        </div>
      </div>

      {/* Add / Edit drawer */}
      <UserDrawer
        open={showDrawer}
        user={selectedUser}
        onClose={() => {
          setShowDrawer(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
      />

      {/* View details drawer */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setViewUser(null)}
          />

          <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="font-bold text-slate-800">User Details</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Platform administrator information
                </p>
              </div>
              <button
                onClick={() => setViewUser(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-blue-700">
                  {viewUser.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{viewUser.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{viewUser.role}</p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[viewUser.status]}`}
                  >
                    {viewUser.status}
                  </span>
                </div>
              </div>

              {[
                [Mail, "Email Address", viewUser.email],
                [UserRound, "Phone Number", viewUser.phone || "Not provided"],
                [ShieldCheck, "Platform Role", viewUser.role],
                [CalendarDays, "Created Date", formatDate(viewUser.createdAt)],
              ].map(([Icon, label, value]) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 p-5">
              <button
                onClick={() => setViewUser(null)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
