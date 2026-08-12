import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  ArrowRight,
  Building2,
  Menu,
  X,
  Eye,
  Key,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  AlertCircle,
  Edit,
  Calendar,
} from "lucide-react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import CredentialsModal from "./credentialProp/Prop";
import { motion, AnimatePresence } from "motion/react";
import { COMPANY_API, AUTH_API, LAMBDA } from '../../../lib/apiConfig';

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;
const PROFILE_BATCH_API = AUTH_API ? `${AUTH_API}/profile/batch` : null;

interface CompanySubscription {
  userId: string;
  companyName: string;
  packageType: string;
  packageExpiry: string;
  tokenBalance: number;
}

// -------------------- Types --------------------
interface Company {
  publishedId: string;
  companyId: string;
  draftId: string;
  userId: string;
  companyName: string;
  location: string;
  sectors: string[];
  previewImage?: string;
  heroImage?: string;
  templateSelection: string;
  reviewStatus: string;
  adminNotes: string;
  status: string | null;
  publishedDate: string;
  lastModified: string;
  createdAt: string;
  submittedForReview: string;
  reviewedAt: string;
  version: number;
  hasEdits: boolean;
  sectionsEdited: string[];
  totalEdits: number;
  isTemplate2: boolean;
  completionPercentage: number;
  hasCustomImages: boolean;
  lastActivity: string;
  canEdit: boolean;
  canResubmit: boolean;
  isVisible: boolean;
  isApproved: boolean;
  dashboardType: string;
  needsAdminAction: boolean;
}

interface ContactLead {
  leadId: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  company?: string;
  publishedId?: string;
  subject?: string;
  message: string;
  email: string;
  phone: string;
  viewed?: boolean;
  submittedAt?: string;
  createdAt?: string;
}

interface ApiResponse {
  success: boolean;
  viewType: string;
  cards: Company[];
  totalCount: number;
  hasTemplates: boolean;
  message: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

interface SidebarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  isMobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

interface CompanyCardProps {
  company: Company;
  onCredentials: (publishedId: string) => void;
  onApprove: (publishedId: string) => void;
  onReject: (publishedId: string) => void;
  onDelete: (publishedId: string) => void;
  onEdit: (publishedId: string, templateSelection: string) => void;
  disabled?: boolean;
}

interface ErrorMessageProps {
  error: string;
  onRetry: () => void;
}

// -------------------- Constants --------------------
const SORT_OPTIONS = [
  "Sort by Date",
  "Sort by Latest",
  "Sort by Location",
  "Sort by Sector",
] as const;

// -------------------- Small Hooks --------------------
function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// -------------------- Header --------------------
const Header: React.FC = () => {
  return (
    <div className="bg-ink px-6 py-5">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-brand-yellow uppercase mb-1">Admin</p>
        <h1 className="text-xl font-extrabold text-white mb-0.5">Company Management</h1>
        <p className="text-sm text-ink-caption">Review and manage all company listings, credentials, and approvals.</p>
      </div>
    </div>
  );
};

// -------------------- Dropdown --------------------
const MinimalisticDropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  placeholder,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center px-4 py-3 w-full text-sm text-ink-paragraph bg-ink-offwhite rounded-lg border border-ink-light transition-colors hover:bg-ink-light focus:outline-none focus:ring-1 focus:ring-ink-light"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={value === options[0] ? "text-ink-caption" : "text-ink"}
        >
          {value || options[0] || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute z-10 mt-1 w-full bg-surface-card rounded-lg border border-ink-light shadow-sm"
          role="listbox"
        >
          {options.map((option: string, idx: number) => (
            <button
              key={idx}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                value === option
                  ? "bg-ink-offwhite text-ink font-medium"
                  : "text-ink-paragraph hover:bg-ink-offwhite"
              }`}
              role="option"
              aria-selected={value === option}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// -------------------- Sidebar --------------------
const Sidebar: React.FC<SidebarProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  isMobileSidebarOpen,
  onCloseMobileSidebar,
  statusFilter,
  onStatusChange,
}) => {
  const sortOptions: string[] = [
    "Sort by Date",
    ...SORT_OPTIONS.filter((s) => s !== "Sort by Date"),
  ];

  // Status filter options - Updated to match EventAdminDashboard
  const statusOptions = [
    { value: "all", label: "All Companies", color: "text-brand-gold" },
    { value: "under_review", label: "Under Review", color: "text-brand-gold" },
    { value: "approved", label: "Approved", color: "text-status-success" },
    { value: "rejected", label: "Rejected", color: "text-status-error" },
  ];

  return (
    <div
      className={`bg-surface-card border-r border-ink-light p-4 md:p-6 h-fit md:sticky md:top-0
      ${
        isMobileSidebarOpen
          ? "fixed top-16 left-0 right-0 z-50 w-full overflow-y-auto bg-surface-card"
          : "hidden md:block md:w-72"
      }`}
    >
      {isMobileSidebarOpen && (
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-base font-bold text-ink">Filters</h2>
          <button
            onClick={onCloseMobileSidebar}
            className="p-2 text-ink-caption"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="space-y-6 md:space-y-8">
        {/* Status Filter Section - Updated to match EventAdminDashboard */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ink-caption uppercase tracking-wide block">
            Filter by Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((option) => (
              <motion.button
                key={option.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStatusChange(option.value)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1 ${
                  statusFilter === option.value
                    ? option.value === "under_review"
                      ? "bg-brand-yellow-soft border-brand-yellow-soft text-brand-gold"
                      : option.value === "approved"
                      ? "bg-status-success/15 border-status-success/40 text-status-success"
                      : option.value === "rejected"
                      ? "bg-status-error/15 border-status-error/40 text-status-error"
                      : "bg-ink-light border-ink-light text-ink-charcoal"
                    : "bg-surface-card border-ink-light hover:border-brand-yellow text-ink-paragraph"
                }`}
              >
                {option.label === "Needs Review" && (
                  <Clock className="w-3 h-3" />
                )}
                {option.label === "Approved" && (
                  <CheckCircle className="w-3 h-3" />
                )}
                {option.label === "Rejected" && <XCircle className="w-3 h-3" />}
                {option.label === "All Companies" && (
                  <Building2 className="w-3 h-3" />
                )}
                <span>{option.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ink-caption uppercase tracking-wide block">
            Search Companies
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-caption" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-ink-light rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-yellow focus:border-brand-yellow bg-surface-card transition-colors placeholder-ink-caption text-ink"
              aria-label="Search companies"
            />
          </div>
        </div>

        {/* Sort Filter */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ink-caption uppercase tracking-wide block">
            Sort by
          </label>
          <MinimalisticDropdown
            key={`sort-${sortBy}`}
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            placeholder="Sort options"
          />
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            onSearchChange("");
            onSortChange("Sort by Date");
            onStatusChange("all");
          }}
          className="text-xs text-ink-caption hover:text-ink-paragraph transition-colors underline underline-offset-2"
        >
          Clear all filters
        </button>

        {/* Divider */}
        <div className="border-t border-ink-light"></div>

        {/* Navigation Links */}
        <div className="flex gap-1.5 flex-col mt-4">
          <p className="text-xs font-bold text-ink-caption uppercase tracking-wide mb-1">Other Sections</p>
          <motion.button
            whileTap={{ scale: [0.9, 1] }}
            className="text-sm text-ink-paragraph p-2.5 rounded-lg hover:bg-ink-light duration-150 flex items-center gap-2 border border-ink-light bg-surface-card"
          >
            <Link to={"/admin/professional/dashboard"} className="w-full text-left">Professionals</Link>
          </motion.button>
          <motion.button
            whileTap={{ scale: [0.9, 1] }}
            className="text-sm text-ink-paragraph p-2.5 rounded-lg hover:bg-ink-light duration-150 flex items-center gap-2 border border-ink-light bg-surface-card"
          >
            <Link to={"/admin/event/dashboard"} className="w-full text-left">Events</Link>
          </motion.button>
          <motion.button
            whileTap={{ scale: [0.9, 1] }}
            className="text-sm text-ink-paragraph p-2.5 rounded-lg hover:bg-ink-light duration-150 flex items-center gap-2 border border-ink-light bg-surface-card"
          >
            <Link to={"/admin/plans"} className="w-full text-left">Admin Plans</Link>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// -------------------- Confirmation Modal Component --------------------
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor,
  icon,
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface-card rounded-xl shadow-2xl max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {icon}
                <h3 className="text-xl font-semibold text-ink">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-ink-light transition-colors"
                disabled={isLoading}
              >
                <X size={20} className="text-ink-caption" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mb-6">
              <p className="text-ink-paragraph">{message}</p>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 justify-end">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 text-ink-paragraph font-medium rounded-lg border border-ink-light bg-surface-card hover:bg-ink-offwhite transition-colors"
                disabled={isLoading}
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className={`px-4 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-colors shadow-md ${confirmColor}`}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// -------------------- CompanyCard --------------------
const CompanyCard: React.FC<CompanyCardProps & { disabled?: boolean }> = ({
  company,
  onCredentials,
  onApprove,
  onReject,
  onDelete,
  onEdit,
  disabled = false,
}) => {
  // Use encodeURIComponent for safety inside data URI
  const placeholderImg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6' rx='8'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='%23374151' font-size='20' font-family='Arial' font-weight='bold'%3E${encodeURIComponent(
    (company.companyName && company.companyName.charAt(0)) || "C"
  )}%3C/text%3E%3C/svg%3E`;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Date not available";
    }
  };

  // Determine which date to show when API provides no publishedDate
  const displayDateValue =
    company.publishedDate ||
    company.lastModified ||
    company.lastActivity ||
    company.createdAt ||
    "";
  const displayDateLabel = company.publishedDate
    ? "Published"
    : company.lastModified
      ? "Last Modified"
      : company.lastActivity
        ? "Last Activity"
        : company.createdAt
          ? "Created"
          : "Date";

  const getStatusBadge = (reviewStatus?: string) => {
    if (reviewStatus === "active" || reviewStatus === "under_review" || reviewStatus === "ai_completed" || reviewStatus === "ai_processing" || reviewStatus === "ai_failed" || reviewStatus === "ai_failed_insufficient_tokens")
      return {
        bg: "bg-brand-yellow-soft",
        text: "text-brand-gold",
        label: "Needs Review",
      };
    if (reviewStatus === "rejected")
      return { bg: "bg-status-error/15", text: "text-status-error", label: "Rejected" };
    if (reviewStatus === "approved")
      return { bg: "bg-status-success/15", text: "text-status-success", label: "Approved" };
    return { bg: "bg-ink-offwhite", text: "text-ink-paragraph", label: "Unknown" };
  };

  const statusStyle = getStatusBadge(company.reviewStatus);

  return (
    <div className="overflow-hidden w-full h-auto rounded-xl border border-ink-light border-l-4 border-l-brand-yellow shadow-sm transition-all duration-200 hover:shadow-md bg-surface-card">
      <div className="p-4 sm:p-5 md:p-6 lg:p-8">
        {/* Header: stacks on small screens, row on >=sm */}
        <div className="grid grid-cols-1 sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 gap-3 sm:gap-0">
          <div className="flex gap-3 items-start sm:items-center min-w-0">
            {/* Logo */}
            <div className="flex flex-shrink-0 overflow-hidden justify-center items-center p-1 w-10 h-10 bg-ink-light rounded-lg sm:w-12 sm:h-12">
              <img
                src={company.previewImage || placeholderImg}
                alt={`${company.companyName || "Company"} logo`}
                className="object-cover rounded w-full h-full"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (img.src !== placeholderImg) img.src = placeholderImg;
                }}
                loading="lazy"
                draggable={false}
              />
            </div>

            {/* Title + location: use min-w-0 so  works */}
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-ink  line-clamp-2">
                {company.companyName || "Unnamed Company"}
              </h3>

              <div className="flex items-center mt-1 text-ink-paragraph text-xs sm:text-sm">
                <MapPin className="mr-1 w-3 h-3 flex-shrink-0" />
                <span className="">
                  {company.location || "Location not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* Status badge: visible on all sizes, compact on small screens */}
          <div className="mt-2 flex-shrink-0">
            <div
              className={`inline-flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
              aria-hidden={false}
            >
              <Building2 className="w-3 h-3" />
              <span className="">{statusStyle.label}</span>
            </div>
          </div>
        </div>

        {/* Sectors */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {(company.sectors && company.sectors.length > 0
              ? company.sectors
              : ["General"]
            ).map((sector: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium text-ink-paragraph bg-ink-light rounded-full"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>

        {/* Info + Buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2 items-center px-3 py-1 bg-ink-offwhite rounded-lg">
              <span className="text-xs sm:text-sm font-bold text-ink-paragraph">
                {formatDate(displayDateValue)}
              </span>
              <span className="hidden sm:inline text-xs text-ink-paragraph">
                {displayDateLabel}
              </span>
            </div>
          </div>

          {/* Buttons grid: 1 col mobile, 2 col sm, 3 col lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCredentials(company.publishedId);
              }}
              aria-label={`Credentials ${company.companyName}`}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs sm:text-sm font-medium text-brand-gold bg-brand-gold/15 rounded-lg transition-colors hover:bg-brand-gold/25 disabled:opacity-50 disabled:pointer-events-none"
              disabled={disabled}
              aria-disabled={disabled}
            >
              <Key className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="">Access Details</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(company.publishedId, company.templateSelection);
              }}
              aria-label={`Edit ${company.companyName}`}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs sm:text-sm font-medium text-ink-paragraph bg-ink-light rounded-lg transition-colors hover:bg-ink-light disabled:opacity-50 disabled:pointer-events-none"
              disabled={disabled}
              aria-disabled={disabled}
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="">Edit</span>
              /
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="">Preview</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onApprove(company.publishedId);
              }}
              aria-label={`Approve ${company.companyName}`}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs sm:text-sm font-medium text-status-success bg-status-success/15 rounded-lg transition-colors hover:bg-status-success/25 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabled || company.reviewStatus === "approved"}
              aria-disabled={disabled}
            >
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="">Approve</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReject(company.publishedId);
              }}
              aria-label={`Reject ${company.companyName}`}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs sm:text-sm font-medium text-status-error bg-status-error/15 rounded-lg transition-colors hover:bg-status-error/25 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabled || company.reviewStatus === "rejected"}
              aria-disabled={disabled}
            >
              <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="">Reject</span>
            </button>

            {/* Delete spans full row on small/medium -> set col-span accordingly */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(company.publishedId);
              }}
              aria-label={`Delete ${company.companyName}`}
              className="flex col-span-1 sm:col-span-2 gap-2 justify-center items-center px-3 py-2 text-xs sm:text-sm font-medium text-white bg-status-error rounded-lg transition-colors hover:bg-status-error disabled:opacity-50 disabled:pointer-events-none"
              disabled={disabled}
              aria-disabled={disabled}
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- Loading & Error --------------------
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-16">
    <div className="w-12 h-12 rounded-full border-b-2 border-brand-gold animate-spin" />
    <span className="ml-4 text-ink-paragraph">Loading companies...</span>
  </div>
);

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => (
  <div className="py-16 text-center">
    <div className="mb-4 text-6xl">⚠</div>
    <p className="mb-2 text-xl text-status-error">Error loading companies</p>
    <p className="mb-4 text-ink-caption">{error}</p>
    <button
      onClick={onRetry}
      className="px-6 py-3 font-semibold text-white bg-status-error rounded-lg transition-colors hover:bg-status-error"
    >
      Try Again
    </button>
  </div>
);

// -------------------- API Service --------------------
const apiService = {
  async fetchAllCompanies(signal?: AbortSignal): Promise<ApiResponse> {
    try {
      // Old Lambda's admin view had a hard ~100-record cap, which is why this
      // used to double-fetch admin+main and merge client-side. Our own
      // backend's admin view respects `limit` directly (no hidden cap), so a
      // single call with a high limit covers everything in one request.
      const adminUrl = COMPANY_API
        ? `${COMPANY_API}/dashboard-cards?viewType=admin&limit=1000`
        : `${LAMBDA.company}/dashboard-cards?viewType=admin&limit=500`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      };

      const adminResp = await fetch(adminUrl, { method: "GET", headers, signal });

      if (!adminResp.ok) {
        throw new Error(`HTTP error! status: ${adminResp.status}`);
      }

      if (!COMPANY_API) {
        // Lambda fallback still needs the old double-fetch merge - its admin
        // view really is capped.
        const mainUrl = `${LAMBDA.company}/dashboard-cards?viewType=main`;
        const adminData: ApiResponse = await adminResp.json();
        const mainResp = await fetch(mainUrl, { method: "GET", headers, signal });
        const mainData = mainResp.ok ? await mainResp.json() : { cards: [] };
        const adminIds = new Set((adminData.cards || []).map((c) => c.publishedId));
        const extra = (mainData.cards || []).filter(
          (c: Company) => c.publishedId && !adminIds.has(c.publishedId)
        );
        return {
          ...adminData,
          cards: [...(adminData.cards || []), ...extra],
          totalCount: (adminData.totalCount || 0) + extra.length,
        };
      }

      return await adminResp.json();
    } catch (error: any) {
      if (error?.name === "AbortError") throw error;
      throw error;
    }
  },

  async fetchCompanyCredentials(draftId: string, userId: string): Promise<any> {
    try {
      const response = await fetch(
        COMPANY_API ? `${COMPANY_API}/restore-js?draftId=${draftId}&userId=${userId}` : `${LAMBDA.companyRestoreJs}/js?draftId=${draftId}&userId=${userId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async approveCompany(publishedId: string, action: string): Promise<any> {
    try {
      const body = JSON.stringify({ publishedId, action });
      const response = await fetch(
        COMPANY_API ? `${COMPANY_API}/admin/templates/review` : `${LAMBDA.companyAdmin}/admin/templates/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body,
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async rejectCompany(publishedId: string, action: string): Promise<any> {
    try {
      const body = JSON.stringify({ publishedId, action });
      const response = await fetch(
        COMPANY_API ? `${COMPANY_API}/admin/templates/review` : `${LAMBDA.companyAdmin}/admin/templates/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body,
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async fetchPublishedDetails(
    publishedId: string,
    userId: string
  ): Promise<any> {
    try {
      const response = await fetch(
        COMPANY_API ? `${COMPANY_API}/dashboard-cards/published-details/${publishedId}` : `${LAMBDA.company}/dashboard-cards/published-details/${publishedId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId,
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async deleteCompany(publishedId: string): Promise<any> {
    try {
      const response = await fetch(
        COMPANY_API ? `${COMPANY_API}/admin/templates/delete` : `${LAMBDA.companyAdmin}/admin/templates/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ publishedId, action: "delete" }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};

// -------------------- Recent Companies Section --------------------
const RecentCompaniesSection: React.FC<{
  recentCompanies: Company[];
  onCredentials: (publishedId: string) => void;
  onApprove: (publishedId: string) => void;
  onReject: (publishedId: string) => void;
  onDelete: (publishedId: string) => void;
  onEdit: (publishedId: string, templateSelection: string) => void;
  disabled?: boolean;
}> = ({
  recentCompanies,
  onCredentials,
  onApprove,
  onReject,
  onDelete,
  onEdit,
  disabled,
}) => {
    if (recentCompanies.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex gap-3 items-center mb-6">
          <div className="flex gap-2 items-center">
            <Clock className="w-5 h-5 text-brand-gold" />
            <h2 className="text-base font-bold text-ink">
              Recent Companies
            </h2>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold text-ink-paragraph bg-ink-light rounded-full">
            Last 7 days
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 md:gap-6">
          {recentCompanies.map((company) => (
            <div key={company.publishedId} className="animate-fadeIn">
              <CompanyCard
                company={company}
                onCredentials={onCredentials}
                onApprove={onApprove}
                onReject={onReject}
                onDelete={onDelete}
                onEdit={onEdit}
                disabled={disabled}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-ink-light"></div>
      </div>
    );
  };

// -------------------- Main Component --------------------
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // data state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // loading states
  const [isFetching, setIsFetching] = useState<boolean>(true); // initial fetch
  const [isMutating, setIsMutating] = useState<boolean>(false); // approve/reject/delete

  // UI state - Updated statusFilter default value
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [searchParams, setSearchParams] = useSearchParams();
  const viewFilter = searchParams.get("view") ?? "all";
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") ?? "all");
  const [sortBy, setSortBy] = useState<string>("Sort by Date");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState<boolean>(false);
  const [credentialsModal, setCredentialsModal] = useState<{
    isOpen: boolean;
    data: any;
    company: Company | null;
  }>({ isOpen: false, data: null, company: null });

  // leads (contact form + webinar registration submissions)
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState<boolean>(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [leadsSearchTerm, setLeadsSearchTerm] = useState<string>("");
  const [leadsRefreshKey, setLeadsRefreshKey] = useState<number>(0);

  // subscriptions (each company owner's package/token status)
  const [subscriptions, setSubscriptions] = useState<CompanySubscription[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState<boolean>(false);
  const [subscriptionsSearchTerm, setSubscriptionsSearchTerm] = useState<string>("");

  // Confirmation modals state
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "edit" | "approve" | "reject" | "delete" | null;
    publishedId: string | null;
    company: Company | null;
  }>({ isOpen: false, type: null, publishedId: null, company: null });

  const [error, setError] = useState<string | null>(null);

  // Recent Companies Logic
  const recentCompanies = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return companies
      .filter((company) => {
        if (!company.createdAt) return false;
        const createdAt = new Date(company.createdAt);
        return createdAt >= sevenDaysAgo;
      })
      .slice(0, 6);
  }, [companies]);

  // Prefer publishedDate, then lastModified, lastActivity, and finally createdAt
  const getPrimaryDate = (company: Company) =>
    company.publishedDate ||
    company.lastModified ||
    company.lastActivity ||
    company.createdAt ||
    "";

  // Fetch Companies (with AbortController)
  const fetchCompanies = async (signal?: AbortSignal) => {
    try {
      setIsFetching(true);
      setError(null);
      const data = await apiService.fetchAllCompanies(signal);

      const seen = new Set<string>();
      const deduped: Company[] = [];
      for (const c of data.cards || []) {
        if (!seen.has(c.publishedId)) {
          seen.add(c.publishedId);
          deduped.push(c);
        }
      }
      deduped.sort((a, b) => {
        const ta = new Date(getPrimaryDate(a) || 0).getTime();
        const tb = new Date(getPrimaryDate(b) || 0).getTime();
        return tb - ta;
      });

      setCompanies(deduped);
      setTotalCount(data.totalCount || 0);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "Failed to fetch companies"
      );
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setSortBy("Sort by Date");
    const controller = new AbortController();
    fetchCompanies(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch real company leads (buyer inquiries submitted to listed companies) when the tab is opened
  useEffect(() => {
    if (viewFilter !== "leads") return;
    const controller = new AbortController();
    setLeadsLoading(true);
    setLeadsError(null);
    const url = `${LAMBDA.adminLeads}/admin-leads`;
    fetch(url, { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(data => setLeads(data.items || []))
      .catch(err => { if (err.name !== 'AbortError') setLeadsError('Failed to load leads.'); })
      .finally(() => setLeadsLoading(false));
    return () => controller.abort();
  }, [viewFilter, leadsRefreshKey]);

  // Fetch real package/subscription status for each company owner when the tab is opened
  useEffect(() => {
    if (viewFilter !== "subscriptions" || companies.length === 0) return;
    const controller = new AbortController();
    setSubscriptionsLoading(true);

    const uniqueByUser = new Map<string, Company>();
    companies.forEach((c) => {
      if (c.userId && !uniqueByUser.has(c.userId)) uniqueByUser.set(c.userId, c);
    });
    const uniqueCompanies = Array.from(uniqueByUser.values());

    // Single batched call instead of one /profile request per company (each
    // of which also fanned out to payment service internally) - was firing
    // up to hundreds of parallel requests every time this tab opened.
    if (PROFILE_BATCH_API) {
      fetch(PROFILE_BATCH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ userIds: uniqueCompanies.map((c) => c.userId) }),
        signal: controller.signal,
      })
        .then((res) => (res.ok ? res.json() : { profiles: [] }))
        .then((data) => {
          const byUser = new Map((data.profiles || []).map((p: any) => [p.userId, p]));
          const results = uniqueCompanies
            .map((company) => {
              const profile: any = byUser.get(company.userId);
              if (!profile) return null;
              return {
                userId: company.userId,
                companyName: company.companyName,
                packageType: profile.packageType || "",
                packageExpiry: profile.packageExpiry || "",
                tokenBalance: profile.tokenBalance ?? 0,
              } as CompanySubscription;
            })
            .filter((r): r is CompanySubscription => r !== null);
          setSubscriptions(results);
        })
        .catch((err) => {
          if (err?.name !== "AbortError") setSubscriptions([]);
        })
        .finally(() => setSubscriptionsLoading(false));
      return () => controller.abort();
    }

    Promise.all(
      uniqueCompanies.map(async (company) => {
        try {
          const res = await fetch(`${PROFILE_API}?userId=${company.userId}`, { signal: controller.signal });
          if (!res.ok) return null;
          const data = await res.json();
          return {
            userId: company.userId,
            companyName: company.companyName,
            packageType: data?.profile?.packageType || "",
            packageExpiry: data?.profile?.packageExpiry || "",
            tokenBalance: data?.profile?.tokenBalance ?? 0,
          } as CompanySubscription;
        } catch {
          return null;
        }
      })
    )
      .then((results) => setSubscriptions(results.filter((r): r is CompanySubscription => r !== null)))
      .finally(() => setSubscriptionsLoading(false));

    return () => controller.abort();
  }, [viewFilter, companies]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, sortBy]);

  // Derived lists
  const industries = useMemo(() => {
    return [
      "All Sectors",
      ...Array.from(new Set(companies.flatMap((c) => c.sectors || []))).sort(),
    ];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    const q = (debouncedSearchTerm || "").trim().toLowerCase();
    return companies.filter((company) => {
      const matchesSearch =
        !q ||
        (company.companyName &&
          company.companyName.toLowerCase().includes(q)) ||
        (company.location && company.location.toLowerCase().includes(q)) ||
        (company.sectors &&
          company.sectors.some((sector) => sector.toLowerCase().includes(q)));

      // Status filter logic - Updated to match EventAdminDashboard
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "under_review" &&
         (company.reviewStatus === "active" || company.reviewStatus === "under_review" || company.reviewStatus === "ai_completed" || company.reviewStatus === "ai_processing" || company.reviewStatus === "ai_failed" || company.reviewStatus === "ai_failed_insufficient_tokens")) ||
        (statusFilter === "approved" && company.reviewStatus === "approved") ||
        (statusFilter === "rejected" && company.reviewStatus === "rejected");

      return matchesSearch && matchesStatus;
    });
  }, [companies, debouncedSearchTerm, statusFilter]);

  const filteredLeads = useMemo(() => {
    const q = leadsSearchTerm.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(lead =>
      (`${lead.firstName || ""} ${lead.lastName || ""}`).toLowerCase().includes(q) ||
      (lead.companyName || lead.company || "").toLowerCase().includes(q) ||
      (lead.email || "").toLowerCase().includes(q) ||
      (lead.phone || "").toLowerCase().includes(q) ||
      (lead.message || "").toLowerCase().includes(q)
    );
  }, [leads, leadsSearchTerm]);

  const getMostRecentDate = (company: Company) =>
    Math.max(
      new Date(company.lastModified || 0).getTime(),
      new Date(company.lastActivity || 0).getTime(),
      new Date(company.publishedDate || 0).getTime(),
      new Date(company.createdAt || 0).getTime()
    );

  const sortedCompanies = useMemo(() => {
    const arr = [...filteredCompanies];
    switch (sortBy) {
      case "Sort by Location":
        return arr.sort((a, b) =>
          (a.location || "").localeCompare(b.location || "")
        );
      case "Sort by Date":
        // primary date descending (newest first)
        return arr.sort(
          (a, b) =>
            new Date(getPrimaryDate(b) || 0).getTime() -
            new Date(getPrimaryDate(a) || 0).getTime()
        );
      case "Sort by Sector":
        return arr.sort((a, b) =>
          (a.sectors?.[0] || "").localeCompare(b.sectors?.[0] || "")
        );
      case "Sort by Latest":
      default:
        return arr.sort((a, b) => getMostRecentDate(b) - getMostRecentDate(a));
    }
  }, [filteredCompanies, sortBy]);

  // Calculate paginated companies
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedCompanies.slice(startIndex, endIndex);
  }, [sortedCompanies, currentPage, itemsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedCompanies.length / itemsPerPage)
  );

  // -------------------- Pagination Handlers --------------------
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // -------------------- Confirmation Modal Handlers --------------------
  const openConfirmationModal = (
    type: "edit" | "approve" | "reject" | "delete",
    publishedId: string
  ) => {
    const company = companies.find((c) => c.publishedId === publishedId);
    setConfirmationModal({ isOpen: true, type, publishedId, company });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      type: null,
      publishedId: null,
      company: null,
    });
  };

  const handleConfirmAction = async () => {
    const { type, publishedId, company } = confirmationModal;
    if (!publishedId) return;

    try {
      setIsMutating(true);

      switch (type) {
        case "edit":
          if (company) {
            if (company.templateSelection === "template-1") {
              navigate(
                `/admin/companies/edit/1/${publishedId}/${company.userId}`
              );
            } else if (company.templateSelection === "template-2") {
              navigate(
                `/admin/companies/edit/2/${publishedId}/${company.userId}`
              );
            } else {
              toast.info("Unknown template selection");
            }
          }
          break;

        case "approve":
          // optimistic update
          setCompanies((prev) =>
            prev.map((c) =>
              c.publishedId === publishedId
                ? { ...c, isApproved: true, reviewStatus: "approved" }
                : c
            )
          );
          const approveResult = await apiService.approveCompany(
            publishedId,
            "approve"
          );
          if (
            approveResult?.status === "approved" ||
            approveResult?.status === "success"
          ) {
            toast.success("Company approved successfully");
            await fetchCompanies();
          } else {
            toast.error("Failed to approve company");
            await fetchCompanies();
          }
          break;

        case "reject":
          setCompanies((prev) =>
            prev.map((c) =>
              c.publishedId === publishedId
                ? { ...c, isApproved: false, reviewStatus: "rejected" }
                : c
            )
          );
          const rejectResult = await apiService.rejectCompany(
            publishedId,
            "reject"
          );
          if (
            rejectResult?.status === "rejected" ||
            rejectResult?.status === "success"
          ) {
            toast.success("Company rejected successfully");
            await fetchCompanies();
          } else {
            toast.error("Failed to reject company");
            await fetchCompanies();
          }
          break;

        case "delete":
          const deleteResult = await apiService.deleteCompany(publishedId);
          toast(deleteResult.message);
          await fetchCompanies();
          break;

        default:
          return;
      }
    } catch (err) {
      toast.error(`Failed to ${type} company`);
      await fetchCompanies();
    } finally {
      setIsMutating(false);
      closeConfirmationModal();
    }
  };

  // -------------------- Action Handlers --------------------
  const handleCredentials = async (publishedId: string) => {
    try {
      const company = companies.find((c) => c.publishedId === publishedId);
      if (!company) {
        toast.error("Company not found");
        return;
      }
      setIsMutating(true);
      const credentials = await apiService.fetchCompanyCredentials(company.draftId, company.userId);
      setCredentialsModal({ isOpen: true, data: credentials, company });
    } catch (err) {
      toast.error("Failed to fetch company credentials");
    } finally {
      setIsMutating(false);
    }
  };

  const handlePreview = async (publishedId: string) => {
    try {
      const company = companies.find((c) => c.publishedId === publishedId);
      if (!company) {
        toast.error("Company not found");
        return;
      }
      setIsMutating(true);
      const details = await apiService.fetchPublishedDetails(
        publishedId,
        company.userId
      );
      if (details.templateSelection === "template-1") {
        navigate(`/admin/companies/preview/1/${publishedId}/${company.userId}`);
      } else if (details.templateSelection === "template-2") {
        navigate(`/admin/companies/preview/2/${publishedId}/${company.userId}`);
      } else {
        toast.info("Unknown template selection");
      }
    } catch (err) {
      toast.error("Failed to load template for preview");
    } finally {
      setIsMutating(false);
    }
  };

  const handleEdit = (publishedId: string, templateSelection: string) => {
    openConfirmationModal("edit", publishedId);
  };

  const handleApprove = (publishedId: string) => {
    openConfirmationModal("approve", publishedId);
  };

  const handleReject = (publishedId: string) => {
    openConfirmationModal("reject", publishedId);
  };

  const handleDelete = (publishedId: string) => {
    openConfirmationModal("delete", publishedId);
  };

  const handleRetry = () => {
    fetchCompanies();
  };

  // -------------------- Modal Configuration --------------------
  const getModalConfig = () => {
    const { type, company } = confirmationModal;
    const companyName = company?.companyName || "this company";

    switch (type) {
      case "edit":
        return {
          title: "Confirm Edit",
          message: `Are you sure you want to edit "${companyName}"? You will be redirected to the edit page.`,
          confirmText: "Edit Company",
          confirmColor: "bg-ink-paragraph hover:bg-ink-paragraph",
          icon: <Edit className="text-ink-paragraph" size={24} />,
        };
      case "approve":
        return {
          title: "Confirm Approval",
          message: `Are you sure you want to approve "${companyName}"? This will make the company visible to users.`,
          confirmText: "Approve Company",
          confirmColor: "bg-status-success hover:bg-status-success",
          icon: <CheckCircle className="text-status-success" size={24} />,
        };
      case "reject":
        return {
          title: "Confirm Rejection",
          message: `Are you sure you want to reject "${companyName}"? This will mark the company as rejected.`,
          confirmText: "Reject Company",
          confirmColor: "bg-status-error hover:bg-status-error",
          icon: <XCircle className="text-status-error" size={24} />,
        };
      case "delete":
        return {
          title: "Confirm Deletion",
          message: `Are you sure you want to delete "${companyName}"? This action cannot be undone and all company data will be permanently removed.`,
          confirmText: "Delete Company",
          confirmColor: "bg-status-error hover:bg-status-error",
          icon: <Trash2 className="text-status-error" size={24} />,
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to perform this action?",
          confirmText: "Confirm",
          confirmColor: "bg-status-info hover:bg-status-info",
          icon: <AlertCircle className="text-status-info" size={24} />,
        };
    }
  };

  const modalConfig = getModalConfig();

  // -------------------- Render --------------------
  return (
    <div className="w-full min-h-screen bg-[#F4F5F7]">

      {/* Universal Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmColor={modalConfig.confirmColor}
        icon={modalConfig.icon}
        isLoading={isMutating}
      />

      {/* Page title */}
      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-ink">Company Listings</h1>
        <p className="text-sm text-ink-caption mt-0.5">Review and manage all company listings, credentials, and approvals.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total", value: companies.length, color: "border-t-brand-yellow" },
          { label: "Pending Review", value: companies.filter(c => c.reviewStatus === "under_review" || c.reviewStatus === "active" || c.reviewStatus === "ai_completed" || c.reviewStatus === "ai_processing" || c.reviewStatus === "ai_failed" || c.reviewStatus === "ai_failed_insufficient_tokens").length, color: "border-t-status-warning" },
          { label: "Approved", value: companies.filter(c => c.reviewStatus === "approved").length, color: "border-t-status-success" },
          { label: "Rejected", value: companies.filter(c => c.reviewStatus === "rejected").length, color: "border-t-status-error" },
        ].map(stat => (
          <div key={stat.label} className={`bg-surface-card rounded-lg border border-ink-light border-t-4 ${stat.color} p-4 shadow-sm`}>
            <div className="text-2xl font-black text-ink">{isFetching ? "—" : stat.value}</div>
            <div className="text-xs font-semibold text-ink-caption mt-1 uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* View tabs */}
      <div className="flex gap-0 border-b-2 border-ink-light mb-4 overflow-x-auto">
        {[
          { id: "all", label: "All Companies" },
          { id: "leads", label: "Lead Management" },
          { id: "subscriptions", label: "Subscriptions" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setSearchParams(prev => { if (tab.id === "all") { prev.delete("view"); } else { prev.set("view", tab.id); } return prev; }, { replace: true });
              setCurrentPage(1);
              setStatusFilter("all");
            }}
            className={`px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-[3px] -mb-[2px] transition-all ${viewFilter === tab.id ? "text-ink border-brand-yellow" : "text-ink-caption border-transparent hover:text-ink-paragraph"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {viewFilter === "subscriptions" && (() => {
        const q = subscriptionsSearchTerm.trim().toLowerCase();
        const filteredSubs = subscriptions.filter(
          s => !q || s.companyName.toLowerCase().includes(q) || s.userId.toLowerCase().includes(q)
        );
        const fmtExpiry = (raw: string) => {
          if (!raw) return "—";
          try { return new Date(raw).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
          catch { return "—"; }
        };
        const tierBadge: Record<string, string> = {
          reach: "bg-status-info/15 text-status-info",
          scale: "bg-brand-yellow-soft text-brand-gold",
          brand: "bg-brand-gold/15 text-brand-gold",
        };
        return (
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="flex items-center gap-2 bg-surface-card border border-ink-light rounded-md px-3 py-1.5 flex-1 min-w-[180px] max-w-xs">
                <Search className="w-4 h-4 text-ink-caption flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by company or email…"
                  value={subscriptionsSearchTerm}
                  onChange={e => setSubscriptionsSearchTerm(e.target.value)}
                  className="border-none outline-none text-sm bg-transparent w-full text-ink-charcoal placeholder-ink-caption"
                />
              </div>
              <span className="px-2.5 py-1 text-xs font-bold text-ink-paragraph bg-ink-light rounded-full">
                {filteredSubs.length} {filteredSubs.length === 1 ? "subscription" : "subscriptions"}
              </span>
            </div>

            {subscriptionsLoading ? (
              <LoadingSpinner />
            ) : filteredSubs.length === 0 ? (
              <div className="flex flex-col gap-3 justify-center items-center mt-20 mb-44">
                <Building2 className="w-24 h-24 text-ink-caption" />
                <p className="text-sm font-semibold text-ink-caption">No subscriptions found.</p>
              </div>
            ) : (
              <div className="bg-surface-card border border-ink-light rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink-light bg-ink-offwhite">
                        <th className="text-left px-4 py-2.5 font-semibold text-ink-paragraph text-xs uppercase tracking-wide">Company</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-ink-paragraph text-xs uppercase tracking-wide">Owner</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-ink-paragraph text-xs uppercase tracking-wide">Package</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-ink-paragraph text-xs uppercase tracking-wide">Token Balance</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-ink-paragraph text-xs uppercase tracking-wide whitespace-nowrap">Renews</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubs.map(sub => (
                        <tr key={sub.userId} className="border-b border-ink-light last:border-0 hover:bg-ink-offwhite">
                          <td className="px-4 py-3 font-semibold text-ink align-top whitespace-nowrap">{sub.companyName}</td>
                          <td className="px-4 py-3 text-ink-paragraph align-top whitespace-nowrap">{sub.userId}</td>
                          <td className="px-4 py-3 align-top">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${tierBadge[sub.packageType] || "bg-ink-light text-ink-paragraph"}`}>
                              {sub.packageType || "No Package"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-ink-paragraph align-top whitespace-nowrap">{sub.tokenBalance.toLocaleString()} ₮</td>
                          <td className="px-4 py-3 text-ink-caption align-top whitespace-nowrap">{fmtExpiry(sub.packageExpiry)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {viewFilter === "leads" && (
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-surface-card border border-ink-light rounded-md px-3 py-1.5 flex-1 min-w-[180px] max-w-xs">
              <Search className="w-4 h-4 text-ink-caption flex-shrink-0" />
              <input
                type="text"
                placeholder="Search leads…"
                value={leadsSearchTerm}
                onChange={e => setLeadsSearchTerm(e.target.value)}
                className="border-none outline-none text-sm bg-transparent w-full text-ink-charcoal placeholder-ink-caption"
              />
            </div>
            <span className="px-2.5 py-1 text-xs font-bold text-ink-paragraph bg-ink-light rounded-full">
              {filteredLeads.length} {filteredLeads.length === 1 ? "lead" : "leads"}
            </span>
          </div>

          {leadsLoading ? (
            <LoadingSpinner />
          ) : leadsError ? (
            <ErrorMessage error={leadsError} onRetry={() => setLeadsRefreshKey(k => k + 1)} />
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col gap-3 justify-center items-center mt-20 mb-44">
              <Building2 className="w-24 h-24 text-ink-caption" />
              <p className="text-sm font-semibold text-ink-caption">No leads yet.</p>
            </div>
          ) : (
            <div className="bg-surface-card border border-ink-light rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-light bg-ink-offwhite">
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-paragraph text-xs uppercase tracking-wide">Company</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-paragraph text-xs uppercase tracking-wide">From</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-paragraph text-xs uppercase tracking-wide">Contact</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-paragraph text-xs uppercase tracking-wide">Message</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-paragraph text-xs uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-paragraph text-xs uppercase tracking-wide whitespace-nowrap">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(lead => (
                      <tr key={lead.leadId} className="border-b border-ink-light last:border-0 hover:bg-ink-offwhite">
                        <td className="px-4 py-3 font-semibold text-ink align-top whitespace-nowrap">{lead.companyName || lead.company || "—"}</td>
                        <td className="px-4 py-3 text-ink-paragraph align-top whitespace-nowrap">{`${lead.firstName || ""} ${lead.lastName || ""}`.trim() || "—"}</td>
                        <td className="px-4 py-3 text-ink-paragraph align-top whitespace-nowrap">
                          <div>{lead.email}</div>
                          <div className="text-xs text-ink-caption">{lead.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-ink-paragraph align-top max-w-md">
                          {lead.subject && <div className="font-semibold text-xs text-ink-caption mb-0.5">{lead.subject}</div>}
                          {lead.message}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${lead.viewed ? 'bg-status-success/15 text-status-success' : 'bg-brand-yellow-soft text-brand-gold'}`}>
                            {lead.viewed ? 'Viewed' : 'Unviewed'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-ink-caption align-top whitespace-nowrap">
                          {(lead.submittedAt || lead.createdAt) ? new Date(lead.submittedAt || lead.createdAt || '').toLocaleString('en-IN') : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Horizontal toolbar + content */}
      {viewFilter !== "subscriptions" && viewFilter !== "leads" && (
      <React.Fragment>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-surface-card border border-ink-light rounded-md px-3 py-1.5 flex-1 min-w-[180px] max-w-xs">
          <Search className="w-4 h-4 text-ink-caption flex-shrink-0" />
          <input
            type="text"
            placeholder="Search companies…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border-none outline-none text-sm bg-transparent w-full text-ink-charcoal placeholder-ink-caption"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 border border-ink-light rounded-md text-sm bg-surface-card text-ink-charcoal focus:outline-none focus:border-brand-yellow cursor-pointer"
        >
          <option value="all">All Companies</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-1.5 border border-ink-light rounded-md text-sm bg-surface-card text-ink-charcoal focus:outline-none focus:border-brand-yellow cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#F4F5F7]">
          {/* Recent Companies Section - Updated condition to hide when status filter is not "all" */}
          {!debouncedSearchTerm && statusFilter === "all" && (
            <RecentCompaniesSection
              recentCompanies={recentCompanies}
              onCredentials={handleCredentials}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              onEdit={handleEdit}
              disabled={isMutating}
            />
          )}

          {/* Companies Section */}
          <div className="flex gap-3 items-center mb-6">
            <div className="flex gap-2 items-center">
              <Building2 className="w-5 h-5 text-brand-gold" />
              <h2 className="text-base font-bold text-ink">
                {statusFilter === "all" ? "All Companies" : statusFilter === "under_review" ? "Under Review Companies" : statusFilter === "approved" ? "Approved Companies" : "Rejected Companies"}
              </h2>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold text-ink-paragraph bg-ink-light rounded-full">
              {sortedCompanies.length}{" "}
              {sortedCompanies.length === 1 ? "company" : "companies"}
            </span>
          </div>

          {isFetching ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage error={error} onRetry={handleRetry} />
          ) : sortedCompanies.length === 0 ? (
            <div className="flex flex-col gap-3 justify-center items-center mt-20 mb-44">
              <Building2 className="w-24 h-24 text-ink-caption" />
              <p className="text-sm font-semibold text-ink-caption">
                Oops looks like there is no companies!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 md:gap-6">
                {paginatedCompanies.map((company) => (
                  <div key={company.publishedId} className="animate-fadeIn">
                    <CompanyCard
                      company={company}
                      onCredentials={handleCredentials}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      disabled={isMutating}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8">
                  <button
                    onClick={handlePrevPage}
                    className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-ink-paragraph bg-surface-card border border-ink-light rounded-lg transition-colors hover:bg-ink-offwhite disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage <= 1}
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Previous
                  </button>
                  <span className="mx-4 text-sm text-ink-paragraph">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-ink bg-brand-yellow rounded-lg transition-colors hover:bg-brand-yellow-soft disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </React.Fragment>
      )}

      {/* Credentials Modal */}
      {credentialsModal.isOpen && (
        <CredentialsModal
          isOpen={credentialsModal.isOpen}
          onClose={() =>
            setCredentialsModal({ isOpen: false, data: null, company: null })
          }
          data={credentialsModal.data}
          loading={isMutating}
          onPreview={handlePreview}
          onApprove={handleApprove}
          onReject={handleReject}
          company={credentialsModal.company}
        />
      )}
    </div>
  );
};

export default AdminDashboard;