import React, { useState } from "react";
import { Search, Users, Briefcase, Calendar } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const stats = [
    {
      label: "Total Companies",
      value: 245,
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      label: "Professionals",
      value: 1832,
      icon: Users,
      color: "bg-purple-500",
    },
    { label: "Events", value: 52, icon: Calendar, color: "bg-green-500" },
  ];

  const visitorData = [
    { name: "Direct", value: 400 },
    { name: "Organic", value: 300 },
    { name: "Referral", value: 200 },
    { name: "Social", value: 150 },
  ];

  const leadsData = [
    { name: "Jan", leads: 45, visits: 240 },
    { name: "Feb", leads: 52, visits: 280 },
    { name: "Mar", leads: 38, visits: 200 },
    { name: "Apr", leads: 61, visits: 320 },
    { name: "May", leads: 55, visits: 290 },
    { name: "Jun", leads: 67, visits: 350 },
  ];

  const recentLeads = [
    {
      id: 1,
      name: "John Doe",
      company: "Tech Corp",
      status: "Active",
      date: "2025-10-21",
    },
    {
      id: 2,
      name: "Sarah Smith",
      company: "Digital Solutions",
      status: "Pending",
      date: "2025-10-20",
    },
    {
      id: 3,
      name: "Mike Johnson",
      company: "Innovation Labs",
      status: "Active",
      date: "2025-10-19",
    },
    {
      id: 4,
      name: "Emily Brown",
      company: "Future Tech",
      status: "Completed",
      date: "2025-10-18",
    },
    {
      id: 5,
      name: "Alex Wilson",
      company: "Cloud Systems",
      status: "Active",
      date: "2025-10-17",
    },
  ];

  const COLORS = ["#3b82f6", "#a855f7", "#10b981", "#f59e0b"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-amber-50  p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          User Dashboard
        </h1>
        <p className="text-slate-400">
          Welcome back! Here's your business overview.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by company name, location, or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-white border-2 border-yellow-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-amber-50 border-4 border-yellow-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-800 text-sm mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`bg-yellow-400 border border-orange-200 p-4 rounded-lg animate-bounce`}
                >
                  <Icon size={28} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-slate-700 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">
            Visitors by Source
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={visitorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {visitorData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Leads */}
        <div className="bg-slate-700 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">
            Leads & Visits by Month
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar
                dataKey="leads"
                fill="#3b82f6"
                name="Leads"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="visits"
                fill="#10b981"
                name="Visits"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart - Trends */}
      <div className="bg-slate-700 rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Lead & Visit Trends
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={leadsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="leads"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6" }}
              name="Leads"
            />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981" }}
              name="Visits"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Leads List */}
      <div className="bg-slate-700 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Recent Leads</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                  Company
                </th>
                <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-slate-600 hover:bg-slate-600 transition-colors"
                >
                  <td className="py-3 px-4 text-white">{lead.name}</td>
                  <td className="py-3 px-4 text-slate-300">{lead.company}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
