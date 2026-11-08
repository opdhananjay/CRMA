/**
 * TeamMembers.jsx
 * 
 * Tenant Team Members & User Management Page.
 * 
 * Accessible by: OrganizationOwner, Manager
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. MULTI-FIELD FILTERING IN `useMemo`:
 *    `filteredMembers` filters by text search, role dropdown ("All", "Manager", "Agent"),
 *    and account status ("All", "Active", "Inactive").
 * 
 * 2. MODULARITY:
 *    The form drawer has been extracted into `AddTeamMemberDrawer.jsx`.
 *    The page now cleanly composes `StatCard`, `PageHeader`, and `StatusBadge`.
 * 
 * 3. BACKEND API INTEGRATION POINT:
 *    - `GET /api/team` loads users for the authenticated organization.
 *    - `POST /api/team/invite` creates a pending user invitation.
 *    - `PATCH /api/team/{id}/status` toggles Active/Inactive status.
 */

import { useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  Pencil,
  UserX,
  UserCheck,
  Building,
} from "lucide-react";

import PageHeader from "../../component/common/PageHeader";
import StatCard from "../../component/common/StatCard";
import StatusBadge from "../../component/common/StatusBadge";
import AddTeamMemberDrawer from "../../component/team/AddTeamMemberDrawer";
import { INITIAL_TEAM_MEMBERS } from "../../data/mockTeam";

export default function TeamMembers() {
  const [members, setMembers] = useState(INITIAL_TEAM_MEMBERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Compute team summary metrics
  const stats = useMemo(() => {
    return {
      total: members.length,
      active: members.filter((m) => m.status === "Active").length,
      inactive: members.filter((m) => m.status === "Inactive").length,
      agents: members.filter((m) => m.role === "Agent").length,
    };
  }, [members]);

  // Filter members based on search and selected dropdowns
  const filteredMembers = useMemo(() => {
    const term = search.toLowerCase().trim();

    return members.filter((member) => {
      const matchesSearch =
        !term ||
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

  // Open drawer to invite a new teammate
  const handleOpenInvite = () => {
    setEditingMember(null);
    setDrawerOpen(true);
  };

  // Open drawer to edit an existing teammate
  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setDrawerOpen(true);
  };

  // Save member (Create or Edit)
  const handleSaveMember = (data) => {
    if (editingMember) {
      setMembers((prev) =>
        prev.map((m) => (m.id === editingMember.id ? { ...m, ...data } : m))
      );
    } else {
      const newMember = {
        ...data,
        id: Date.now(),
        status: "Active",
        joinedDate: new Date().toISOString().slice(0, 10),
      };
      setMembers((prev) => [newMember, ...prev]);
    }
  };

  // Toggle member Active / Inactive status
  const handleToggleStatus = (id) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" }
          : m
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Page Header                                                        */}
      {/* ------------------------------------------------------------------ */}
      <PageHeader
        title="Team Members"
        description="Manage sales agents, assign roles, and monitor team seat capacity."
        action={
          <button
            type="button"
            onClick={handleOpenInvite}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
          >
            <UserPlus size={18} />
            <span>Invite Member</span>
          </button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* Summary KPI Cards                                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Team"
          value={stats.total}
          subtitle="All invited users"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Members"
          value={stats.active}
          subtitle="Can log in & work"
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Sales Agents"
          value={stats.agents}
          subtitle="Assigned to leads"
          icon={Building}
          color="purple"
        />
        <StatCard
          title="Deactivated"
          value={stats.inactive}
          subtitle="Suspended accounts"
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

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            <option value="All">All Roles</option>
            <option value="Manager">Manager</option>
            <option value="Agent">Agent</option>
          </select>

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
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Team Members Table                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
            <div className="mb-3 rounded-full bg-blue-50 p-3 text-blue-600">
              <Users size={28} />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">
              No team members found
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Try adjusting your search or role filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Name & Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-gray-800">
                        {member.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                        <Mail size={12} />
                        <span>{member.email}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-xs">
                      <span className="font-medium text-gray-700 bg-slate-100 px-2.5 py-1 rounded-full">
                        {member.role}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-gray-600">
                      {member.department}
                    </td>

                    <td className="px-5 py-3.5 text-xs text-gray-600 font-mono">
                      {member.phone || "—"}
                    </td>

                    <td className="px-5 py-3.5">
                      <StatusBadge status={member.status} dot />
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(member)}
                          title="Edit Member"
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(member.id)}
                          title={member.status === "Active" ? "Deactivate" : "Activate"}
                          className={`rounded-lg p-1.5 transition ${
                            member.status === "Active"
                              ? "text-red-500 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {member.status === "Active" ? (
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
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Add / Edit Team Member Drawer                                      */}
      {/* ------------------------------------------------------------------ */}
      <AddTeamMemberDrawer
        key={editingMember ? editingMember.id : "new"}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSaveMember}
        memberToEdit={editingMember}
      />
    </div>
  );
}
