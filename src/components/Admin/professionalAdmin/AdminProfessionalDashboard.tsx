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
  Edit,
  Calendar,
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
  sortBy: string;
  onSortChange: (value: string) => void;
  isMobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

interface ProfessionalCardProps {
  professional: Professional;
  onCredentials: (professionalId: string) => void;
  onPreview: (professionalId: string) => void;
  onApprove: (professionalId: string) => void;
  onReject: (professionalId: string) => void;
  onDelete: (professionalId: string) => void;
  onEdit: (professionalId: string, templateSelection: string) => void;
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
  sortBy: string;
  statusFilter: string;
  onClearFilters: () => void;
  onDelete: (professionalId: string) => void;
  onEdit: (professionalId: string, templateSelection: string) => void;
  isMutating?: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

interface ErrorMessageProps {
  error: string;
  onRetry: () => void;
}

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

// Header Component - Updated to match EventAdminDashboard
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
              Professional Management
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base font-medium text-yellow-800/80 md:text-lg leading-relaxed">
            Review and manage all professional profiles, credentials, and approvals with ease.
          </p>
        </motion.div>
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

/* Sidebar Filters Component - Updated to match EventAdminDashboard */
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
    "Sort by Name",
    "Sort by Location",
    "Sort by Date",
    "Sort by Category",
  ];

  // Status filter options - Updated to match EventAdminDashboard
  const statusOptions = [
    { value: "all", label: "All Professionals", color: "text-yellow-900" },
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
                {option.label === "All Professionals" && (
                  <User className="w-3 h-3" />
                )}
                <span>{option.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-yellow-900 block">
            Search Professionals
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-600" />
            <input
              type="text"
              placeholder="Search by name, location..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              className="w-full pl-10 pr-4 py-3 text-sm border border-yellow-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 bg-white/50 transition-colors placeholder-yellow-700/50 text-yellow-900"
            />
          </div>
        </div>

        {/* Sort Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-yellow-900 block">
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
            onSortChange("Sort by Name");
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
            <Link to={"/admin/company/dashboard"} className="w-full text-left">
              Companies{" "}
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

// Professional Card Component
const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  onCredentials,
  onPreview,
  onApprove,
  onReject,
  onDelete,
  onEdit,
  disabled = false,
}) => {
  // Create a placeholder image using professional name
  const placeholderImg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6' rx='8'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='%23374151' font-size='20' font-family='Arial' font-weight='bold'%3E${
    professional.professionalName?.charAt(0) || "P"
  }%3C/text%3E%3C/svg%3E`;

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

  // Status badge styling based on status - Updated to match new status values
  const getStatusBadge = (reviewStatus: string) => {
    if (reviewStatus === "active" || reviewStatus === "under_review") {
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
    <div className="w-full h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-8 border-gradient-to-b from-amber-500 to-yellow-600 group bg-white">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden shadow-md bg-white p-1 md:p-2 flex items-center justify-center group-hover:shadow-lg group-hover:bg-gradient-to-br group-hover:from-amber-50 group-hover:to-yellow-50 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
              <img
                src={professional.previewImage || placeholderImg}
                alt={`${professional.professionalName} profile`}
                className="w-full h-full object-cover rounded-lg transition-all duration-500 group-hover:rotate-[-3deg] group-hover:scale-110"
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
                className="px-2 py-1 md:px-3 md:py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full"
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
              <span className="font-bold text-amber-600 text-xs md:text-sm">
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
                onEdit(
                  professional.professionalId,
                  professional.templateSelection
                );
              }}
              disabled={disabled}
              className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit className="w-3 h-3 md:w-4 md:h-4" />
              Edit /
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              Preview
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
              disabled={disabled || professional.reviewStatus === "approved"}
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
              disabled={disabled || professional.reviewStatus === "rejected"}
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
  onEdit: (professionalId: string, templateSelection: string) => void;
  disabled?: boolean;
}> = ({
  recentProfessionals,
  onCredentials,
  onPreview,
  onApprove,
  onReject,
  onDelete,
  onEdit,
  disabled,
}) => {
    if (recentProfessionals.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex gap-3 items-center mb-6">
          <div className="flex gap-2 items-center">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-yellow-900 md:text-2xl">
              Recent Professionals
            </h2>
          </div>
          <span className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-full">
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

// Main Content Area Component - Updated to match EventAdminDashboard
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
  sortBy,
  statusFilter,
  onClearFilters,
  onDelete,
  onEdit,
  isMutating = false,
  onNextPage,
  onPrevPage,
}) => {
  if (loading)
    return (
      <div className="flex-1 p-4 md:p-8 bg-orange-50">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className="flex-1 p-4 md:p-8 bg-orange-50">
        <ErrorMessage error={error} onRetry={onRetry} />
      </div>
    );

  return (
    <div className="flex-1 p-4 md:p-8 bg-orange-50">
      {/* Mobile sidebar toggle */}
      <button
        onClick={onOpenMobileSidebar}
        className="p-3 rounded-full border border-gray-200 bg-yellow-500 text-white relative left-5 hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300 duration-200 md:hidden"
        aria-label="Open filters"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Recent Professionals Section - Updated condition to hide when status filter is not "all" */}
      {!searchTerm && statusFilter === "all" && (
        <RecentProfessionalsSection
          recentProfessionals={recentProfessionals}
          onCredentials={onCredentials}
          onPreview={onPreview}
          onApprove={onApprove}
          onReject={onReject}
          onDelete={onDelete}
          onEdit={onEdit}
          disabled={isMutating}
        />
      )}

      {/* All Professionals Section */}
      <div className="flex gap-3 items-center mb-6">
        <div className="flex gap-2 items-center">
          <User className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-bold text-yellow-900 md:text-2xl">
            {statusFilter === "all" ? "All Professionals" : statusFilter === "under_review" ? "Under Review Professionals" : statusFilter === "approved" ? "Approved Professionals" : "Rejected Professionals"}
          </h2>
        </div>
        <span className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-full">
          {totalCount}{" "}
          {totalCount === 1 ? "professional" : "professionals"}
        </span>
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
                onEdit={onEdit}
                disabled={isMutating}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3 justify-center items-center mt-20 mb-44">
          <User className="w-24 h-24 text-gray-400" />
          <p className="text-sm font-semibold text-gray-400">
            Oops looks like there is no professionals!
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
          <button
            onClick={onPrevPage}
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
  const [statusFilter, setStatusFilter] = useState<string>("all"); // Changed from "All Statuses"
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

  // Confirmation modals state
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "edit" | "approve" | "reject" | "delete" | null;
    professionalId: string | null;
    professional: Professional | null;
  }>({ isOpen: false, type: null, professionalId: null, professional: null });

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

  // -------------------- Confirmation Modal Handlers --------------------
  const openConfirmationModal = (
    type: "edit" | "approve" | "reject" | "delete",
    professionalId: string
  ) => {
    const professional = professionals.find(
      (p) => p.professionalId === professionalId
    );
    setConfirmationModal({ isOpen: true, type, professionalId, professional });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      type: null,
      professionalId: null,
      professional: null,
    });
  };

  const handleConfirmAction = async () => {
    const { type, professionalId, professional } = confirmationModal;
    if (!professionalId) return;

    try {
      setIsMutating(true);

      switch (type) {
        case "edit":
          if (professional) {
            if (professional.templateSelection === "template-1") {
              navigate(
                `/user/professionals/edit/1/${professionalId}/${professional.userId}`
              );
            } else if (professional.templateSelection === "template-2") {
              navigate(
                `/user/professionals/edit/2/${professionalId}/${professional.userId}`
              );
            }
          }
          break;

        case "approve":
          if (professional) {
            const result = await apiService.approveProfessional(
              professionalId,
              professional.userId
            );

            if (result.status == "approved") {
              toast.success("Professional approved successfully");
              await fetchProfessionals();
            } else {
              toast.error("Failed to approve professional");
            }
          }
          break;

        case "reject":
          if (professional) {
            const result = await apiService.rejectProfessional(
              professionalId,
              professional.userId
            );

            if (result.status == "rejected") {
              toast.success("Professional rejected successfully");
              await fetchProfessionals();
            } else {
              toast.error("Failed to reject professional");
            }
          }
          break;

        case "delete":
          const result = await apiService.deleteProfessional(professionalId);
          if (result.message === "Professional template deleted successfully") {
            toast.success("Professional deleted successfully");
            await fetchProfessionals();
          } else {
            toast.error("Failed to delete professional");
          }
          break;

        default:
          return;
      }
    } catch (err) {
      console.error(`Error performing ${type} action:`, err);
      toast.error(`Failed to ${type} professional`);
      await fetchProfessionals();
    } finally {
      setIsMutating(false);
      closeConfirmationModal();
    }
  };

  // -------------------- Action Handlers --------------------
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

  const handleEdit = (professionalId: string, templateSelection: string) => {
    openConfirmationModal("edit", professionalId);
  };

  const handleApprove = (professionalId: string) => {
    openConfirmationModal("approve", professionalId);
  };

  const handleReject = (professionalId: string) => {
    openConfirmationModal("reject", professionalId);
  };

  const handleDelete = (professionalId: string) => {
    openConfirmationModal("delete", professionalId);
  };

  // Clear filters function
  const handleClearFilters = (): void => {
    setSearchTerm("");
    setStatusFilter("all");
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
  }, [searchTerm, statusFilter, sortBy]);

  // Get unique categories from professionals
  const categories: string[] = [
    "All Categories",
    ...Array.from(
      new Set(professionals.flatMap((p: Professional) => p.categories || []))
    ).sort(),
  ];

  // Filter and sort professionals - Updated status filter logic
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

      // Status filter logic - Updated to match EventAdminDashboard
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "under_review" && 
         (professional.reviewStatus === "active" || professional.reviewStatus === "under_review")) ||
        (statusFilter === "approved" && professional.reviewStatus === "approved") ||
        (statusFilter === "rejected" && professional.reviewStatus === "rejected");

      return matchesSearch && matchesStatus;
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

  const totalPages = Math.max(
    1,
    Math.ceil(sortedProfessionals.length / itemsPerPage)
  );

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

  // -------------------- Modal Configuration --------------------
  const getModalConfig = () => {
    const { type, professional } = confirmationModal;
    const professionalName =
      professional?.professionalName || "this professional";

    switch (type) {
      case "edit":
        return {
          title: "Confirm Edit",
          message: `Are you sure you want to edit "${professionalName}"? You will be redirected to the edit page.`,
          confirmText: "Edit Professional",
          confirmColor: "bg-amber-600 hover:bg-amber-700",
          icon: <Edit className="text-amber-600" size={24} />,
        };
      case "approve":
        return {
          title: "Confirm Approval",
          message: `Are you sure you want to approve "${professionalName}"? This will make the professional visible to users.`,
          confirmText: "Approve Professional",
          confirmColor: "bg-green-600 hover:bg-green-700",
          icon: <CheckCircle className="text-green-600" size={24} />,
        };
      case "reject":
        return {
          title: "Confirm Rejection",
          message: `Are you sure you want to reject "${professionalName}"? This will mark the professional as rejected.`,
          confirmText: "Reject Professional",
          confirmColor: "bg-red-600 hover:bg-red-700",
          icon: <XCircle className="text-red-600" size={24} />,
        };
      case "delete":
        return {
          title: "Confirm Deletion",
          message: `Are you sure you want to delete "${professionalName}"? This action cannot be undone and all professional data will be permanently removed.`,
          confirmText: "Delete Professional",
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

      {/* Main Layout Container */}
      <div className="flex">
        {/* Left Sidebar */}
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

        {/* Main Content Area */}
        <MainContent
          professionals={paginatedProfessionals}
          recentProfessionals={recentProfessionals}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          error={error}
          onRetry={fetchProfessionals}
          totalCount={sortedProfessionals.length}
          hasMore={hasMore}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onCredentials={handleCredentials}
          onPreview={handlePreview}
          onApprove={handleApprove}
          onReject={handleReject}
          searchTerm={searchTerm}
          sortBy={sortBy}
          statusFilter={statusFilter}
          onClearFilters={handleClearFilters}
          onDelete={handleDelete}
          onEdit={handleEdit}
          isMutating={isMutating}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      </div>
    </div>
  );
};

export default AdminProfessionalDashboard;