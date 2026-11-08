/**
 * Organizations.jsx
 * 
 * Tenant Organizations Management Page for Platform SuperAdmin.
 * 
 * Accessible by: SuperAdmin
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. MULTI-TENANT ARCHITECTURE:
 *    In multi-tenant CRM systems, an "Organization" represents a separate company/client.
 *    Each organization has its own isolated leads, deals, users, and pipelines.
 *    SuperAdmin manages organizations at the platform level.
 * 
 * 2. COMPONENT DE-DUPLICATION:
 *    Previously, this file defined a local `SummaryCard` function that triggered
 *    ESLint unused variable warnings. We now use our shared `<StatCard>`.
 * 
 * 3. BACKEND API INTEGRATION POINT:
 *    - `GET /api/organizations` loads all registered tenant accounts.
 *    - `POST /api/organizations` creates a new tenant, provisions the owner,
 *      and attaches the default subscription plan.
 */

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Building2,
  CheckCircle2,
  Clock3,
  Ban,
  Users,
} from "lucide-react";

import PageHeader from "../../component/common/PageHeader";
import StatCard from "../../component/common/StatCard";
import StatusBadge from "../../component/common/StatusBadge";
import AddOrganizationDrawer from "./AddOrganizationDrawer";
import { INITIAL_ORGANIZATIONS } from "../../data/mockOrganizations";

export default function Organizations() {
  const [organizations, setOrganizations] = useState(INITIAL_ORGANIZATIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  // Compute organization statistics
  const stats = useMemo(() => {
    return {
      total: organizations.length,
      active: organizations.filter((o) => o.status === "Active").length,
      trial: organizations.filter((o) => o.status === "Trial").length,
      suspended: organizations.filter((o) => o.status === "Suspended").length,
    };
  }, [organizations]);

  // Filter organizations by search and status
  const filteredOrganizations = useMemo(() => {
    const term = search.toLowerCase().trim();

    return organizations.filter((org) => {
      const matchesSearch =
        !term ||
        org.name.toLowerCase().includes(term) ||
        org.owner.toLowerCase().includes(term) ||
        org.email.toLowerCase().includes(term) ||
        org.code.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || org.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [organizations, search, statusFilter]);

  // Handle creating a new organization
  const handleCreateOrganization = async (data) => {
    const newOrg = {
      id: Date.now(),
      name: data.organizationName,
      code: `ORG-000${organizations.length + 1}`,
      owner: data.ownerName,
      email: data.businessEmail,
      phone: data.businessPhone,
      plan: "Free Plan",
      users: 1,
      status: "Active",
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    setOrganizations((prev) => [newOrg, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Page Header                                                        */}
      {/* ------------------------------------------------------------------ */}
      <PageHeader
        title="Organizations"
        description="Monitor tenant companies, provision new accounts, and track plan allocations."
        action={
          <button
            type="button"
            onClick={() => setShowAddDrawer(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={18} />
            <span>Add Organization</span>
          </button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* KPI Cards                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Organizations"
          value={stats.total}
          subtitle="All registered tenants"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Active Tenants"
          value={stats.active}
          subtitle="Operational accounts"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Trial Subscriptions"
          value={stats.trial}
          subtitle="Evaluation period"
          icon={Clock3}
          color="cyan"
        />
        <StatCard
          title="Suspended / Inactive"
          value={stats.suspended}
          subtitle="Requires attention"
          icon={Ban}
          color="red"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Search & Filter Bar                                                */}
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
            placeholder="Search by company name, owner, or org code..."
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
          <option value="Trial">Trial</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Organizations Table                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {filteredOrganizations.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
            <div className="mb-3 rounded-full bg-blue-50 p-3 text-blue-600">
              <Building2 size={28} />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">
              No organizations found
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Organization & Code</th>
                  <th className="px-5 py-3.5 font-medium">Owner & Contact</th>
                  <th className="px-5 py-3.5 font-medium">Assigned Plan</th>
                  <th className="px-5 py-3.5 font-medium">Users</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium">Registered</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredOrganizations.map((org) => (
                  <tr
                    key={org.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-800">
                        {org.name}
                      </div>
                      <div className="text-xs text-blue-600 font-mono mt-0.5">
                        {org.code}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs">
                      <div className="font-medium text-gray-800">{org.owner}</div>
                      <div className="text-gray-400 mt-0.5">{org.email}</div>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-700">
                      <span className="font-medium bg-slate-100 px-2 py-1 rounded">
                        {org.plan}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Users size={13} className="text-gray-400" />
                        <span>{org.users}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={org.status} dot />
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500 font-mono">
                      {org.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Add Organization Drawer                                            */}
      {/* ------------------------------------------------------------------ */}
      <AddOrganizationDrawer
        open={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        onSave={handleCreateOrganization}
      />
    </div>
  );
}
