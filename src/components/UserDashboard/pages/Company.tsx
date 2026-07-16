import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, MapPin, Building2, Edit, Eye, Plus, Upload, CheckCircle, X, AlertCircle, Loader2, RefreshCw, ExternalLink, Shield, Settings, Briefcase, Users, Mail, Phone } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useTemplate, useUserAuth } from "../../context/context";
import { fetchAdminContent, MediaItem } from "../../../lib/mediaApi";
import { toast } from "sonner";
import axios from "axios";
import ListingLimitBanner from "../components/common/ListingLimitBanner";
import { COMPANY_API, AUTH_API, LAMBDA } from "../../../lib/apiConfig";

const SUREPASS_PROXY = import.meta.env.VITE_SUREPASS_PROXY_URL;
const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

function getCompanyLimit(earned: number) {
  if (earned >= 8000) return Infinity;
  if (earned >= 2000) return 5;
  if (earned >= 500) return 2;
  return 1;
}

type DigiStatus = 'idle' | 'loading' | 'ready' | 'polling' | 'verified' | 'error';

interface Company {
  publishedId: string;
  userId: string;
  draftId: string;
  companyName: string;
  location: string;
  sectors: string[];
  publishedDate?: string;
  createdAt?: string;
  previewImage?: string;
  reviewStatus?: string;
}

interface CompanyCardProps {
  company: Company;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onPublish: (company: Company) => void;
  isDetailsUpdated?: boolean;
}

interface PublishedDetailsResponse {
  publishedId: string;
  templateSelection: string;
  websiteContent: {
    hero: any;
    about: any;
    services: any;
    products: any;
    clients: any;
    testimonials: any[];
    blog: any;
    contact: any;
    faq: any;
    templateMetadata: any;
  };
  mediaAssets: {
    companyLogoUrl?: string;
    heroBackgroundUrl?: string;
    officeImageUrl?: string;
    contactBackgroundUrl?: string;
    dgcaCertificateUrl?: string;
  };
  companyInfo: {
    name: string;
    location: string;
    sectors: string[];
    yearEstablished: string;
  };
  contentSource: string;
  metadata: {
    lastModified: string;
    version: number;
    hasEdits: boolean;
    templateOptimized: boolean;
    ownerId: string;
  };
  publishedAt?: string;
  createdAt?: string;
}

// =================== Company card ==============================
const Card: React.FC<CompanyCardProps> = ({ company, onEdit, onPreview, onPublish, isDetailsUpdated }) => {
  const placeholderImg =
    company.previewImage || company?.companyName?.charAt(0) || "C";
  const navigate = useNavigate();

  const formatDate = (dateString: string): string => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Date not available";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "active":
        return { bg: "bg-yellow-200", text: "text-yellow-900", label: "Under Review" };
      case "approved":
        return { bg: "bg-green-100", text: "text-green-800", label: "Published" };
      case "rejected":
        return { bg: "bg-red-100", text: "text-red-800", label: "Rejected" };
      default:
        return { bg: "bg-yellow-100", text: "text-yellow-900", label: "Published" };
    }
  };

  const statusStyle = getStatusBadge(company?.reviewStatus || "default");
  const isPublished = company?.reviewStatus?.toLowerCase() === "approved";

  return (
    <div className="overflow-hidden w-full h-full bg-white rounded-2xl border border-yellow-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-yellow-400 group">
      <div className="p-6">
        {/* Header */}
        <div className="grid grid-cols-1 items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md bg-yellow-50 p-2 flex items-center justify-center group-hover:shadow-lg group-hover:bg-yellow-100 transition-all duration-300 group-hover:scale-110">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-yellow-600">
                {company.previewImage ? (
                  <img
                    src={placeholderImg}
                    alt={company.companyName}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  placeholderImg
                )}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                {company?.companyName || "Unnamed Company"}
              </h3>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1 text-yellow-500" />
                <span className="text-sm">{company?.location || "Location not specified"}</span>
              </div>
            </div>
          </div>

          <div>
            <div className={`inline-flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-3 py-1 rounded-full text-xs font-semibold`}>
              <Building2 className="w-3 h-3" />
              {statusStyle.label}
            </div>
          </div>
        </div>

        {/* Sectors */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {(company?.sectors && company?.sectors.length > 0 ? company.sectors : ["General"]).map((sector, index) => (
              <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-200">
                {sector}
              </span>
            ))}
          </div>
        </div>

        {/* Date and Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-yellow-50 rounded-lg px-4 py-2 border border-yellow-200">
            <span className="font-semibold text-yellow-700 text-sm">
              {company?.createdAt ? formatDate(company?.createdAt) : "Date not available"}
            </span>
            <span className="text-xs text-yellow-600">Submitted</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (company?.publishedId) onEdit(company.publishedId);
              }}
              className="flex-1 px-3 py-2 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-yellow-500"
            >
              <Edit className="w-4 h-4" />
              Edit |
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          {!isDetailsUpdated && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/user-website?tab=details");
              }}
              className="w-full px-3 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-amber-300"
            >
              <Settings className="w-4 h-4" />
              Update Details
            </button>
          )}

          {/* Publish Button — only shown if not yet approved */}
          {!isPublished && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPublish(company);
              }}
              className="w-full px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Publish Live
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

// =================== My Posted Jobs ==============================
function getMyPostedJobs(userId: string): { contentId: string; title: string; createdAt: string }[] {
  try { return JSON.parse(localStorage.getItem(`dtv_my_jobs_${userId}`) || '[]'); } catch { return []; }
}

const MyPostedJobs: React.FC = () => {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || '';
  const [jobs] = useState(() => userId ? getMyPostedJobs(userId) : []);
  if (!userId || jobs.length === 0) return null;
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-yellow-500" /> My Posted Jobs
      </h2>
      <div className="space-y-3">
        {jobs.map(j => (
          <div key={j.contentId} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{j.title}</p>
                <p className="text-xs text-gray-400">Submitted {new Date(j.createdAt).toLocaleDateString('en-IN')} · Pending DroneTv review</p>
              </div>
            </div>
            <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded flex-shrink-0">Pending</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        Jobs go live on the <Link to="/professionals/job-board" className="text-yellow-600 underline">Job Board</Link> after admin approval.
      </p>
    </div>
  );
};

// =================== Job Applications Received ==============================
const JobApplicationsReceived: React.FC<{ companyNames: string[] }> = ({ companyNames }) => {
  const [applications, setApplications] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (companyNames.length === 0) { setLoading(false); return; }
    const controller = new AbortController();
    fetchAdminContent(controller.signal)
      .then(items => {
        const names = new Set(companyNames.map(n => n.toLowerCase().trim()));
        const apps = items.filter(i =>
          i.title.startsWith('[Application]') &&
          names.has((i.category || '').toLowerCase().trim())
        );
        setApplications(apps);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [companyNames.join(',')]);

  if (loading) return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-500" /> Job Applications Received
      </h2>
      <div className="text-sm text-gray-400 py-4">Loading applications...</div>
    </div>
  );

  if (companyNames.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-500" /> Job Applications Received
        {applications.length > 0 && (
          <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{applications.length}</span>
        )}
      </h2>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center">
          <Users className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No applications yet for your job listings.</p>
          <p className="text-xs text-gray-400 mt-1">
            Applications received via <Link to="/professionals/job-board" className="text-blue-500 underline">Job Board</Link> will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(app => {
            const jobTitle = app.title.replace('[Application] ', '');
            const isOpen = expanded === app.contentId;
            return (
              <div key={app.contentId} className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : app.contentId)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-blue-50/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{app.company || 'Applicant'}</p>
                      <p className="text-xs text-gray-400">Applied for: <span className="font-medium text-gray-600">{jobTitle}</span> · {new Date(app.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <span className="text-xs text-blue-500 font-semibold flex-shrink-0">{isOpen ? 'Hide ▲' : 'View ▼'}</span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-blue-50 pt-3 space-y-2">
                    {app.source && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <a href={`mailto:${app.source}`} className="text-blue-600 hover:underline">{app.source}</a>
                      </div>
                    )}
                    {app.author && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <a href={`tel:${app.author}`} className="text-blue-600 hover:underline">{app.author}</a>
                      </div>
                    )}
                    {app.description && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-2">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Message</p>
                        <p className="text-sm text-gray-700">{app.description}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      {app.source && (
                        <a href={`mailto:${app.source}?subject=Re: ${jobTitle} Application`}
                          className="text-xs font-bold bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors">
                          Reply via Email
                        </a>
                      )}
                      {app.author && (
                        <a href={`tel:${app.author}`}
                          className="text-xs font-bold border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                          Call Applicant
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// =================== Company page ==============================
const CompanyPage: React.FC = () => {
  const { user } = useUserAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { setFinaleDataReview, setFinalTemplate } = useTemplate();
  const navigate = useNavigate();

  const [detailsUpdatedIds, setDetailsUpdatedIds] = useState<Set<string>>(new Set());
  const [totalTokensEarned, setTotalTokensEarned] = useState<number>(0);

  // Aadhaar modal state
  const [publishingCompany, setPublishingCompany] = useState<Company | null>(null);
  const [digiStatus, setDigiStatus] = useState<DigiStatus>('idle');
  const [digiUrl, setDigiUrl] = useState('');
  const [digiClientId, setDigiClientId] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popupRef = useRef<Window | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const PLACEHOLDER_NAMES = new Set(["company name", "innovative labs", "your company", "unnamed company"]);

  const fetchCompanies = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        COMPANY_API ? `${COMPANY_API}/dashboard-cards?userId=${userId}` : `https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards?userId=${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch companies");
      const data = await res.json();
      const cards = (data.cards || []).map((c: any) => ({
        publishedId: c.publishedId || "",
        userId: c.userId || "",
        draftId: c.draftId || "",
        companyName: c.companyName || "Unnamed Company",
        location: c.location || "Location not specified",
        sectors: Array.isArray(c.sectors) ? c.sectors : c.sectors ? [c.sectors] : ["General"],
        publishedDate: c.publishedDate || "",
        createdAt: c.createdAt || "",
        reviewStatus: c.reviewStatus || "active",
        previewImage: c.previewImage || c.headerLogo || "",
      }));
      setCompanies(cards);
      setLoading(false); // Show cards immediately, update name in background

      // Fetch template company names in parallel from the public preview Lambda
      const previewBase = COMPANY_API
        ? `${COMPANY_API}/template`
        : `${LAMBDA.companyPreviewLoad}/template`;

      const updates = await Promise.allSettled(
        cards.map(async (c) => {
          const urlSlug = (data.cards || []).find((raw: any) => raw.publishedId === c.publishedId)?.urlSlug;
          if (!urlSlug) return null;
          const r = await fetch(`${previewBase}?companyName=${encodeURIComponent(urlSlug)}`);
          if (!r.ok) return null;
          const d = await r.json();
          const content = d?.data?.content || d?.content || {};
          const profileName: string = content?.profile?.companyName || "";
          if (profileName && !PLACEHOLDER_NAMES.has(profileName.toLowerCase().trim())) {
            return { publishedId: c.publishedId, companyName: profileName };
          }
          const headerName: string = content?.header?.companyName || content?.company?.name || "";
          if (headerName && !PLACEHOLDER_NAMES.has(headerName.toLowerCase().trim())) {
            return { publishedId: c.publishedId, companyName: headerName };
          }
          return null;
        })
      );

      const nameMap: Record<string, string> = {};
      updates.forEach((r) => {
        if (r.status === "fulfilled" && r.value) {
          nameMap[r.value.publishedId] = r.value.companyName;
        }
      });

      if (Object.keys(nameMap).length > 0) {
        setCompanies((prev) =>
          prev.map((c) =>
            nameMap[c.publishedId] ? { ...c, companyName: nameMap[c.publishedId] } : c
          )
        );
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchPublishedCompanyDetails = async (
    publishedId: string,
    userId: string,
    cb: (data: PublishedDetailsResponse) => void
  ) => {
    const res = await fetch(
      COMPANY_API ? `${COMPANY_API}/dashboard-cards/published-details/${publishedId}` : `https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards/published-details/${publishedId}`,
      { headers: { "Content-Type": "application/json", "X-User-Id": userId } }
    );
    if (!res.ok) {
      const messages: Record<number, string> = {
        401: "User not authenticated.",
        403: "You don't have permission to access this template.",
        404: "Template not found.",
      };
      throw new Error(messages[res.status] || `Failed to fetch data (${res.status})`);
    }
    const data = await res.json();
    cb(data);
    return data;
  };

  const handleEdit = async (publishedId: string): Promise<void> => {
    try {
      const userId = user?.email || user?.userData?.email || '';
      if (!userId) throw new Error("User not authenticated");
      const details = await fetchPublishedCompanyDetails(publishedId, userId, setFinaleDataReview);
      if (details.templateSelection === "template-1") {
        navigate(`/user/companies/edit/1/${publishedId}/${userId}`);
      } else if (details.templateSelection === "template-2") {
        navigate(`/user/companies/edit/2/${publishedId}/${userId}`);
      }
    } catch (error) {
      toast.error("Failed to load template for editing. Please try again.");
    }
  };

  const handlePreview = async (publishedId: string): Promise<void> => {
    try {
      const userId = user?.email || user?.userData?.email || '';
      if (!userId) throw new Error("User not authenticated");
      const details = await fetchPublishedCompanyDetails(publishedId, userId, setFinaleDataReview);
      if (details.templateSelection === "template-1") {
        navigate(`/user/companies/preview/1/${publishedId}/${userId}`);
      } else if (details.templateSelection === "template-2") {
        navigate(`/user/companies/preview/2/${publishedId}/${userId}`);
      }
    } catch (error) {
      toast.error("Failed to load template for preview. Please try again.");
    }
  };

  // ---- Aadhaar / Publish flow ----

  const initDigiBoost = async () => {
    setDigiStatus('loading');
    setDigiUrl('');
    setDigiClientId('');
    try {
      const res = await axios.post(SUREPASS_PROXY, { action: 'digilocker-init' });
      if (!res.data?.success || !res.data?.data?.url) throw new Error('Init failed');
      setDigiUrl(res.data.data.url);
      setDigiClientId(res.data.data.client_id);
      setDigiStatus('ready');
    } catch {
      setDigiStatus('error');
    }
  };

  const startPolling = (clientId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    let attempts = 0;
    const MAX = 60;
    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await axios.post(SUREPASS_PROXY, { action: 'digilocker-poll', client_id: clientId });
        if (res.data?.success) {
          clearInterval(pollRef.current!);
          popupRef.current?.close();
          setDigiStatus('verified');
          toast.success('Aadhaar verified successfully!');
          return;
        }
      } catch { /* keep polling */ }

      if (popupRef.current?.closed) {
        clearInterval(pollRef.current!);
        try {
          const finalRes = await axios.post(SUREPASS_PROXY, { action: 'digilocker-poll', client_id: clientId });
          if (finalRes.data?.success) {
            setDigiStatus('verified');
            toast.success('Aadhaar verified successfully!');
          } else {
            setDigiStatus('ready');
          }
        } catch { setDigiStatus('ready'); }
        return;
      }

      if (attempts >= MAX) {
        clearInterval(pollRef.current!);
        setDigiStatus('error');
        toast.error('Verification timed out. Please try again.');
      }
    }, 2000);
  };

  const handleOpenDigiLocker = () => {
    if (!digiUrl || !digiClientId) return;
    const popup = window.open(digiUrl, 'digilocker-verify', 'width=620,height=720,left=300,top=80');
    popupRef.current = popup;
    setDigiStatus('polling');
    startPolling(digiClientId);
  };

  const handleOpenPublishModal = (company: Company) => {
    if (pollRef.current) clearInterval(pollRef.current);
    setDigiStatus('idle');
    setPublishingCompany(company);
    initDigiBoost();
  };

  const handleClosePublishModal = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    popupRef.current?.close();
    setPublishingCompany(null);
    setDigiStatus('idle');
  };

  const handleConfirmPublish = async () => {
    if (!publishingCompany || digiStatus !== 'verified') return;
    setIsPublishing(true);
    try {
      const userId = user?.email || user?.userData?.email || '';
      await axios.post(
        COMPANY_API ? `${COMPANY_API}/admin/templates/review` : 'https://twd6yfrd25.execute-api.ap-south-1.amazonaws.com/prod/admin/templates/review',
        { publishedId: publishingCompany.publishedId, action: 'approve' },
        { headers: { 'Content-Type': 'application/json' } }
      );
      // Best-effort: sync company status in profile Lambda so leads work
      fetch(COMPANY_API ? `${COMPANY_API}/leads/company-activate` : `${LAMBDA.profile}/leads/company-activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publishedId: publishingCompany.publishedId, userId, template: publishingCompany.templateSelection || "template-1", status: "active" }),
      }).catch(() => {});
      toast.success('Your listing is now live!');
      handleClosePublishModal();
      await fetchCompanies(userId);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    const userId = user?.email || user?.userData?.email || "";
    if (!userId) return;
    fetchCompanies(userId);
    axios.get(`${PROFILE_API}?userId=${userId}`)
      .then(r => {
        const p = r.data?.profile ?? {};
        setTotalTokensEarned(p.totalTokensEarned ?? p.tokenBalance ?? 0);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (companies.length === 0) return;
    const userId = user?.email || user?.userData?.email || "";
    companies.forEach((c) => {
      // Fast path: localStorage
      if (localStorage.getItem(`details_updated_${c.publishedId}`) === "true") {
        setDetailsUpdatedIds((prev) => new Set(prev).add(c.publishedId));
        return;
      }
      // Server-side check
      fetch(
        COMPANY_API ? `${COMPANY_API}/dashboard-cards/published-details/${c.publishedId}` : `https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards/published-details/${c.publishedId}`,
        { headers: { "Content-Type": "application/json", "X-User-Id": userId } }
      )
        .then((r) => r.json())
        .then((data) => {
          if (data?.content?._detailsUpdatedAt) {
            localStorage.setItem(`details_updated_${c.publishedId}`, "true");
            setDetailsUpdatedIds((prev) => new Set(prev).add(c.publishedId));
          }
        })
        .catch(() => {});
    });
  }, [companies, user]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (company) =>
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.sectors.some((sector) =>
          sector.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm, companies]);

  const SkeletonCard: React.FC = () => (
    <div className="overflow-hidden w-full h-full bg-white rounded-2xl border border-yellow-200 shadow-lg transition-all duration-300 group animate-pulse p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-yellow-100 p-2 flex items-center justify-center" />
          <div className="flex-1">
            <div className="h-5 bg-yellow-100 rounded w-3/4 mb-2" />
            <div className="h-3 bg-yellow-100 rounded w-1/2" />
          </div>
        </div>
        <div className="w-24 h-7 bg-yellow-100 rounded-full" />
      </div>
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-yellow-100 rounded-full w-20" />
          <div className="h-6 bg-yellow-100 rounded-full w-16" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-10 bg-yellow-100 rounded-lg" />
        <div className="h-10 bg-yellow-100 rounded-lg" />
        <div className="h-10 bg-yellow-100 rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="flex items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Company Directory
          </h1>
          <p className="text-gray-600 mb-3">Browse and manage company submissions</p>
          <ListingLimitBanner count={companies.length} type="company" label="Companies" />
        </div>
        {(() => {
          const limit = getCompanyLimit(totalTokensEarned);
          const atLimit = isFinite(limit) && companies.length >= limit;
          return atLimit ? (
            <button
              onClick={() => navigate("/user-recharge")}
              className="bg-gray-100 text-sm font-medium text-gray-500 flex items-center gap-2 px-4 py-4 rounded-lg align-top border border-gray-300 cursor-not-allowed"
              title={`Plan limit reached (${companies.length}/${limit}). Upgrade to add more.`}
            >
              <Plus className="w-5 h-5" />
              Limit Reached — Upgrade
            </button>
          ) : (
            <button
              onClick={() => navigate("/form")}
              className="bg-yellow-500 text-sm font-medium text-white flex items-center gap-2 px-4 py-4 rounded-lg align-top hover:bg-yellow-600 hover:scale-110 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add New Company
            </button>
          );
        })()}
      </div>

      <div className="mb-8 relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
          <Search className="h-5 w-5 text-yellow-500" />
        </div>
        <input
          type="text"
          placeholder="Search by company name, location, or sector..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-3 bg-white border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card
              key={company.publishedId}
              company={company}
              onPreview={handlePreview}
              onEdit={handleEdit}
              onPublish={handleOpenPublishModal}
              isDetailsUpdated={detailsUpdatedIds.has(company.publishedId)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <Search className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
          No companies found matching "{searchTerm}"
        </div>
      )}

      <div className="flex justify-end mb-2">
        <Link
          to="/professionals/job-board?postjob=true"
          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <Plus size={16} />
          Post a Job
        </Link>
      </div>
      <MyPostedJobs />
      <JobApplicationsReceived companyNames={companies.map(c => c.companyName)} />

      {/* Aadhaar / Publish Modal */}
      {publishingCompany && (
        <div
          className="fixed inset-0 z-[10000000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClosePublishModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="text-indigo-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">Verify & Publish</h3>
              </div>
              <button onClick={handleClosePublishModal} className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg mb-4">
              <AlertCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Verify your Aadhaar via DigiLocker to publish <strong>{publishingCompany.companyName}</strong> live on DroneTv.
              </p>
            </div>

            {/* Verification Section */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-5">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Shield size={16} className="text-indigo-500" />
                Aadhaar Verification
              </h4>

              {digiStatus === 'loading' && (
                <div className="flex items-center gap-2 text-indigo-600 text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Initializing secure verification...
                </div>
              )}

              {digiStatus === 'error' && (
                <div>
                  <p className="text-xs text-red-600 mb-2">Initialization failed. Please retry.</p>
                  <button
                    onClick={initDigiBoost}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <RefreshCw size={12} /> Retry
                  </button>
                </div>
              )}

              {digiStatus === 'ready' && (
                <div>
                  <p className="text-xs text-gray-500 mb-3">Click the button below to open DigiLocker verification in a new window.</p>
                  <button
                    onClick={handleOpenDigiLocker}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <ExternalLink size={15} />
                    Verify via DigiLocker
                  </button>
                </div>
              )}

              {digiStatus === 'polling' && (
                <div className="flex items-center gap-2 text-indigo-600 text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Waiting for DigiLocker verification...
                  <button
                    onClick={() => { if (pollRef.current) clearInterval(pollRef.current); setDigiStatus('ready'); }}
                    className="ml-auto text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {digiStatus === 'verified' && (
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="text-sm font-medium text-green-700">Aadhaar Verified Successfully</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleClosePublishModal}
                className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                disabled={digiStatus !== 'verified' || isPublishing}
                className={`px-4 py-2 font-medium rounded-lg transition-colors shadow-md flex items-center gap-2 ${
                  digiStatus === 'verified' && !isPublishing
                    ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isPublishing ? <><Loader2 size={16} className="animate-spin" /> Publishing...</> : 'Confirm & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPage;
