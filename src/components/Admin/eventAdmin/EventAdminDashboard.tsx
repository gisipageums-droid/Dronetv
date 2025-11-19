import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  ArrowRight,
  Calendar,
  Menu,
  X,
  Eye,
  Key,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  Pen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "motion/react";

// -------------------- Types --------------------
interface Event {
  eventId: string;
  userId: string;
  submissionId: string;
  eventName: string;
  shortDescription: string;
  eventDate: string;
  eventTime: string;
  location: string;
  category: string;
  reviewStatus: string;
  status: boolean;
  version: number;
  hasEdits: boolean;
  lastModified: string;
  createdAt: string;
  publishedAt: string;
  urlSlug: string;
  thumbnailUrl: string;
  previewImage: string;
  templateSelection: string;
  adminNotes: string;
  isVisible: boolean;
  isApproved: boolean;
  canEdit: boolean;
  canResubmit: boolean;
  hasCustomImages: boolean;
  completionPercentage: number;
  dashboardType: string;
  needsAdminAction: boolean;
}

interface EventCredentialsData {
  success: boolean;
  eventId: string;
  draftId: string;
  debug: {
    message: string;
    draftRecordKeys: string[];
    publishedRecordKeys: string[];
    draftRecordRaw: {
      publishedEventId: string;
      updatedAt: string;
      userId: string;
      status: string;
      submissionId: string;
    };
    publishedRecordRaw: {
      content: {
        heroContent: {
          eventTime: string;
          eventName: string;
          tagline: string;
          location: string;
          heroImage: string;
          category: string;
          eventDate: string;
        };
      };
      metadata: {
        adminNotes: string;
        urlSlug: string;
        reviewedAt: string;
        isVisible: boolean;
        shortDescription: string;
        approvedAt: string;
        lastUpdated: string;
        createdAt: string;
        needsAdminAction: boolean;
        rejectedAt: string;
        eventTime: string;
        eventName: string;
        location: string;
        category: string;
        rejectionReason: string;
        status: string;
        eventDate: string;
        thumbnailUrl: string;
      };
      eventId: string;
      urlSlug: string;
      publishedAt: string;
      templateSelection: string;
      userId: string;
      editHistory: {
        createdAt: string;
        lastModified: string;
        lastEditBy: string;
        version: number;
        editCount: number;
      };
      lastModified: string;
      createdAt: string;
      adminReview: {
        reviewedAt: string;
        notes: string;
        reviewedBy: string;
        status: string;
      };
      submissionId: string;
    };
  };
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

interface EventCardProps {
  event: Event;
  onCredentials: (eventId: string) => void;
  onPreview: (eventId: string, userId: string) => void;
  onApprove: (eventId: string, userId: string) => void;
  onReject: (eventId: string, userId: string) => void;
  onDelete: (eventId: string) => void;
}

// -------------------- Credentials Modal --------------------
interface EventCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EventCredentialsData | null;
}

const EventCredentialsModal: React.FC<EventCredentialsModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const publishedData = data.debug.publishedRecordRaw;
  // const draftData = data.debug.draftRecordRaw;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Key className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Event Credentials & Details
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Basic Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Name
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                      {publishedData.metadata.eventName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Date & Time
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                      {formatDate(publishedData.metadata.eventDate)} at{" "}
                      {publishedData.metadata.eventTime}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                      {publishedData.metadata.location}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                      {publishedData.metadata.category}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Technical Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event ID
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border font-mono">
                      {data.eventId}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border font-mono">
                      {publishedData.userId}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Submission ID
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border font-mono">
                      {publishedData.submissionId}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                      {publishedData.templateSelection}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Timeline
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created At
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                      {formatDate(publishedData.createdAt)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Modified
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                      {formatDate(publishedData.lastModified)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Published At
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                      {formatDate(publishedData.publishedAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Review Status
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Status
                    </label>
                    <p
                      className={`text-sm font-medium p-2 rounded border ${
                        publishedData.metadata.status === "approved"
                          ? "text-green-800 bg-green-100 border-green-200"
                          : publishedData.metadata.status === "rejected"
                          ? "text-red-800 bg-red-100 border-red-200"
                          : "text-yellow-800 bg-yellow-100 border-yellow-200"
                      }`}
                    >
                      {publishedData.metadata.status?.toUpperCase() ||
                        "UNDER REVIEW"}
                    </p>
                  </div>

                  {publishedData.metadata.adminNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admin Notes
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                        {publishedData.metadata.adminNotes}
                      </p>
                    </div>
                  )}

                  {publishedData.metadata.rejectionReason && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rejection Reason
                      </label>
                      <p className="text-sm text-red-700 bg-red-50 p-2 rounded border">
                        {publishedData.metadata.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Edit History
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Version
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border text-center">
                      v{publishedData.editHistory.version}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Edit Count
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border text-center">
                      {publishedData.editHistory.editCount}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Edited By
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border text-center">
                      {publishedData.editHistory.lastEditBy}
                    </p>
                  </div>
                </div>
              </div>

              {/* URLs */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  URLs & Media
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Slug
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border font-mono">
                      {publishedData.urlSlug}
                    </p>
                  </div>
                  {publishedData.metadata.thumbnailUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail URL
                      </label>
                      <p className="text-sm text-blue-600 bg-gray-50 p-2 rounded border font-mono truncate">
                        {publishedData.metadata.thumbnailUrl}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// -------------------- Constants --------------------
const SORT_OPTIONS = [
  "Sort by Date",
  "Sort by Latest",
  "Sort by Location",
  "Sort by Category",
] as const;

// -------------------- Header --------------------
const Header: React.FC = () => {
  return (
    <div className="h-[40vh] bg-blue-50 flex items-center justify-center px-4 sm:px-6">
      <div className="relative w-full max-w-3xl text-center">
        <div className="relative z-10">
          <h1 className="mb-4 text-3xl font-extrabold text-blue-900 md:text-5xl md:mb-6">
            Admin Dashboard
            <span className="block mt-1 text-xl font-bold text-blue-600 md:text-3xl md:mt-2">
              Event Management
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-xl text-base font-semibold text-blue-700 md:text-lg md:mb-10">
            Review and manage all event listings, credentials, and approvals.
          </p>
        </div>
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
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories,
  isMobileSidebarOpen,
  onCloseMobileSidebar,
}) => {
  const sortOptions: string[] = [
    "Sort by Date",
    ...SORT_OPTIONS.filter((s) => s !== "Sort by Date"),
  ];
  const navigate = useNavigate();

  return (
    <div
      className={`bg-blue-50 p-4 md:p-8 h-full min-h-screen md:sticky md:top-0 border-r-2 border-gray-200 ${
        isMobileSidebarOpen
          ? "overflow-y-auto fixed inset-0 z-50 w-full"
          : "hidden md:block md:w-80"
      }`}
    >
      {isMobileSidebarOpen && (
        <div className="flex justify-between items-center mt-16 mb-6 md:hidden">
          <h2 className="text-xl font-bold">Filters</h2>
          <button
            onClick={onCloseMobileSidebar}
            className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="space-y-6 md:space-y-8">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">
            Search
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-8 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              className="py-3 pr-4 pl-10 w-full text-sm bg-gray-50 rounded-lg border border-gray-200 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
              aria-label="Search events"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">
            Category
          </label>
          <MinimalisticDropdown
            value={categoryFilter}
            onChange={onCategoryChange}
            options={categories}
            placeholder="Select category"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">
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

        <button
          onClick={() => {
            onSearchChange("");
            onCategoryChange("All Categories");
            onSortChange("Sort by Date");
          }}
          className="text-sm text-gray-500 underline transition-colors hover:text-gray-700 underline-offset-2"
        >
          Clear all filters
        </button>

        <div className="border-t border-gray-100"></div>

        <div className="flex items-center w-full gap-2 flex-col">
          <button
            className="bg-yellow-500 text-white text-sm font-semibold px-4 py-2 rounded-lg w-full hover:bg-yellow-600 transition-all duration-200"
            onClick={() => navigate("/admin/company/dashboard")}
          >
            Companies
          </button>
          <button
            className="bg-yellow-500 text-white text-sm font-semibold px-4 py-2 rounded-lg w-full hover:bg-yellow-600 transition-all duration-200"
            onClick={() => navigate("/admin/professional")}
          >
            Professionals
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------- EventCard --------------------
const EventCard: React.FC<EventCardProps> = ({
  event,
  onCredentials,
  onPreview,
  onApprove,
  onReject,
  onDelete,
}) => {
  const placeholderImg = event.previewImage || event.eventName[0];

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

  const getStatusBadge = (reviewStatus?: string) => {
    if (reviewStatus === "under_review")
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

  const statusStyle = getStatusBadge(event.reviewStatus);

  return (
    <div className="overflow-hidden w-full h-full rounded-2xl border-l-8 shadow-lg transition-all duration-300 hover:shadow-xl group">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex gap-3 items-center md:gap-4">
            <div className="flex overflow-hidden justify-center items-center p-1 w-12 h-12 bg-white rounded-xl shadow-md md:w-14 md:h-14 lg:w-16 lg:h-16">
              {event.previewImage ? (
                <img
                  src={event.previewImage}
                  alt={`${event.eventName} logo`}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              ) : (
                <span className="text-4xl font-extrabold text-yellow-600">
                  {placeholderImg}
                </span>
              )}
            </div>

            <div className="max-w-[calc(100%-60px)] md:max-w-none">
              <h3 className="text-lg font-bold text-gray-900 md:text-xl line-clamp-2">
                {event.eventName || "Unnamed Event"}
              </h3>
              <div className="flex items-center mt-1 text-gray-600">
                <MapPin className="mr-1 w-3 h-3" />
                <span className="text-xs md:text-sm">
                  {event.location || "Location not specified"}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <div
              className={`inline-flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium`}
            >
              <Calendar className="w-3 h-3" />
              {statusStyle.label}
            </div>
          </div>
        </div>

        <div className="mb-4 md:mb-6">
          <div className="flex flex-wrap gap-1 md:gap-2">
            {event.category || "Category not specified"}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center md:gap-6">
            <div className="flex gap-2 items-center px-3 py-1 bg-gray-50 rounded-lg md:px-4 md:py-2">
              <span className="text-xs font-bold text-purple-600 md:text-sm">
                {formatDate(event.createdAt)}
              </span>
              <span className="hidden text-xs text-gray-600 md:block">
                Published
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onPreview(event.eventId, event.userId)}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200 md:text-sm"
              aria-label={`Preview ${event.eventName}`}
            >
              <Pen className="w-3 h-3 md:w-4 md:h-4" /> Edit /{" "}
              <Eye className="w-3 h-3 md:w-4 md:h-4" /> Preview
            </button>

            <button
              onClick={() => onCredentials(event.eventId)}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-purple-700 bg-purple-100 rounded-lg transition-colors hover:bg-purple-200 md:text-sm"
              aria-label={`Credentials ${event.eventName}`}
            >
              <Key className="w-3 h-3 md:w-4 md:h-4" />
              Credentials
            </button>

            <button
              onClick={() => onApprove(event.eventId, event.userId)}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-green-700 bg-green-100 rounded-lg transition-colors hover:bg-green-200 md:text-sm"
              aria-label={`Approve ${event.eventName}`}
            >
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
              Approve
            </button>

            <button
              onClick={() => onReject(event.eventId, event.userId)}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-red-700 bg-red-100 rounded-lg transition-colors hover:bg-red-200 md:text-sm"
              aria-label={`Reject ${event.eventName}`}
            >
              <XCircle className="w-3 h-3 md:w-4 md:h-4" />
              Reject
            </button>

            <button
              onClick={() => onDelete(event.eventId)}
              className="flex col-span-2 gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600 md:text-sm"
              aria-label={`Delete ${event.eventName}`}
            >
              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-gray-100 md:mt-4 md:pt-4">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="mr-2 truncate">
              ID: {event.eventId || "No ID"}
            </span>
            <span>v{event.version}</span>
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
    <span className="ml-4 text-gray-600">Loading events...</span>
  </div>
);

// -------------------- Recent Events Section --------------------
const RecentEventsSection: React.FC<{
  recentEvents: Event[];
  onCredentials: (publishedId: string) => void;
  onPreview: (publishedId: string, userId: string) => void;
  onApprove: (publishedId: string, userId: string) => void;
  onReject: (publishedId: string, userId: string) => void;
  onDelete: (publishedId: string) => void;
}> = ({
  recentEvents,
  onCredentials,
  onPreview,
  onApprove,
  onReject,
  onDelete,
}) => {
  if (recentEvents.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex gap-3 items-center mb-6">
        <div className="flex gap-2 items-center">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
            Recent Events
          </h2>
        </div>
        <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
          Last 7 days
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {recentEvents.map((event) => (
          <div key={event.eventId} className="animate-fadeIn">
            <EventCard
              event={event}
              onCredentials={onCredentials}
              onPreview={onPreview}
              onApprove={onApprove}
              onReject={onReject}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-200"></div>
    </div>
  );
};

// -------------------- API Service --------------------
const eventApiService = {
  async fetchEventCredentials(eventId: string): Promise<EventCredentialsData> {
    try {
      const response = await fetch(
        `https://dmxs169e33.execute-api.ap-south-1.amazonaws.com/dev/event-formdetails-verification/${eventId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching event credentials:", error);
      throw error;
    }
  },
};

// -------------------- Main Component --------------------
const EventAdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] =
    useState<string>("All Categories");
  const [sortBy, setSortBy] = useState<string>("Sort by Date");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [credentialsModal, setCredentialsModal] = useState<{
    isOpen: boolean;
    data: EventCredentialsData | null;
  }>({
    isOpen: false,
    data: null,
  });
  const navigate = useNavigate();

  const categories = [
    "All Categories",
    "Technology",
    "Conference",
    "Music",
    "Entertainment",
    "Business",
    "Networking",
    "Art",
    "Culture",
    "Sports",
    "Competition",
    "Food",
    "Culinary",
  ];

  const handleCredentials = async (eventId: string) => {
    try {
      setLoading(true);
      const credentials = await eventApiService.fetchEventCredentials(eventId);
      setCredentialsModal({ isOpen: true, data: credentials });
    } catch (error) {
      console.error("Error fetching credentials:", error);
      toast.error("Failed to fetch credentials");
    } finally {
      setLoading(false);
    }
  };

const handlePreview = (eventId: string, userId: string) => {
  // Find the event to get its templateSelection
  const event = events.find(e => e.eventId === eventId);
  if (!event) {
    toast.error("Event not found");
    return;
  }

  // Handle both template selection formats
  if (event.templateSelection === "template-1" || event.templateSelection === "1") {
    navigate(`/edit/event/t1/admin/${eventId}/${userId}`);
  } else if (event.templateSelection === "template-2" || event.templateSelection === "2") {
    navigate(`/edit/event/t2/admin/${eventId}/${userId}`);
  } else {
    // Default to template 1 if unknown
    console.warn(`Unknown template selection: ${event.templateSelection}, defaulting to template 1`);
    navigate(`/edit/event/t1/admin/${eventId}/${userId}`);
  }
};

  const handleApprove = async (eventId: string, userId: string) => {
    try {
      await fetch(
        `https://tl85vj590m.execute-api.ap-south-1.amazonaws.com/dev/event/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: eventId,
            action: "approve",
            adminNotes: "Looks good!",
            userId: userId,
          }),
        }
      );

      toast.success("Event approved successfully");
      const updatedEvents = events.map((event) => {
        if (event.eventId === eventId) {
          return { ...event, reviewStatus: "approved" };
        }
        return event;
      });
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("Failed to approve event");
    }
  };

  const handleReject = async (eventId: string, userId: string) => {
    try {
      await fetch(
        `https://tl85vj590m.execute-api.ap-south-1.amazonaws.com/dev/event/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: eventId,
            action: "reject",
            adminNotes: "Looks bad!",
            userId: userId,
          }),
        }
      );

      toast.success("Event rejected successfully");
      const updatedEvents = events.map((event) => {
        if (event.eventId === eventId) {
          return { ...event, reviewStatus: "rejected" };
        }
        return event;
      });
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error rejecting event:", error);
      toast.error("Failed to rejecte event");
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await fetch(
        "https://pjqm3sgpzf.execute-api.ap-south-1.amazonaws.com/dev/delete-event",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: eventId,
            action: "delete",
          }),
        }
      );

      toast.success("Event deleted successfully");
      const updatedEvents = events.filter((event) => event.eventId !== eventId);
      setEvents(updatedEvents);
      setRecentEvents(recentEvents.filter((e) => e.eventId != eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://o9og9e2rik.execute-api.ap-south-1.amazonaws.com/prod/events-dashboard?viewType=admin"
        );
        const data = await response.json();
        setEvents(data?.cards || []);
        setRecentEvents(data?.cards?.slice(0, 3) || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="w-full min-h-screen h-full bg-blue-50">
      <Header />

      {/* Credentials Modal */}
      <EventCredentialsModal
        isOpen={credentialsModal.isOpen}
        onClose={() => setCredentialsModal({ isOpen: false, data: null })}
        data={credentialsModal.data}
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
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        <div className="flex-1 p-4 md:p-8 bg-blue-50">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Recent Events Section */}
              <RecentEventsSection
                recentEvents={recentEvents}
                onCredentials={handleCredentials}
                onPreview={handlePreview}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
              />

              {/* All Events Section */}
              <div className="flex gap-3 items-center mb-6">
                <div className="flex gap-2 items-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                    All Events
                  </h2>
                </div>
                <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                  {events.length} {events.length === 1 ? "event" : "events"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {events.map((event) => (
                  <div key={event.eventId} className="animate-fadeIn">
                    <EventCard
                      event={event}
                      onCredentials={handleCredentials}
                      onPreview={handlePreview}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>

              <div>
                {events.length === 0 && (
                  <div className="flex flex-col gap-3 justify-center items-center mt-20 mb-44">
                    <Calendar className="w-24 h-24 text-gray-400" />
                    <p className="text-sm font-semibold text-gray-400">
                      Oops looks like there is not events!
                    </p>
                  </div>
                )}
              </div>

              {/* Static Pagination */}
              <div className="flex justify-center items-center mt-8">
                <button
                  className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={true}
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Previous
                </button>
                <span className="mx-4 text-sm text-gray-600">Page 1 of 1</span>
                <button
                  className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={true}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventAdminDashboard;