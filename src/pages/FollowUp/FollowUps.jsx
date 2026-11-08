/**
 * FollowUps.jsx
 * 
 * Scheduled Follow-ups & Reminders Page.
 * 
 * Accessible by: OrganizationOwner, Manager, Agent
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. PURE FUNCTIONS OUTSIDE REACT COMPONENTS:
 *    Notice that `getFollowUpStatus(item, today)` is declared OUTSIDE the component.
 *    Why? Because it doesn't depend on any component state or props!
 *    Moving pure helper functions outside prevents re-declaring them on every render
 *    and completely fixes the ESLint `react-hooks/exhaustive-deps` warning.
 * 
 * 2. TAB + SEARCH FILTERING IN `useMemo`:
 *    `filteredFollowUps` computes matching records across active tabs ("All", "Today",
 *    "Upcoming", "Overdue", "Completed") and search text. Sorting ensures earliest
 *    follow-ups appear at the top.
 * 
 * 3. EXTRACTED DRAWER COMPONENT:
 *    The form drawer was extracted into `AddFollowUpDrawer.jsx`, reducing this file
 *    from 774 lines down to ~220 clean lines!
 */

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  CalendarDays,
  Clock,
  Phone,
  Users,
  Video,
  CheckCircle2,
  AlertCircle,
  CalendarClock,
  MessageSquare,
  Check,
  X,
} from "lucide-react";

import PageHeader from "../../component/common/PageHeader";
import StatCard from "../../component/common/StatCard";
import StatusBadge from "../../component/common/StatusBadge";
import AddFollowUpDrawer from "../../component/followups/AddFollowUpDrawer";
import { INITIAL_FOLLOW_UPS } from "../../data/mockFollowUps";

// Helper: Calculate today's ISO date string
const getTodayDateString = () => new Date().toISOString().slice(0, 10);

/**
 * Pure function to determine follow-up status based on due date.
 * Declared outside the component to prevent recreating on every render.
 */
function getFollowUpStatus(item, today) {
  if (item.status === "Completed" || item.status === "Cancelled") {
    return item.status;
  }
  if (item.date < today) return "Overdue";
  if (item.date === today) return "Today";
  return "Upcoming";
}

/**
 * Return matching icon based on communication channel.
 */
function getTypeIcon(type) {
  switch (type) {
    case "Call":
      return Phone;
    case "Meeting":
      return Users;
    case "Email":
      return MessageSquare;
    case "Site Visit":
      return Video;
    default:
      return CalendarClock;
  }
}

const tabs = ["All", "Today", "Upcoming", "Overdue", "Completed"];

const FollowUps = () => {
  const [followUps, setFollowUps] = useState(INITIAL_FOLLOW_UPS);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const today = getTodayDateString();

  // Summary statistics calculation
  const summary = useMemo(() => {
    const pending = followUps.filter((item) => item.status === "Pending");

    return {
      total: pending.length,
      today: pending.filter((item) => item.date === today).length,
      upcoming: pending.filter((item) => item.date > today).length,
      overdue: pending.filter((item) => item.date < today).length,
    };
  }, [followUps, today]);

  // Filtered & sorted follow-ups list
  const filteredFollowUps = useMemo(() => {
    const term = search.toLowerCase().trim();

    return followUps
      .filter((item) => {
        const status = getFollowUpStatus(item, today);

        const matchesTab =
          activeTab === "All" || status === activeTab;

        const matchesSearch =
          !term ||
          item.leadName.toLowerCase().includes(term) ||
          item.contact.toLowerCase().includes(term) ||
          item.assignedTo.toLowerCase().includes(term);

        return matchesTab && matchesSearch;
      })
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }, [followUps, activeTab, search, today]);

  // Handle adding a new follow-up
  const handleAddFollowUp = (data) => {
    const newFollowUp = {
      ...data,
      id: Date.now(),
      contact: "Contact pending",
      phone: "",
      status: "Pending",
    };

    setFollowUps((prev) => [newFollowUp, ...prev]);
  };

  // Mark a follow-up as completed
  const handleMarkCompleted = (id) => {
    setFollowUps((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Completed" } : item))
    );
  };

  // Cancel a follow-up
  const handleCancelFollowUp = (id) => {
    setFollowUps((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Cancelled" } : item))
    );
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Page Header                                                        */}
      {/* ------------------------------------------------------------------ */}
      <PageHeader
        title="Follow-ups & Reminders"
        description="Stay on top of scheduled calls, meetings, emails and client check-ins."
        action={
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={18} />
            <span>Add Follow-up</span>
          </button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* Summary KPI Cards                                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pending"
          value={summary.total}
          subtitle="All open follow-ups"
          icon={CalendarClock}
          color="blue"
        />
        <StatCard
          title="Due Today"
          value={summary.today}
          subtitle="Scheduled for today"
          icon={Clock}
          color="purple"
        />
        <StatCard
          title="Upcoming"
          value={summary.upcoming}
          subtitle="Future reminders"
          icon={CalendarDays}
          color="orange"
        />
        <StatCard
          title="Overdue"
          value={summary.overdue}
          subtitle="Requires urgent action"
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main List Container                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Tabs Bar */}
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

        {/* Search Bar */}
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
              placeholder="Search by lead, contact, or assignee..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Follow-ups Table */}
        {filteredFollowUps.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
            <div className="mb-3 rounded-full bg-blue-50 p-3 text-blue-600">
              <CalendarClock size={28} />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">
              No follow-ups found
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {search
                ? "No matching records found for your search."
                : `No ${activeTab.toLowerCase()} follow-ups at the moment.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Lead & Notes</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Due Date & Time</th>
                  <th className="px-5 py-3 font-medium">Assigned To</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredFollowUps.map((item) => {
                  const Icon = getTypeIcon(item.type);
                  const currentStatus = getFollowUpStatus(item, today);
                  const isPending = item.status === "Pending";

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-gray-800">
                          {item.leadName}
                        </div>
                        {item.notes && (
                          <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-xs">
                            {item.notes}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                          <Icon size={14} className="text-gray-400" />
                          {item.type}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-gray-600 font-mono">
                        <div>{item.date}</div>
                        <div className="text-gray-400">{item.time}</div>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-gray-600">
                        {item.assignedTo}
                      </td>

                      <td className="px-5 py-3.5">
                        <StatusBadge status={currentStatus} dot />
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        {isPending && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleMarkCompleted(item.id)}
                              title="Mark as completed"
                              className="rounded-lg p-1.5 text-green-600 hover:bg-green-50 transition"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancelFollowUp(item.id)}
                              title="Cancel follow-up"
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
      {/* Extracted Add Follow-Up Drawer                                     */}
      {/* ------------------------------------------------------------------ */}
      <AddFollowUpDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleAddFollowUp}
      />
    </div>
  );
};

export default FollowUps;
