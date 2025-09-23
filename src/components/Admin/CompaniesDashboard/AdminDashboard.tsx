import React, { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown, ArrowRight, Star, Users, Building2, Menu, X, Eye, Key, FileText, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CredentialsModal from './credentialProp/Prop'; // ✅ import the modal component
// import { useTemplate } from "../../context/context"; // ✅ import context hook

// TypeScript Interfaces
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
}

interface MainContentProps {
  companies: Company[];
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

// Header Component
const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className='h-[40vh] md:h-[60vh] bg-blue-50 flex items-center justify-center px-4 sm:px-6'>
      <div className='text-center max-w-3xl relative w-full'>
        {/* Geometric Elements */}
        <div className='absolute -top-10 -left-10 w-20 h-20 md:-top-20 md:-left-20 md:w-40 md:h-40 border border-blue-200 rounded-full opacity-40'></div>
        <div className='absolute -bottom-8 -right-1 w-16 h-16 md:-bottom-16 md:-right-[-5.9rem] md:w-32 md:h-32 bg-blue-200 opacity-30 rounded-2xl'></div>

        <div className='relative z-10'>
          <div className='flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-8'>
            <div className='w-2 h-2 md:w-3 md:h-3 bg-blue-400 rounded-full'></div>
            <div className='w-4 h-4 md:w-6 md:h-6 border-2 border-blue-400'></div>
            <div className='w-3 h-3 md:w-4 md:h-4 bg-blue-600 rotate-45'></div>
          </div>

          <h1 className='text-3xl md:text-5xl font-light text-blue-900 mb-4 md:mb-6'>
            Admin Dashboard
            <span className='block text-xl md:text-3xl font-extralight text-blue-600 mt-1 md:mt-2'>
              Company Management
            </span>
          </h1>

          <p className='text-base md:text-lg text-blue-700 mb-6 md:mb-10 max-w-xl mx-auto font-light'>
            Review and manage all company listings, credentials, and approvals.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <button
              onClick={() => navigate('/admin/analytics')}
              className='bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-3 md:px-8 md:py-4 font-semibold hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 rounded-lg w-full sm:w-auto text-sm md:text-base'
            >
             
            </button>
            <div className='w-px h-8 md:h-12 bg-blue-300 hidden sm:block'></div>
            <button className='text-blue-700 hover:text-blue-900 transition-colors duration-300 text-sm md:text-base sm:mt-0 mt-2'>
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Dropdown Filter Component */
const MinimalisticDropdown: React.FC<DropdownProps> = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className='relative'>
      <button
        onClick={() => setOpen(!open)}
        className='w-full flex justify-between items-center px-4 py-3 bg-gray-50 text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300'
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
        <div className='absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-sm z-10'>
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
  industryFilter,
  onIndustryChange,
  sortBy,
  onSortChange,
  industries,
  isMobileSidebarOpen,
  onCloseMobileSidebar
}) => {
  const sortOptions: string[] = [
    "Sort by Name",
    "Sort by Location",
    "Sort by Date",
    "Sort by Sector",
  ];

  return (
    <div className={`bg-blue-50 p-4 md:p-8 h-fit md:sticky md:top-0 border-r border-gray-100 
      ${isMobileSidebarOpen ? 'fixed inset-0 z-50 w-full overflow-y-auto' : 'hidden md:block md:w-80'}`}
    >
      {isMobileSidebarOpen && (
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onCloseMobileSidebar} className="p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <div className='space-y-6 md:space-y-8'>
        {/* Search Section */}
        <div className='space-y-3'>
          <label className='text-sm font-medium text-gray-900 block'>
            Search
          </label>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              placeholder='Search companies...'
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
              className='w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-gray-50 transition-colors'
            />
        </div>
        </div>

        {/* Industry Filter */}
        <div className='space-y-3'>
          <label className='text-sm font-medium text-gray-900 block'>
            Sector
          </label>
          <MinimalisticDropdown
            value={industryFilter}
            onChange={onIndustryChange}
            options={industries}
            placeholder='Select sector'
          />
        </div>

        {/* Sort Filter */}
        <div className='space-y-3'>
          <label className='text-sm font-medium text-gray-900 block'>
            Sort by
          </label>
          <MinimalisticDropdown
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            placeholder='Sort options'
          />
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            onSearchChange("");
            onIndustryChange("All Sectors");
            onSortChange("Sort by Name");
          }}
          className='text-sm text-gray-500 hover:text-gray-700 transition-colors underline underline-offset-2'
        >
          Clear all filters
        </button>

        {/* Divider */}
        <div className='border-t border-gray-100'></div>

       
      </div>
    </div>
  );
};

// Company Card Component with four action buttons
const CompanyCard: React.FC<CompanyCardProps> = ({ 
  company, 
  onCredentials, 
  onPreview, 
  onApprove, 
  onReject,
  onDelete,
}) => {
  // Create a placeholder image using company name
  const placeholderImg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6' rx='8'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='%23374151' font-size='20' font-family='Arial' font-weight='bold'%3E${
    company.companyName?.charAt(0) || "C"
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

  // Status badge styling based on status
  const getStatusBadge = (reviewStatus: string) => {
    if (reviewStatus === "active") {
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Needs Review'
      };
    } else if (reviewStatus === "rejected") {
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Rejected'
      };
    } else if (reviewStatus === "approved") {
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'approved'
      };
  };
  }
  const statusStyle = getStatusBadge(company.reviewStatus);

  return (
    <div className='w-full h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-8 border-gradient-to-b from-blue-500 to-purple-600 group'>
      <div className='p-4 md:p-6 lg:p-8'>
        <div className='flex items-center justify-between mb-4 md:mb-6'>
          <div className='flex items-center gap-3 md:gap-4'>
            <div className='w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden shadow-md bg-white p-1 md:p-2 flex items-center justify-center group-hover:shadow-lg group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110'>
              <img
                src={company.previewImage || placeholderImg}
                alt={`${company.companyName} logo`}
                className='w-full h-full object-contain transition-all duration-500 group-hover:rotate-[-3deg] group-hover:scale-110'
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.target as HTMLImageElement;
                  target.src = placeholderImg;
                }}
              />
            </div>
            <div className="max-w-[calc(100%-60px)] md:max-w-none">
              <h3 className='text-lg md:text-xl font-bold text-gray-900 line-clamp-2'>
                {company.companyName || 'Unnamed Company'}
              </h3>
              <div className='flex items-center text-gray-600 mt-1'>
                <MapPin className='w-3 h-3 mr-1' />
                <span className='text-xs md:text-sm'>{company.location || 'Location not specified'}</span>
              </div>
            </div>
          </div>
          <div className='text-right hidden sm:block'>
            <div className={`inline-flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium`}>
              <Building2 className='w-3 h-3' />
              {statusStyle.label}
            </div>
          </div>
        </div>

        {/* Sectors */}
        <div className='mb-4 md:mb-6'>
          <div className='flex flex-wrap gap-1 md:gap-2'>
            {(company.sectors && company.sectors.length > 0 ? company.sectors : ['General']).map((sector: string, index: number) => (
              <span
                key={index}
                className='px-2 py-1 md:px-3 md:py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'
              >
                {sector}
              </span>
            ))}
          </div>
        </div>

        {/* Date and Actions Row */}
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-3 md:gap-6'>
            <div className='flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1 md:px-4 md:py-2'>
              <span className='font-bold text-purple-600 text-xs md:text-sm'>
                {company.publishedDate ? formatDate(company.publishedDate) : 'Date not available'}
              </span>
              <span className='text-xs text-gray-600 hidden md:block'>Published</span>
            </div>
          </div>

          {/* Action Buttons - Four buttons in a grid */}
          <div className='grid grid-cols-2 gap-2'>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onPreview(company.publishedId);
              }}
              className='px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center'
            >
              <Eye className='w-3 h-3 md:w-4 md:h-4' />
              Preview
            </button>

            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onCredentials(company.publishedId);
              }}
              className='px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center'
            >
              <Key className='w-3 h-3 md:w-4 md:h-4' />
              Credentials
            </button>

            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onApprove(company.publishedId);
              }}
              className='px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center'
            >
              <CheckCircle className='w-3 h-3 md:w-4 md:h-4' />
              Approve
            </button>

            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onReject(company.publishedId);
              }}
              className='px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center'
            >
              <XCircle className='w-3 h-3 md:w-4 md:h-4' />
              Reject
            </button>

            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onDelete(company.publishedId);
              }}
              className='col-span-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center'
            >
              <Trash2 className='w-3 h-3 md:w-4 md:h-4' />
              Delete
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className='mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100'>
          <div className='flex justify-between items-center text-xs text-gray-400'>
            <span className="truncate mr-2">ID: {company.publishedId || 'No ID'}</span>
            <span>v{company.version}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className='flex items-center justify-center py-16'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
    <span className='ml-4 text-gray-600'>Loading companies...</span>
  </div>
);

// Error Component
const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => (
  <div className='text-center py-16'>
    <div className='text-6xl mb-4'>⚠</div>
    <p className='text-xl text-red-600 mb-2'>Error loading companies</p>
    <p className='text-gray-500 mb-4'>{error}</p>
    <button
      onClick={onRetry}
      className='bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors'
    >
      Try Again
    </button>
  </div>
);

// Main Content Area Component
const MainContent: React.FC<MainContentProps> = ({
  companies,
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
  industryFilter,
  sortBy,
  onClearFilters,
  onDelete
}) => {
  if (loading)
    return (
      <div className='flex-1 bg-blue-50 px-4 md:px-8 py-8'>
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className='flex-1 bg-blue-50 px-4 md:px-8 py-8'>
        <ErrorMessage error={error} onRetry={onRetry} />
      </div>
    );

  return (
    <div className='flex-1 bg-blue-50 px-4 md:px-8 py-8'>
      {/* Mobile filter button */}
      <button 
        onClick={onOpenMobileSidebar}
        className="md:hidden flex items-center gap-2 mb-6 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
      >
        <Menu className="w-4 h-4" />
        <span>Filters</span>
      </button>

      {/* Results Header */}
      <div className='flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-3 md:gap-4'>
        <h2 className='text-xl md:text-2xl font-bold text-black'>
          All Companies ({totalCount || companies.length})
        </h2>
        <div className='flex items-center gap-2 md:gap-4'>
          <span className='text-black font-medium text-sm md:text-base'>
            Page {currentPage} of {totalPages}
          </span>
          {hasMore && (
            <span className='text-xs md:text-sm text-gray-600 bg-blue-100 px-2 py-1 md:px-3 md:py-1 rounded-full'>
              More available
            </span>
          )}
        </div>
      </div>

      {/* Company Grid */}
      {companies.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
          {companies.map((company: Company, index: number) => (
            <div key={company.publishedId || index} className='animate-fadeIn'>
              <CompanyCard 
                company={company}
                onCredentials={onCredentials}
                onPreview={onPreview}
                onApprove={onApprove}
                onReject={onReject}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Check if filters are applied */}
          {searchTerm || industryFilter !== "All Sectors" || sortBy !== "Sort by Name" ? (
            // Empty State with Filters Applied
            <div className='text-center py-12 md:py-16'>
              <div className='text-6xl mb-4'>🔍</div>
              <p className='text-xl text-gray-700 mb-2'>No companies match your filters</p>
              <p className='text-gray-500 mb-6'>
                Try adjusting your search criteria or clear all filters
              </p>
              <button
                onClick={onClearFilters}
                className='bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors'
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            // Empty State - No companies at all
            <div className='text-center py-12 md:py-16'>
              <div className='text-6xl mb-4'>🏢</div>
              <p className='text-xl text-gray-700 mb-2'>No companies found</p>
              <p className='text-gray-500 mb-6'>
                There are no company listings in the system yet.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// API Service for Admin
const apiService = {
  async fetchAllCompanies(): Promise<ApiResponse> {
    try {
      const response = await fetch(
        'https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards?viewType=admin',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
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

  // Update the fetchCompanyCredentials function if it needs userId
async fetchCompanyCredentials(publishedId: string, userId: string): Promise<any> {
  try {
    const response = await fetch(
      `https://xe9l3knwqi.execute-api.ap-south-1.amazonaws.com/prod/admin/form-details/${publishedId}`);

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
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: body,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Approve response data:", data);
      
      return data;
    } catch (error) {
      console.error("Error approving company:", error);
      throw error;
    }
  },

  async rejectCompany(publishedId: string, action: string): Promise<any> {
    try {
      const response = await fetch(
        `https://twd6yfrd25.execute-api.ap-south-1.amazonaws.com/prod/admin/templates/review`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            
          },
          body: JSON.stringify({ publishedId, action }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Reject response data:", data);
      
      return data;
    } catch (error) {
      console.error("Error rejecting company:", error);
      throw error;
    }
  },

// Update the fetchPublishedDetails function in the apiService
async fetchPublishedDetails(publishedId: string,
   userId: string,
  //  setFinaleDataReview: (data: PublishedDetailsResponse) => void
  ): Promise<any> {
  try {
    const response = await fetch(
      `https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards/published-details/${publishedId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // setFinaleDataReview(data); // Set the data in the state
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
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`, // if required
        },
        body: JSON.stringify({
          publishedId,
          action: "delete",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Delete response data:", data);
    return data;
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
}

};

// Main Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  // const { setFinaleDataReview } = useTemplate(); // ✅ bring context setter
  // State management
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [industryFilter, setIndustryFilter] = useState<string>("All Sectors");
  const [sortBy, setSortBy] = useState<string>("Sort by Name");
  const [currentPage] = useState<number>(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [credentialsModal, setCredentialsModal] = useState<{isOpen: boolean; data: any}>({
    isOpen: false,
    data: null
  });

 // Update the handleCredentials function if it also needs userId
const handleCredentials = async (publishedId: string): Promise<void> => {
  try {
    // Find the company to get the userId
    const company = companies.find(c => c.publishedId === publishedId);
    if (!company) {
      toast.error("Company not found");
      return;
    }
    
    setLoading(true);
    const credentials = await apiService.fetchCompanyCredentials(publishedId, company.userId);
    
    // Open modal with credentials data
    setCredentialsModal({
      isOpen: true,
      data: credentials
    });
    
  } catch (error) {
    console.error("Error fetching company credentials:", error);
    toast.error("Failed to fetch company credentials");
  } finally {
    setLoading(false);
  }
};

 // Update the handlePreview function in the main component
const handlePreview = async (publishedId: string): Promise<void> => {
  try {
    // Find the company to get the userId
    const company = companies.find(c => c.publishedId === publishedId);
    if (!company) {
      toast.error("Company not found");
      return;
    }

    const details = await apiService.fetchPublishedDetails(publishedId, company.userId);

    // Navigate to preview page
    if(details.templateSelection === "template-1"){
      navigate(`/admin/companies/preview/1/${publishedId}/${company.userId}`);
    } else if(details.templateSelection === "template-2"){
      navigate(`/admin/companies/preview/2/${publishedId}/${company.userId}`);
    }
  } catch (error) {
    console.error("Error loading template for preview:", error);
    toast.error("Failed to load template for preview");
  }
};  

  // Handle approve button click
  const handleApprove = async (publishedId: string): Promise<void> => {
    try {
      const action = "approve";
      setLoading(true);
      const result = await apiService.approveCompany(publishedId, action);

      if (result.status === "approved") {
        toast.success("Company approved successfully");
        // Refresh the companies list
        fetchCompanies();
      } else {
        toast.error("Failed to approve company");
      }
    } catch (error) {
      console.error("Error approving company:", error);
      toast.error("Failed to approve company");
    } finally {
      setLoading(false);
    }
  };

  // Handle reject button click
  const handleReject = async (publishedId: string): Promise<void> => {
    try {
      const action = "reject";
      
      setLoading(true);
      const result = await apiService.rejectCompany(publishedId, action);

      if (result.status === "rejected") {
        toast.success("Company rejected successfully");
        // Refresh the companies list
        fetchCompanies();
      } else {
        toast.error("Failed to reject company");
      }
    } catch (error) {
      console.error("Error rejecting company:", error);
      toast.error("Failed to reject company");
    } finally {
      setLoading(false);
    }
  };

  // Clear filters function
  const handleClearFilters = (): void => {
    setSearchTerm("");
    setIndustryFilter("All Sectors");
    setSortBy("Sort by Name");
  };

  // Fetch all companies from API
  const fetchCompanies = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.fetchAllCompanies();
      
      setCompanies(data.cards || []);
      setTotalCount(data.totalCount || 0);
      setHasMore(data.hasTemplates || false);
      
    } catch (err) {
      console.error('Error in fetchCompanies:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch companies";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

   // Handle delete button click
  const handleDelete = async (publishedId: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      const result = await apiService.deleteCompany(publishedId);

      // console.log(result)
        toast.success("Company deleted successfully");
        // Refresh the companies list
        await fetchCompanies();
      
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Failed to delete company");
    } finally {
      setLoading(false);
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Get unique sectors from companies
  const industries: string[] = [
    "All Sectors",
    ...Array.from(new Set(companies.flatMap((c: Company) => c.sectors || []))).sort(),
  ];

  // Filter and sort companies
  const filteredCompanies = companies.filter((company: Company) => {
    const matchesSearch = !searchTerm || 
      (company.companyName && company.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.location && company.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.sectors && company.sectors.some((sector: string) =>
        sector.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    const matchesSector =
      industryFilter === "All Sectors" ||
      (company.sectors && company.sectors.includes(industryFilter));
    
    return matchesSearch && matchesSector;
  });

  // Sort companies
  const sortedCompanies = [...filteredCompanies].sort((a: Company, b: Company) => {
    switch (sortBy) {
      case "Sort by Location":
        return (a.location || "").localeCompare(b.location || "");
      case "Sort by Date":
        const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
        const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
        return dateB - dateA;
      case "Sort by Sector":
        const sectorA = a.sectors && a.sectors.length > 0 ? a.sectors[0] : "";
        const sectorB = b.sectors && b.sectors.length > 0 ? b.sectors[0] : "";
        return sectorA.localeCompare(sectorB);
      default:
        return (a.companyName || "").localeCompare(b.companyName || "");
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedCompanies.length / 12));

  return (
    <div className='min-h-screen bg-blue-100'>
      <Header />
      
      {/* Credentials Modal */}
   <CredentialsModal
  isOpen={credentialsModal.isOpen}
  onClose={() => setCredentialsModal({isOpen: false, data: null})}
  data={credentialsModal.data}
  loading={loading}
  onPreview={handlePreview}
  onApprove={handleApprove}
  onReject={handleReject}
  company={companies.find(c => c.publishedId === credentialsModal.data?.publishedId) || null}
/>
        

      {/* Main Layout Container */}
      <div className='flex flex-col md:flex-row bg-gray-50 min-h-screen'>
        {/* Left Sidebar */}
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

        {/* Main Content Area */}
        <MainContent
          companies={sortedCompanies}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          error={error}
          onRetry={fetchCompanies}
          totalCount={totalCount}
          hasMore={hasMore}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onCredentials={handleCredentials}
          onPreview={handlePreview}
          onApprove={handleApprove}
          onReject={handleReject}
          searchTerm={searchTerm}
          industryFilter={industryFilter}
          sortBy={sortBy}
          onClearFilters={handleClearFilters}
          // delete function
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;