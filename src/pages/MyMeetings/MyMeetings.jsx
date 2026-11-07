import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  CalendarDays,
  Clock,
  MapPin,
  Video,
  Users,
  Phone,
  X,
  Eye,
  Pencil,
  CheckCircle2,
  Filter,
  Building2,
} from "lucide-react";

const today = new Date().toISOString().slice(0, 10);

const getDate = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const initialMeetings = [
  {
    id: 1,
    title: "CRM Requirements Discussion",
    leadName: "Rahul Sharma",
    companyName: "ABC Technologies",
    meetingType: "Online",
    date: today,
    startTime: "10:30",
    endTime: "11:30",
    location: "Google Meet",
    status: "Scheduled",
    notes: "Discuss CRM requirements and project scope.",
    outcome: "",
  },
  {
    id: 2,
    title: "Product Demonstration",
    leadName: "Priya Patil",
    companyName: "Bright Solutions",
    meetingType: "In Person",
    date: today,
    startTime: "14:00",
    endTime: "15:00",
    location: "Thane Office",
    status: "Scheduled",
    notes: "Demonstrate CRM dashboard and features.",
    outcome: "",
  },
  {
    id: 3,
    title: "Proposal Discussion",
    leadName: "Amit Joshi",
    companyName: "Global Enterprises",
    meetingType: "Online",
    date: getDate(2),
    startTime: "11:00",
    endTime: "12:00",
    location: "Microsoft Teams",
    status: "Scheduled",
    notes: "Discuss commercial proposal.",
    outcome: "",
  },
  {
    id: 4,
    title: "Initial Client Meeting",
    leadName: "Sneha Desai",
    companyName: "Smart Retail",
    meetingType: "In Person",
    date: getDate(-1),
    startTime: "12:00",
    endTime: "13:00",
    location: "Mumbai Office",
    status: "Scheduled",
    notes: "Understand business requirements.",
    outcome: "",
  },
  {
    id: 5,
    title: "Project Discussion",
    leadName: "Karan Mehta",
    companyName: "NextGen Systems",
    meetingType: "Phone",
    date: getDate(-2),
    startTime: "15:00",
    endTime: "15:30",
    location: "",
    status: "Completed",
    notes: "Discussed implementation timeline.",
    outcome: "Client is interested. Send detailed proposal.",
  },
];

const tabs = ["All", "Today", "Upcoming", "Overdue", "Completed", "Cancelled"];

const emptyForm = {
  title: "",
  leadName: "",
  companyName: "",
  meetingType: "Online",
  date: today,
  startTime: "10:00",
  endTime: "11:00",
  location: "",
  notes: "",
  outcome: "",
};

export default function MyMeetings() {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const isCompleted = (item) => item.status === "Completed";
  const isCancelled = (item) => item.status === "Cancelled";
  const isScheduled = (item) => item.status === "Scheduled";

  const isOverdue = (item) =>
    isScheduled(item) &&
    `${item.date}T${item.endTime || "23:59"}` <
      new Date().toISOString().slice(0, 16);

  const stats = useMemo(() => {
    const scheduled = meetings.filter(isScheduled);

    return {
      total: meetings.length,
      today: scheduled.filter((item) => item.date === today).length,
      upcoming: scheduled.filter((item) => item.date > today).length,
      overdue: scheduled.filter(isOverdue).length,
      completed: meetings.filter(isCompleted).length,
    };
  }, [meetings]);

  const filteredMeetings = useMemo(() => {
    return meetings.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(searchText) ||
        item.leadName.toLowerCase().includes(searchText) ||
        item.companyName.toLowerCase().includes(searchText);

      const matchesType =
        typeFilter === "All" || item.meetingType === typeFilter;

      let matchesTab = true;

      if (activeTab === "Today") {
        matchesTab = isScheduled(item) && item.date === today;
      } else if (activeTab === "Upcoming") {
        matchesTab = isScheduled(item) && item.date > today;
      } else if (activeTab === "Overdue") {
        matchesTab = isOverdue(item);
      } else if (activeTab === "Completed") {
        matchesTab = isCompleted(item);
      } else if (activeTab === "Cancelled") {
        matchesTab = isCancelled(item);
      }

      return matchesSearch && matchesType && matchesTab;
    });
  }, [meetings, search, typeFilter, activeTab]);

  const openAddDrawer = () => {
    setSelectedMeeting(null);
    setDrawerMode("add");
    setForm(emptyForm);
    setShowDrawer(true);
  };

  const openEditDrawer = (item) => {
    setSelectedMeeting(item);
    setDrawerMode("edit");
    setForm({ ...item });
    setShowDrawer(true);
  };

  const openViewDrawer = (item) => {
    setSelectedMeeting(item);
    setDrawerMode("view");
    setForm({ ...item });
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedMeeting(null);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.leadName.trim() || !form.date) {
      alert("Meeting title, lead name and date are required.");
      return;
    }

    if (form.endTime <= form.startTime) {
      alert("Meeting end time must be after start time.");
      return;
    }

    if (drawerMode === "edit") {
      setMeetings((previous) =>
        previous.map((item) =>
          item.id === selectedMeeting.id ? { ...item, ...form } : item,
        ),
      );
    } else {
      setMeetings((previous) => [
        {
          ...form,
          id: Date.now(),
          status: "Scheduled",
        },
        ...previous,
      ]);
    }

    closeDrawer();
  };

  const markCompleted = (id) => {
    setMeetings((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status: "Completed" } : item,
      ),
    );

    const meeting = meetings.find((item) => item.id === id);
    if (meeting) {
      setSelectedMeeting(meeting);
      setForm({ ...meeting });
      setDrawerMode("complete");
      setShowDrawer(true);
    }
  };

  const saveOutcome = () => {
    setMeetings((previous) =>
      previous.map((item) =>
        item.id === selectedMeeting.id
          ? {
              ...item,
              status: "Completed",
              outcome: form.outcome,
              notes: form.notes,
            }
          : item,
      ),
    );

    closeDrawer();
  };

  const cancelMeeting = (id) => {
    if (!window.confirm("Are you sure you want to cancel this meeting?")) {
      return;
    }

    setMeetings((previous) =>
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
          <h1 className="text-2xl font-semibold text-slate-800">My Meetings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Schedule and manage your client meetings.
          </p>
        </div>

        <button
          onClick={openAddDrawer}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Schedule Meeting
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <SummaryCard label="Total Meetings" value={stats.total} />
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
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meeting, lead or company..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
        >
          <option value="All">All Meeting Types</option>
          <option value="Online">Online</option>
          <option value="In Person">In Person</option>
          <option value="Phone">Phone</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setTypeFilter("All");
          }}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Filter size={16} />
          Reset
        </button>
      </div>

      {/* Meeting List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-4">
          <h2 className="font-semibold text-slate-800">
            {activeTab === "All" ? "All Meetings" : `${activeTab} Meetings`}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {filteredMeetings.length} meetings found
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredMeetings.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 p-4 hover:bg-slate-50/70 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex min-w-0 gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  {item.meetingType === "Online" && <Video size={20} />}
                  {item.meetingType === "In Person" && <Users size={20} />}
                  {item.meetingType === "Phone" && <Phone size={20} />}
                </div>

                <div className="min-w-0">
                  <h3 className="font-medium text-slate-800">{item.title}</h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {item.leadName} · {item.companyName}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={13} />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {item.startTime} - {item.endTime}
                    </span>
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <MeetingStatus item={item} />

                <button
                  onClick={() => openViewDrawer(item)}
                  title="View meeting"
                  className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Eye size={17} />
                </button>

                {item.status === "Scheduled" && (
                  <>
                    <button
                      onClick={() => openEditDrawer(item)}
                      title="Edit meeting"
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
                      onClick={() => cancelMeeting(item.id)}
                      title="Cancel meeting"
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    >
                      <X size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filteredMeetings.length === 0 && (
            <div className="px-5 py-12 text-center">
              <CalendarDays className="mx-auto mb-3 text-slate-300" size={32} />
              <p className="font-medium text-slate-700">No meetings found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your filters or schedule a new meeting.
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
                    ? "Schedule Meeting"
                    : drawerMode === "edit"
                      ? "Edit Meeting"
                      : drawerMode === "complete"
                        ? "Complete Meeting"
                        : "Meeting Details"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Manage your client meeting information.
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
                label="Meeting Title"
                value={form.title}
                disabled={drawerMode === "view" || drawerMode === "complete"}
                onChange={(value) => setForm({ ...form, title: value })}
                required
              />

              <FormField
                label="Lead Name"
                value={form.leadName}
                disabled={drawerMode === "view" || drawerMode === "complete"}
                onChange={(value) => setForm({ ...form, leadName: value })}
                required
              />

              <FormField
                label="Company Name"
                value={form.companyName}
                disabled={drawerMode === "view" || drawerMode === "complete"}
                onChange={(value) => setForm({ ...form, companyName: value })}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField
                  label="Meeting Type"
                  value={form.meetingType}
                  disabled={drawerMode === "view" || drawerMode === "complete"}
                  options={["Online", "In Person", "Phone"]}
                  onChange={(value) => setForm({ ...form, meetingType: value })}
                />

                <FormField
                  label="Meeting Date"
                  type="date"
                  value={form.date}
                  disabled={drawerMode === "view" || drawerMode === "complete"}
                  onChange={(value) => setForm({ ...form, date: value })}
                  required
                />

                <FormField
                  label="Start Time"
                  type="time"
                  value={form.startTime}
                  disabled={drawerMode === "view" || drawerMode === "complete"}
                  onChange={(value) => setForm({ ...form, startTime: value })}
                />

                <FormField
                  label="End Time"
                  type="time"
                  value={form.endTime}
                  disabled={drawerMode === "view" || drawerMode === "complete"}
                  onChange={(value) => setForm({ ...form, endTime: value })}
                />
              </div>

              <FormField
                label="Location / Meeting Link"
                value={form.location}
                disabled={drawerMode === "view" || drawerMode === "complete"}
                onChange={(value) => setForm({ ...form, location: value })}
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Meeting Notes
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  disabled={drawerMode === "view" || drawerMode === "complete"}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Add meeting agenda or discussion points..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>

              {(drawerMode === "complete" || drawerMode === "view") && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Meeting Outcome
                  </label>
                  <textarea
                    rows={3}
                    value={form.outcome}
                    disabled={drawerMode === "view"}
                    onChange={(e) =>
                      setForm({ ...form, outcome: e.target.value })
                    }
                    placeholder="What was discussed? What are the next steps?"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                  />
                </div>
              )}
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
                  onClick={drawerMode === "complete" ? saveOutcome : handleSave}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {drawerMode === "complete" ? "Save Outcome" : "Save Meeting"}
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

function MeetingStatus({ item }) {
  let status = item.status;

  if (status === "Scheduled") {
    const now = new Date();
    const end = new Date(`${item.date}T${item.endTime || "23:59"}`);

    if (end < now) status = "Overdue";
    else if (item.date === today) status = "Today";
    else if (item.date > today) status = "Upcoming";
  }

  const styles = {
    Scheduled: "bg-blue-50 text-blue-700",
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
