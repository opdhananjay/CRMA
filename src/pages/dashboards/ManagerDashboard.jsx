import { Users, UserPlus, CalendarClock, Trophy, Plus } from "lucide-react";
import PageHeader from "../../component/common/PageHeader";
import StatCard from "../../component/common/StatCard";
import AddLeadDrawer from "../../component/leads/AddLeadDrawer";
import { useState } from "react";

const ManagerDashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const stats = [
    {
      title: "Total Leads",
      value: "248",
      subtitle: "All organization leads",
      icon: Users,
      color: "blue",
    },
    {
      title: "New Leads",
      value: "36",
      subtitle: "Recently added",
      icon: UserPlus,
      color: "purple",
    },
    {
      title: "Pending Follow-ups",
      value: "18",
      subtitle: "Requires attention",
      icon: CalendarClock,
      color: "orange",
    },
    {
      title: "Won Leads",
      value: "32",
      subtitle: "Successfully converted",
      icon: Trophy,
      color: "green",
    },
  ];

  const handleAddLead = () => {
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manager Dashboard"
        description="Overview of your organization's sales activities."
        action={
          <button
            onClick={handleAddLead}
            className="flex items-center gap-2 bg-blue-600
                                       text-white px-4 py-2.5 rounded-lg
                                       hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Lead
          </button>
        }
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-800">Lead Pipeline</h2>

          <p className="text-sm text-gray-500 mt-1">
            Overview of leads by status
          </p>

          <div className="mt-6 space-y-4">
            {[
              ["New", 36, "bg-blue-500"],
              ["Contacted", 65, "bg-purple-500"],
              ["Interested", 48, "bg-orange-500"],
              ["Proposal Sent", 24, "bg-indigo-500"],
              ["Won", 32, "bg-green-500"],
            ].map(([label, count, color]) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold">{count}</span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className={`${color} h-2 rounded-full`}
                    style={{ width: `${(count / 65) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-800">Team Performance</h2>

          <p className="text-sm text-gray-500 mt-1">
            Lead handling by team members
          </p>

          <div className="mt-6 space-y-5">
            {[
              { name: "Rahul Sharma", leads: 42, won: 8 },
              { name: "Priya Patel", leads: 35, won: 6 },
              { name: "Amit Shah", leads: 28, won: 5 },
            ].map((member) => (
              <div
                key={member.name}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {member.leads} assigned leads
                  </p>
                </div>

                <span className="text-sm font-semibold text-green-600">
                  {member.won} Won
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-800">Recent Activities</h2>

        <div className="mt-4 divide-y divide-gray-100">
          {[
            "Rahul contacted ABC Manufacturing",
            "Priya scheduled a meeting with Global Properties",
            "Amit updated Bright Education lead status",
          ].map((activity, index) => (
            <div key={index} className="py-3 text-sm text-gray-600">
              {activity}
            </div>
          ))}
        </div>
      </div>

      {/* Add Lead Drawer */}
      <AddLeadDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleAddLead}
      />
    </div>
  );
};

export default ManagerDashboard;
