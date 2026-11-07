import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Phone,
  Mail,
  Users,
  MessageSquare,
  FileText,
  RefreshCw,
  CalendarDays,
  Clock,
  Building2,
  User,
  X,
  Eye,
  Filter,
  CheckCircle2,
  Activity,
  MapPin,
} from "lucide-react";

const today = new Date().toISOString().slice(0, 10);

const getDate = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const initialActivities = [
  {
    id: 1,
    leadName: "Rahul Sharma",
    companyName: "ABC Technologies",
    type: "Call",
    subject: "Initial requirements discussion",
    description: "Discussed the client's CRM requirements and business needs.",
    date: today,
    time: "10:30",
    outcome: "Interested",
  },
  {
    id: 2,
    leadName: "Priya Patil",
    companyName: "Bright Solutions",
    type: "Email",
    subject: "Product information shared",
    description: "Sent company profile and CRM product information.",
    date: today,
    time: "12:15",
    outcome: "Email Sent",
  },
  {
    id: 3,
    leadName: "Amit Joshi",
    companyName: "Global Enterprises",
    type: "Meeting",
    subject: "Proposal discussion",
    description: "Discussed the proposal, implementation timeline and budget.",
    date: getDate(-1),
    time: "15:00",
    outcome: "Follow-up Required",
  },
  {
    id: 4,
    leadName: "Sneha Desai",
    companyName: "Smart Retail",
    type: "Note",
    subject: "Client requirement updated",
    description: "Client requires additional reporting and inventory features.",
    date: getDate(-2),
    time: "11:45",
    outcome: "Note Added",
  },
  {
    id: 5,
    leadName: "Karan Mehta",
    companyName: "NextGen Systems",
    type: "Status Update",
    subject: "Lead status changed",
    description: "Lead status updated from Qualified to Proposal.",
    date: getDate(-3),
    time: "16:20",
    outcome: "Status Updated",
  },
  {
    id: 6,
    leadName: "Rahul Sharma",
    companyName: "ABC Technologies",
    type: "Follow-up",
    subject: "Follow-up completed",
    description: "Completed the scheduled follow-up call.",
    date: getDate(-4),
    time: "14:00",
    outcome: "Completed",
  },
  {
    id: 7,
    leadName: "Priya Patil",
    companyName: "Bright Solutions",
    type: "Proposal",
    subject: "Commercial proposal shared",
    description: "Shared the estimated project cost and proposal.",
    date: getDate(-5),
    time: "13:30",
    outcome: "Proposal Sent",
  },
];

const activityTypes = [
  "All",
  "Call",
  "Email",
  "Meeting",
  "Note",
  "Follow-up",
  "Status Update",
  "Proposal",
  "Other",
];

const emptyForm = {
  leadName: "",
  companyName: "",
  type: "Call",
  subject: "",
  description: "",
  date: today,
  time: "10:00",
  outcome: "",
};

export default function MyActivities() {
  const [activities, setActivities] = useState(initialActivities);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const stats = useMemo(
    () => ({
      total: activities.length,
      calls: activities.filter((item) => item.type === "Call").length,
      emails: activities.filter((item) => item.type === "Email").length,
      meetings: activities.filter((item) => item.type === "Meeting").length,
      notes: activities.filter((item) => item.type === "Note").length,
    }),
    [activities],
  );

  const filteredActivities = useMemo(() => {
    return activities
      .filter((item) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
          item.leadName.toLowerCase().includes(searchText) ||
          item.companyName.toLowerCase().includes(searchText) ||
          item.subject.toLowerCase().includes(searchText) ||
          item.description.toLowerCase().includes(searchText);

        const matchesType = typeFilter === "All" || item.type === typeFilter;

        let matchesDate = true;

        if (dateFilter === "Today") {
          matchesDate = item.date === today;
        } else if (dateFilter === "Last 7 Days") {
          matchesDate = item.date >= getDate(-6) && item.date <= today;
        } else if (dateFilter === "Last 30 Days") {
          matchesDate = item.date >= getDate(-29) && item.date <= today;
        }

        return matchesSearch && matchesType && matchesDate;
      })
      .sort((a, b) =>
        `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`),
      );
  }, [activities, search, typeFilter, dateFilter]);

  const openAddDrawer = () => {
    setSelectedActivity(null);
    setDrawerMode("add");
    setForm(emptyForm);
    setShowDrawer(true);
  };

  const openViewDrawer = (item) => {
    setSelectedActivity(item);
    setDrawerMode("view");
    setForm({ ...item });
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedActivity(null);
  };

  const handleSave = () => {
    if (
      !form.leadName.trim() ||
      !form.subject.trim() ||
      !form.description.trim() ||
      !form.date
    ) {
      alert("Lead, subject, description and date are required.");
      return;
    }

    const newActivity = {
      ...form,
      id: Date.now(),
    };

    setActivities((previous) => [newActivity, ...previous]);
    closeDrawer();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            My Activities
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your interactions and work history with leads.
          </p>
        </div>

        <button
          onClick={openAddDrawer}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Activity
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <SummaryCard
          icon={Activity}
          label="Total Activities"
          value={stats.total}
        />
        <SummaryCard icon={Phone} label="Calls" value={stats.calls} />
        <SummaryCard icon={Mail} label="Emails" value={stats.emails} />
        <SummaryCard icon={Users} label="Meetings" value={stats.meetings} />
        <SummaryCard icon={MessageSquare} label="Notes" value={stats.notes} />
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
              placeholder="Search lead, company or activity..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
          >
            {activityTypes.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? "All Activity Types" : type}
              </option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
          >
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setTypeFilter("All");
              setDateFilter("All");
            }}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <Filter size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-4">
          <h2 className="font-semibold text-slate-800">Activity Timeline</h2>
          <p className="mt-1 text-xs text-slate-500">
            {filteredActivities.length} activities found
          </p>
        </div>

        <div className="p-4 sm:p-6">
          {filteredActivities.length > 0 ? (
            <div className="relative space-y-6">
              <div className="absolute bottom-4 left-[19px] top-4 w-px bg-slate-200" />

              {filteredActivities.map((item) => (
                <div key={item.id} className="relative flex gap-4">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600">
                    <ActivityIcon type={item.type} />
                  </div>

                  <div className="min-w-0 flex-1 rounded-lg border border-slate-100 p-4 hover:border-slate-200">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-slate-800">
                            {item.subject}
                          </h3>
                          <ActivityBadge type={item.type} />
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Building2 size={13} />
                            {item.companyName}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={13} />
                            {item.leadName}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>

                        {item.outcome && (
                          <p className="mt-2 text-xs text-slate-500">
                            Outcome:{" "}
                            <span className="font-medium text-slate-700">
                              {item.outcome}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                        <div className="text-xs text-slate-500 sm:text-right">
                          <p className="flex items-center gap-1">
                            <CalendarDays size={13} />
                            {item.date}
                          </p>
                          <p className="mt-1 flex items-center gap-1">
                            <Clock size={13} />
                            {item.time}
                          </p>
                        </div>

                        <button
                          onClick={() => openViewDrawer(item)}
                          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Activity className="mx-auto mb-3 text-slate-300" size={34} />
              <p className="font-medium text-slate-700">No activities found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your filters or add a new activity.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add / View Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
          <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-800">
                  {drawerMode === "add" ? "Add Activity" : "Activity Details"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Record an interaction with your lead.
                </p>
              </div>

              <button
                onClick={closeDrawer}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <FormField
                label="Lead Name"
                value={form.leadName}
                disabled={drawerMode === "view"}
                onChange={(value) => setForm({ ...form, leadName: value })}
                required
              />

              <FormField
                label="Company Name"
                value={form.companyName}
                disabled={drawerMode === "view"}
                onChange={(value) => setForm({ ...form, companyName: value })}
              />

              <SelectField
                label="Activity Type"
                value={form.type}
                disabled={drawerMode === "view"}
                options={activityTypes.filter((type) => type !== "All")}
                onChange={(value) => setForm({ ...form, type: value })}
              />

              <FormField
                label="Subject"
                value={form.subject}
                disabled={drawerMode === "view"}
                onChange={(value) => setForm({ ...form, subject: value })}
                required
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Activity Date"
                  type="date"
                  value={form.date}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, date: value })}
                  required
                />

                <FormField
                  label="Activity Time"
                  type="time"
                  value={form.time}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, time: value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  disabled={drawerMode === "view"}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe what happened..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>

              <FormField
                label="Outcome"
                value={form.outcome}
                disabled={drawerMode === "view"}
                onChange={(value) => setForm({ ...form, outcome: value })}
              />
            </div>

            {drawerMode === "add" && (
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
                  Save Activity
                </button>
              </div>
            )}
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
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function ActivityIcon({ type }) {
  const icons = {
    Call: Phone,
    Email: Mail,
    Meeting: Users,
    Note: MessageSquare,
    "Follow-up": RefreshCw,
    "Status Update": CheckCircle2,
    Proposal: FileText,
    Other: Activity,
  };

  const Icon = icons[type] || Activity;
  return <Icon size={18} />;
}

function ActivityBadge({ type }) {
  const styles = {
    Call: "bg-blue-50 text-blue-700",
    Email: "bg-purple-50 text-purple-700",
    Meeting: "bg-cyan-50 text-cyan-700",
    Note: "bg-amber-50 text-amber-700",
    "Follow-up": "bg-green-50 text-green-700",
    "Status Update": "bg-slate-100 text-slate-700",
    Proposal: "bg-orange-50 text-orange-700",
    Other: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[type] || ""}`}
    >
      {type}
    </span>
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
