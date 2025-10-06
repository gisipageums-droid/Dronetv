import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  ArrowRight,
  Star,
  Users,
  Building2,
  Menu,
  X,
  Eye,
  Key,
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "react-toastify";
import CredentialsModal from "./credentialProp/Prop"; // ✅ import the modal component
import { motion, AnimatePresence } from 'motion/react';
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
  industryFilter: string;
  onIndustryChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  industries: string[];
  isMobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
}

interface CompanyCardProps {
  company: Company;
  onCredentials: (publishedId: string) => void;
  onPreview: (publishedId: string) => void;
  onApprove: (publishedId: string) => void;
  onReject: (publishedId: string) => void;
  onDelete: (publishedId: string) => void;
  disabled?: boolean;
}

interface MainContentProps {
  companies: Company[];
  recentCompanies: Company[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  totalCount: number;
  hasMore: boolean;
  onOpenMobileSidebar: () => void;
  onCredentials: (publishedId: string) => void;
  onPreview: (publishedId: string) => void;
  onApprove: (publishedId: string) => void;
  onReject: (publishedId: string) => void;
  searchTerm: string;
  industryFilter: string;
  sortBy: string;
  onClearFilters: () => void;
  onDelete: (publishedId: string) => void;
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
type SortOption = typeof SORT_OPTIONS[number];

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
  const navigate = useNavigate();
  return (
    <div className="h-[40vh] md:h-[60vh] bg-blue-50 flex items-center justify-center px-4 sm:px-6">
      <div className="relative w-full max-w-3xl text-center">
        <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full border border-blue-200 opacity-40 md:-top-20 md:-left-20 md:w-40 md:h-40"></div>
        <div className="absolute -bottom-8 -right-1 w-16 h-16 md:-bottom-16 md:-right-[-5.9rem] md:w-32 md:h-32 bg-blue-200 opacity-30 rounded-2xl"></div>

        <div className="relative z-10">
          <div className="flex gap-2 justify-center items-center mb-4 md:gap-4 md:mb-8">
            <div className="w-2 h-2 bg-blue-400 rounded-full md:w-3 md:h-3"></div>
            <div className="w-4 h-4 border-2 border-blue-400 md:w-6 md:h-6"></div>
            <div className="w-3 h-3 bg-blue-600 rotate-45 md:w-4 md:h-4"></div>
          </div>

          <h1 className="mb-4 text-3xl font-light text-blue-900 md:text-5xl md:mb-6">
            Admin Dashboard
            <span className="block mt-1 text-xl font-extralight text-blue-600 md:text-3xl md:mt-2">
              Company Management
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-xl text-base font-light text-blue-700 md:text-lg md:mb-10">
            Review and manage all company listings, credentials, and approvals.
          </p>

          <div className="flex flex-col gap-4 justify-center items-center sm:flex-row">
            <button
              onClick={() => navigate("/admin/analytics")}
              className="px-6 py-3 w-full text-sm font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg shadow-lg transition-all duration-300 transform md:px-8 md:py-4 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl hover:-translate-y-1 sm:w-auto md:text-base"
            >
              Analytics
            </button>
            <div className="hidden w-px h-8 bg-blue-300 md:h-12 sm:block"></div>
            <button className="mt-2 text-sm text-blue-700 transition-colors duration-300 hover:text-blue-900 md:text-base sm:mt-0">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- Dropdown --------------------
const MinimalisticDropdown: React.FC<DropdownProps> = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center px-4 py-3 w-full text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-200 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-300"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value === options[0] ? "text-gray-500" : "text-gray-900"}>
          {value || options[0] || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-sm" role="listbox">
          {options.map((option: string, idx: number) => (
            <button
              key={idx}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${value === option ? "bg-gray-50 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
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
  industryFilter,
  onIndustryChange,
  sortBy,
  onSortChange,
  industries,
  isMobileSidebarOpen,
  onCloseMobileSidebar,
}) => {
  const sortOptions: string[] = ["Sort by Date", ...SORT_OPTIONS.filter((s) => s !== "Sort by Date")];

  return (
    <div
      className={`bg-blue-50 p-4 md:p-8 h-fit md:sticky md:top-0 border-r border-gray-100 ${isMobileSidebarOpen ? "overflow-y-auto fixed inset-0 z-50 w-full" : "hidden md:block md:w-80"
        }`}
    >
      {isMobileSidebarOpen && (
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onCloseMobileSidebar} className="p-2" aria-label="Close filters">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="space-y-6 md:space-y-8">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
              className="py-3 pr-4 pl-10 w-full text-sm bg-gray-50 rounded-lg border border-gray-200 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
              aria-label="Search companies"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">Sector</label>
          <MinimalisticDropdown value={industryFilter} onChange={onIndustryChange} options={industries} placeholder="Select sector" />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">Sort by</label>
          <MinimalisticDropdown key={`sort-${sortBy}`} value={sortBy} onChange={onSortChange} options={sortOptions} placeholder="Sort options" />
        </div>

        <button
          onClick={() => {
            onSearchChange("");
            onIndustryChange("All Sectors");
            onSortChange("Sort by Date");
          }}
          className="text-sm text-gray-500 underline transition-colors hover:text-gray-700 underline-offset-2"
        >
          Clear all filters
        </button>

        <div className="border-t border-gray-100"></div>
          <motion.button
            whileTap={{scale:[0.9,1]}}
            className="bg-blue-300 p-2 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 duration-200">
            <Link to={'/admin/professional'} >Professionals </Link>

            </motion.button>
      </div>
    </div>
  );
};

// -------------------- CompanyCard --------------------
const CompanyCard: React.FC<CompanyCardProps & { disabled?: boolean }> = ({
  company,
  onCredentials,
  onPreview,
  onApprove,
  onReject,
  onDelete,
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
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Date not available";
    }
  };

  const getStatusBadge = (reviewStatus?: string) => {
    if (reviewStatus === "active") return { bg: "bg-yellow-100", text: "text-yellow-800", label: "Needs Review" };
    if (reviewStatus === "rejected") return { bg: "bg-red-100", text: "text-red-800", label: "Rejected" };
    if (reviewStatus === "approved") return { bg: "bg-green-100", text: "text-green-800", label: "Approved" };
    return { bg: "bg-gray-50", text: "text-gray-700", label: "Unknown" };
  };

  const statusStyle = getStatusBadge(company.reviewStatus);

  return (
    <div className="overflow-hidden w-full h-full rounded-2xl border-l-8 shadow-lg transition-all duration-300 hover:shadow-xl group">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex gap-3 items-center md:gap-4">
            <div className="flex overflow-hidden justify-center items-center p-1 w-12 h-12 bg-white rounded-xl shadow-md md:w-14 md:h-14 lg:w-16 lg:h-16">
              <img
                src={company.previewImage || placeholderImg}
                alt={`${company.companyName} logo`}
                className="object-contain w-full h-full"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  if (t.src !== placeholderImg) t.src = placeholderImg;
                }}
                loading="lazy"
              />
            </div>
            <div className="max-w-[calc(100%-60px)] md:max-w-none">
              <h3 className="text-lg font-bold text-gray-900 md:text-xl line-clamp-2">{company.companyName || "Unnamed Company"}</h3>
              <div className="flex items-center mt-1 text-gray-600">
                <MapPin className="mr-1 w-3 h-3" />
                <span className="text-xs md:text-sm">{company.location || "Location not specified"}</span>
              </div>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <div className={`inline-flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium`}>
              <Building2 className="w-3 h-3" />
              {statusStyle.label}
            </div>
          </div>
        </div>

        <div className="mb-4 md:mb-6">
          <div className="flex flex-wrap gap-1 md:gap-2">
            {(company.sectors && company.sectors.length > 0 ? company.sectors : ["General"]).map((sector: string, index: number) => (
              <span key={index} className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full md:px-3 md:py-1">
                {sector}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center md:gap-6">
            <div className="flex gap-2 items-center px-3 py-1 bg-gray-50 rounded-lg md:px-4 md:py-2">
              <span className="text-xs font-bold text-purple-600 md:text-sm">{formatDate(company.publishedDate)}</span>
              <span className="hidden text-xs text-gray-600 md:block">Published</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview(company.publishedId);
              }}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200 md:text-sm"
              aria-label={`Preview ${company.companyName}`}
              disabled={disabled}
            >
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              Preview
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onCredentials(company.publishedId);
              }}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-purple-700 bg-purple-100 rounded-lg transition-colors hover:bg-purple-200 md:text-sm"
              aria-label={`Credentials ${company.companyName}`}
              disabled={disabled}
            >
              <Key className="w-3 h-3 md:w-4 md:h-4" />
              Credentials
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onApprove(company.publishedId);
              }}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-green-700 bg-green-100 rounded-lg transition-colors hover:bg-green-200 md:text-sm"
              aria-label={`Approve ${company.companyName}`}
              disabled={disabled}
            >
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
              Approve
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onReject(company.publishedId);
              }}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-red-700 bg-red-100 rounded-lg transition-colors hover:bg-red-200 md:text-sm"
              aria-label={`Reject ${company.companyName}`}
              disabled={disabled}
            >
              <XCircle className="w-3 h-3 md:w-4 md:h-4" />
              Reject
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(company.publishedId);
              }}
              className="flex col-span-2 gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600 md:text-sm"
              aria-label={`Delete ${company.companyName}`}
              disabled={disabled}
            >
              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-gray-100 md:mt-4 md:pt-4">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="mr-2 truncate">ID: {company.publishedId || "No ID"}</span>
            <span>v{company.version}</span>
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
    <button onClick={onRetry} className="px-6 py-3 font-semibold text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600">
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

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error rejecting company:", error);
      throw error;
    }
  },

  async fetchPublishedDetails(publishedId: string, userId: string): Promise<any> {
    try {
      const response = await fetch(
        `https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards/published-details/${publishedId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", "X-User-Id": userId },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching published details:", error);
      throw error;
    }
  },

  async deleteCompany(publishedId: string): Promise<any> {
    try {
      const response = await fetch("https://twd6yfrd25.execute-api.ap-south-1.amazonaws.com/prod/admin/templates/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ publishedId, action: "delete" }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
  onPreview: (publishedId: string) => void;
  onApprove: (publishedId: string) => void;
  onReject: (publishedId: string) => void;
  onDelete: (publishedId: string) => void;
  disabled?: boolean;
}> = ({ recentCompanies, onCredentials, onPreview, onApprove, onReject, onDelete, disabled }) => {
  if (recentCompanies.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex gap-3 items-center mb-6">
        <div className="flex gap-2 items-center">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
            Recent Companies
          </h2>
        </div>
        <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
          Last 7 days
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {recentCompanies.map((company) => (
          <div key={company.publishedId} className="animate-fadeIn">
            <CompanyCard
              company={company}
              onCredentials={onCredentials}
              onPreview={onPreview}
              onApprove={onApprove}
              onReject={onReject}
              onDelete={onDelete}
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-200"></div>
    </div>
  );
};

// -------------------- Main Component --------------------
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // data state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // loading states
  const [isFetching, setIsFetching] = useState<boolean>(true); // initial fetch
  const [isMutating, setIsMutating] = useState<boolean>(false); // approve/reject/delete
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [industryFilter, setIndustryFilter] = useState<string>("All Sectors");
  const [sortBy, setSortBy] = useState<string>("Sort by Date");
  const [currentPage] = useState<number>(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [credentialsModal, setCredentialsModal] = useState<{ isOpen: boolean; data: any }>({ isOpen: false, data: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; publishedId: string | null }>({
    isOpen: false,
    publishedId: null,
  });

  // -------------------- Recent Companies Logic --------------------
  const recentCompanies = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return companies.filter(company => {
      if (!company.createdAt) return false;
      const createdAt = new Date(company.createdAt);
      return createdAt >= sevenDaysAgo;
    }).slice(0, 6); // Show max 6 recent companies
  }, [companies]);

  // -------------------- Fetch Companies (with AbortController) --------------------
  const fetchCompanies = async (signal?: AbortSignal) => {
    try {
      setIsFetching(true);
      setError(null);
      const data = await apiService.fetchAllCompanies(signal);

      // --- ENSURE: sort by publishedDate (newest first) immediately after fetch ---
      const cards: Company[] = (data.cards || []).slice();
      cards.sort((a, b) => {
        const ta = new Date(a.publishedDate || 0).getTime();
        const tb = new Date(b.publishedDate || 0).getTime();
        return tb - ta; // newest first (descending)
      });

      setCompanies(cards);
      setTotalCount(data.totalCount || 0);
      setHasMore(data.hasTemplates || false);
    } catch (err) {
      if ((err as any)?.name === "AbortError") return;
      console.error("Error in fetchCompanies:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch companies");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    // Force default sort to "Sort by Date" on first mount (so UI shows Date)
    setSortBy("Sort by Date");

    const controller = new AbortController();
    fetchCompanies(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------- Derived lists (useMemo) --------------------
  const industries = useMemo(() => {
    return ["All Sectors", ...Array.from(new Set(companies.flatMap((c) => c.sectors || []))).sort()];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    const q = (debouncedSearchTerm || "").trim().toLowerCase();
    return companies.filter((company) => {
      const matchesSearch =
        !q ||
        (company.companyName && company.companyName.toLowerCase().includes(q)) ||
        (company.location && company.location.toLowerCase().includes(q)) ||
        (company.sectors && company.sectors.some((sector) => sector.toLowerCase().includes(q)));

      const matchesSector = industryFilter === "All Sectors" || (company.sectors && company.sectors.includes(industryFilter));
      return matchesSearch && matchesSector;
    });
  }, [companies, debouncedSearchTerm, industryFilter]);

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
        return arr.sort((a, b) => (a.location || "").localeCompare(b.location || ""));
      case "Sort by Date":
        // publishedDate descending (newest first)
        return arr.sort((a, b) => new Date(b.publishedDate || 0).getTime() - new Date(a.publishedDate || 0).getTime());
      case "Sort by Sector":
        return arr.sort((a, b) => ((a.sectors?.[0] || "").localeCompare(b.sectors?.[0] || "")));
      case "Sort by Latest":
      default:
        // most recent activity across fields
        return arr.sort((a, b) => getMostRecentDate(b) - getMostRecentDate(a));
    }
  }, [filteredCompanies, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedCompanies.length / 12));

  // -------------------- Handlers (mutations with isMutating) --------------------
  const handleCredentials = async (publishedId: string) => {
    try {
      const company = companies.find((c) => c.publishedId === publishedId);
      if (!company) {
        toast.error("Company not found");
        return;
      }
      setIsMutating(true);
      const credentials = await apiService.fetchCompanyCredentials(publishedId);
      setCredentialsModal({ isOpen: true, data: credentials });
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
      const details = await apiService.fetchPublishedDetails(publishedId, company.userId);
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

  const handleApprove = async (publishedId: string) => {
    if (!window.confirm("Approve this company?")) return;
    try {
      setIsMutating(true);
      // optimistic update
      setCompanies((prev) => prev.map((c) => (c.publishedId === publishedId ? { ...c, isApproved: true, reviewStatus: "approved" } : c)));
      const result = await apiService.approveCompany(publishedId, "approve");
      if (result?.status === "approved" || result?.status === "success") {
        toast.success("Company approved successfully");
        await fetchCompanies();
      } else {
        toast.error("Failed to approve company");
        await fetchCompanies();
      }
    } catch (err) {
      console.error("Error approving company:", err);
      toast.error("Failed to approve company");
      await fetchCompanies();
    } finally {
      setIsMutating(false);
    }
  };

  const handleReject = async (publishedId: string) => {
    if (!window.confirm("Reject this company?")) return;
    try {
      setIsMutating(true);
      setCompanies((prev) => prev.map((c) => (c.publishedId === publishedId ? { ...c, isApproved: false, reviewStatus: "rejected" } : c)));
      const result = await apiService.rejectCompany(publishedId, "reject");
      if (result?.status === "rejected" || result?.status === "success") {
        toast.success("Company rejected successfully");
        await fetchCompanies();
      } else {
        toast.error("Failed to reject company");
        await fetchCompanies();
      }
    } catch (err) {
      console.error("Error rejecting company:", err);
      toast.error("Failed to reject company");
      await fetchCompanies();
    } finally {
      setIsMutating(false);
    }
  };

  // Replace handleDelete with modal logic
  const handleDelete = async (publishedId: string) => {
    setDeleteModal({ isOpen: true, publishedId });
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (!deleteModal.publishedId) return;
    try {
      setIsMutating(true);
      const result = await apiService.deleteCompany(deleteModal.publishedId);
      toast(result.message);
      await fetchCompanies();
    } catch (err) {
      console.error("Error deleting company:", err);
      toast.error("Failed to delete company");
      await fetchCompanies();
    } finally {
      setIsMutating(false);
      setDeleteModal({ isOpen: false, publishedId: null });
    }
  };

  const handleRetry = () => {
    fetchCompanies();
  };

  // -------------------- Render --------------------
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <motion.div
            className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteModal({ isOpen: false, publishedId: null })}
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
                  <Trash2 className="text-red-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Confirm Deletion
                  </h3>
                </div>
                <button
                  onClick={() => setDeleteModal({ isOpen: false, publishedId: null })}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              {/* Modal Body */}
              <div className="mb-6">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg mb-4">
                  <AlertCircle
                    size={18}
                    className="text-red-600 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-red-800">
                    This action cannot be undone. All data for this company will be permanently deleted.
                  </p>
                </div>
                <p className="text-gray-600">
                  Are you sure you want to delete this company?
                </p>
              </div>
              {/* Modal Footer */}
              <div className="flex gap-3 justify-end">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setDeleteModal({ isOpen: false, publishedId: null })}
                  className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-200 transition-colors"
                  disabled={isMutating}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md"
                  disabled={isMutating}
                >
                  Confirm & Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sidebar toggle */}
      <div className="flex sticky top-0 z-40 justify-between items-center p-4 bg-white border-b border-gray-200 md:hidden">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-lg border border-gray-200"
          aria-label="Open filters"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {totalCount} {totalCount === 1 ? "company" : "companies"}
        </span>
      </div>

      {/* Main layout */}
      <div className="flex">
        <Sidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          industryFilter={industryFilter}
          onIndustryChange={setIndustryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          industries={industries}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        <div className="flex-1 p-4 md:p-8">
          {/* Recent Companies Section */}
          <RecentCompaniesSection
            recentCompanies={recentCompanies}
            onCredentials={handleCredentials}
            onPreview={handlePreview}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            disabled={isMutating}
          />

          {/* All Companies Section */}
          <div className="flex gap-3 items-center mb-6">
            <div className="flex gap-2 items-center">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                All Companies
              </h2>
            </div>
            <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
              {sortedCompanies.length} {sortedCompanies.length === 1 ? "company" : "companies"}
            </span>
          </div>

          {isFetching ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage error={error} onRetry={handleRetry} />
          ) : sortedCompanies.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-4 text-6xl">🏢</div>
              <p className="mb-2 text-xl text-gray-600">No companies found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {sortedCompanies.map((company) => (
                <div key={company.publishedId} className="animate-fadeIn">
                  <CompanyCard
                    company={company}
                    onCredentials={handleCredentials}
                    onPreview={handlePreview}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                    disabled={isMutating}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8">
              <button
                className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage <= 1}
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Previous
              </button>
              <span className="mx-4 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage >= totalPages}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Credentials Modal */}
      {credentialsModal.isOpen && (
        <CredentialsModal
          isOpen={credentialsModal.isOpen}
          onClose={() => setCredentialsModal({ isOpen: false, data: null })}
          data={credentialsModal.data}
        />
      )}
    </div>
  );
};

export default AdminDashboard;