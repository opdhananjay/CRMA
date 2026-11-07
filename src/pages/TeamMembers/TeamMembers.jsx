
import { useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  MoreVertical,
  Pencil,
  UserX,
  UserCheck,
  X,
} from "lucide-react";

const initialMembers = [
  {
    id: 1,
    name: "Dhananjay",
    email: "dhananjay@anjaya.com",
    phone: "9876543210",
    role: "Manager",
    department: "Management",
    status: "Active",
    joinedDate: "2026-01-10",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    email: "rahul@anjaya.com",
    phone: "9876543211",
    role: "Agent",
    department: "Sales",
    status: "Active",
    joinedDate: "2026-02-15",
  },
  {
    id: 3,
    name: "Priya Shah",
    email: "priya@anjaya.com",
    phone: "9876543212",
    role: "Agent",
    department: "Marketing",
    status: "Active",
    joinedDate: "2026-03-01",
  },
  {
    id: 4,
    name: "Amit Patel",
    email: "amit@anjaya.com",
    phone: "9876543213",
    role: "Agent",
    department: "Sales",
    status: "Inactive",
    joinedDate: "2026-03-15",
  },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "Agent",
  department: "",
};

export default function TeamMembers() {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [openMenu, setOpenMenu] = useState(null);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const term = search.toLowerCase();

      const matchesSearch =
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.phone.includes(term);

      const matchesRole =
        roleFilter === "All" || member.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, search, roleFilter, statusFilter]);

  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === "Active").length,
    inactive: members.filter((m) => m.status === "Inactive").length,
    agents: members.filter((m) => m.role === "Agent").length,
  };

  const openAddDrawer = () => {
    setEditingMember(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEditDrawer = (member) => {
    setEditingMember(member);
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      department: member.department,
    });
    setDrawerOpen(true);
    setOpenMenu(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedEmail = form.email.trim().toLowerCase();

    const duplicateEmail = members.some(
      (member) =>
        member.email.toLowerCase() === normalizedEmail &&
        member.id !== editingMember?.id
    );

    if (duplicateEmail) {
      alert("This email address is already registered.");
      return;
    }

    if (editingMember) {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === editingMember.id
            ? { ...member, ...form, email: normalizedEmail }
            : member
        )
      );
    } else {
      const newMember = {
        ...form,
        email: normalizedEmail,
        id: Date.now(),
        status: "Active",
        joinedDate: new Date().toLocaleDateString("en-CA"),
      };

      setMembers((prev) => [newMember, ...prev]);
    }

    setDrawerOpen(false);
    setEditingMember(null);
    setForm(emptyForm);
  };

  const toggleStatus = (id) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id
          ? {
              ...member,
              status: member.status === "Active" ? "Inactive" : "Active",
            }
          : member
      )
    );

    setOpenMenu(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Team Members
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your organization employees and their access.
          </p>
        </div>

        <button
          onClick={openAddDrawer}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          <UserPlus size={18} />
          Add Team Member
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={stats.total} icon={<Users size={20} />} />
        <StatCard title="Active Members" value={stats.active} icon={<UserCheck size={20} />} />
        <StatCard title="Inactive Members" value={stats.inactive} icon={<UserX size={20} />} />
        <StatCard title="Agents" value={stats.agents} icon={<Users size={20} />} />
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or phone..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="All">All Roles</option>
              <option value="Manager">Manager</option>
              <option value="Agent">Agent</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">All Members</h2>
          <p className="text-xs text-slate-500 mt-1">
            {filteredMembers.length} team members found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Member</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Joined Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {member.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      {member.phone}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                      {member.role}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {member.department || "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                    {new Date(`${member.joinedDate}T00:00:00`).toLocaleDateString("en-IN")}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        member.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right relative">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === member.id ? null : member.id)
                      }
                      className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenu === member.id && (
                      <div className="absolute right-8 top-12 z-20 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-left">
                        <button
                          onClick={() => openEditDrawer(member)}
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-slate-50 text-slate-700"
                        >
                          <Pencil size={15} />
                          Edit Member
                        </button>

                        <button
                          onClick={() => toggleStatus(member.id)}
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-slate-50 text-slate-700"
                        >
                          {member.status === "Active" ? (
                            <><UserX size={15} /> Deactivate</>
                          ) : (
                            <><UserCheck size={15} /> Activate</>
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    No team members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative bg-white w-full sm:max-w-xl h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white z-10 border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {editingMember ? "Edit Team Member" : "Add Team Member"}
                </h2>
                <p className="text-sm text-slate-500">
                  Enter employee information.
                </p>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <FormField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                required
              />

              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
                required
              />

              <FormField
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleFormChange}
                required
              />

              <FormSelect
                label="Role"
                name="role"
                value={form.role}
                onChange={handleFormChange}
                options={["Manager", "Agent"]}
              />

              <FormField
                label="Department"
                name="department"
                value={form.department}
                onChange={handleFormChange}
                placeholder="e.g. Sales, Marketing"
              />

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  {editingMember ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{title}</p>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
      </div>
      <p className="text-2xl font-semibold text-slate-800 mt-3">{value}</p>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
