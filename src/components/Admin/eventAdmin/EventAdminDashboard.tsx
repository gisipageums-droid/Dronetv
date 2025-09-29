import React, { useState } from "react";
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
} from "lucide-react";

// -------------------- Types --------------------
interface Event {
  publishedId: string;
  eventName: string;
  location: string;
  categories: string[];
  previewImage?: string;
  reviewStatus: string;
  publishedDate: string;
  version: number;
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
  onCredentials: (publishedId: string) => void;
  onPreview: (publishedId: string) => void;
  onApprove: (publishedId: string) => void;
  onReject: (publishedId: string) => void;
  onDelete: (publishedId: string) => void;
}

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
              Event Management
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-xl text-base font-light text-blue-700 md:text-lg md:mb-10">
            Review and manage all event listings, credentials, and approvals.
          </p>

          <div className="flex flex-col gap-4 justify-center items-center sm:flex-row">
            <button className="px-6 py-3 w-full text-sm font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg shadow-lg transition-all duration-300 transform md:px-8 md:py-4 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl hover:-translate-y-1 sm:w-auto md:text-base">
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
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories,
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
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
              className="py-3 pr-4 pl-10 w-full text-sm bg-gray-50 rounded-lg border border-gray-200 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
              aria-label="Search events"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">Category</label>
          <MinimalisticDropdown value={categoryFilter} onChange={onCategoryChange} options={categories} placeholder="Select category" />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">Sort by</label>
          <MinimalisticDropdown key={`sort-${sortBy}`} value={sortBy} onChange={onSortChange} options={sortOptions} placeholder="Sort options" />
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
  const placeholderImg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6' rx='8'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='%23374151' font-size='20' font-family='Arial' font-weight='bold'%3E${encodeURIComponent(
    (event.eventName && event.eventName.charAt(0)) || "E"
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

  const statusStyle = getStatusBadge(event.reviewStatus);

  const handleAction = (action: string) => {
    alert(`${action} action clicked for ${event.eventName}`);
  };

  return (
    <div className="overflow-hidden w-full h-full rounded-2xl border-l-8 shadow-lg transition-all duration-300 hover:shadow-xl group">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex gap-3 items-center md:gap-4">
            <div className="flex overflow-hidden justify-center items-center p-1 w-12 h-12 bg-white rounded-xl shadow-md md:w-14 md:h-14 lg:w-16 lg:h-16">
              <img
                src={event.previewImage || placeholderImg}
                alt={`${event.eventName} logo`}
                className="object-contain w-full h-full"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  if (t.src !== placeholderImg) t.src = placeholderImg;
                }}
                loading="lazy"
              />
            </div>
            <div className="max-w-[calc(100%-60px)] md:max-w-none">
              <h3 className="text-lg font-bold text-gray-900 md:text-xl line-clamp-2">{event.eventName || "Unnamed Event"}</h3>
              <div className="flex items-center mt-1 text-gray-600">
                <MapPin className="mr-1 w-3 h-3" />
                <span className="text-xs md:text-sm">{event.location || "Location not specified"}</span>
              </div>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <div className={`inline-flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium`}>
              <Calendar className="w-3 h-3" />
              {statusStyle.label}
            </div>
          </div>
        </div>

        <div className="mb-4 md:mb-6">
          <div className="flex flex-wrap gap-1 md:gap-2">
            {(event.categories && event.categories.length > 0 ? event.categories : ["General"]).map((category: string, index: number) => (
              <span key={index} className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full md:px-3 md:py-1">
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center md:gap-6">
            <div className="flex gap-2 items-center px-3 py-1 bg-gray-50 rounded-lg md:px-4 md:py-2">
              <span className="text-xs font-bold text-purple-600 md:text-sm">{formatDate(event.publishedDate)}</span>
              <span className="hidden text-xs text-gray-600 md:block">Published</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAction("Preview")}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200 md:text-sm"
              aria-label={`Preview ${event.eventName}`}
            >
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              Preview
            </button>

            <button
              onClick={() => handleAction("Credentials")}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-purple-700 bg-purple-100 rounded-lg transition-colors hover:bg-purple-200 md:text-sm"
              aria-label={`Credentials ${event.eventName}`}
            >
              <Key className="w-3 h-3 md:w-4 md:h-4" />
              Credentials
            </button>

            <button
              onClick={() => handleAction("Approve")}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-green-700 bg-green-100 rounded-lg transition-colors hover:bg-green-200 md:text-sm"
              aria-label={`Approve ${event.eventName}`}
            >
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
              Approve
            </button>

            <button
              onClick={() => handleAction("Reject")}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-red-700 bg-red-100 rounded-lg transition-colors hover:bg-red-200 md:text-sm"
              aria-label={`Reject ${event.eventName}`}
            >
              <XCircle className="w-3 h-3 md:w-4 md:h-4" />
              Reject
            </button>

            <button
              onClick={() => handleAction("Delete")}
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
            <span className="mr-2 truncate">ID: {event.publishedId || "No ID"}</span>
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
  onPreview: (publishedId: string) => void;
  onApprove: (publishedId: string) => void;
  onReject: (publishedId: string) => void;
  onDelete: (publishedId: string) => void;
}> = ({ recentEvents, onCredentials, onPreview, onApprove, onReject, onDelete }) => {
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
          <div key={event.publishedId} className="animate-fadeIn">
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

// -------------------- Static Data --------------------
const STATIC_EVENTS: Event[] = [
  {
    publishedId: "event-001",
    eventName: "Tech Conference 2024",
    location: "San Francisco, CA",
    categories: ["Technology", "Conference"],
    reviewStatus: "approved",
    publishedDate: "2024-01-15",
    version: 2
  },
  {
    publishedId: "event-002",
    eventName: "Music Festival",
    location: "Austin, TX",
    categories: ["Music", "Entertainment"],
    reviewStatus: "active",
    publishedDate: "2024-01-10",
    version: 1
  },
  {
    publishedId: "event-003",
    eventName: "Business Summit",
    location: "Boston, MA",
    categories: ["Business", "Networking"],
    reviewStatus: "rejected",
    publishedDate: "2024-01-05",
    version: 3
  },
  {
    publishedId: "event-004",
    eventName: "Art Exhibition",
    location: "New York, NY",
    categories: ["Art", "Culture"],
    reviewStatus: "approved",
    publishedDate: "2024-01-12",
    version: 1
  },
  {
    publishedId: "event-005",
    eventName: "Sports Tournament",
    location: "Chicago, IL",
    categories: ["Sports", "Competition"],
    reviewStatus: "active",
    publishedDate: "2024-01-08",
    version: 2
  },
  {
    publishedId: "event-006",
    eventName: "Food Festival",
    location: "Detroit, MI",
    categories: ["Food", "Culinary"],
    reviewStatus: "approved",
    publishedDate: "2024-01-03",
    version: 1
  }
];

// -------------------- Main Component --------------------
const EventAdminDashboard: React.FC = () => {
  // Static state - no API calls
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
  const [sortBy, setSortBy] = useState<string>("Sort by Date");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Static data
  const events = STATIC_EVENTS;
  const recentEvents = STATIC_EVENTS.slice(0, 3); // First 3 as recent
  const categories = ["All Categories", "Technology", "Conference", "Music", "Entertainment", "Business", "Networking", "Art", "Culture", "Sports", "Competition", "Food", "Culinary"];

  // Static handlers - just show alerts
  const handleCredentials = (publishedId: string) => {
    alert(`Credentials for event ID: ${publishedId}`);
  };

  const handlePreview = (publishedId: string) => {
    alert(`Preview for event ID: ${publishedId}`);
  };

  const handleApprove = (publishedId: string) => {
    alert(`Approve event ID: ${publishedId}`);
  };

  const handleReject = (publishedId: string) => {
    alert(`Reject event ID: ${publishedId}`);
  };

  const handleDelete = (publishedId: string) => {
    alert(`Delete event ID: ${publishedId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

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
          {events.length} {events.length === 1 ? "event" : "events"}
        </span>
      </div>

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

        <div className="flex-1 p-4 md:p-8">
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
              <div key={event.publishedId} className="animate-fadeIn">
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

          {/* Static Pagination */}
          <div className="flex justify-center items-center mt-8">
            <button
              className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={true}
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Previous
            </button>
            <span className="mx-4 text-sm text-gray-600">
              Page 1 of 1
            </span>
            <button
              className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={true}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAdminDashboard;