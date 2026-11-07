import { Building2, Users, Building, Activity } from "lucide-react";
import PageHeader from "../../component/common/PageHeader";
import StatCard from "../../component/common/StatCard";

const SuperAdminDashboard = () => {
  const stats = [
    {
      title: "Total Organizations",
      value: "128",
      icon: Building2,
      color: "blue",
    },
    {
      title: "Active Organizations",
      value: "112",
      icon: Building,
      color: "green",
    },
    { title: "Total Users", value: "1,450", icon: Users, color: "purple" },
    {
      title: "Platform Status",
      value: "Healthy",
      icon: Activity,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Dashboard"
        description="Monitor organizations and overall CRM platform activity."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-800">
          Recently Registered Organizations
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-3">Organization</th>
                <th className="py-3">Users</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {[
                ["ABC Technologies", 12, "Active"],
                ["Global Properties", 8, "Active"],
                ["Bright Education", 5, "Pending"],
              ].map(([name, users, status]) => (
                <tr key={name} className="border-b last:border-0">
                  <td className="py-4 font-medium text-gray-800">{name}</td>
                  <td className="py-4 text-gray-600">{users}</td>
                  <td className="py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs ${
                        status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
