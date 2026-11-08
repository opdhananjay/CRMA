/**
 * MyActivities.jsx
 * 
 * Activity Timeline & Audit Feed.
 * 
 * Accessible by: OrganizationOwner, Manager, Agent
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. WHY THIS PAGE WAS REBUILT:
 *    Previously, this file was an 11-line blank placeholder returning `<div>My Activities</div>`.
 *    In a production CRM, sales agents and managers need an audit log of client
 *    interactions (calls logged, status changes, emails sent, meetings scheduled).
 * 
 * 2. TIMELINE UI PATTERN (TAILWIND CSS):
 *    Notice how the timeline line is drawn:
 *    - An absolute vertical line: `<div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />`
 *    - Circular event nodes positioned with `relative z-10`.
 *    This creates a beautiful, responsive activity feed without complex CSS.
 * 
 * 3. BACKEND API INTEGRATION POINT:
 *    The ASP.NET Core Web API (`GET /api/activities`) will return chronological
 *    records created by CRM domain events (e.g. LeadStatusChanged, CallLogged).
 */

import { useState, useMemo } from "react";
import {
  Activity,
  Phone,
  Video,
  Mail,
  CheckCircle2,
  Calendar,
  Clock,
  Filter,
} from "lucide-react";

import PageHeader from "../../component/common/PageHeader";
import StatCard from "../../component/common/StatCard";
import { INITIAL_ACTIVITIES } from "../../data/mockActivities";

const ACTIVITY_FILTERS = ["All", "Call", "Meeting", "StatusChange", "Email"];

function getActivityIcon(type) {
  switch (type) {
    case "Call":
      return { icon: Phone, color: "bg-blue-50 text-blue-600 border-blue-200" };
    case "Meeting":
      return { icon: Video, color: "bg-purple-50 text-purple-600 border-purple-200" };
    case "StatusChange":
      return { icon: CheckCircle2, color: "bg-green-50 text-green-600 border-green-200" };
    case "Email":
      return { icon: Mail, color: "bg-orange-50 text-orange-600 border-orange-200" };
    default:
      return { icon: Activity, color: "bg-slate-50 text-slate-600 border-slate-200" };
  }
}

export default function MyActivities() {
  const [activities] = useState(INITIAL_ACTIVITIES);
  const [filterType, setFilterType] = useState("All");

  // Aggregate activity statistics
  const stats = useMemo(() => {
    return {
      total: activities.length,
      calls: activities.filter((a) => a.type === "Call").length,
      meetings: activities.filter((a) => a.type === "Meeting").length,
      updates: activities.filter((a) => a.type === "StatusChange").length,
    };
  }, [activities]);

  // Filter activities based on active filter button
  const filteredActivities = useMemo(() => {
    if (filterType === "All") return activities;
    return activities.filter((a) => a.type === filterType);
  }, [activities, filterType]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Page Header                                                        */}
      {/* ------------------------------------------------------------------ */}
      <PageHeader
        title="Activity Log"
        description="Chronological record of client outreach, status transitions, and team actions."
      />

      {/* ------------------------------------------------------------------ */}
      {/* Summary Stat Cards                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={stats.total}
          subtitle="Recent logged interactions"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Calls Logged"
          value={stats.calls}
          subtitle="Phone calls conducted"
          icon={Phone}
          color="cyan"
        />
        <StatCard
          title="Meetings Conducted"
          value={stats.meetings}
          subtitle="Client demos & syncs"
          icon={Video}
          color="purple"
        />
        <StatCard
          title="Status Progressions"
          value={stats.updates}
          subtitle="Pipeline stage transitions"
          icon={CheckCircle2}
          color="green"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Activity Timeline Feed                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-gray-100 mb-6">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">
            Filter:
          </span>
          {ACTIVITY_FILTERS.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filterType === type
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type === "StatusChange" ? "Status Updates" : type}
            </button>
          ))}
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {filteredActivities.map((act) => {
            const { icon: Icon, color } = getActivityIcon(act.type);

            return (
              <div key={act.id} className="relative group">
                {/* Timeline Icon Node */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0 flex h-7 w-7 items-center justify-center rounded-full border bg-white shadow-sm transition group-hover:scale-110 ${color}`}
                >
                  <Icon size={14} />
                </div>

                {/* Content Box */}
                <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 transition group-hover:border-blue-200 group-hover:bg-white group-hover:shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {act.title}
                    </h4>
                    <span className="text-xs text-gray-400 font-mono">
                      {act.timestamp}
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="font-medium text-blue-600">
                      {act.relatedTo}
                    </span>
                    <span className="text-gray-400">
                      By: <strong className="text-gray-600">{act.performedBy}</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
