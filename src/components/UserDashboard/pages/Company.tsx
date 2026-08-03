import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, MapPin, Building2, Edit, Eye, Plus, Upload, CheckCircle, X, AlertCircle, Loader2, RefreshCw, ExternalLink, Shield, Settings, Briefcase, Users, Mail, Phone, Send } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useTemplate, useUserAuth } from "../../context/context";
import { fetchAdminContent, createContent, MediaItem } from "../../../lib/mediaApi";
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
        return { bg: "bg-brand-yellow-soft", text: "text-brand-gold", label: "Under Review" };
      case "approved":
        return { bg: "bg-status-success/15", text: "text-status-success", label: "Published" };
      case "rejected":
        return { bg: "bg-status-error/15", text: "text-status-error", label: "Rejected" };
      default:
        return { bg: "bg-brand-yellow-soft", text: "text-brand-gold", label: "Published" };
    }
  };

  const statusStyle = getStatusBadge(company?.reviewStatus || "default");
  const isPublished = company?.reviewStatus?.toLowerCase() === "approved";

  return (
    <div className="overflow-hidden w-full h-full bg-surface-card rounded-2xl border border-brand-yellow-soft shadow-lg transition-all duration-300 hover:shadow-xl hover:border-brand-yellow group">
      <div className="p-6">
        {/* Header */}
        <div className="grid grid-cols-1 items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md bg-surface-main p-2 flex items-center justify-center group-hover:shadow-lg group-hover:bg-brand-yellow-soft transition-all duration-300 group-hover:scale-110">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-brand-gold">
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
              <h3 className="text-lg font-bold text-ink line-clamp-2">
                {company?.companyName || "Unnamed Company"}
              </h3>
              <div className="flex items-center text-ink-paragraph mt-1">
                <MapPin className="w-4 h-4 mr-1 text-brand-gold" />
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
              <span key={index} className="px-3 py-1 bg-brand-yellow-soft text-brand-gold text-xs font-medium rounded-full border border-brand-yellow-soft">
                {sector}
              </span>
            ))}
          </div>
        </div>

        {/* Date and Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-surface-main rounded-lg px-4 py-2 border border-brand-yellow-soft">
            <span className="font-semibold text-brand-gold text-sm">
              {company?.createdAt ? formatDate(company?.createdAt) : "Date not available"}
            </span>
            <span className="text-xs text-brand-gold">Submitted</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (company?.publishedId) onEdit(company.publishedId);
              }}
              className="flex-1 px-3 py-2 bg-brand-yellow text-brand-gold rounded-lg hover:bg-brand-gold transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-brand-gold"
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
              className="w-full px-3 py-2 bg-brand-yellow-soft text-brand-gold rounded-lg hover:bg-brand-yellow-soft transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-brand-yellow-soft"
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
              className="w-full px-3 py-2 bg-status-info text-white rounded-lg hover:bg-status-info transition-colors text-sm font-semibold flex items-center justify-center gap-2"
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
interface PostJobForm { title: string; company: string; location: string; salary: string; category: string; jobType: string; description: string; imageUrl: string; applicationDeadline: string; }
const EMPTY_POST: PostJobForm = { title: '', company: '', location: '', salary: '', category: '', jobType: 'Full-Time', description: '', imageUrl: '', applicationDeadline: '' };
const JOB_CATEGORIES = ['Agriculture', 'Survey & GIS', 'Inspection', 'Cinematography', 'Instructor', 'Defence', 'Manufacturing', 'R&D', 'Operations'];

const MyPostedJobs: React.FC<{ onPostJob: () => void; refreshKey?: number }> = ({ onPostJob, refreshKey }) => {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || '';
  const [jobs, setJobs] = useState<MediaItem[]>([]);

  // Server-backed so a job posted on one device shows up on every device, not just localStorage
  useEffect(() => {
    if (!userId) { setJobs([]); return; }
    const controller = new AbortController();
    fetchAdminContent(controller.signal, 'job')
      .then(all => setJobs(all.filter(j => j.author === userId && !j.title.startsWith('[Application]'))))
      .catch(() => {});
    return () => controller.abort();
  }, [userId, refreshKey]);

  if (!userId) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-ink flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-brand-gold" /> My Posted Jobs
        </h2>
        <button
          onClick={onPostJob}
          className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-gold text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <Plus size={16} /> Post a Job
        </button>
      </div>
      {jobs.length === 0 ? (
        <div className="bg-surface-card rounded-xl border border-dashed border-ink-light p-6 text-center">
          <Briefcase className="w-8 h-8 text-ink-light mx-auto mb-2" />
          <p className="text-sm text-ink-caption">No jobs posted yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(j => (
            <div key={j.contentId} className="bg-surface-card rounded-xl border border-ink-light p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-surface-main rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{j.title}</p>
                  <p className="text-xs text-ink-caption">Submitted {new Date(j.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              {j.isPublished
                ? <span className="text-xs bg-status-success/15 text-status-success font-bold px-2 py-0.5 rounded flex-shrink-0">Live</span>
                : <span className="text-xs bg-brand-yellow-soft text-brand-gold font-bold px-2 py-0.5 rounded flex-shrink-0">Pending</span>
              }
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-ink-caption mt-3">
        Jobs go live on the <Link to="/professionals/job-board" className="text-brand-gold underline">Job Board</Link> after admin approval.
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
      <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-status-info" /> Job Applications Received
      </h2>
      <div className="text-sm text-ink-caption py-4">Loading applications...</div>
    </div>
  );

  if (companyNames.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-status-info" /> Job Applications Received
        {applications.length > 0 && (
          <span className="text-xs bg-status-info/15 text-status-info font-bold px-2 py-0.5 rounded-full">{applications.length}</span>
        )}
      </h2>

      {applications.length === 0 ? (
        <div className="bg-surface-card rounded-xl border border-dashed border-ink-light p-6 text-center">
          <Users className="w-8 h-8 text-ink-light mx-auto mb-2" />
          <p className="text-sm text-ink-caption">No applications yet for your job listings.</p>
          <p className="text-xs text-ink-caption mt-1">
            Applications received via <Link to="/professionals/job-board" className="text-status-info underline">Job Board</Link> will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(app => {
            const jobTitle = app.title.replace('[Application] ', '');
            const isOpen = expanded === app.contentId;
            return (
              <div key={app.contentId} className="bg-surface-card rounded-xl border border-status-info/15 shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : app.contentId)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-status-info/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-status-info/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-status-info" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{app.company || 'Applicant'}</p>
                      <p className="text-xs text-ink-caption">Applied for: <span className="font-medium text-ink-paragraph">{jobTitle}</span> · {new Date(app.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <span className="text-xs text-status-info font-semibold flex-shrink-0">{isOpen ? 'Hide ▲' : 'View ▼'}</span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-status-info/10 pt-3 space-y-2">
                    {app.source && (
                      <div className="flex items-center gap-2 text-sm text-ink-paragraph">
                        <Mail className="w-4 h-4 text-status-info flex-shrink-0" />
                        <a href={`mailto:${app.source}`} className="text-status-info hover:underline">{app.source}</a>
                      </div>
                    )}
                    {app.author && (
                      <div className="flex items-center gap-2 text-sm text-ink-paragraph">
                        <Phone className="w-4 h-4 text-status-info flex-shrink-0" />
                        <a href={`tel:${app.author}`} className="text-status-info hover:underline">{app.author}</a>
                      </div>
                    )}
                    {app.description && (
                      <div className="bg-ink-offwhite rounded-lg p-3 mt-2">
                        <p className="text-xs font-semibold text-ink-caption mb-1">Message</p>
                        <p className="text-sm text-ink-paragraph">{app.description}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      {app.source && (
                        <a href={`mailto:${app.source}?subject=Re: ${jobTitle} Application`}
                          className="text-xs font-bold bg-status-info text-white px-3 py-1.5 rounded-lg hover:bg-status-info transition-colors">
                          Reply via Email
                        </a>
                      )}
                      {app.author && (
                        <a href={`tel:${app.author}`}
                          className="text-xs font-bold border border-status-info/25 text-status-info px-3 py-1.5 rounded-lg hover:bg-status-info/10 transition-colors">
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
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [postJobModal, setPostJobModal] = useState(false);
  const [postJobForm, setPostJobForm] = useState<PostJobForm>(EMPTY_POST);
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [jobsRefreshKey, setJobsRefreshKey] = useState(0);

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

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postJobForm.title || !postJobForm.company) return;
    setPostSubmitting(true);
    try {
      const userId = user?.email || user?.userData?.email || '';
      const created = await createContent({
        contentType: 'job',
        title: postJobForm.title,
        description: postJobForm.description,
        company: postJobForm.company,
        location: postJobForm.location,
        salary: postJobForm.salary,
        category: postJobForm.category,
        platform: postJobForm.jobType,
        imageUrl: postJobForm.imageUrl,
        applicationDeadline: postJobForm.applicationDeadline,
        author: userId,
        source: userId,
        isPublished: false,
      });
      if (userId && created?.contentId) {
        setJobsRefreshKey(k => k + 1);
      }
      setPostSubmitted(true);
    } catch {
      setPostSubmitted(true);
    } finally {
      setPostSubmitting(false);
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
      .catch(() => {})
      .finally(() => setProfileLoaded(true));
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
    <div className="overflow-hidden w-full h-full bg-surface-card rounded-2xl border border-brand-yellow-soft shadow-lg transition-all duration-300 group animate-pulse p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-brand-yellow-soft p-2 flex items-center justify-center" />
          <div className="flex-1">
            <div className="h-5 bg-brand-yellow-soft rounded w-3/4 mb-2" />
            <div className="h-3 bg-brand-yellow-soft rounded w-1/2" />
          </div>
        </div>
        <div className="w-24 h-7 bg-brand-yellow-soft rounded-full" />
      </div>
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-brand-yellow-soft rounded-full w-20" />
          <div className="h-6 bg-brand-yellow-soft rounded-full w-16" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-10 bg-brand-yellow-soft rounded-lg" />
        <div className="h-10 bg-brand-yellow-soft rounded-lg" />
        <div className="h-10 bg-brand-yellow-soft rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-main p-8">
      <div className="flex items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2 flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Company Directory
          </h1>
          <p className="text-ink-paragraph mb-3">Browse and manage company submissions</p>
          <ListingLimitBanner count={companies.length} type="company" label="Companies" />
        </div>
        {(() => {
          const limit = getCompanyLimit(totalTokensEarned);
          const atLimit = profileLoaded && isFinite(limit) && companies.length >= limit;
          return atLimit ? (
            <button
              onClick={() => navigate("/user-recharge")}
              className="bg-ink-light text-sm font-medium text-ink-caption flex items-center gap-2 px-4 py-4 rounded-lg align-top border border-ink-light cursor-not-allowed"
              title={`Plan limit reached (${companies.length}/${limit}). Upgrade to add more.`}
            >
              <Plus className="w-5 h-5" />
              Limit Reached — Upgrade
            </button>
          ) : (
            <button
              onClick={() => navigate("/form")}
              className="bg-brand-gold text-sm font-medium text-white flex items-center gap-2 px-4 py-4 rounded-lg align-top hover:bg-brand-gold hover:scale-110 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add New Company
            </button>
          );
        })()}
      </div>

      <div className="mb-8 relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
          <Search className="h-5 w-5 text-brand-gold" />
        </div>
        <input
          type="text"
          placeholder="Search by company name, location, or sector..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-3 bg-surface-card border-2 border-brand-yellow-soft rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
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
        <div className="text-center py-20 text-ink-caption">
          <Search className="w-16 h-16 text-brand-yellow-soft mx-auto mb-4" />
          No companies found matching "{searchTerm}"
        </div>
      )}

      <MyPostedJobs refreshKey={jobsRefreshKey} onPostJob={() => { setPostJobModal(true); setPostSubmitted(false); setPostJobForm({ ...EMPTY_POST, company: companies[0]?.companyName || '' }); }} />
      <JobApplicationsReceived companyNames={companies.map(c => c.companyName)} />

      {/* Post Job Modal */}
      {postJobModal && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm" onClick={() => setPostJobModal(false)}>
          <div className="bg-surface-card rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Briefcase className="text-brand-gold" size={22} />
                <h3 className="text-xl font-semibold text-ink">Post a Job</h3>
              </div>
              <button onClick={() => setPostJobModal(false)} className="p-1 rounded-full hover:bg-ink-light"><X size={20} className="text-ink-caption" /></button>
            </div>

            {postSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-14 h-14 text-status-success mx-auto mb-4" />
                <h4 className="text-lg font-bold text-ink mb-2">Job Submitted!</h4>
                <p className="text-sm text-ink-caption mb-6">Your job listing is under review. It will go live on the Job Board after admin approval.</p>
                <button onClick={() => { setPostJobModal(false); setPostSubmitted(false); setPostJobForm(EMPTY_POST); }}
                  className="px-6 py-2.5 bg-brand-yellow hover:bg-brand-gold text-white font-semibold rounded-lg transition-colors">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handlePostJob} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-ink-paragraph mb-1 block">Job Title *</label>
                  <input required value={postJobForm.title} onChange={e => setPostJobForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Drone Pilot – Agriculture" className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-paragraph mb-1 block">Company Name *</label>
                  {companies.length > 0 ? (
                    <select required value={postJobForm.company} onChange={e => setPostJobForm(p => ({ ...p, company: e.target.value }))}
                      className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-yellow">
                      <option value="">Select your company</option>
                      {companies.map(c => <option key={c.publishedId} value={c.companyName}>{c.companyName}</option>)}
                    </select>
                  ) : (
                    <input required value={postJobForm.company} onChange={e => setPostJobForm(p => ({ ...p, company: e.target.value }))}
                      placeholder="Your company name" className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                  )}
                  <p className="text-[11px] text-ink-caption mt-1">Must match your registered company exactly so applications reach your dashboard.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-ink-paragraph mb-1 block">Location</label>
                    <input value={postJobForm.location} onChange={e => setPostJobForm(p => ({ ...p, location: e.target.value }))}
                      placeholder="e.g. Hyderabad" className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-paragraph mb-1 block">Salary</label>
                    <input value={postJobForm.salary} onChange={e => setPostJobForm(p => ({ ...p, salary: e.target.value }))}
                      placeholder="e.g. ₹30,000–40,000/mo" className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-ink-paragraph mb-1 block">Category</label>
                    <select value={postJobForm.category} onChange={e => setPostJobForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-yellow">
                      <option value="">Select category</option>
                      {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-paragraph mb-1 block">Job Type</label>
                    <select value={postJobForm.jobType} onChange={e => setPostJobForm(p => ({ ...p, jobType: e.target.value }))}
                      className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-yellow">
                      {['Full-Time', 'Part-Time', 'Contract', 'Internship'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-paragraph mb-1 block">Job Description</label>
                  <textarea rows={4} value={postJobForm.description} onChange={e => setPostJobForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe the role, requirements, responsibilities..." className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-yellow resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-ink-paragraph mb-1 block">Job Image URL</label>
                    <input value={postJobForm.imageUrl} onChange={e => setPostJobForm(p => ({ ...p, imageUrl: e.target.value }))}
                      placeholder="https://..." className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-paragraph mb-1 block">Application Deadline</label>
                    <input type="date" value={postJobForm.applicationDeadline} onChange={e => setPostJobForm(p => ({ ...p, applicationDeadline: e.target.value }))}
                      className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setPostJobModal(false)} className="px-4 py-2 text-ink-paragraph font-medium rounded-lg border border-ink-light bg-surface-card hover:bg-ink-offwhite transition-colors">Cancel</button>
                  <button type="submit" disabled={postSubmitting} className="flex items-center gap-2 px-5 py-2 bg-brand-yellow hover:bg-brand-gold text-white font-semibold rounded-lg transition-colors disabled:opacity-60">
                    {postSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Send size={16} /> Submit Job</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Aadhaar / Publish Modal */}
      {publishingCompany && (
        <div
          className="fixed inset-0 z-[10000000] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
          onClick={handleClosePublishModal}
        >
          <div
            className="bg-surface-card rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="text-status-info" size={24} />
                <h3 className="text-xl font-semibold text-ink">Verify & Publish</h3>
              </div>
              <button onClick={handleClosePublishModal} className="p-1 rounded-full hover:bg-ink-light">
                <X size={20} className="text-ink-caption" />
              </button>
            </div>

            <div className="flex items-start gap-3 p-3 bg-status-info/10 rounded-lg mb-4">
              <AlertCircle size={18} className="text-status-info mt-0.5 flex-shrink-0" />
              <p className="text-sm text-status-info">
                Verify your Aadhaar via DigiLocker to publish <strong>{publishingCompany.companyName}</strong> live on DroneTv.
              </p>
            </div>

            {/* Verification Section */}
            <div className="border border-ink-light rounded-lg p-4 bg-ink-offwhite mb-5">
              <h4 className="text-sm font-semibold text-ink-charcoal mb-3 flex items-center gap-2">
                <Shield size={16} className="text-status-info" />
                Aadhaar Verification
              </h4>

              {digiStatus === 'loading' && (
                <div className="flex items-center gap-2 text-status-info text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Initializing secure verification...
                </div>
              )}

              {digiStatus === 'error' && (
                <div>
                  <p className="text-xs text-status-error mb-2">Initialization failed. Please retry.</p>
                  <button
                    onClick={initDigiBoost}
                    className="flex items-center gap-1 text-xs text-status-info hover:text-status-info font-medium"
                  >
                    <RefreshCw size={12} /> Retry
                  </button>
                </div>
              )}

              {digiStatus === 'ready' && (
                <div>
                  <p className="text-xs text-ink-caption mb-3">Click the button below to open DigiLocker verification in a new window.</p>
                  <button
                    onClick={handleOpenDigiLocker}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-status-info text-white text-sm font-semibold rounded-lg hover:bg-status-info transition-colors"
                  >
                    <ExternalLink size={15} />
                    Verify via DigiLocker
                  </button>
                </div>
              )}

              {digiStatus === 'polling' && (
                <div className="flex items-center gap-2 text-status-info text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Waiting for DigiLocker verification...
                  <button
                    onClick={() => { if (pollRef.current) clearInterval(pollRef.current); setDigiStatus('ready'); }}
                    className="ml-auto text-xs text-ink-caption hover:text-ink-paragraph"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {digiStatus === 'verified' && (
                <div className="flex items-center gap-2 p-2 bg-status-success/10 border border-status-success/25 rounded-lg">
                  <CheckCircle size={18} className="text-status-success" />
                  <span className="text-sm font-medium text-status-success">Aadhaar Verified Successfully</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleClosePublishModal}
                className="px-4 py-2 text-ink-paragraph font-medium rounded-lg border border-ink-light bg-surface-card hover:bg-ink-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                disabled={digiStatus !== 'verified' || isPublishing}
                className={`px-4 py-2 font-medium rounded-lg transition-colors shadow-md flex items-center gap-2 ${
                  digiStatus === 'verified' && !isPublishing
                    ? 'bg-status-success text-white hover:bg-status-success cursor-pointer'
                    : 'bg-ink-light text-ink-caption cursor-not-allowed'
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
