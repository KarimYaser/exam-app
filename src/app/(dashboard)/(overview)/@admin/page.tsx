import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Award,
  BarChart3,
} from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,284", icon: Users, change: "+12%" },
  { label: "Active Courses", value: "48", icon: BookOpen, change: "+3%" },
  { label: "Exams Taken", value: "9,321", icon: ClipboardList, change: "+18%" },
  { label: "Pass Rate", value: "76%", icon: TrendingUp, change: "+2%" },
  { label: "Diplomas Issued", value: "832", icon: Award, change: "+7%" },
  { label: "Avg. Score", value: "68.4", icon: BarChart3, change: "+1.2%" },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col h-screen">
      {/* Breadcrumb */}
      <div className="px-6 py-3 border-b border-gray-200 bg-white">
        <p className="text-xs text-orange-600 font-mono">Admin / Overview</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {/* Header */}
        <div className="flex items-center gap-3 bg-orange-600 text-white px-5 py-4 mb-8 rounded-md">
          <BarChart3 size={36} />
          <div>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            <p className="text-xs text-orange-100">Platform overview & analytics</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map(({ label, value, icon: Icon, change }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-xs text-green-600 font-medium mt-0.5">{change} this month</p>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder section */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-base font-semibold text-gray-700 mb-2">Recent Activity</h2>
          <p className="text-sm text-gray-400">Detailed activity logs and management tools will appear here.</p>
        </div>
      </div>
    </div>
  );
}
