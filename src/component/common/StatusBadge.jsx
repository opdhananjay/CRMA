/**
 * StatusBadge.jsx
 * 
 * Reusable Status Badge Component for Anjaya CRM.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. PURPOSE:
 *    CRM entities (Leads, Deals, Follow-ups, Meetings, Users, Organizations) all
 *    have statuses ("New", "Won", "Pending", "Overdue", "Active", "Suspended", etc.).
 *    Previously, each page invented its own inline styling like:
 *    `<span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs">...</span>`
 *    This caused color inconsistencies across the CRM.
 * 
 * 2. CENTRALIZED COLOR PALETTE:
 *    This component centralizes status colors in one place.
 *    If the design team asks to change the color of "Overdue" or "Won",
 *    we change it in this one file and the entire application updates instantly!
 * 
 * 3. USAGE:
 *    `<StatusBadge status="Won" />`
 *    `<StatusBadge status="Overdue" dot />`
 */

// Unified dictionary of status colors
const STATUS_STYLES = {
  // Positive / Successful / Active
  Won: "bg-green-50 text-green-700 border-green-200/60",
  Active: "bg-green-50 text-green-700 border-green-200/60",
  Completed: "bg-green-50 text-green-700 border-green-200/60",
  Qualified: "bg-emerald-50 text-emerald-700 border-emerald-200/60",

  // In Progress / Action Needed Today
  New: "bg-blue-50 text-blue-700 border-blue-200/60",
  Today: "bg-blue-50 text-blue-700 border-blue-200/60",
  Scheduled: "bg-blue-50 text-blue-700 border-blue-200/60",
  Contacted: "bg-cyan-50 text-cyan-700 border-cyan-200/60",
  Trial: "bg-sky-50 text-sky-700 border-sky-200/60",

  // Upcoming / Informational / Mid-Pipeline
  Upcoming: "bg-purple-50 text-purple-700 border-purple-200/60",
  Interested: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  "Proposal Sent": "bg-violet-50 text-violet-700 border-violet-200/60",
  Proposal: "bg-violet-50 text-violet-700 border-violet-200/60",
  Negotiation: "bg-amber-50 text-amber-700 border-amber-200/60",

  // Warnings / Pending / Overdue
  Pending: "bg-amber-50 text-amber-700 border-amber-200/60",
  Overdue: "bg-red-50 text-red-700 border-red-200/60",
  Suspended: "bg-red-50 text-red-700 border-red-200/60",
  Lost: "bg-rose-50 text-rose-700 border-rose-200/60",
  Cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  Inactive: "bg-slate-100 text-slate-600 border-slate-200",
  Expired: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

// Dot indicator colors matching the badge state
const DOT_COLORS = {
  Won: "bg-green-500",
  Active: "bg-green-500",
  Completed: "bg-green-500",
  New: "bg-blue-500",
  Today: "bg-blue-500",
  Pending: "bg-amber-500",
  Overdue: "bg-red-500",
  Suspended: "bg-red-500",
  Lost: "bg-rose-500",
};

export default function StatusBadge({ status, dot = false, className = "" }) {
  if (!status) return null;

  // Fallback to neutral gray styling if status is unrecognized
  const badgeStyle = STATUS_STYLES[status] || "bg-gray-100 text-gray-700 border-gray-200";
  const dotColor = DOT_COLORS[status] || "bg-gray-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />}
      {status}
    </span>
  );
}
