/**
 * StatCard.jsx
 * 
 * Reusable Metric & KPI Card Component.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. PURPOSE:
 *    Used across dashboards and page summaries (Leads, Deals, Follow-ups, Meetings,
 *    Organizations) to show high-level counts and totals.
 * 
 * 2. FLEXIBLE ICON HANDLING (REACT BEST PRACTICE):
 *    Different developers might pass icons in two ways:
 *    - As a component: `<StatCard icon={Users} />`
 *    - As a JSX element: `<StatCard icon={<Users size={20} />} />`
 *    By using `isValidElement(Icon)`, our component effortlessly supports BOTH styles,
 *    eliminating errors and unifying all 6 previously duplicated summary cards.
 */

import { isValidElement } from "react";

const COLOR_MAP = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  orange: "bg-orange-50 text-orange-600",
  purple: "bg-purple-50 text-purple-600",
  red: "bg-red-50 text-red-600",
  cyan: "bg-cyan-50 text-cyan-600",
  amber: "bg-amber-50 text-amber-600",
};

export default function StatCard({
  title,
  value,
  subtitle,
  description,
  icon: Icon,
  color = "blue",
}) {
  const iconClasses = COLOR_MAP[color] || COLOR_MAP.blue;
  const helperText = subtitle || description;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition hover:shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-2 tracking-tight">
            {value}
          </h2>
          {helperText && (
            <p className="text-xs text-gray-500 mt-1.5">{helperText}</p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${iconClasses}`}>
            {isValidElement(Icon) ? Icon : <Icon size={22} />}
          </div>
        )}
      </div>
    </div>
  );
}
