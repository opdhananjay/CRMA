
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  Video,
  MapPin,
  Phone,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  CalendarCheck,
  X,
  MoreHorizontal,
} from "lucide-react";

const today = new Date().toLocaleDateString("en-CA");

const initialMeetings = [
  {
    id: 1,
    title: "CRM Product Discussion",
    leadName: "ABC Technologies",
    contactPerson: "Rahul Sharma",
    date: today,
    time: "11:00",
    duration: "30",
    type: "Online",
    location: "Google Meet",
    assignedTo: "Dhananjay",
    notes: "Discuss CRM requirements and project scope.",
    status: "Scheduled",
  },
  {
    id: 2,
    title: "Project Requirement Meeting",
    leadName: "Bright Solutions",
    contactPerson: "Amit Patel",
    date: "2026-11-09",
    time: "14:30",
    duration: "60",
    type: "In Person",
    location: "Mumbai Office",
    assignedTo: "Rahul",
    notes: "Discuss project requirements.",
    status: "Scheduled",
  },
  {
    id: 3,
    title: "Initial Business Discussion",
    leadName: "TechNova",
    contactPerson: "Priya Shah",
    date: "2026-11-05",
    time: "10:00",
    duration: "30",
    type: "Online",
    location: "Google Meet",
    assignedTo: "Dhananjay",
    notes: "Initial discussion.",
    status: "Completed",
  },
];

const emptyForm = {
  title: "",
  leadName: "",
  contactPerson: "",
  date: today,
  time: "10:00",
  duration: "30",
  type: "Online",
  location: "",
  assignedTo: "",
  notes: "",
};

function getMeetingStatus(meeting) {
  if (meeting.status === "Completed" || meeting.status === "Cancelled") {
    return meeting.status;
  }

  return meeting.date < today ? "Overdue" :
    meeting.date === today ? "Today" : "Upcoming";
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Meetings() {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const tabs = ["All", "Today", "Upcoming", "Overdue", "Completed", "Cancelled"];

  const stats = useMemo(() => {
    const pending = meetings.filter(
      (m) => !["Completed", "Cancelled"].includes(m.status)
    );

    return {
      total: meetings.length,
      today: pending.filter((m) => m.date === today).length,
      upcoming: pending.filter((m) => m.date > today).length,
      completed: meetings.filter((m) => m.status === "Completed").length,
    };
  }, [meetings]);

  const filteredMeetings = useMemo(() => {
    return meetings
      .filter((meeting) => {
        const status = getMeetingStatus(meeting);

        const matchesTab =
          activeTab === "All" || status === activeTab;

        const searchText = search.toLowerCase();

        const matchesSearch =
          meeting.title.toLowerCase().includes(searchText) ||
          meeting.leadName.toLowerCase().includes(searchText) ||
          meeting.contactPerson.toLowerCase().includes(searchText) ||
          meeting.assignedTo.toLowerCase().includes(searchText);

        return matchesTab && matchesSearch;
      })
      .sort((a, b) => {
        return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
      });
  }, [meetings, activeTab, search]);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMeeting = {
      ...form,
      id: Date.now(),
      status: "Scheduled",
    };

    setMeetings((prev) => [newMeeting, ...prev]);
    setForm(emptyForm);
    setDrawerOpen(false);
  };

  const updateMeetingStatus = (id, status) => {
    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === id ? { ...meeting, status } : meeting
      )
    );
  };

  const statusStyles = {
    Today: "bg-blue-50 text-blue-700",
    Upcoming: "bg-indigo-50 text-indigo-700",
    Overdue: "bg-red-50 text-red-700",
    Completed: "bg-green-50 text-green-700",
    Cancelled: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Meetings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Schedule and manage your business meetings.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedMeeting(null);
            setForm(emptyForm);
            setDrawerOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Schedule Meeting
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Meetings"
          value={stats.total}
          icon={<CalendarDays size={20} />}
          color="blue"
        />
        <StatCard
          title="Today's Meetings"
          value={stats.today}
          icon={<Clock size={20} />}
          color="orange"
        />
        <StatCard
          title="Upcoming Meetings"
          value={stats.upcoming}
          icon={<CalendarCheck size={20} />}
          color="purple"
        />
        <StatCard
          title="Completed Meetings"
          value={stats.completed}
          icon={<CheckCircle size={20} />}
          color="green"
        />
      </div>

      {/* Meetings Table */}
      <div className="bg-white border border-slate-200 rounded-xl">
        <div className="p-4 border-b border-slate-200 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-72">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search meetings..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Meeting</th>
                <th className="px-5 py-3 font-medium">Lead / Contact</th>
                <th className="px-5 py-3 font-medium">Date & Time</th>
                <th className="px-5 py-3 font-medium">Meeting Type</th>
                <th className="px-5 py-3 font-medium">Assigned To</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredMeetings.map((meeting) => {
                const status = getMeetingStatus(meeting);

                return (
                  <tr key={meeting.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {meeting.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {meeting.duration} minutes
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-700">
                        {meeting.leadName}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {meeting.contactPerson}
                      </p>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-slate-700">
                        {formatDate(meeting.date)}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {meeting.time}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        {meeting.type === "Online" ? (
                          <Video size={16} />
                        ) : meeting.type === "Call" ? (
                          <Phone size={16} />
                        ) : (
                          <MapPin size={16} />
                        )}
                        {meeting.type}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {meeting.assignedTo}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusStyles[status]
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedMeeting(meeting)}
                          title="View meeting"
                          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {!["Completed", "Cancelled"].includes(meeting.status) && (
                          <>
                            <button
                              onClick={() =>
                                updateMeetingStatus(meeting.id, "Completed")
                              }
                              title="Mark completed"
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            >
                              <CheckCircle size={18} />
                            </button>

                            <button
                              onClick={() =>
                                updateMeetingStatus(meeting.id, "Cancelled")
                              }
                              title="Cancel meeting"
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredMeetings.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    No meetings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Meeting Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative bg-white w-full sm:max-w-2xl h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white z-10 border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Schedule Meeting
                </h2>
                <p className="text-sm text-slate-500">
                  Enter the meeting details below.
                </p>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <FormSection title="Meeting Information">
                <FormInput
                  label="Meeting Title"
                  name="title"
                  value={form.title}
                  onChange={updateForm}
                  required
                  placeholder="Enter meeting title"
                />

                <FormInput
                  label="Lead / Company Name"
                  name="leadName"
                  value={form.leadName}
                  onChange={updateForm}
                  required
                  placeholder="Enter lead name"
                />

                <FormInput
                  label="Contact Person"
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={updateForm}
                  placeholder="Enter contact person"
                />
              </FormSection>

              <FormSection title="Date & Time">
                <FormInput
                  label="Meeting Date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={updateForm}
                  required
                  min={today}
                />

                <FormInput
                  label="Meeting Time"
                  name="time"
                  type="time"
                  value={form.time}
                  onChange={updateForm}
                  required
                />

                <FormInput
                  label="Duration (Minutes)"
                  name="duration"
                  type="number"
                  value={form.duration}
                  onChange={updateForm}
                  required
                  min="1"
                />
              </FormSection>

              <FormSection title="Meeting Setup">
                <FormSelect
                  label="Meeting Type"
                  name="type"
                  value={form.type}
                  onChange={updateForm}
                  options={["Online", "In Person", "Call"]}
                />

                <FormInput
                  label="Location / Meeting Link"
                  name="location"
                  value={form.location}
                  onChange={updateForm}
                  placeholder="Enter address or meeting link"
                />

                <FormInput
                  label="Assigned To"
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={updateForm}
                  required
                  placeholder="Enter employee name"
                />
              </FormSection>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={updateForm}
                  rows="3"
                  placeholder="Add meeting agenda or notes..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Meeting Details Drawer */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedMeeting(null)}
          />

          <div className="relative bg-white w-full sm:max-w-lg h-full overflow-y-auto shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Meeting Details</h2>
              <button onClick={() => setSelectedMeeting(null)}>
                <X size={20} />
              </button>
            </div>

            <h3 className="text-xl font-semibold text-slate-800">
              {selectedMeeting.title}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {selectedMeeting.leadName} · {selectedMeeting.contactPerson}
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <Detail label="Date" value={formatDate(selectedMeeting.date)} />
              <Detail label="Time" value={selectedMeeting.time} />
              <Detail label="Duration" value={`${selectedMeeting.duration} minutes`} />
              <Detail label="Meeting Type" value={selectedMeeting.type} />
              <Detail label="Location / Link" value={selectedMeeting.location || "-"} />
              <Detail label="Assigned To" value={selectedMeeting.assignedTo} />
              <Detail label="Status" value={getMeetingStatus(selectedMeeting)} />
              <Detail label="Notes" value={selectedMeeting.notes || "-"} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{title}</p>
        <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
      </div>
      <p className="text-2xl font-semibold text-slate-800 mt-3">{value}</p>
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <section>
      <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  min,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
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

function Detail({ label, value }) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-slate-700">{value}</p>
    </div>
  );
}
