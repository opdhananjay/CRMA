import { useState } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  Lock,
  Users,
  LayoutDashboard,
  Target,
  GitBranch,
  CalendarCheck,
  CalendarDays,
  BarChart3,
  Settings,
  UserCog,
} from "lucide-react";

const permissionGroups = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    permissions: [{ key: "dashboard.view", label: "View Dashboard" }],
  },
  {
    name: "Leads",
    icon: Target,
    permissions: [
      { key: "leads.view", label: "View Leads" },
      { key: "leads.create", label: "Create Leads" },
      { key: "leads.edit", label: "Edit Leads" },
      { key: "leads.delete", label: "Delete Leads" },
      { key: "leads.assign", label: "Assign Leads" },
      { key: "leads.view_all", label: "View All Team Leads" },
    ],
  },
  {
    name: "Pipeline",
    icon: GitBranch,
    permissions: [
      { key: "pipeline.view", label: "View Pipeline" },
      { key: "pipeline.create", label: "Create Opportunities" },
      { key: "pipeline.edit", label: "Edit Opportunities" },
      { key: "pipeline.delete", label: "Delete Opportunities" },
      { key: "pipeline.move", label: "Move Pipeline Stages" },
    ],
  },
  {
    name: "Follow-ups",
    icon: CalendarCheck,
    permissions: [
      { key: "followups.view", label: "View Follow-ups" },
      { key: "followups.create", label: "Create Follow-ups" },
      { key: "followups.edit", label: "Edit Follow-ups" },
      { key: "followups.delete", label: "Delete Follow-ups" },
      { key: "followups.view_all", label: "View Team Follow-ups" },
    ],
  },
  {
    name: "Meetings",
    icon: CalendarDays,
    permissions: [
      { key: "meetings.view", label: "View Meetings" },
      { key: "meetings.create", label: "Create Meetings" },
      { key: "meetings.edit", label: "Edit Meetings" },
      { key: "meetings.delete", label: "Delete Meetings" },
      { key: "meetings.view_all", label: "View Team Meetings" },
    ],
  },
  {
    name: "Team Members",
    icon: Users,
    permissions: [
      { key: "team.view", label: "View Team Members" },
      { key: "team.invite", label: "Invite Team Members" },
      { key: "team.edit", label: "Edit Team Members" },
      { key: "team.deactivate", label: "Activate / Deactivate Members" },
    ],
  },
  {
    name: "Reports",
    icon: BarChart3,
    permissions: [
      { key: "reports.view", label: "View Reports" },
      { key: "reports.export", label: "Export Reports" },
    ],
  },
  {
    name: "Organization Settings",
    icon: Settings,
    permissions: [
      { key: "settings.view", label: "View Organization Settings" },
      { key: "settings.edit", label: "Edit Organization Settings" },
      { key: "roles.manage", label: "Manage Roles & Permissions" },
    ],
  },
];

const allPermissionKeys = permissionGroups.flatMap((group) =>
  group.permissions.map((permission) => permission.key),
);

const defaultPermissions = {
  OrganizationOwner: allPermissionKeys,

  Manager: [
    "dashboard.view",
    "leads.view",
    "leads.create",
    "leads.edit",
    "leads.assign",
    "leads.view_all",
    "pipeline.view",
    "pipeline.create",
    "pipeline.edit",
    "pipeline.move",
    "followups.view",
    "followups.create",
    "followups.edit",
    "followups.view_all",
    "meetings.view",
    "meetings.create",
    "meetings.edit",
    "meetings.view_all",
    "team.view",
    "reports.view",
  ],

  Agent: [
    "dashboard.view",
    "leads.view",
    "leads.create",
    "leads.edit",
    "pipeline.view",
    "followups.view",
    "followups.create",
    "followups.edit",
    "meetings.view",
    "meetings.create",
    "meetings.edit",
  ],
};

const initialRoles = [
  {
    id: 1,
    name: "Organization Owner",
    code: "OrganizationOwner",
    description: "Full access to organization and CRM.",
    type: "System",
    permissions: defaultPermissions.OrganizationOwner,
    members: 1,
    isSystem: true,
  },
  {
    id: 2,
    name: "Manager",
    code: "Manager",
    description: "Manage sales operations and team activities.",
    type: "System",
    permissions: defaultPermissions.Manager,
    members: 2,
    isSystem: true,
  },
  {
    id: 3,
    name: "Agent",
    code: "Agent",
    description: "Manage assigned leads and personal activities.",
    type: "System",
    permissions: defaultPermissions.Agent,
    members: 5,
    isSystem: true,
  },
];

const emptyForm = {
  id: null,
  name: "",
  description: "",
  permissions: [],
};

export default function RolesPermissions() {
  const [roles, setRoles] = useState(initialRoles);
  const [search, setSearch] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreateDrawer = () => {
    setEditingRole(null);
    setForm(emptyForm);
    setShowDrawer(true);
  };

  const openEditDrawer = (role) => {
    if (role.code === "OrganizationOwner") return;

    setEditingRole(role);
    setForm({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    });
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setEditingRole(null);
    setForm(emptyForm);
  };

  const togglePermission = (permissionKey) => {
    setForm((previous) => ({
      ...previous,
      permissions: previous.permissions.includes(permissionKey)
        ? previous.permissions.filter((item) => item !== permissionKey)
        : [...previous.permissions, permissionKey],
    }));
  };

  const toggleGroup = (group) => {
    const groupKeys = group.permissions.map((permission) => permission.key);
    const allSelected = groupKeys.every((key) =>
      form.permissions.includes(key),
    );

    setForm((previous) => ({
      ...previous,
      permissions: allSelected
        ? previous.permissions.filter((key) => !groupKeys.includes(key))
        : [...new Set([...previous.permissions, ...groupKeys])],
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert("Please enter a role name.");
      return;
    }

    if (editingRole) {
      setRoles((previous) =>
        previous.map((role) =>
          role.id === editingRole.id
            ? {
                ...role,
                name: form.name.trim(),
                description: form.description.trim(),
                permissions: form.permissions,
              }
            : role,
        ),
      );
    } else {
      const newRole = {
        id: Date.now(),
        name: form.name.trim(),
        code: `Custom_${Date.now()}`,
        description: form.description.trim(),
        type: "Custom",
        permissions: form.permissions,
        members: 0,
        isSystem: false,
      };

      setRoles((previous) => [...previous, newRole]);
    }

    closeDrawer();
  };

  const handleDelete = (role) => {
    if (role.isSystem) return;

    if (role.members > 0) {
      alert(
        "This role is assigned to team members. Reassign them before deleting it.",
      );
      return;
    }

    if (window.confirm(`Delete the ${role.name} role?`)) {
      setRoles((previous) => previous.filter((item) => item.id !== role.id));
    }
  };

  const getPermissionCount = (role) => role.permissions.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Roles & Permissions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage roles and control what your team members can access.
          </p>
        </div>

        <button
          onClick={openCreateDrawer}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Role
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={ShieldCheck}
          label="Total Roles"
          value={roles.length}
        />
        <SummaryCard
          icon={UserCog}
          label="System Roles"
          value={roles.filter((role) => role.isSystem).length}
        />
        <SummaryCard
          icon={Users}
          label="Custom Roles"
          value={roles.filter((role) => !role.isSystem).length}
        />
      </div>

      {/* Role List */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">Available Roles</h2>
            <p className="mt-1 text-xs text-slate-500">
              Configure access permissions for each role.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                  <ShieldCheck size={21} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-slate-800">{role.name}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        role.isSystem
                          ? "bg-slate-100 text-slate-600"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {role.type}
                    </span>
                    {role.code === "OrganizationOwner" && (
                      <Lock size={13} className="text-slate-400" />
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {role.description}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span>{getPermissionCount(role)} permissions</span>
                    <span>{role.members} members assigned</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:shrink-0">
                <button
                  onClick={() => openEditDrawer(role)}
                  disabled={role.code === "OrganizationOwner"}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Pencil size={15} />
                  Edit Permissions
                </button>

                {!role.isSystem && (
                  <button
                    onClick={() => handleDelete(role)}
                    className="rounded-lg border border-slate-200 p-2 text-red-500 hover:bg-red-50"
                    title="Delete role"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredRoles.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-500">
              No roles found.
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
          <div className="flex h-full w-full max-w-2xl flex-col bg-white shadow-xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {editingRole ? "Edit Role" : "Create New Role"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Set role details and choose permissions.
                </p>
              </div>

              <button
                onClick={closeDrawer}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g. Sales Executive"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the responsibilities of this role..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="border-t border-slate-200 pt-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Permissions
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {form.permissions.length} of {allPermissionKeys.length}{" "}
                      permissions selected
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setForm((previous) => ({
                        ...previous,
                        permissions:
                          previous.permissions.length ===
                          allPermissionKeys.length
                            ? []
                            : [...allPermissionKeys],
                      }))
                    }
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {form.permissions.length === allPermissionKeys.length
                      ? "Clear All"
                      : "Select All"}
                  </button>
                </div>

                <div className="space-y-3">
                  {permissionGroups.map((group) => {
                    const GroupIcon = group.icon;
                    const selectedCount = group.permissions.filter(
                      (permission) => form.permissions.includes(permission.key),
                    ).length;

                    const allSelected =
                      selectedCount === group.permissions.length;

                    return (
                      <div
                        key={group.name}
                        className="overflow-hidden rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <GroupIcon size={17} className="text-slate-600" />
                            <span className="text-sm font-semibold text-slate-700">
                              {group.name}
                            </span>
                            <span className="text-xs text-slate-400">
                              ({selectedCount}/{group.permissions.length})
                            </span>
                          </div>

                          <button
                            onClick={() => toggleGroup(group)}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            {allSelected ? "Clear" : "Select All"}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                          {group.permissions.map((permission) => {
                            const checked = form.permissions.includes(
                              permission.key,
                            );

                            return (
                              <label
                                key={permission.key}
                                className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    togglePermission(permission.key)
                                  }
                                  className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                                />
                                {permission.label}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button
                onClick={closeDrawer}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Check size={16} />
                {editingRole ? "Save Changes" : "Create Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
        <Icon size={21} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
