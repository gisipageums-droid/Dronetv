import React, { useState, useEffect, useCallback } from "react";
import { Search, Users, Briefcase, Calendar } from "lucide-react";
import { useUserAuth } from "../../context/context";
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
import axios from "axios";

interface Lead {
  leadId: string;
  companyName: string;
  publishedId: string;
  company: string;
  category: string;
  subject: string;
  submittedAt: string;
  viewed: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
}

interface ApiResponse {
  success: boolean;
  mode: string;
  leads: Lead[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  offset: number;
  limit: number;
}

const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentProfessional, setRecentProfessional] = useState<Lead[]>([]);
  const [recentEvent, setRecentEvent] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [professionalLoading, setProfessionalLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [professionalError, setProfessionalError] = useState<string | null>(
    null
  );
  const [eventError, setEventError] = useState<string | null>(null);
  const [companyCount, setCompanyCount] = useState(0);
  const [professionalCount, setProfessionalCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  // Mock data (keeping other static data as is for now)
  const stats = [
    {
      label: "Total Companies",
      value: companyCount,
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      label: "Professionals",
      value: professionalCount,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      label: "Events",
      value: eventCount,
      icon: Calendar,
      color: "bg-green-500",
    },
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

  const COLORS = ["#3b82f6", "#a855f7", "#10b981", "#f59e0b"];

  const { user } = useUserAuth();
  const userDetails = user?.userData;

  const getCategory = useCallback(async () => {
    const fetchData = await fetch(
      `https://kgm0ckp0uf.execute-api.ap-south-1.amazonaws.com/dev/user-templates/${userDetails.email} `
    );
    const resData = await fetchData.json();
    setCompanyCount(resData.count);
  }, [userDetails.email]);

  const getProfessionalCount = useCallback(() => {
    axios
      .get(
        `https://5otjcn6oi1.execute-api.ap-south-1.amazonaws.com/dev/user-templates/${userDetails.email} `
      )
      .then((res) => {
        setProfessionalCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userDetails.email]);

  const getEventCount = useCallback(() => {
    axios
      .get(
        `https://zd3q4ewnxe.execute-api.ap-south-1.amazonaws.com/dev/user-templates/${userDetails.email} `
      )
      .then((res) => {
        setEventCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userDetails.email]);

  useEffect(() => {
    getCategory();
    getProfessionalCount();
    getEventCount();
  }, [getCategory, getProfessionalCount, getEventCount]);

  // fetch for company recent leads
  const fetchRecentCompaniesLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/leads?userId=${userDetails?.email}&mode=all&filter=unviewed&limit=7&offset=0`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setRecentLeads(data.leads);
      } else {
        throw new Error("Failed to fetch leads");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  }, [userDetails?.email]);

  // fetch professional recent leads
  const fetchRecentProfessionalLeads = useCallback(async () => {
    try {
      setProfessionalLoading(true);
      const response = await fetch(
        `https://r5mcwn6b10.execute-api.ap-south-1.amazonaws.com/prod/get-leads?userId=${userDetails?.email}&filter=unviewed&limit=7`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setRecentProfessional(data.leads);
      } else {
        throw new Error("Failed to fetch leads");
      }
    } catch (err) {
      setProfessionalError(
        err instanceof Error ? err.message : "An error occurred"
      );
      console.error("Error fetching leads:", err);
    } finally {
      setProfessionalLoading(false);
    }
  }, [userDetails?.email]);

  // fetch event recent leads
  const fetchRecentEventLeads = useCallback(async () => {
    try {
      setEventLoading(true);
      const response = await fetch(
        `https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/event-leads?userId=${userDetails.email}&mode=all&limit=7&offset=0`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setRecentEvent(data.leads);
      } else {
        throw new Error("Failed to fetch leads");
      }
    } catch (err) {
      setEventError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching leads:", err);
    } finally {
      setEventLoading(false);
    }
  }, [userDetails?.email]);

  useEffect(() => {
    fetchRecentCompaniesLeads();
    fetchRecentProfessionalLeads();
    fetchRecentEventLeads();
  }, [
    fetchRecentCompaniesLeads,
    fetchRecentProfessionalLeads,
    fetchRecentEventLeads,
  ]);

  const getStatusColor = (viewed: boolean) => {
    return viewed
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusText = (viewed: boolean) => {
    return viewed ? "Viewed" : "Unviewed";
  };

  return (
    <div className="min-h-screen bg-amber-50 p-8">
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

      {/* Recent Companies Leads List */}
      <div className="bg-slate-700 rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Recent Companies Leads ({recentLeads.length})
        </h2>

        {loading && (
          <div className="text-center py-4">
            <p className="text-slate-300">Loading leads...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                    Subject
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
                    key={lead.leadId}
                    className="border-b border-slate-600 hover:bg-slate-600 transition-colors"
                  >
                    <td className="py-3 px-4 text-white">
                      {lead.firstName} {lead.lastName}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {lead.category}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{lead.subject}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          lead.viewed
                        )}`}
                      >
                        {getStatusText(lead.viewed)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {formatDate(lead.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && recentLeads.length === 0 && (
          <div className="text-center py-4">
            <p className="text-slate-300">No leads found</p>
          </div>
        )}
      </div>

      {/* Recent Professional Leads List */}
      <div className="bg-slate-700 rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Recent Professional Leads ({recentProfessional.length})
        </h2>

        {professionalLoading && (
          <div className="text-center py-4">
            <p className="text-slate-300">Loading professional leads...</p>
          </div>
        )}

        {professionalError && (
          <div className="text-center py-4">
            <p className="text-red-400">Error: {professionalError}</p>
          </div>
        )}

        {!professionalLoading && !professionalError && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                    Phone
                  </th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                    Subject
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
                {recentProfessional.map((lead) => (
                  <tr
                    key={lead.leadId}
                    className="border-b border-slate-600 hover:bg-slate-600 transition-colors"
                  >
                    <td className="py-3 px-4 text-white">{lead.firstName} </td>
                    <td className="py-3 px-4 text-white">{lead.phone}</td>
                    <td className="py-3 px-4 text-slate-300">{lead.subject}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          lead.viewed
                        )}`}
                      >
                        {getStatusText(lead.viewed)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {formatDate(lead.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!professionalLoading &&
          !professionalError &&
          recentProfessional.length === 0 && (
            <div className="text-center py-4">
              <p className="text-slate-300">No professional leads found</p>
            </div>
          )}
      </div>

      {/* Recent Events Leads List */}
      <div className="bg-slate-700 rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Recent Event Leads ({recentEvent.length})
        </h2>

        {eventLoading && (
          <div className="text-center py-4">
            <p className="text-slate-300">Loading event leads...</p>
          </div>
        )}

        {eventError && (
          <div className="text-center py-4">
            <p className="text-red-400">Error: {eventError}</p>
          </div>
        )}

        {!eventLoading && !eventError && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                    Phone
                  </th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                    Subject
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
                {recentEvent.map((lead) => (
                  <tr
                    key={lead.leadId}
                    className="border-b border-slate-600 hover:bg-slate-600 transition-colors"
                  >
                    <td className="py-3 px-4 text-white">{lead.firstName} </td>
                    <td className="py-3 px-4 text-white">{lead.phone}</td>
                    <td className="py-3 px-4 text-slate-300">{lead.subject}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          lead.viewed
                        )}`}
                      >
                        {getStatusText(lead.viewed)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {formatDate(lead.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!eventLoading && !eventError && recentEvent.length === 0 && (
          <div className="text-center py-4">
            <p className="text-slate-300">No event leads found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;