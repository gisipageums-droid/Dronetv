import React, { useState, useEffect, useCallback } from "react";
import { Search, Users, Briefcase, Calendar, Coins, Building2, Phone } from "lucide-react";
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
import { ADMIN_API, AUTH_API, LEADS_API, LAMBDA } from '../../../lib/apiConfig';

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
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);

  // Mock data (keeping other static data as is for now)
  const stats = [
    {
      label: "Total Companies",
      value: companyCount,
      icon: Briefcase,
      color: "bg-status-info",
      topBorder: "border-t-status-info",
    },
    {
      label: "Professionals",
      value: professionalCount,
      icon: Users,
      color: "bg-brand-gold",
      topBorder: "border-t-brand-gold",
    },
    {
      label: "Events",
      value: eventCount,
      icon: Calendar,
      color: "bg-status-success",
      topBorder: "border-t-status-success",
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

  // Design-system tokens only (DESIGN_SYSTEM.md) — no ad-hoc chart colors.
  const COLORS = ["#2563EB", "#E8B400", "#22C55E", "#F59E0B"];

  const { user } = useUserAuth();
  const userDetails = user?.userData;

  const getCategory = useCallback(async () => {
    const fetchData = await fetch(
      ADMIN_API ? `${ADMIN_API}/user-templates/${userDetails.email} ` : `${LAMBDA.adminUserTemplates1}/user-templates/${userDetails.email} `
    );
    const resData = await fetchData.json();
    setCompanyCount(resData.count);
  }, [userDetails.email]);

  const getProfessionalCount = useCallback(() => {
    axios
      .get(
        ADMIN_API ? `${ADMIN_API}/user-templates/${userDetails.email} ` : `${LAMBDA.adminUserTemplates3}/user-templates/${userDetails.email} `
      )
      .then((res) => {
        setProfessionalCount(res.data.count);
      })
      .catch(() => {});
  }, [userDetails.email]);

  const getEventCount = useCallback(() => {
    axios
      .get(
        ADMIN_API ? `${ADMIN_API}/user-templates/${userDetails.email} ` : `${LAMBDA.adminUserTemplates2}/user-templates/${userDetails.email} `
      )
      .then((res) => {
        setEventCount(res.data.count);
      })
      .catch(() => {});
  }, [userDetails.email]);

  useEffect(() => {
    getCategory();
    getProfessionalCount();
    getEventCount();
    if (userDetails?.email) {
      axios.get(AUTH_API ? `${AUTH_API}/profile?userId=${userDetails.email}` : `${LAMBDA.profile}/profile?userId=${userDetails.email}`)
        .then(r => setTokenBalance(r.data?.profile?.tokenBalance ?? 0))
        .catch(() => setTokenBalance(0));
    }
  }, [getCategory, getProfessionalCount, getEventCount, userDetails?.email]);

  // fetch for company recent leads
  const fetchRecentCompaniesLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        AUTH_API ? `${AUTH_API}/leads?userId=${userDetails?.email}&mode=all&filter=unviewed&limit=7&offset=0` : `${LAMBDA.profile}/leads?userId=${userDetails?.email}&mode=all&filter=unviewed&limit=7&offset=0`
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
    } finally {
      setLoading(false);
    }
  }, [userDetails?.email]);

  // fetch professional recent leads
  const fetchRecentProfessionalLeads = useCallback(async () => {
    try {
      setProfessionalLoading(true);
      const response = await fetch(
        LEADS_API ? `${LEADS_API}/get-leads?userId=${userDetails?.email}&filter=unviewed&limit=7` : `${LAMBDA.profLeadsGet}/get-leads?userId=${userDetails?.email}&filter=unviewed&limit=7`
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
    } finally {
      setProfessionalLoading(false);
    }
  }, [userDetails?.email]);

  // fetch event recent leads
  const fetchRecentEventLeads = useCallback(async () => {
    try {
      setEventLoading(true);
      const response = await fetch(
        AUTH_API ? `${AUTH_API}/event-leads?userId=${userDetails.email}&mode=all&limit=7&offset=0` : `${LAMBDA.profile}/event-leads?userId=${userDetails.email}&mode=all&limit=7&offset=0`
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
      ? "bg-status-success/15 text-status-success"
      : "bg-ink-light text-ink-paragraph";
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
    <div className="min-h-full bg-surface-main p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-ink mb-1">
          Welcome back, {userDetails?.fullName?.split(" ")[0] || "there"}
        </h1>
        <p className="text-xs text-ink-caption">Here's your business overview.</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ink-caption w-4 h-4" />
          <input
            type="text"
            placeholder="Search by company name, location, or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-6 py-2.5 bg-surface-card border border-ink-light rounded-lg text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-yellow focus:border-brand-yellow transition-all"
          />
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`bg-surface-card border border-ink-light border-t-[3px] ${stat.topBorder} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-ink-caption text-[10px] font-bold uppercase tracking-wide">{stat.label}</p>
                <Icon size={14} className="text-ink-caption" />
              </div>
              <p className="text-2xl font-extrabold text-ink leading-none">{stat.value}</p>
            </div>
          );
        })}
        {/* Token balance card */}
        <a href="/user-recharge" className="bg-ink rounded-lg p-4 block relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-yellow" />
          <div className="flex items-center justify-between mb-1">
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-wide">Token Balance</p>
            <Coins size={14} className="text-brand-yellow" />
          </div>
          <p className="text-2xl font-extrabold text-brand-yellow leading-none">
            {tokenBalance === null ? "…" : tokenBalance.toLocaleString()}
          </p>
        </a>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Pie Chart */}
        <div className="bg-surface-card border border-ink-light rounded-lg p-5">
          <h2 className="text-xs font-bold text-ink uppercase tracking-wide mb-4">
            Visitors by Source
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={visitorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#F8C400"
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
        <div className="bg-surface-card border border-ink-light rounded-lg p-5">
          <h2 className="text-xs font-bold text-ink uppercase tracking-wide mb-4">
            Leads & Visits by Month
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={leadsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#8B8B8B" />
              <YAxis stroke="#8B8B8B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  color: "#111111",
                }}
              />
              <Legend />
              <Bar
                dataKey="leads"
                fill="#2563EB"
                name="Leads"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="visits"
                fill="#22C55E"
                name="Visits"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart - Trends */}
      <div className="bg-surface-card border border-ink-light rounded-lg p-5 mb-6">
        <h2 className="text-xs font-bold text-ink uppercase tracking-wide mb-4">
          Lead & Visit Trends
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={leadsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#8B8B8B" />
            <YAxis stroke="#8B8B8B" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111111",
                border: "none",
                borderRadius: "8px",
                color: "#FFFFFF",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="leads"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ fill: "#2563EB" }}
              name="Leads"
            />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#22C55E"
              strokeWidth={2}
              dot={{ fill: "#22C55E" }}
              name="Visits"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Leads — card style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <LeadListSection
          title="Recent Companies Leads"
          icon={Building2}
          leads={recentLeads}
          loading={loading}
          error={error}
          emptyText="No leads found"
          subtitleField="category"
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          formatDate={formatDate}
        />
        <LeadListSection
          title="Recent Professional Leads"
          icon={Users}
          leads={recentProfessional}
          loading={professionalLoading}
          error={professionalError}
          emptyText="No professional leads found"
          subtitleField="phone"
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          formatDate={formatDate}
        />
        <LeadListSection
          title="Recent Event Leads"
          icon={Calendar}
          leads={recentEvent}
          loading={eventLoading}
          error={eventError}
          emptyText="No event leads found"
          subtitleField="phone"
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
};

// Card-list presentation for a "recent leads" section — same lead data/fields
// as before, just styled to match the DroneTv design system's card language
// instead of a plain HTML table.
interface LeadListSectionProps {
  title: string;
  icon: React.ElementType;
  leads: Lead[];
  loading: boolean;
  error: string | null;
  emptyText: string;
  subtitleField: "category" | "phone";
  getStatusColor: (viewed: boolean) => string;
  getStatusText: (viewed: boolean) => string;
  formatDate: (d: string) => string;
}

const LeadListSection: React.FC<LeadListSectionProps> = ({
  title, icon: Icon, leads, loading, error, emptyText, subtitleField, getStatusColor, getStatusText, formatDate,
}) => (
  <div className="bg-surface-card border border-ink-light rounded-lg overflow-hidden">
    <div className="px-4 py-3 border-b border-ink-light flex items-center justify-between">
      <span className="text-xs font-bold text-ink uppercase tracking-wide">{title}</span>
      <span className="text-[11px] text-ink-caption font-semibold">{leads.length}</span>
    </div>
    <div className="p-3 space-y-2 max-h-[420px] overflow-y-auto">
      {loading && <p className="text-ink-caption text-xs text-center py-4">Loading...</p>}
      {error && <p className="text-status-error text-xs text-center py-4">Error: {error}</p>}
      {!loading && !error && leads.length === 0 && (
        <p className="text-ink-caption text-xs text-center py-4">{emptyText}</p>
      )}
      {!loading && !error && leads.map((lead) => (
        <div key={lead.leadId} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-ink-offwhite transition-colors">
          <div className="w-8 h-8 rounded-full bg-surface-main flex items-center justify-center flex-shrink-0">
            <Icon size={14} className="text-ink-paragraph" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink truncate">{lead.firstName} {lead.lastName}</p>
            <p className="text-[11px] text-ink-caption flex items-center gap-1 truncate">
              {subtitleField === "phone" ? <Phone size={10} /> : null}
              {subtitleField === "category" ? lead.category : lead.phone}
            </p>
            {lead.subject && <p className="text-xs text-ink-paragraph mt-1 line-clamp-2">{lead.subject}</p>}
            <div className="flex items-center justify-between mt-1.5">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(lead.viewed)}`}>
                {getStatusText(lead.viewed)}
              </span>
              <span className="text-[10px] text-ink-caption">{formatDate(lead.submittedAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;