import {
  CheckCircle,
  ChevronDown,
  Eye,
  FileText,
  MapPin,
  Menu,
  Search,
  Trash2,
  User,
  X,
  XCircle,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProfessionalCredentialsModal from "./ProfessionalCredentialsModal";
import { motion, AnimatePresence } from "motion/react";

// TypeScript Interfaces for Professionals
interface Professional {
  professionalId: string;
  userId: string;
  submissionId: string;
  professionalName: string;
  fullName: string;
  professionalDescription: string;
  location: string;
  categories: string[];
  skillsCount: number;
  servicesCount: number;
  reviewStatus: string;
  templateSelection: string;
  status: boolean;
  lastModified: string;
  createdAt: string;
  publishedDate: string;
  urlSlug: string;
  previewImage: string;
  heroImage: string;
  adminNotes: string;
  version: number;
  hasEdits: boolean;
  completionPercentage: number;
  hasCustomImages: boolean;
  lastActivity: string;
  canEdit: boolean;
  canResubmit: boolean;
  isVisible: boolean;
  isApproved: boolean;
  dashboardType: string;
  needsAdminAction: boolean;
  cleanUrl: string;
}

interface ApiResponse {
  success: boolean;
  cards: Professional[];
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
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  categories: string[];
  isMobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
}

interface ProfessionalCardProps {
  professional: Professional;
  onCredentials: (professionalId: string) => void;
  onPreview: (professionalId: string) => void;
  onApprove: (professionalId: string) => void;
  onReject: (professionalId: string) => void;
  onDelete: (professionalId: string) => void;
  disabled?: boolean;
}

interface MainContentProps {
  professionals: Professional[];
  recentProfessionals: Professional[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  totalCount: number;
  hasMore: boolean;
  onOpenMobileSidebar: () => void;
  onCredentials: (professionalId: string) => void;
  onPreview: (professionalId: string) => void;
  onApprove: (professionalId: string) => void;
  onReject: (professionalId: string) => void;
  searchTerm: string;
  categoryFilter: string;
  sortBy: string;
  onClearFilters: () => void;
  onDelete: (professionalId: string) => void;
  isMutating?: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

interface ErrorMessageProps {
  error: string;
  onRetry: () => void;
}

// Header Component
const Header: React.FC = () => {
  return (
    <div className="h-[40vh] md:h-[60vh] bg-blue-50 flex items-center justify-center px-4 sm:px-6">
      <div className="text-center max-w-3xl relative w-full">
        {/* Geometric Elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 md:-top-20 md:-left-20 md:w-40 md:h-40 border border-blue-200 rounded-full opacity-40"></div>
        <div className="absolute -bottom-8 -right-1 w-16 h-16 md:-bottom-16 md:-right-[-5.9rem] md:w-32 md:h-32 bg-blue-200 opacity-30 rounded-2xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-8">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-400 rounded-full"></div>
            <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-blue-400"></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-600 rotate-45"></div>
          </div>

          <h1 className="text-3xl md:text-5xl font-light text-blue-900 mb-4 md:mb-6">
            Admin Dashboard
            <span className="block text-xl md:text-3xl font-extralight text-blue-600 mt-1 md:mt-2">
              Professional Management
            </span>
          </h1>

          <p className="text-base md:text-lg text-blue-700 mb-6 md:mb-10 max-w-xl mx-auto font-light">
            Review and manage all professional profiles, credentials, and
            approvals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-px h-8 md:h-12 bg-blue-300 hidden sm:block"></div>
            <button className="text-blue-700 hover:text-blue-900 transition-colors duration-300 text-sm md:text-base sm:mt-0 mt-2">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Dropdown Filter Component */
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
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300"
      >
        <span
          className={value === options[0] ? "text-gray-500" : "text-gray-900"}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-sm z-10">
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
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* Sidebar Filters Component */
const Sidebar: React.FC<SidebarProps> = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories,
  isMobileSidebarOpen,
  onCloseMobileSidebar,
}) => {
  const sortOptions: string[] = [
    "Sort by Name",
    "Sort by Location",
    "Sort by Date",
    "Sort by Category",
  ];

  return (
    <div
      className={`bg-blue-50 p-4 md:p-8 h-fit md:sticky md:top-0 border-r border-gray-100 
      ${
        isMobileSidebarOpen
          ? "fixed inset-0 z-50 w-full overflow-y-auto"
          : "hidden md:block md:w-80"
      }`}
    >
      {isMobileSidebarOpen && (
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onCloseMobileSidebar} className="p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="space-y-6 md:space-y-8">
        {/* Search Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-900 block">
            Search Professionals
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, location..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-gray-50 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-900 block">
            Category
          </label>
          <MinimalisticDropdown
            value={categoryFilter}
            onChange={onCategoryChange}
            options={categories}
            placeholder="Select category"
          />
        </div>

        {/* Sort Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-900 block">
            Sort by
          </label>
          <MinimalisticDropdown
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
            onCategoryChange("All Categories");
            onSortChange("Sort by Name");
          }}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline underline-offset-2"
        >
          Clear all filters
        </button>

        {/* Divider */}
        <div className="border-t border-gray-100"></div>
      </div>
      <div className="flex gap-2 flex-col">

      <motion.button
        whileTap={{ scale: [0.9, 1] }}
        className="bg-blue-300 p-2 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 duration-200"
        >
        <Link to={"/admin/company/dashboard"}>Companies </Link>
      </motion.button>
      <motion.button
        whileTap={{ scale: [0.9, 1] }}
        className="bg-blue-300 p-2 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 duration-200"
        >
        <Link to={"/admin/event/dashboard"}>Events </Link>
      </motion.button>
      <motion.button
        whileTap={{ scale: [0.9, 1] }}
        className="bg-blue-300 p-2 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 duration-200"
        >
        <Link to={"/admin/plans"}>Admin Plans </Link>
      </motion.button>
        </div>
    </div>
  );
};

// Professional Card Component
const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  onCredentials,
  onPreview,
  onApprove,
  onReject,
  onDelete,
  disabled = false,
}) => {
  // Create a placeholder image using professional name
  const placeholderImg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6' rx='8'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='%23374151' font-size='20' font-family='Arial' font-weight='bold'%3E${
    professional.professionalName?.charAt(0) || "P"
  }%3C/text%3E%3C/svg%3E`;

  let navigate = useNavigate();

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Date not available";
    }
  };

  // Status badge styling based on status
  const getStatusBadge = (reviewStatus: string) => {
    if (reviewStatus === "active") {
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Needs Review",
      };
    } else if (reviewStatus === "rejected") {
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Rejected",
      };
    } else if (reviewStatus === "approved") {
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved",
      };
    }
    return {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: "Draft",
    };
  };

  const statusStyle = getStatusBadge(professional.reviewStatus || "draft");

  return (
    <div className="w-full h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-8 border-gradient-to-b from-blue-500 to-purple-600 group">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden shadow-md bg-white p-1 md:p-2 flex items-center justify-center group-hover:shadow-lg group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
              <img
                src={professional.previewImage || placeholderImg}
                alt={`${professional.professionalName} profile`}
                className="w-full h-full object-cover transition-all duration-500 group-hover:rotate-[-3deg] group-hover:scale-110"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.target as HTMLImageElement;
                  target.src = placeholderImg;
                }}
              />
            </div>
            <div className="max-w-[calc(100%-60px)] md:max-w-none">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-2">
                {professional.professionalName || "Unnamed Professional"}
              </h3>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="text-xs md:text-sm">
                  {professional.location || "Location not specified"}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div
              className={`inline-flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium`}
            >
              <User className="w-3 h-3" />
              {statusStyle.label}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-wrap gap-1 md:gap-2">
            {(professional.categories && professional.categories.length > 0
              ? professional.categories
              : ["General"]
            ).map((category: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 md:px-3 md:py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Stats and Actions Row */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1 md:px-4 md:py-2">
              <span className="font-bold text-purple-600 text-xs md:text-sm">
                {professional.publishedDate
                  ? formatDate(professional.publishedDate)
                  : "Not published"}
              </span>
              <span className="text-xs text-gray-600 hidden md:block">
                Created
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                // onPreview(professional.professionalId);
                if (professional.templateSelection === "template-1") {
                  navigate(
                    `/user/professionals/edit/1/${professional.professionalId}/${professional.userId}`
                  );
                } else if (professional.templateSelection === "template-2") {
                  navigate(
                    `/user/professionals/edit/2/${professional.professionalId}/${professional.userId}`
                  );
                }
              }}
              disabled={disabled}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              Edit/ Preview
            </button>

            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onCredentials(professional.professionalId);
              }}
              disabled={disabled}
              className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-3 h-3 md:w-4 md:h-4" />
              Details
            </button>

            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onApprove(professional.professionalId);
              }}
              disabled={disabled}
              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
              Approve
            </button>

            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onReject(professional.professionalId);
              }}
              disabled={disabled}
              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-3 h-3 md:w-4 md:h-4" />
              Reject
            </button>

            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onDelete(professional.professionalId);
              }}
              disabled={disabled}
              className="col-span-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Additional Info */}
          {/* <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="truncate mr-2">
                ID: {professional.professionalId || "No ID"}
              </span>
              <span>v{professional.version}</span>
            </div>
          </div> */}
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    <span className="ml-4 text-gray-600">Loading professionals...</span>
  </div>
);

// Error Component
const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => (
  <div className="text-center py-16">
    <div className="text-6xl mb-4">⚠</div>
    <p className="text-xl text-red-600 mb-2">Error loading professionals</p>
    <p className="text-gray-500 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Recent Professionals Section Component
const RecentProfessionalsSection: React.FC<{
  recentProfessionals: Professional[];
  onCredentials: (professionalId: string) => void;
  onPreview: (professionalId: string) => void;
  onApprove: (professionalId: string) => void;
  onReject: (professionalId: string) => void;
  onDelete: (professionalId: string) => void;
  disabled?: boolean;
}> = ({
  recentProfessionals,
  onCredentials,
  onPreview,
  onApprove,
  onReject,
  onDelete,
  disabled,
}) => {
  if (recentProfessionals.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex gap-3 items-center mb-6">
        <div className="flex gap-2 items-center">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
            Recent Professionals
          </h2>
        </div>
        <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
          Last 7 days
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {recentProfessionals.map((professional) => (
          <div key={professional.professionalId} className="animate-fadeIn">
            <ProfessionalCard
              professional={professional}
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

// Main Content Area Component
const MainContent: React.FC<MainContentProps> = ({
  professionals,
  recentProfessionals,
  currentPage,
  totalPages,
  loading,
  error,
  onRetry,
  totalCount,
  hasMore,
  onOpenMobileSidebar,
  onCredentials,
  onPreview,
  onApprove,
  onReject,
  searchTerm,
  categoryFilter,
  sortBy,
  onClearFilters,
  onDelete,
  isMutating = false,
  onNextPage,
  onPrevPage,
}) => {
  if (loading)
    return (
      <div className="flex-1 bg-blue-50 px-4 md:px-8 py-8">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className="flex-1 bg-blue-50 px-4 md:px-8 py-8">
        <ErrorMessage error={error} onRetry={onRetry} />
      </div>
    );

  return (
    <div className="flex-1 bg-blue-50 px-4 md:px-8 py-8">
      {/* Mobile filter button */}
      <button
        onClick={onOpenMobileSidebar}
        className="md:hidden flex items-center gap-2 mb-6 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
      >
        <Menu className="w-4 h-4" />
        <span>Filters</span>
      </button>

      {/* Recent Professionals Section */}
      <RecentProfessionalsSection
        recentProfessionals={recentProfessionals}
        onCredentials={onCredentials}
        onPreview={onPreview}
        onApprove={onApprove}
        onReject={onReject}
        onDelete={onDelete}
        disabled={isMutating}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-3 md:gap-4">
        <div className="flex gap-2 items-center">
          <User className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl md:text-2xl font-bold text-black">
            All Professionals ({totalCount || professionals.length})
          </h2>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-black font-medium text-sm md:text-base">
            Page {currentPage} of {totalPages}
          </span>
          {hasMore && (
            <span className="text-xs md:text-sm text-gray-600 bg-blue-100 px-2 py-1 md:px-3 md:py-1 rounded-full">
              More available
            </span>
          )}
        </div>
      </div>

      {/* Professionals Grid */}
      {professionals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {professionals.map((professional: Professional, index: number) => (
            <div
              key={professional.professionalId || index}
              className="animate-fadeIn"
            >
              <ProfessionalCard
                professional={professional}
                onCredentials={onCredentials}
                onPreview={onPreview}
                onApprove={onApprove}
                onReject={onReject}
                onDelete={onDelete}
                disabled={isMutating}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Check if filters are applied */}
          {searchTerm ||
          categoryFilter !== "All Categories" ||
          sortBy !== "Sort by Name" ? (
            // Empty State with Filters Applied
            <div className="text-center py-12 md:py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-700 mb-2">
                No professionals match your filters
              </p>
              <p className="text-gray-500 mb-6">
                Try adjusting your search criteria or clear all filters
              </p>
              <button
                onClick={onClearFilters}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            // Empty State - No professionals at all
            <div className="text-center py-12 md:py-16">
              <div className="text-6xl mb-4">👨‍💼</div>
              <p className="text-xl text-gray-700 mb-2">
                No professionals found
              </p>
              <p className="text-gray-500 mb-6">
                There are no professional profiles in the system yet.
              </p>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
          <button
            onClick={onPrevPage}
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
            onClick={onNextPage}
            className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage >= totalPages}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// API Service for Professionals
const apiService = {
  async fetchAllProfessionals(): Promise<ApiResponse> {
    try {
      const response = await fetch(
        "https://zgkue3u9cl.execute-api.ap-south-1.amazonaws.com/prod/professional-dashboard-cards?viewType=admin",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched professionals data:", data);

      return data;
    } catch (error) {
      console.error("Error fetching professionals:", error);
      throw error;
    }
  },

  async fetchProfessionalDetails(professionalId: string): Promise<any> {
    try {
      const response = await fetch(
        `https://dfdooqn9k1.execute-api.ap-south-1.amazonaws.com/dev/professionals/${professionalId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error("Error fetching professional details:", error);
      throw error;
    }
  },

  async approveProfessional(publishedId: string, userId: string): Promise<any> {
    try {
      //  const professional = professionals.find(p => p.professionalId === professionalId);
      console.log(publishedId, userId);

      const response = await fetch(
        `https://ei94o66irc.execute-api.ap-south-1.amazonaws.com/dev/professional-tem-validation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publishedId, action: "approve", userId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error approving professional:", error);
      throw error;
    }
  },

  async rejectProfessional(publishedId: string, userId: string): Promise<any> {
    try {
      const response = await fetch(
        `https://ei94o66irc.execute-api.ap-south-1.amazonaws.com/dev/professional-tem-validation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publishedId, action: "reject", userId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error rejecting professional:", error);
      throw error;
    }
  },

  async deleteProfessional(professionalId: string): Promise<any> {
    try {
      const response = await fetch(
        `https://ss6lmkj0o8.execute-api.ap-south-1.amazonaws.com/prof/delete-prof-tem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ professionalId, action: "delete" }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error("Error deleting professional:", error);
      throw error;
    }
  },
};

// Main Professional Dashboard Component
const AdminProfessionalDashboard: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] =
    useState<string>("All Categories");
  const [sortBy, setSortBy] = useState<string>("Sort by Name");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState<boolean>(false);
  const [credentialsModal, setCredentialsModal] = useState<{
    isOpen: boolean;
    data: any;
  }>({
    isOpen: false,
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    professionalId: string | null;
  }>({
    isOpen: false,
    professionalId: null,
  });

  // Calculate recent professionals (last 7 days)
  const recentProfessionals = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return professionals
      .filter((professional) => {
        if (!professional.createdAt) return false;
        const createdAt = new Date(professional.createdAt);
        return createdAt >= sevenDaysAgo;
      })
      .slice(0, 6); // Show max 6 recent professionals
  }, [professionals]);

  // Handle credentials button click
  const handleCredentials = async (professionalId: string): Promise<void> => {
    try {
      setIsMutating(true);
      const details = await apiService.fetchProfessionalDetails(professionalId);

      // Open modal with professional details
      setCredentialsModal({
        isOpen: true,
        data: details,
      });
    } catch (error) {
      console.error("Error fetching professional details:", error);
      toast.error("Failed to fetch professional details");
    } finally {
      setIsMutating(false);
    }
  };

  // Handle preview button click
  const handlePreview = async (professionalId: string): Promise<void> => {
    try {
      const professional = professionals.find(
        (p) => p.professionalId === professionalId
      );
      if (!professional) {
        toast.error("Professional not found");
        return;
      }

      // Navigate to preview page based on template
      if (professional.templateSelection === "template-1") {
        navigate(
          `/user/professionals/preview/1/${professionalId}/${professional.userId}`
        );
      } else if (professional.templateSelection === "template-2") {
        navigate(
          `/user/professionals/preview/2/${professionalId}/${professional.userId}`
        );
      }
    } catch (error) {
      console.error("Error loading professional for preview:", error);
      toast.error("Failed to load professional for preview");
    }
  };

  // Handle approve button click
  const handleApprove = async (professionalId: string): Promise<void> => {
    try {
      setIsMutating(true);
      const professional = professionals.find(
        (p) => p.professionalId === professionalId
      );

      if (!professional) {
        toast.error("Professional not found");
        return;
      }

      const result = await apiService.approveProfessional(
        professionalId,
        professional.userId
      );

      if (result.status == "approved") {
        toast.success("Professional approved successfully");
        // Refresh the professionals list
        fetchProfessionals();
      } else {
        toast.error("Failed to approve professional");
      }
    } catch (error) {
      console.error("Error approving professional:", error);
      toast.error("Failed to approve professional");
    } finally {
      setIsMutating(false);
    }
  };

  // Handle reject button click
  const handleReject = async (professionalId: string): Promise<void> => {
    try {
      setIsMutating(true);
      const professional = professionals.find(
        (p) => p.professionalId === professionalId
      );

      if (!professional) {
        toast.error("Professional not found");
        return;
      }

      const result = await apiService.rejectProfessional(
        professionalId,
        professional.userId
      );

      if (result.status == "rejected") {
        toast.success("Professional rejected successfully");
        // Refresh the professionals list
        fetchProfessionals();
      } else {
        toast.error("Failed to reject professional");
      }
    } catch (error) {
      console.error("Error rejecting professional:", error);
      toast.error("Failed to reject professional");
    } finally {
      setIsMutating(false);
    }
  };

  // Handle delete button click
  const handleDelete = async (professionalId: string): Promise<void> => {
    setDeleteModal({ isOpen: true, professionalId });
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (!deleteModal.professionalId) return;
    try {
      setIsMutating(true);
      const result = await apiService.deleteProfessional(
        deleteModal.professionalId
      );

      if (result.message === "Professional template deleted successfully") {
        toast.success("Professional deleted successfully");
        await fetchProfessionals();
      } else {
        toast.error("Failed to delete professional");
      }
    } catch (error) {
      console.error("Error deleting professional:", error);
      toast.error("Failed to delete professional");
    } finally {
      setIsMutating(false);
      setDeleteModal({ isOpen: false, professionalId: null });
    }
  };

  // Clear filters function
  const handleClearFilters = (): void => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setSortBy("Sort by Name");
    setCurrentPage(1);
  };

  // Fetch all professionals from API
  const fetchProfessionals = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiService.fetchAllProfessionals();

      setProfessionals(data.cards || []);
      setTotalCount(data.totalCount || 0);
      setHasMore(data.hasTemplates || false);
    } catch (err) {
      console.error("Error in fetchProfessionals:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch professionals";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchProfessionals();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, sortBy]);

  // Get unique categories from professionals
  const categories: string[] = [
    "All Categories",
    ...Array.from(
      new Set(professionals.flatMap((p: Professional) => p.categories || []))
    ).sort(),
  ];

  // Filter and sort professionals
  const filteredProfessionals = professionals.filter(
    (professional: Professional) => {
      const matchesSearch =
        !searchTerm ||
        (professional.professionalName &&
          professional.professionalName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (professional.location &&
          professional.location
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (professional.categories &&
          professional.categories.some((category: string) =>
            category.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      const matchesCategory =
        categoryFilter === "All Categories" ||
        (professional.categories &&
          professional.categories.includes(categoryFilter));

      return matchesSearch && matchesCategory;
    }
  );

  // Sort professionals
  const sortedProfessionals = [...filteredProfessionals].sort(
    (a: Professional, b: Professional) => {
      switch (sortBy) {
        case "Sort by Location":
          return (a.location || "").localeCompare(b.location || "");
        case "Sort by Date":
          const dateA = a.publishedDate
            ? new Date(a.publishedDate).getTime()
            : 0;
          const dateB = b.publishedDate
            ? new Date(b.publishedDate).getTime()
            : 0;
          return dateB - dateA;
        case "Sort by Category":
          const categoryA =
            a.categories && a.categories.length > 0 ? a.categories[0] : "";
          const categoryB =
            b.categories && b.categories.length > 0 ? b.categories[0] : "";
          return categoryA.localeCompare(categoryB);
        default:
          return (a.professionalName || "").localeCompare(
            b.professionalName || ""
          );
      }
    }
  );

  const totalPages = Math.max(1, Math.ceil(sortedProfessionals.length / itemsPerPage));

  // Calculate paginated professionals
  const paginatedProfessionals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProfessionals.slice(startIndex, endIndex);
  }, [sortedProfessionals, currentPage, itemsPerPage]);

  // Pagination Handlers
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

  return (
    <div className="min-h-screen bg-blue-100">
      <Header />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <motion.div
            className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setDeleteModal({ isOpen: false, professionalId: null })
            }
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
                  onClick={() =>
                    setDeleteModal({ isOpen: false, professionalId: null })
                  }
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
                    This action cannot be undone. All data for this professional
                    will be permanently deleted.
                  </p>
                </div>
                <p className="text-gray-600">
                  Are you sure you want to delete this professional?
                </p>
              </div>
              {/* Modal Footer */}
              <div className="flex gap-3 justify-end">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() =>
                    setDeleteModal({ isOpen: false, professionalId: null })
                  }
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

      {/* Credentials Modal */}
      <ProfessionalCredentialsModal
        isOpen={credentialsModal.isOpen}
        onClose={() => setCredentialsModal({ isOpen: false, data: null })}
        professionalId={credentialsModal.data?.professionalId}
        loading={loading}
        onPreview={handlePreview}
        onApprove={handleApprove}
        onReject={handleReject}
        professional={
          professionals.find(
            (p) => p.professionalId === credentialsModal.data?.professionalId
          ) || null
        }
      />

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
          {totalCount} {totalCount === 1 ? "professional" : "professionals"}
        </span>
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
        {/* Left Sidebar */}
        <Sidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <MainContent
          professionals={paginatedProfessionals}
          recentProfessionals={recentProfessionals}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          error={error}
          onRetry={fetchProfessionals}
          totalCount={totalCount}
          hasMore={hasMore}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onCredentials={handleCredentials}
          onPreview={handlePreview}
          onApprove={handleApprove}
          onReject={handleReject}
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          sortBy={sortBy}
          onClearFilters={handleClearFilters}
          onDelete={handleDelete}
          isMutating={isMutating}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      </div>
    </div>
  );
};

export default AdminProfessionalDashboard;
