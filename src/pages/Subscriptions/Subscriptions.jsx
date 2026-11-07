import { useMemo, useState } from "react";
import {
  Search,
  CreditCard,
  Users,
  CheckCircle2,
  Clock3,
  Ban,
  MoreHorizontal,
  Eye,
  CalendarDays,
  X,
  Package,
  Plus,
} from "lucide-react";
import AddPlanDrawer from "./AddPlanDrawer";

const initialSubscriptions = [
  {
    id: 1,
    organizationId: "ORG-0001",
    organizationName: "ABC Technologies",
    ownerName: "Rahul Sharma",
    ownerEmail: "rahul@abctech.com",
    planName: "Free Plan",
    price: 0,
    billingCycle: "Free",
    startDate: "2026-10-12",
    endDate: null,
    status: "Active",
  },
  {
    id: 2,
    organizationId: "ORG-0002",
    organizationName: "Bright Solutions",
    ownerName: "Priya Patel",
    ownerEmail: "priya@brightsolutions.com",
    planName: "Free Plan",
    price: 0,
    billingCycle: "Free",
    startDate: "2026-10-20",
    endDate: null,
    status: "Active",
  },
  {
    id: 3,
    organizationId: "ORG-0003",
    organizationName: "NextGen Services",
    ownerName: "Amit Verma",
    ownerEmail: "amit@nextgen.com",
    planName: "Free Plan",
    price: 0,
    billingCycle: "Free",
    startDate: "2026-10-25",
    endDate: null,
    status: "Suspended",
  },
  {
    id: 4,
    organizationId: "ORG-0004",
    organizationName: "Global Connect",
    ownerName: "Sneha Desai",
    ownerEmail: "sneha@globalconnect.com",
    planName: "Free Plan",
    price: 0,
    billingCycle: "Free",
    startDate: "2026-11-01",
    endDate: null,
    status: "Active",
  },
];

const statusStyles = {
  Active: "bg-green-50 text-green-700",
  Suspended: "bg-red-50 text-red-700",
  Expired: "bg-amber-50 text-amber-700",
  Cancelled: "bg-slate-100 text-slate-600",
};

function SummaryCard({ title, value, icon: Icon, color, description }) {
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
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "No expiry";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [plans, setPlans] = useState([
    {
        id: 1,
        planName: "Free Plan",
        description: "Free CRM access for organizations.",
        price: 0,
        billingCycle: "Free",
        maxUsers: null,
        maxLeads: null,
        storageLimit: null,
    },
 ]);

 const [showAddPlan, setShowAddPlan] = useState(false);

 const handleCreatePlan = async (data) => {
  // Temporary frontend implementation.
  // Later connect POST /api/platform/subscription-plans.

  const newPlan = {
    ...data,
    id: crypto.randomUUID(),
  };

  setPlans((prev) => [...prev, newPlan]);
};

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((subscription) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        subscription.organizationName.toLowerCase().includes(searchValue) ||
        subscription.organizationId.toLowerCase().includes(searchValue) ||
        subscription.ownerName.toLowerCase().includes(searchValue) ||
        subscription.ownerEmail.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || subscription.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, search, statusFilter]);

  const counts = {
    total: subscriptions.length,
    active: subscriptions.filter((x) => x.status === "Active").length,
    suspended: subscriptions.filter((x) => x.status === "Suspended").length,
    expired: subscriptions.filter((x) => x.status === "Expired").length,
  };

  const handleStatusChange = (subscriptionId) => {
    setSubscriptions((prev) =>
      prev.map((subscription) => {
        if (subscription.id !== subscriptionId) return subscription;

        return {
          ...subscription,
          status: subscription.status === "Suspended" ? "Active" : "Suspended",
        };
      }),
    );

    setOpenMenu(null);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">
            Subscriptions
            </h1>
            <p className="mt-1 text-sm text-slate-500">
            Monitor and manage subscription plans assigned to organizations.
            </p>
        </div>

        <button
            onClick={() => setShowAddPlan(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
            <Plus size={18} />
            Add Plan
        </button>
        </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Subscriptions"
          value={counts.total}
          icon={CreditCard}
          color="bg-blue-50 text-blue-600"
          description="All organization subscriptions"
        />

        <SummaryCard
          title="Active Subscriptions"
          value={counts.active}
          icon={CheckCircle2}
          color="bg-green-50 text-green-600"
          description="Currently active accounts"
        />

        <SummaryCard
          title="Suspended"
          value={counts.suspended}
          icon={Ban}
          color="bg-red-50 text-red-600"
          description="Temporarily disabled"
        />

        <SummaryCard
          title="Expired"
          value={counts.expired}
          icon={Clock3}
          color="bg-amber-50 text-amber-600"
          description="Subscriptions past expiry"
        />
      </div>

      {/* Current plan */}
      <div className="rounded-xl border border-blue-100 bg-white p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package size={23} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">Free Plan</h2>
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                  Active
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Default subscription plan assigned to new organizations.
              </p>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">₹0</span>
                <span>Free access</span>
                <span>No expiry date</span>
                <span>{counts.total} organizations assigned</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <p className="font-semibold">Default Plan</p>
            <p className="mt-1 text-xs">Automatically assigned on onboarding</p>
          </div>
        </div>
      </div>

      {/* Subscription table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">
              Organization Subscriptions
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              View the plans assigned to your customer organizations.
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
                placeholder="Search organization..."
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
              <option value="Suspended">Suspended</option>
              <option value="Expired">Expired</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Organization</th>
                <th className="px-5 py-4 font-semibold">Plan</th>
                <th className="px-5 py-4 font-semibold">Billing</th>
                <th className="px-5 py-4 font-semibold">Start Date</th>
                <th className="px-5 py-4 font-semibold">End Date</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {subscription.organizationName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {subscription.organizationId}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-700">
                      {subscription.planName}
                    </span>
                    <p className="mt-1 text-xs text-slate-500">
                      ₹{subscription.price}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {subscription.billingCycle}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(subscription.startDate)}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(subscription.endDate)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[subscription.status]}`}
                    >
                      {subscription.status}
                    </span>
                  </td>

                  <td className="relative px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === subscription.id ? null : subscription.id,
                        )
                      }
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                      <MoreHorizontal size={19} />
                    </button>

                    {openMenu === subscription.id && (
                      <div className="absolute right-8 top-12 z-20 w-48 rounded-lg border border-slate-200 bg-white py-1 text-left shadow-lg">
                        <button
                          onClick={() => {
                            setSelectedSubscription(subscription);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Eye size={15} />
                          View Details
                        </button>

                        <button
                          onClick={() => handleStatusChange(subscription.id)}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Ban size={15} />
                          {subscription.status === "Suspended"
                            ? "Activate"
                            : "Suspend"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredSubscriptions.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <CreditCard
                      size={32}
                      className="mx-auto mb-3 text-slate-300"
                    />
                    <p className="text-sm font-semibold text-slate-700">
                      No subscriptions found
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
            Showing {filteredSubscriptions.length} of {subscriptions.length}{" "}
            subscriptions
          </p>
        </div>
      </div>

      {/* Subscription details drawer */}
      {selectedSubscription && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setSelectedSubscription(null)}
          />

          <div className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="font-bold text-slate-800">
                  Subscription Details
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedSubscription.organizationId}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubscription(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-5">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Assigned Plan</p>
                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  {selectedSubscription.planName}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  ₹{selectedSubscription.price} ·{" "}
                  {selectedSubscription.billingCycle}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">
                  Organization Information
                </h3>

                <div>
                  <p className="text-xs text-slate-500">Organization</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedSubscription.organizationName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Owner</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedSubscription.ownerName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedSubscription.ownerEmail}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">
                  Subscription Information
                </h3>

                <div>
                  <p className="text-xs text-slate-500">Start Date</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {formatDate(selectedSubscription.startDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">End Date</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {formatDate(selectedSubscription.endDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedSubscription.status]}`}
                  >
                    {selectedSubscription.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-5">
              <button
                onClick={() => setSelectedSubscription(null)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <AddPlanDrawer
        open={showAddPlan}
        onClose={() => setShowAddPlan(false)}
        onSave={handleCreatePlan}
      />

    </div>
    

  );
}
