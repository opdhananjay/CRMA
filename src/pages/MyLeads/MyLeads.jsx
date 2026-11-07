import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Pencil,
  X,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Building2,
  User,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

const initialLeads = [
  {
    id: 1,
    companyName: "ABC Technologies",
    contactPerson: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@abctech.com",
    city: "Mumbai",
    leadSource: "Website",
    leadType: "Business",
    industry: "IT Services",
    status: "New",
    priority: "High",
    budget: "₹2,00,000",
    nextFollowUp: "2026-11-09",
    notes: "Interested in CRM software.",
  },
  {
    id: 2,
    companyName: "Bright Solutions",
    contactPerson: "Priya Patil",
    phone: "9876543211",
    email: "priya@bright.com",
    city: "Thane",
    leadSource: "Referral",
    leadType: "Business",
    industry: "Consulting",
    status: "Contacted",
    priority: "Medium",
    budget: "₹1,50,000",
    nextFollowUp: "2026-11-10",
    notes: "Initial discussion completed.",
  },
  {
    id: 3,
    companyName: "Global Enterprises",
    contactPerson: "Amit Joshi",
    phone: "9876543212",
    email: "amit@global.com",
    city: "Pune",
    leadSource: "LinkedIn",
    leadType: "Business",
    industry: "Manufacturing",
    status: "Qualified",
    priority: "High",
    budget: "₹3,00,000",
    nextFollowUp: "2026-11-12",
    notes: "Needs a customized CRM solution.",
  },
  {
    id: 4,
    companyName: "Smart Retail",
    contactPerson: "Sneha Desai",
    phone: "9876543213",
    email: "sneha@smartretail.com",
    city: "Nashik",
    leadSource: "JustDial",
    leadType: "Business",
    industry: "Retail",
    status: "Proposal",
    priority: "Medium",
    budget: "₹90,000",
    nextFollowUp: "2026-11-13",
    notes: "Proposal shared with client.",
  },
  {
    id: 5,
    companyName: "NextGen Systems",
    contactPerson: "Karan Mehta",
    phone: "9876543214",
    email: "karan@nextgen.com",
    city: "Mumbai",
    leadSource: "Website",
    leadType: "Business",
    industry: "Technology",
    status: "Won",
    priority: "High",
    budget: "₹2,50,000",
    nextFollowUp: "",
    notes: "Deal successfully closed.",
  },
];

const statuses = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

const emptyLead = {
  companyName: "",
  contactPerson: "",
  phone: "",
  email: "",
  city: "",
  leadSource: "Website",
  leadType: "Business",
  industry: "",
  status: "New",
  priority: "Medium",
  budget: "",
  nextFollowUp: "",
  notes: "",
};

export default function MyLeads() {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerMode, setDrawerMode] = useState("view");
  const [form, setForm] = useState(emptyLead);

  const stats = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter((lead) => lead.status === "New").length,
      inProgress: leads.filter((lead) =>
        ["Contacted", "Qualified", "Proposal", "Negotiation"].includes(
          lead.status,
        ),
      ).length,
      won: leads.filter((lead) => lead.status === "Won").length,
    }),
    [leads],
  );

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        lead.companyName.toLowerCase().includes(searchText) ||
        lead.contactPerson.toLowerCase().includes(searchText) ||
        lead.phone.includes(searchText) ||
        lead.email.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;

      const matchesSource =
        sourceFilter === "All" || lead.leadSource === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, search, statusFilter, sourceFilter]);

  const openAddDrawer = () => {
    setSelectedLead(null);
    setDrawerMode("add");
    setForm(emptyLead);
    setShowDrawer(true);
  };

  const openViewDrawer = (lead) => {
    setSelectedLead(lead);
    setDrawerMode("view");
    setForm({ ...lead });
    setShowDrawer(true);
  };

  const openEditDrawer = (lead) => {
    setSelectedLead(lead);
    setDrawerMode("edit");
    setForm({ ...lead });
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedLead(null);
    setDrawerMode("view");
  };

  const handleSave = () => {
    if (
      !form.companyName.trim() ||
      !form.contactPerson.trim() ||
      !form.phone.trim()
    ) {
      alert("Company name, contact person and phone are required.");
      return;
    }

    if (drawerMode === "edit") {
      setLeads((previous) =>
        previous.map((lead) =>
          lead.id === selectedLead.id ? { ...lead, ...form } : lead,
        ),
      );
    } else {
      const newLead = {
        ...form,
        id: Date.now(),
      };
      setLeads((previous) => [newLead, ...previous]);
    }

    closeDrawer();
  };

  const updateStatus = (leadId, newStatus) => {
    setLeads((previous) =>
      previous.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">My Leads</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and track your assigned leads.
          </p>
        </div>

        <button
          onClick={openAddDrawer}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="Total Leads" value={stats.total} />
        <SummaryCard label="New Leads" value={stats.new} />
        <SummaryCard label="In Progress" value={stats.inProgress} />
        <SummaryCard label="Won Leads" value={stats.won} />
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, contact, phone or email..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
            >
              <option value="All">All Sources</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="JustDial">JustDial</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setSourceFilter("All");
              }}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              <Filter size={16} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <div>
            <h2 className="font-semibold text-slate-800">Lead List</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredLeads.length} leads found
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Company / Contact</th>
                <th className="px-5 py-3">Contact Details</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Next Follow-up</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                        <Building2 size={19} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {lead.companyName}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {lead.contactPerson}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">{lead.phone}</p>
                    <p className="mt-1 text-xs text-slate-500">{lead.email}</p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {lead.leadSource}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={lead.status} />
                  </td>

                  <td className="px-5 py-4">
                    <PriorityBadge priority={lead.priority} />
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {lead.nextFollowUp || "Not scheduled"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openViewDrawer(lead)}
                        title="View lead"
                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        onClick={() => openEditDrawer(lead)}
                        title="Edit lead"
                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit / View Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
          <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-800">
                  {drawerMode === "add"
                    ? "Add New Lead"
                    : drawerMode === "edit"
                      ? "Edit Lead"
                      : "Lead Details"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {drawerMode === "view"
                    ? "View your lead information."
                    : "Enter the lead information below."}
                </p>
              </div>

              <button
                onClick={closeDrawer}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <FormSection title="Basic Information">
                <FormField
                  label="Company Name"
                  value={form.companyName}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, companyName: value })}
                  required
                />
                <FormField
                  label="Contact Person"
                  value={form.contactPerson}
                  disabled={drawerMode === "view"}
                  onChange={(value) =>
                    setForm({ ...form, contactPerson: value })
                  }
                  required
                />
                <FormField
                  label="Phone"
                  value={form.phone}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, phone: value })}
                  required
                />
                <FormField
                  label="Email"
                  value={form.email}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, email: value })}
                />
                <FormField
                  label="City"
                  value={form.city}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, city: value })}
                />
                <FormField
                  label="Industry"
                  value={form.industry}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, industry: value })}
                />
              </FormSection>

              <FormSection title="Lead Information">
                <SelectField
                  label="Lead Source"
                  value={form.leadSource}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, leadSource: value })}
                  options={[
                    "Website",
                    "Referral",
                    "LinkedIn",
                    "JustDial",
                    "Other",
                  ]}
                />

                <SelectField
                  label="Lead Type"
                  value={form.leadType}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, leadType: value })}
                  options={["Business", "Individual", "Partner"]}
                />

                <SelectField
                  label="Status"
                  value={form.status}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, status: value })}
                  options={statuses}
                />

                <SelectField
                  label="Priority"
                  value={form.priority}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, priority: value })}
                  options={["Low", "Medium", "High"]}
                />

                <FormField
                  label="Budget"
                  value={form.budget}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, budget: value })}
                />

                <FormField
                  label="Next Follow-up"
                  type="date"
                  value={form.nextFollowUp}
                  disabled={drawerMode === "view"}
                  onChange={(value) =>
                    setForm({ ...form, nextFollowUp: value })
                  }
                />
              </FormSection>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  disabled={drawerMode === "view"}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                  placeholder="Enter notes..."
                />
              </div>
            </div>

            {drawerMode !== "view" && (
              <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
                <button
                  onClick={closeDrawer}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Lead
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    New: "bg-blue-50 text-blue-700",
    Contacted: "bg-cyan-50 text-cyan-700",
    Qualified: "bg-purple-50 text-purple-700",
    Proposal: "bg-amber-50 text-amber-700",
    Negotiation: "bg-orange-50 text-orange-700",
    Won: "bg-green-50 text-green-700",
    Lost: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    High: "text-red-600",
    Medium: "text-amber-600",
    Low: "text-slate-500",
  };

  return (
    <span className={`text-sm font-medium ${styles[priority] || ""}`}>
      {priority}
    </span>
  );
}

function FormSection({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 border-b border-slate-100 pb-2 text-sm font-semibold text-slate-800">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  required = false,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, disabled = false }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <select
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
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
