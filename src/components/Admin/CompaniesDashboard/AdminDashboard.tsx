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
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import CredentialsModal from "./credentialProp/Prop"; // ✅ import the modal component
import { motion, AnimatePresence } from "motion/react";

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
    <div className="relative h-[40vh] bg-amber-50 flex items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative w-full max-w-3xl text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 text-3xl font-extrabold text-yellow-900 md:text-5xl md:mb-6 tracking-tight">
            Admin Dashboard
            <span className="block mt-2 text-transparent bg-clip-text bg-amber-600 ">
              Company Management
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base font-medium text-yellow-800/80 md:text-lg leading-relaxed">
            Review and manage all company listings, credentials, and approvals with ease.
          </p>
        </motion.div>
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
        className="flex justify-between items-center px-4 py-3 w-full text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-200 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-300"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={value === options[0] ? "text-gray-500" : "text-gray-900"}
        >
          {value || options[0] || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-sm"
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
                  ? "bg-gray-50 text-gray-900 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
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
    { value: "all", label: "All Companies", color: "text-yellow-900" },
    { value: "under_review", label: "Under Review", color: "text-yellow-600" },
    { value: "approved", label: "Approved", color: "text-green-600" },
    { value: "rejected", label: "Rejected", color: "text-red-600" },
  ];

  return (
    <div
      className={`bg-white/40 backdrop-blur-xl border-r border-yellow-200/50 p-4 md:p-8 h-fit md:sticky md:top-0 
      ${
        isMobileSidebarOpen
          ? "fixed inset-0 z-50 w-full overflow-y-auto bg-orange-50"
          : "hidden md:block md:w-80"
      }`}
    >
      {isMobileSidebarOpen && (
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-xl font-bold text-yellow-900">Filters</h2>
          <button
            onClick={onCloseMobileSidebar}
            className="p-2 text-yellow-800"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="space-y-6 md:space-y-8">
        {/* Status Filter Section - Updated to match EventAdminDashboard */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-yellow-900 block">
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
                      ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                      : option.value === "approved"
                      ? "bg-green-100 border-green-300 text-green-800"
                      : option.value === "rejected"
                      ? "bg-red-100 border-red-300 text-red-800"
                      : "bg-gray-100 border-gray-300 text-gray-800"
                    : "bg-white/50 border-yellow-200/50 hover:bg-gray-50 text-gray-700"
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
          <label className="text-sm font-medium text-yellow-900 block">
            Search Companies
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-600" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              className="w-full pl-10 pr-4 py-3 text-sm border border-yellow-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 bg-white/50 transition-colors placeholder-yellow-700/50 text-yellow-900"
              aria-label="Search companies"
            />
          </div>
        </div>

        {/* Sort Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-yellow-900 block">
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
          className="text-sm text-yellow-700 hover:text-yellow-900 transition-colors underline underline-offset-2"
        >
          Clear all filters
        </button>

        {/* Divider */}
        <div className="border-t border-yellow-200/50"></div>

        {/* Navigation Links */}
        <div className="flex gap-2 flex-col mt-6">
          <motion.button
            whileTap={{ scale: [0.9, 1] }}
            className="bg-yellow-400/30 text-yellow-900 p-3 rounded-xl shadow-sm hover:shadow-md hover:bg-yellow-400/50 duration-200 flex items-center gap-3 backdrop-blur-sm border border-yellow-200/50"
          >
            <Link
              to={"/admin/professional/dashboard"}
              className="w-full text-left"
            >
              Professionals{" "}
            </Link>
          </motion.button>
          <motion.button
            whileTap={{ scale: [0.9, 1] }}
            className="bg-yellow-400/30 text-yellow-900 p-3 rounded-xl shadow-sm hover:shadow-md hover:bg-yellow-400/50 duration-200 flex items-center gap-3 backdrop-blur-sm border border-yellow-200/50"
          >
            <Link to={"/admin/event/dashboard"} className="w-full text-left">
              Events{" "}
            </Link>
          </motion.button>
          <motion.button
            whileTap={{ scale: [0.9, 1] }}
            className="bg-yellow-400/30 text-yellow-900 p-3 rounded-xl shadow-sm hover:shadow-md hover:bg-yellow-400/50 duration-200 flex items-center gap-3 backdrop-blur-sm border border-yellow-200/50"
          >
            <Link to={"/admin/plans"} className="w-full text-left">
              Admin Plans{" "}
            </Link>
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
          className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {icon}
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mb-6">
              <p className="text-gray-600">{message}</p>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 justify-end">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
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
    if (reviewStatus === "active" || reviewStatus === "under_review")
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Needs Review",
      };
    if (reviewStatus === "rejected")
      return { bg: "bg-red-100", text: "text-red-800", label: "Rejected" };
    if (reviewStatus === "approved")
      return { bg: "bg-green-100", text: "text-green-800", label: "Approved" };
    return { bg: "bg-gray-50", text: "text-gray-700", label: "Unknown" };
  };

  const statusStyle = getStatusBadge(company.reviewStatus);

  return (
    <div className="overflow-hidden w-full h-auto rounded-2xl border-l-4 sm:border-l-8 shadow-lg transition-all duration-300 hover:shadow-xl group border-gradient-to-b from-amber-500 to-yellow-600 bg-white">
      <div className="p-4 sm:p-5 md:p-6 lg:p-8">
        {/* Header: stacks on small screens, row on >=sm */}
        <div className="grid grid-cols-1 sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 gap-3 sm:gap-0">
          <div className="flex gap-3 items-start sm:items-center min-w-0">
            {/* Logo */}
            <div className="flex flex-shrink-0 overflow-hidden justify-center items-center p-1 w-12 h-12 bg-white rounded-xl shadow-md sm:w-14 sm:h-14 md:w-16 md:h-16 group-hover:shadow-lg group-hover:bg-gradient-to-br group-hover:from-amber-50 group-hover:to-yellow-50 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
              <img
                src={company.previewImage || placeholderImg}
                alt={`${company.companyName || "Company"} logo`}
                className="object-cover rounded-lg w-full h-full transition-all duration-500 group-hover:rotate-[-3deg] group-hover:scale-110"
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
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900  line-clamp-2">
                {company.companyName || "Unnamed Company"}
              </h3>

              <div className="flex items-center mt-1 text-gray-600 text-xs sm:text-sm">
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
                className="px-2 py-1 text-xs sm:text-sm font-medium text-amber-800 bg-amber-100 rounded-full"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>

        {/* Info + Buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2 items-center px-3 py-1 bg-gray-50 rounded-lg">
              <span className="text-xs sm:text-sm font-bold text-amber-600">
                {formatDate(displayDateValue)}
              </span>
              <span className="hidden sm:inline text-xs text-gray-600">
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
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs sm:text-sm font-medium text-purple-700 bg-purple-100 rounded-lg transition-colors hover:bg-purple-200 disabled:opacity-50 disabled:pointer-events-none"
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
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs sm:text-sm font-medium text-amber-700 bg-amber-100 rounded-lg transition-colors hover:bg-amber-200 disabled:opacity-50 disabled:pointer-events-none"
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
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs sm:text-sm font-medium text-green-700 bg-green-100 rounded-lg transition-colors hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs sm:text-sm font-medium text-red-700 bg-red-100 rounded-lg transition-colors hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex col-span-1 sm:col-span-2 gap-2 justify-center items-center px-3 py-2 text-xs sm:text-sm font-medium text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
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
    <div className="w-12 h-12 rounded-full border-b-2 border-purple-600 animate-spin" />
    <span className="ml-4 text-gray-600">Loading companies...</span>
  </div>
);

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => (
  <div className="py-16 text-center">
    <div className="mb-4 text-6xl">⚠</div>
    <p className="mb-2 text-xl text-red-600">Error loading companies</p>
    <p className="mb-4 text-gray-500">{error}</p>
    <button
      onClick={onRetry}
      className="px-6 py-3 font-semibold text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600"
    >
      Try Again
    </button>
  </div>
);

// -------------------- API Service --------------------
const apiService = {
  async fetchAllCompanies(signal?: AbortSignal): Promise<ApiResponse> {
    try {
      const response = await fetch(
        "https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards?viewType=admin",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched companies data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  },

  async fetchCompanyCredentials(publishedId: string): Promise<any> {
    try {
      const response = await fetch(
        `https://xe9l3knwqi.execute-api.ap-south-1.amazonaws.com/prod/admin/form-details/${publishedId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching company credentials:", error);
      throw error;
    }
  },

  async approveCompany(publishedId: string, action: string): Promise<any> {
    try {
      const body = JSON.stringify({ publishedId, action });
      const response = await fetch(
        `https://twd6yfrd25.execute-api.ap-south-1.amazonaws.com/prod/admin/templates/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error approving company:", error);
      throw error;
    }
  },

  async rejectCompany(publishedId: string, action: string): Promise<any> {
    try {
      const body = JSON.stringify({ publishedId, action });
      const response = await fetch(
        `https://twd6yfrd25.execute-api.ap-south-1.amazonaws.com/prod/admin/templates/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error rejecting company:", error);
      throw error;
    }
  },

  async fetchPublishedDetails(
    publishedId: string,
    userId: string
  ): Promise<any> {
    try {
      const response = await fetch(
        `https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards/published-details/${publishedId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", "X-User-Id": userId },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("data", data);
      return data;
    } catch (error) {
      console.error("Error fetching published details:", error);
      throw error;
    }
  },

  async deleteCompany(publishedId: string): Promise<any> {
    try {
      const response = await fetch(
        "https://twd6yfrd25.execute-api.ap-south-1.amazonaws.com/prod/admin/templates/delete",
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
      console.error("Error deleting company:", error);
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
            <Clock className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-yellow-900 md:text-2xl">
              Recent Companies
            </h2>
          </div>
          <span className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-full">
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

        <div className="mt-6 border-t border-yellow-200/50"></div>
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
  const [statusFilter, setStatusFilter] = useState<string>("all"); // Changed from "All Statuses"
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

      const cards: Company[] = (data.cards || []).slice();
      cards.sort((a, b) => {
        const ta = new Date(getPrimaryDate(a) || 0).getTime();
        const tb = new Date(getPrimaryDate(b) || 0).getTime();
        return tb - ta; // newest first
      });

      setCompanies(cards);
      setTotalCount(data.totalCount || 0);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.error("Error in fetchCompanies:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch companies"
      );
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    // default sort on mount
    setSortBy("Sort by Date");
    setStatusFilter("all");
    const controller = new AbortController();
    fetchCompanies(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
         (company.reviewStatus === "active" || company.reviewStatus === "under_review")) ||
        (statusFilter === "approved" && company.reviewStatus === "approved") ||
        (statusFilter === "rejected" && company.reviewStatus === "rejected");

      return matchesSearch && matchesStatus;
    });
  }, [companies, debouncedSearchTerm, statusFilter]);

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
      console.error(`Error performing ${type} action:`, err);
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
      const credentials = await apiService.fetchCompanyCredentials(publishedId);
      setCredentialsModal({ isOpen: true, data: credentials, company });
    } catch (err) {
      console.error("Error fetching company credentials:", err);
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
      console.error("Error loading template for preview:", err);
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
          confirmColor: "bg-amber-600 hover:bg-amber-700",
          icon: <Edit className="text-amber-600" size={24} />,
        };
      case "approve":
        return {
          title: "Confirm Approval",
          message: `Are you sure you want to approve "${companyName}"? This will make the company visible to users.`,
          confirmText: "Approve Company",
          confirmColor: "bg-green-600 hover:bg-green-700",
          icon: <CheckCircle className="text-green-600" size={24} />,
        };
      case "reject":
        return {
          title: "Confirm Rejection",
          message: `Are you sure you want to reject "${companyName}"? This will mark the company as rejected.`,
          confirmText: "Reject Company",
          confirmColor: "bg-red-600 hover:bg-red-700",
          icon: <XCircle className="text-red-600" size={24} />,
        };
      case "delete":
        return {
          title: "Confirm Deletion",
          message: `Are you sure you want to delete "${companyName}"? This action cannot be undone and all company data will be permanently removed.`,
          confirmText: "Delete Company",
          confirmColor: "bg-red-600 hover:bg-red-700",
          icon: <Trash2 className="text-red-600" size={24} />,
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to perform this action?",
          confirmText: "Confirm",
          confirmColor: "bg-blue-600 hover:bg-blue-700",
          icon: <AlertCircle className="text-blue-600" size={24} />,
        };
    }
  };

  const modalConfig = getModalConfig();

  // -------------------- Render --------------------
  return (
    <div className="w-full min-h-screen h-full bg-orange-50">
      <Header />

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

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="p-3 rounded-full border border-gray-200 bg-yellow-500 text-white relative left-5 hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300 duration-200 md:hidden"
        aria-label="Open filters"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main layout */}
      <div className="flex">
        <Sidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <div className="flex-1 p-4 md:p-8 bg-orange-50">
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

          {/* All Companies Section */}
          <div className="flex gap-3 items-center mb-6">
            <div className="flex gap-2 items-center">
              <Building2 className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-bold text-yellow-900 md:text-2xl">
                {statusFilter === "all" ? "All Companies" : statusFilter === "under_review" ? "Under Review Companies" : statusFilter === "approved" ? "Approved Companies" : "Rejected Companies"}
              </h2>
            </div>
            <span className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-full">
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
              <Building2 className="w-24 h-24 text-gray-400" />
              <p className="text-sm font-semibold text-gray-400">
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
                    className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-lg transition-colors hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage <= 1}
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Previous
                  </button>
                  <span className="mx-4 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>

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