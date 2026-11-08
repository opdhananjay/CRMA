/**
 * Reports.jsx
 * 
 * Reports & Sales Analytics Page.
 * 
 * Accessible by: OrganizationOwner, Manager
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. WHY THIS PAGE WAS CREATED:
 *    The Sidebar contained a link to "/reports" for Owner and Manager roles, but 
 *    no route or page existed for it. Clicking it previously bounced the user to "/login".
 *    This page provides a clean overview of upcoming analytics and reports.
 * 
 * 2. BACKEND API INTEGRATION POINT:
 *    The ASP.NET Core backend will expose reporting endpoints such as:
 *    - `GET /api/reports/sales-summary`
 *    - `GET /api/reports/lead-sources`
 *    - `GET /api/reports/team-performance`
 */

import { BarChart3, TrendingUp, Users, Calendar, Download } from "lucide-react";
import PageHeader from "../../component/common/PageHeader";

const reportCards = [
  {
    title: "Lead Conversion Report",
    description: "Analyze how leads transition from New to Won across all pipeline stages.",
    icon: TrendingUp,
    badge: "Sales",
    status: "In Development",
  },
  {
    title: "Team Performance Report",
    description: "View activity volume, calls logged, and conversion rates by sales agent.",
    icon: Users,
    badge: "Team",
    status: "In Development",
  },
  {
    title: "Lead Source Effectiveness",
    description: "Compare lead quality and deal values across Website, LinkedIn, Referrals, etc.",
    icon: BarChart3,
    badge: "Marketing",
    status: "In Development",
  },
  {
    title: "Activity & Follow-up Log",
    description: "Summary of completed and overdue follow-ups and meetings across the team.",
    icon: Calendar,
    badge: "Operations",
    status: "In Development",
  },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Reports & Analytics"
        description="Gain insights into your team's sales performance and pipeline velocity."
        action={
          <button
            onClick={() => alert("Export feature will be available once backend reporting APIs are integrated.")}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <Download size={17} />
            Export Summary
          </button>
        }
      />

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportCards.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={24} />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {report.status}
                </span>
              </div>

              <div className="mt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  {report.badge}
                </span>
                <h3 className="mt-1 text-lg font-bold text-gray-800">
                  {report.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {report.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">ASP.NET Core Web API Ready</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  onClick={() => alert(`View details for "${report.title}" will connect to reporting endpoint.`)}
                >
                  View Details &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

