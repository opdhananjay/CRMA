
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Building2,
  CheckCircle2,
  Clock3,
  Ban,
  MoreHorizontal,
  Eye,
  Pencil,
  Power,
  Users,
  X,
  Filter,
} from "lucide-react";
import AddOrganizationDrawer from "./AddOrganizationDrawer";

const initialOrganizations = [
  {
    id: 1,
    name: "ABC Technologies",
    code: "ORG-0001",
    owner: "Rahul Sharma",
    email: "rahul@abctech.com",
    phone: "+91 98765 43210",
    plan: "Professional",
    users: 12,
    status: "Active",
    createdAt: "12 Oct 2026",
  },
  {
    id: 2,
    name: "Bright Solutions",
    code: "ORG-0002",
    owner: "Priya Patel",
    email: "priya@brightsolutions.com",
    phone: "+91 98765 12345",
    plan: "Starter",
    users: 5,
    status: "Trial",
    createdAt: "20 Oct 2026",
  },
  {
    id: 3,
    name: "NextGen Services",
    code: "ORG-0003",
    owner: "Amit Verma",
    email: "amit@nextgen.com",
    phone: "+91 99887 66554",
    plan: "Enterprise",
    users: 28,
    status: "Suspended",
    createdAt: "25 Oct 2026",
  },
  {
    id: 4,
    name: "Global Connect",
    code: "ORG-0004",
    owner: "Sneha Desai",
    email: "sneha@globalconnect.com",
    phone: "+91 98760 12345",
    plan: "Professional",
    users: 9,
    status: "Active",
    createdAt: "01 Nov 2026",
  },
];

const statusStyles = {
  Active: "bg-green-50 text-green-700",
  Trial: "bg-blue-50 text-blue-700",
  Suspended: "bg-red-50 text-red-700",
  Inactive: "bg-slate-100 text-slate-600",
};

function SummaryCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <h2 className="mt-3 text-2xl font-bold text-slate-800">{value}</h2>
    </div>
  );
}

export default function Organizations() {
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  const handleCreateOrganization = async (data) => {
  // Frontend-only temporary implementation.
  // Replace with POST /api/platform/organizations later.

  const newOrganization = {
    id: crypto.randomUUID(),
    code: `ORG-${String(Date.now()).slice(-6)}`,
    name: data.organizationName,
    owner: data.ownerName,
    email: data.ownerEmail,
    phone: data.businessPhone,
    plan: "Not Assigned",
    users: 0,
    status: "Inactive",
    createdAt: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };

  setOrganizations((prev) => [newOrganization, ...prev]);
};

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        org.name.toLowerCase().includes(searchValue) ||
        org.owner.toLowerCase().includes(searchValue) ||
        org.email.toLowerCase().includes(searchValue) ||
        org.code.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || org.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [organizations, search, statusFilter]);

  const counts = {
    total: organizations.length,
    active: organizations.filter((x) => x.status === "Active").length,
    trial: organizations.filter((x) => x.status === "Trial").length,
    suspended: organizations.filter((x) => x.status === "Suspended").length,
  };

  const handleStatusChange = (id) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id !== id) return org;

        return {
          ...org,
          status: org.status === "Suspended" ? "Active" : "Suspended",
        };
      })
    );

    setOpenMenu(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Organizations
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage customer organizations registered on Anjaya CRM.
          </p>
        </div>

        <button
            onClick={() => setShowAddDrawer(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
            <Plus size={18} />
            Add Organization
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Organizations"
          value={counts.total}
          icon={Building2}
          color="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          title="Active Organizations"
          value={counts.active}
          icon={CheckCircle2}
          color="bg-green-50 text-green-600"
        />
        <SummaryCard
          title="Trial Organizations"
          value={counts.trial}
          icon={Clock3}
          color="bg-amber-50 text-amber-600"
        />
        <SummaryCard
          title="Suspended Organizations"
          value={counts.suspended}
          icon={Ban}
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* Organization table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">
              All Organizations
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              View and manage your customer accounts.
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
                placeholder="Search organizations..."
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
              />
            </div>

            <div className="relative">
              <Filter
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-8 text-sm outline-none focus:border-blue-500 sm:w-40"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Trial">Trial</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Organization</th>
                <th className="px-5 py-4 font-semibold">Owner</th>
                <th className="px-5 py-4 font-semibold">Plan</th>
                <th className="px-5 py-4 font-semibold">Users</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Created Date</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredOrganizations.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Building2 size={19} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {org.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {org.code}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      {org.owner}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{org.email}</p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {org.plan}
                  </td>

                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-sm text-slate-700">
                      <Users size={15} className="text-slate-400" />
                      {org.users}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[org.status]}`}
                    >
                      {org.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {org.createdAt}
                  </td>

                  <td className="relative px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === org.id ? null : org.id)
                      }
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                      <MoreHorizontal size={19} />
                    </button>

                    {openMenu === org.id && (
                      <div className="absolute right-8 top-12 z-20 w-44 rounded-lg border border-slate-200 bg-white py-1 text-left shadow-lg">
                        <button
                          onClick={() => {
                            alert(`View ${org.name}`);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Eye size={15} /> View Details
                        </button>
                        <button
                          onClick={() => {
                            alert(`Edit ${org.name}`);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil size={15} /> Edit
                        </button>
                        <button
                          onClick={() => handleStatusChange(org.id)}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Power size={15} />
                          {org.status === "Suspended" ? "Activate" : "Suspend"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredOrganizations.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <Building2
                      size={32}
                      className="mx-auto mb-3 text-slate-300"
                    />
                    <p className="text-sm font-semibold text-slate-700">
                      No organizations found
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
            Showing {filteredOrganizations.length} of {organizations.length} organizations
          </p>
        </div>
      </div>

      <AddOrganizationDrawer
        open={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        onSave={handleCreateOrganization}
       />

    </div>
  );
}
