/**
 * Subscriptions.jsx
 * 
 * SaaS Subscription Plans & Organization Billing Management for SuperAdmin.
 * 
 * Accessible by: SuperAdmin
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. DUAL TAB ARCHITECTURE (SUBSCRIPTIONS VS PLANS):
 *    - Tab 1: "Organization Subscriptions" – Active tenant subscriptions.
 *    - Tab 2: "Available Plans" – Configurable pricing tiers.
 *    This cleanly utilizes the `plans` state that was previously marked as unused by ESLint!
 * 
 * 2. COMPONENT DE-DUPLICATION:
 *    Replaced the duplicate local `SummaryCard` function with `<StatCard>`.
 * 
 * 3. BACKEND API INTEGRATION POINT:
 *    - `GET /api/subscriptions` loads tenant billing status.
 *    - `GET /api/plans` loads plan catalog.
 *    - `POST /api/plans` adds a new tier.
 */

import { useMemo, useState } from "react";
import {
  Search,
  CreditCard,
  CheckCircle2,
  Clock3,
  Ban,
  Package,
  Plus,
} from "lucide-react";

import PageHeader from "../../component/common/PageHeader";
import StatCard from "../../component/common/StatCard";
import StatusBadge from "../../component/common/StatusBadge";
import AddPlanDrawer from "./AddPlanDrawer";
import {
  INITIAL_PLANS,
  INITIAL_SUBSCRIPTIONS,
} from "../../data/mockSubscriptions";

export default function Subscriptions() {
  const [subscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [activeTab, setActiveTab] = useState("subscriptions"); // "subscriptions" | "plans"
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Compute billing KPIs
  const stats = useMemo(() => {
    return {
      total: subscriptions.length,
      active: subscriptions.filter((s) => s.status === "Active").length,
      plansCount: plans.length,
      suspended: subscriptions.filter((s) => s.status === "Suspended").length,
    };
  }, [subscriptions, plans]);

  // Filter subscriptions by search and status
  const filteredSubscriptions = useMemo(() => {
    const term = search.toLowerCase().trim();

    return subscriptions.filter((sub) => {
      const matchesSearch =
        !term ||
        sub.organizationName.toLowerCase().includes(term) ||
        sub.ownerName.toLowerCase().includes(term) ||
        sub.planName.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || sub.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, search, statusFilter]);

  // Handle creating a new plan
  const handleCreatePlan = async (newPlanData) => {
    const created = {
      ...newPlanData,
      id: Date.now(),
      status: "Active",
      features: [
        `Up to ${newPlanData.maxUsers || "unlimited"} Users`,
        `Up to ${newPlanData.maxLeads || "unlimited"} Leads`,
        `${newPlanData.storageLimit || 5} GB Cloud Storage`,
      ],
    };

    setPlans((prev) => [...prev, created]);
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Page Header                                                        */}
      {/* ------------------------------------------------------------------ */}
      <PageHeader
        title="Subscriptions & Plans"
        description="Manage SaaS customer tiers, billing cycles, and organization subscription status."
        action={
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={18} />
            <span>Create Plan</span>
          </button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* KPI Cards                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Subscriptions"
          value={stats.active}
          subtitle="Paying or active tenants"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Total Subscriptions"
          value={stats.total}
          subtitle="All provisioned orgs"
          icon={CreditCard}
          color="blue"
        />
        <StatCard
          title="Configured Plans"
          value={stats.plansCount}
          subtitle="Available SaaS tiers"
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Suspended / Expired"
          value={stats.suspended}
          subtitle="Access blocked"
          icon={Ban}
          color="red"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Subscriptions vs Plans Tabs                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("subscriptions")}
          className={`py-3 text-sm font-semibold border-b-2 transition ${
            activeTab === "subscriptions"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Tenant Subscriptions ({subscriptions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("plans")}
          className={`py-3 text-sm font-semibold border-b-2 transition ${
            activeTab === "plans"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          SaaS Pricing Plans ({plans.length})
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Tab 1: Organization Subscriptions Table                            */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "subscriptions" && (
        <div className="space-y-4">
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
                placeholder="Search by organization, owner, or plan..."
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
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Organization</th>
                    <th className="px-5 py-3.5 font-medium">Plan Name</th>
                    <th className="px-5 py-3.5 font-medium">Billing Cycle</th>
                    <th className="px-5 py-3.5 font-medium">Monthly Fee</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                    <th className="px-5 py-3.5 font-medium">Start Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredSubscriptions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-800">
                          {sub.organizationName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {sub.ownerName} ({sub.ownerEmail})
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs font-medium text-gray-800">
                        {sub.planName}
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-600">
                        {sub.billingCycle}
                      </td>

                      <td className="px-5 py-4 text-xs font-semibold text-gray-800 font-mono">
                        {sub.price === 0 ? "Free" : `₹${sub.price.toLocaleString("en-IN")}`}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={sub.status} dot />
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500 font-mono">
                        {sub.startDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Tab 2: Pricing Plans Grid                                          */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "plans" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {plan.billingCycle}
                  </span>
                </div>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {plan.price === 0 ? "Free" : `₹${plan.price.toLocaleString("en-IN")}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-xs text-gray-500">/ month</span>
                  )}
                </div>

                <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Plan Inclusions:
                  </p>
                  {plan.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle2 size={15} className="text-green-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                Managed by SuperAdmin
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Create Plan Drawer                                                 */}
      {/* ------------------------------------------------------------------ */}
      <AddPlanDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleCreatePlan}
      />
    </div>
  );
}
