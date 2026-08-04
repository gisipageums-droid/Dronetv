import React, { useState, useEffect, useCallback } from "react";
import { Search, Coins, Award } from "lucide-react";
import { useUserAuth } from "../../context/context";
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
  const [packageType, setPackageType] = useState<string>("");

  // Mock data (keeping other static data as is for now)
  const stats = [
    { label: "Total Companies", value: companyCount, note: "Your published companies", topBorder: "border-t-status-info" },
    { label: "Professionals", value: professionalCount, note: "Your published profiles", topBorder: "border-t-brand-gold" },
    { label: "Events", value: eventCount, note: "Your published events", topBorder: "border-t-status-success" },
  ];

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
        .then(r => {
          setTokenBalance(r.data?.profile?.tokenBalance ?? 0);
          setPackageType((r.data?.profile?.packageType || "").toLowerCase());
        })
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

  const PACKAGE_INFO: Record<string, { label: string; price: string }> = {
    reach: { label: "Reach Package", price: "₹25,000/yr" },
    scale: { label: "Scale Package", price: "₹75,000/yr" },
    brand: { label: "Brand Package", price: "₹1,50,000/yr" },
  };
  const pkg = PACKAGE_INFO[packageType];

  return (
    <div className="min-h-full bg-surface-main p-6 md:p-8">
      {/* Header */}
      <div className="mb-[3px]">
        <h1 className="text-[20px] font-extrabold text-ink">
          Welcome back, {userDetails?.fullName?.split(" ")[0] || "there"}
        </h1>
      </div>
      <p className="text-[12.5px] text-ink-caption mb-[22px]">Here's your business overview.</p>

      {/* Search Bar */}
      <div className="mb-[22px]">
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-[22px]">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-surface-card border border-ink-light border-t-[3px] ${stat.topBorder} rounded-md p-4`}>
            <p className="text-ink-caption text-[10px] font-bold uppercase tracking-[.5px] mb-1.5">{stat.label}</p>
            <p className="text-[28px] font-extrabold text-ink leading-none">{stat.value}</p>
            <p className="text-[11px] text-ink-caption mt-1">{stat.note}</p>
          </div>
        ))}
        {/* Token balance card */}
        <a href="/user-recharge" className="bg-ink rounded-md p-4 block relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-yellow" />
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-[.5px] mb-1.5">Token Balance</p>
          <p className="text-[28px] font-extrabold text-brand-yellow leading-none">
            {tokenBalance === null ? "…" : tokenBalance.toLocaleString()}
          </p>
          <p className="text-[11px] text-white/40 mt-1 flex items-center gap-1"><Coins size={11} /> Buy more →</p>
        </a>
      </div>

      {/* Package banner — real data, same as My Package page */}
      {pkg && (
        <div className="bg-ink rounded-lg p-5 mb-[22px] flex items-center gap-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-yellow" />
          <Award size={36} className="text-brand-yellow flex-shrink-0" />
          <div className="flex-1">
            <p className="text-white font-extrabold text-lg mb-0.5">{pkg.label} — Active</p>
            <p className="text-white/55 text-[12.5px] leading-relaxed">Your active DroneTv.in partnership package.</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-brand-yellow font-extrabold text-xl">{pkg.price}</p>
          </div>
        </div>
      )}

      {/* Recent Leads — card style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <LeadListSection
          title="Recent Companies Leads"
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
  title, leads, loading, error, emptyText, subtitleField, getStatusColor, getStatusText, formatDate,
}) => (
  <div className="bg-surface-card border border-ink-light rounded-md overflow-hidden">
    <div className="px-4 py-2.5 border-b border-ink-light flex items-center justify-between">
      <span className="text-[12.5px] font-bold text-ink">{title}</span>
      <span className="text-[11px] text-ink-caption font-semibold">{leads.length}</span>
    </div>
    <div className="p-3 space-y-3 max-h-[420px] overflow-y-auto">
      {loading && <p className="text-ink-caption text-xs text-center py-4">Loading...</p>}
      {error && <p className="text-status-error text-xs text-center py-4">Error: {error}</p>}
      {!loading && !error && leads.length === 0 && (
        <p className="text-ink-caption text-xs text-center py-4">{emptyText}</p>
      )}
      {!loading && !error && leads.map((lead) => (
        <div key={lead.leadId} className="pb-3 border-b border-ink-light last:border-0 last:pb-0">
          <p className="text-[13px] font-bold text-ink truncate">{lead.firstName} {lead.lastName}</p>
          <p className="text-[11.5px] text-ink-caption truncate mt-0.5">
            {subtitleField === "category" ? lead.category : lead.phone}
          </p>
          {lead.subject && <p className="text-[11.5px] text-ink-paragraph mt-1 line-clamp-2">{lead.subject}</p>}
          <div className="flex items-center justify-between mt-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(lead.viewed)}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {getStatusText(lead.viewed)}
            </span>
            <span className="text-[10px] text-ink-caption">{formatDate(lead.submittedAt)}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;