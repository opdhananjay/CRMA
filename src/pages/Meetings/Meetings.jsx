/**
 * Meetings.jsx
 * 
 * Scheduled Meetings & Appointments Page.
 * 
 * Accessible by: OrganizationOwner, Manager, Agent
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. UNIFIED STATS & BADGES:
 *    Previously, `Meetings.jsx` defined its own private `StatCard` function and custom
 *    status styling dictionaries. We now use the shared `<StatCard>` and `<StatusBadge>`.
 * 
 * 2. MODULARITY:
 *    The form drawer has been extracted into `AddMeetingDrawer.jsx`, making this page
 *    focused strictly on displaying, searching, and managing meetings.
 * 
 * 3. BACKEND API INTEGRATION POINT:
 *    When connected to ASP.NET Core:
 *    - `GET /api/meetings` loads meetings for the active organization.
 *    - `POST /api/meetings` schedules a meeting and sends calendar invitations.
 *    - `PATCH /api/meetings/{id}/status` marks a meeting as Completed or Cancelled.
 */

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  Video,
  MapPin,
  Clock,
  CheckCircle,
  CalendarCheck,
  Check,
  X,
} from "lucide-react";

import PageHeader from "../../component/common/PageHeader";
import StatCard from "../../component/common/StatCard";
import StatusBadge from "../../component/common/StatusBadge";
import AddMeetingDrawer from "../../component/meetings/AddMeetingDrawer";
import { INITIAL_MEETINGS } from "../../data/mockMeetings";

const todayString = new Date().toISOString().slice(0, 10);

function getMeetingStatus(meeting) {
  if (meeting.status === "Completed" || meeting.status === "Cancelled") {
    return meeting.status;
  }
  return meeting.date < todayString
    ? "Overdue"
    : meeting.date === todayString
    ? "Today"
    : "Upcoming";
}

const tabs = ["All", "Today", "Upcoming", "Overdue", "Completed", "Cancelled"];

export default function Meetings() {
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculate meeting stats dynamically
  const stats = useMemo(() => {
    const pending = meetings.filter(
      (m) => !["Completed", "Cancelled"].includes(m.status)
    );

    return {
      total: meetings.length,
      today: pending.filter((m) => m.date === todayString).length,
      upcoming: pending.filter((m) => m.date > todayString).length,
      completed: meetings.filter((m) => m.status === "Completed").length,
    };
  }, [meetings]);

  // Filter meetings by search query and active tab
  const filteredMeetings = useMemo(() => {
    const term = search.toLowerCase().trim();

    return meetings
      .filter((meeting) => {
        const computedStatus = getMeetingStatus(meeting);

        const matchesTab =
          activeTab === "All" || computedStatus === activeTab;

        const matchesSearch =
          !term ||
          meeting.title.toLowerCase().includes(term) ||
          meeting.leadName.toLowerCase().includes(term) ||
          meeting.contactPerson.toLowerCase().includes(term) ||
          meeting.assignedTo.toLowerCase().includes(term);

        return matchesTab && matchesSearch;
      })
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }, [meetings, activeTab, search]);

  // Handle scheduling a new meeting
  const handleScheduleMeeting = (data) => {
    const newMeeting = {
      ...data,
      id: Date.now(),
      status: "Scheduled",
    };

    setMeetings((prev) => [newMeeting, ...prev]);
  };

  // Update status (e.g., Completed, Cancelled)
  const updateMeetingStatus = (id, newStatus) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Page Header                                                        */}
      {/* ------------------------------------------------------------------ */}
      <PageHeader
        title="Meetings & Appointments"
        description="Schedule product demos, client discussions, and strategic syncs."
        action={
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={18} />
            <span>Schedule Meeting</span>
          </button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* Metric Cards                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Meetings"
          value={stats.total}
          subtitle="All scheduled & past"
          icon={CalendarDays}
          color="blue"
        />
        <StatCard
          title="Today's Meetings"
          value={stats.today}
          subtitle="Happening today"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Upcoming"
          value={stats.upcoming}
          subtitle="Future schedule"
          icon={CalendarCheck}
          color="purple"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle="Successfully conducted"
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Meetings Table Container                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Tabs */}
        <div className="flex gap-4 overflow-x-auto border-b border-gray-200 px-5 pt-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 py-3.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search meetings by title, lead, or host..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table Content */}
        {filteredMeetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
            <div className="mb-3 rounded-full bg-blue-50 p-3 text-blue-600">
              <CalendarDays size={28} />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">
              No meetings found
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {search
                ? "No meetings match your search."
                : `No ${activeTab.toLowerCase()} meetings scheduled.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Meeting Title & Lead</th>
                  <th className="px-5 py-3 font-medium">Date & Time</th>
                  <th className="px-5 py-3 font-medium">Type & Location</th>
                  <th className="px-5 py-3 font-medium">Host</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredMeetings.map((meeting) => {
                  const currentStatus = getMeetingStatus(meeting);
                  const isScheduled = meeting.status === "Scheduled";

                  return (
                    <tr
                      key={meeting.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-800">
                          {meeting.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {meeting.leadName}
                          {meeting.contactPerson && ` • ${meeting.contactPerson}`}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-600 font-mono">
                        <div>{meeting.date}</div>
                        <div className="text-gray-400">
                          {meeting.time} ({meeting.duration}m)
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1 font-medium text-gray-700">
                          {meeting.type === "Online" ? (
                            <Video size={14} className="text-blue-500" />
                          ) : (
                            <MapPin size={14} className="text-red-500" />
                          )}
                          <span>{meeting.type}</span>
                        </div>
                        {meeting.location && (
                          <div className="text-gray-400 truncate max-w-xs mt-0.5">
                            {meeting.location}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-600">
                        {meeting.assignedTo}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={currentStatus} dot />
                      </td>

                      <td className="px-5 py-4 text-right">
                        {isScheduled && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateMeetingStatus(meeting.id, "Completed")}
                              title="Mark as completed"
                              className="rounded-lg p-1.5 text-green-600 hover:bg-green-50 transition"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => updateMeetingStatus(meeting.id, "Cancelled")}
                              title="Cancel meeting"
                              className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Extracted Add Meeting Drawer                                       */}
      {/* ------------------------------------------------------------------ */}
      <AddMeetingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleScheduleMeeting}
      />
    </div>
  );
}
