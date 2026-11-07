import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  CalendarDays,
  Clock,
  Phone,
  Mail,
  Users,
  MessageSquare,
  CheckCircle2,
  CircleAlert,
  X,
  Eye,
  Pencil,
  Check,
  Filter,
} from "lucide-react";

const today = new Date().toISOString().slice(0, 10);

const getDate = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const initialFollowUps = [
  {
    id: 1,
    leadName: "Rahul Sharma",
    companyName: "ABC Technologies",
    subject: "Discuss CRM requirements",
    type: "Call",
    dueDate: today,
    dueTime: "10:30",
    priority: "High",
    status: "Pending",
    notes: "Discuss required modules and project budget.",
  },
  {
    id: 2,
    leadName: "Priya Patil",
    companyName: "Bright Solutions",
    subject: "Send product information",
    type: "Email",
    dueDate: today,
    dueTime: "14:00",
    priority: "Medium",
    status: "Pending",
    notes: "Share CRM product details.",
  },
  {
    id: 3,
    leadName: "Amit Joshi",
    companyName: "Global Enterprises",
    subject: "Follow up on proposal",
    type: "Call",
    dueDate: getDate(-1),
    dueTime: "11:00",
    priority: "High",
    status: "Pending",
    notes: "Check whether the proposal was reviewed.",
  },
  {
    id: 4,
    leadName: "Sneha Desai",
    companyName: "Smart Retail",
    subject: "Product demonstration",
    type: "Meeting",
    dueDate: getDate(2),
    dueTime: "15:30",
    priority: "Medium",
    status: "Pending",
    notes: "Demonstrate the CRM dashboard.",
  },
  {
    id: 5,
    leadName: "Karan Mehta",
    companyName: "NextGen Systems",
    subject: "Initial discussion",
    type: "Call",
    dueDate: getDate(-2),
    dueTime: "12:00",
    priority: "Low",
    status: "Completed",
    notes: "Initial discussion completed.",
  },
];

const emptyForm = {
  leadName: "",
  companyName: "",
  subject: "",
  type: "Call",
  dueDate: today,
  dueTime: "10:00",
  priority: "Medium",
  notes: "",
};

const tabs = ["All", "Today", "Upcoming", "Overdue", "Completed"];

export default function MyFollowUps() {
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const isCompleted = (item) => item.status === "Completed";
  const isPending = (item) => item.status === "Pending";

  const stats = useMemo(() => {
    const pending = followUps.filter(isPending);

    return {
      total: followUps.length,
      today: pending.filter((item) => item.dueDate === today).length,
      upcoming: pending.filter((item) => item.dueDate > today).length,
      overdue: pending.filter((item) => item.dueDate < today).length,
      completed: followUps.filter(isCompleted).length,
    };
  }, [followUps]);

  const filteredFollowUps = useMemo(() => {
    return followUps.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.leadName.toLowerCase().includes(searchText) ||
        item.companyName.toLowerCase().includes(searchText) ||
        item.subject.toLowerCase().includes(searchText);

      const matchesType = typeFilter === "All" || item.type === typeFilter;

      const matchesPriority =
        priorityFilter === "All" || item.priority === priorityFilter;

      let matchesTab = true;

      if (activeTab === "Today") {
        matchesTab = isPending(item) && item.dueDate === today;
      } else if (activeTab === "Upcoming") {
        matchesTab = isPending(item) && item.dueDate > today;
      } else if (activeTab === "Overdue") {
        matchesTab = isPending(item) && item.dueDate < today;
      } else if (activeTab === "Completed") {
        matchesTab = isCompleted(item);
      }

      return matchesSearch && matchesType && matchesPriority && matchesTab;
    });
  }, [followUps, activeTab, search, typeFilter, priorityFilter]);

  const openAddDrawer = () => {
    setSelectedFollowUp(null);
    setDrawerMode("add");
    setForm(emptyForm);
    setShowDrawer(true);
  };

  const openEditDrawer = (item) => {
    setSelectedFollowUp(item);
    setDrawerMode("edit");
    setForm({ ...item });
    setShowDrawer(true);
  };

  const openViewDrawer = (item) => {
    setSelectedFollowUp(item);
    setDrawerMode("view");
    setForm({ ...item });
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedFollowUp(null);
  };

  const handleSave = () => {
    if (!form.leadName.trim() || !form.subject.trim() || !form.dueDate) {
      alert("Lead, subject and due date are required.");
      return;
    }

    if (drawerMode === "edit") {
      setFollowUps((previous) =>
        previous.map((item) =>
          item.id === selectedFollowUp.id ? { ...item, ...form } : item,
        ),
      );
    } else {
      setFollowUps((previous) => [
        {
          ...form,
          id: Date.now(),
          status: "Pending",
        },
        ...previous,
      ]);
    }

    closeDrawer();
  };

  const markCompleted = (id) => {
    setFollowUps((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status: "Completed" } : item,
      ),
    );
  };

  const cancelFollowUp = (id) => {
    if (!window.confirm("Are you sure you want to cancel this follow-up?")) {
      return;
    }

    setFollowUps((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status: "Cancelled" } : item,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            My Follow-ups
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Stay on top of your calls, emails and client follow-ups.
          </p>
        </div>

        <button
          onClick={openAddDrawer}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Follow-up
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <SummaryCard label="Total" value={stats.total} />
        <SummaryCard label="Today" value={stats.today} />
        <SummaryCard label="Upcoming" value={stats.upcoming} />
        <SummaryCard label="Overdue" value={stats.overdue} />
        <SummaryCard label="Completed" value={stats.completed} />
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto border-b border-slate-200">
        <div className="flex min-w-max gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-1 pb-3 text-sm font-medium ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
              {tab === "Today" && (
                <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                  {stats.today}
                </span>
              )}
              {tab === "Overdue" && stats.overdue > 0 && (
                <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
                  {stats.overdue}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lead, company or subject..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
        >
          <option value="All">All Types</option>
          <option value="Call">Call</option>
          <option value="Email">Email</option>
          <option value="Meeting">Meeting</option>
          <option value="Message">Message</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setTypeFilter("All");
            setPriorityFilter("All");
          }}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Filter size={16} />
          Reset
        </button>
      </div>

      {/* Follow-up List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-4">
          <h2 className="font-semibold text-slate-800">
            {activeTab === "All" ? "All Follow-ups" : `${activeTab} Follow-ups`}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {filteredFollowUps.length} records found
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredFollowUps.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 p-4 hover:bg-slate-50/70 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex min-w-0 gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  {item.type === "Call" && <Phone size={19} />}
                  {item.type === "Email" && <Mail size={19} />}
                  {item.type === "Meeting" && <Users size={19} />}
                  {item.type === "Message" && <MessageSquare size={19} />}
                  {item.type === "Other" && <CalendarDays size={19} />}
                </div>

                <div className="min-w-0">
                  <h3 className="font-medium text-slate-800">{item.subject}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.leadName} · {item.companyName}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={13} />
                      {item.dueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {item.dueTime}
                    </span>
                    <span>{item.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <PriorityBadge priority={item.priority} />
                <FollowUpStatus item={item} today={today} />

                <button
                  onClick={() => openViewDrawer(item)}
                  title="View"
                  className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Eye size={17} />
                </button>

                {item.status === "Pending" && (
                  <>
                    <button
                      onClick={() => openEditDrawer(item)}
                      title="Edit"
                      className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => markCompleted(item.id)}
                      title="Mark completed"
                      className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                    >
                      <CheckCircle2 size={18} />
                    </button>

                    <button
                      onClick={() => cancelFollowUp(item.id)}
                      title="Cancel follow-up"
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    >
                      <X size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filteredFollowUps.length === 0 && (
            <div className="px-5 py-12 text-center">
              <CalendarDays className="mx-auto mb-3 text-slate-300" size={32} />
              <p className="font-medium text-slate-700">No follow-ups found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your filters or add a new follow-up.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
          <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-800">
                  {drawerMode === "add"
                    ? "Add Follow-up"
                    : drawerMode === "edit"
                      ? "Edit Follow-up"
                      : "Follow-up Details"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Record your next interaction with a lead.
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

              <FormField
                label="Subject"
                value={form.subject}
                disabled={drawerMode === "view"}
                onChange={(value) => setForm({ ...form, subject: value })}
                required
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField
                  label="Follow-up Type"
                  value={form.type}
                  disabled={drawerMode === "view"}
                  options={["Call", "Email", "Meeting", "Message", "Other"]}
                  onChange={(value) => setForm({ ...form, type: value })}
                />

                <SelectField
                  label="Priority"
                  value={form.priority}
                  disabled={drawerMode === "view"}
                  options={["Low", "Medium", "High"]}
                  onChange={(value) => setForm({ ...form, priority: value })}
                />

                <FormField
                  label="Due Date"
                  type="date"
                  value={form.dueDate}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, dueDate: value })}
                  required
                />

                <FormField
                  label="Due Time"
                  type="time"
                  value={form.dueTime}
                  disabled={drawerMode === "view"}
                  onChange={(value) => setForm({ ...form, dueTime: value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  rows={4}
                  value={form.notes}
                  disabled={drawerMode === "view"}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Add discussion points or reminders..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
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
                  Save Follow-up
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

function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-red-50 text-red-700",
    Medium: "bg-amber-50 text-amber-700",
    Low: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[priority] || ""}`}
    >
      {priority}
    </span>
  );
}

function FollowUpStatus({ item, today }) {
  let status = item.status;

  if (status === "Pending") {
    if (item.dueDate < today) status = "Overdue";
    else if (item.dueDate === today) status = "Today";
    else status = "Upcoming";
  }

  const styles = {
    Pending: "bg-blue-50 text-blue-700",
    Today: "bg-blue-50 text-blue-700",
    Upcoming: "bg-purple-50 text-purple-700",
    Overdue: "bg-red-50 text-red-700",
    Completed: "bg-green-50 text-green-700",
    Cancelled: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || ""}`}
    >
      {status}
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
