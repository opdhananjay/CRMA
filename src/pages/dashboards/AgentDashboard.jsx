import { Users, CalendarClock, AlertCircle, Trophy } from "lucide-react";
import PageHeader from "../../component/common/PageHeader";
import StatCard from "../../component/common/StatCard";

const AgentDashboard = () => {
  const stats = [
    { title: "My Leads", value: "42", icon: Users, color: "blue" },
    {
      title: "Today's Follow-ups",
      value: "12",
      icon: CalendarClock,
      color: "purple",
    },
    {
      title: "Overdue Follow-ups",
      value: "3",
      icon: AlertCircle,
      color: "orange",
    },
    { title: "Won Leads", value: "5", icon: Trophy, color: "green" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Dashboard"
        description="Track your assigned leads and daily activities."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-800">Today's Follow-ups</h2>

        <div className="mt-4 divide-y divide-gray-100">
          {[
            { name: "ABC Manufacturing", time: "10:30 AM", type: "Call" },
            { name: "Global Properties", time: "12:00 PM", type: "Meeting" },
            { name: "Bright Education", time: "03:00 PM", type: "Follow-up" },
          ].map((item) => (
            <div
              key={item.name}
              className="py-4 flex justify-between items-center gap-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500 mt-1">{item.type}</p>
              </div>

              <span className="text-sm text-gray-600">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
