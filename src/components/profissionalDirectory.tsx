import { Briefcase, ChevronDown, Edit, Eye, MapPin, Menu, Search, User, X } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserAuth } from "./context/context";

// TypeScript Interfaces for Professional Profiles
interface ProfessionalProfile {
  professionalId: string;
  professionalName: string;
  location: string;
  specialties: string[];
  publishedDate: string;
  previewImage?: string;
  status: string;
  userId: string;
  publicId: string;
  submissionId: string;
  jobTitle?: string;
  experience?: string;
  education?: string[];
  skills?: string[];
  templateSelection?:string;
}

interface ApiResponse {
  cards: ProfessionalProfile[];
  totalCount: number;
  hasMore: boolean;
  nextKey: string | null;
  userId?: string;
}

interface PublishedDetailsResponse {
  professionalId: string;
  templateSelection: string;
  websiteContent: {
    hero: {
      headline?: string;
      subheadline?: string;
      title?: string;
      subtitle?: string;
      description?: string;
      heroImage?: string;
      primaryCta?: string;
      secondaryCta?: string;
      features?: string[];
      keyBenefits?: string[];
    };
    about: {
      professionalName?: string;
      jobTitle?: string;
      experience?: string;
      location?: string;
      description1?: string;
      description2?: string;
      story?: string;
      mission?: string;
      education?: string[];
      skills?: string[];
      certifications?: string[];
      profileImage?: string;
    };
    services: {
      headline?: string;
      description?: string;
      services?: any[];
      expertise?: string[];
    };
    testimonials: any[];
    contact: any;
    faq: {
      headline?: string;
      description?: string;
      faqs?: Array<{ question: string; answer: string }>;
    };
    templateMetadata: any;
  };
  mediaAssets: {
    profileImageUrl?: string;
    heroBackgroundUrl?: string;
    certificateUrls?: string[];
  };
  profileInfo: {
    name: string;
    location: string;
    specialties: string[];
    experience: string;
  };
  contentSource: string;
  metadata: {
    lastModified: string;
    version: number;
    hasEdits: boolean;
    templateOptimized: boolean;
    ownerId: string;
  };
  editHistory?: {
    version: number;
    lastModified: string;
    editedSections?: string[];
  };
  publishedAt?: string;
  createdAt?: string;
}

interface User {
  userId: string;
  userData: {
    email: string;
    // Add other userData properties as needed
  };
  // Add other user properties as needed
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
  specialtyFilter: string;
  onSpecialtyChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  specialties: string[];
  isMobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
}

interface ProfileCardProps {
  profile: ProfessionalProfile;
  onEdit: (professionalId: string ,templateSelection: string) => void;
  onPreview: (professionalId: string,templateSelection: string) => void;
}

interface MainContentProps {
  profiles: ProfessionalProfile[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  totalCount: number;
  hasMore: boolean;
  onOpenMobileSidebar: () => void;
  onEdit: (professionalId: string,templateSelection: string) => void;
  onPreview: (professionalId: string, templateSelection: string) => void;
  searchTerm: string;
  specialtyFilter: string;
  sortBy: string;
  onClearFilters: () => void;
}

interface ErrorMessageProps {
  error: string;
  onRetry: () => void;
}

// Header Component for Professional Directory
const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className='h-[40vh] md:h-[60vh] bg-yellow-50 flex items-center justify-center px-4 sm:px-6'>
      {/* ===== Always Visible Popup ===== */}
      <div className="fixed right-12 top-28 z-10 animate-bounce">
        <div className="px-5 py-8 text-center bg-white rounded-xl border border-yellow-300 shadow-lg">
          <h2 className="text-base font-semibold text-amber-900 md:text-lg">
            🎉 Free Trial
          </h2>
          <p className="mt-1 text-lg font-semibold text-amber-700">
            You have{" "}
            <span className="font-bold text-amber-600">90</span> free trial days
            remaining.
          </p>
          <p className="pl-6 mt-4 text-sm text-left text-amber-700">
            ✅ Create <span className="font-bold text-amber-600">unlimited professional profiles</span>.
          </p>
          <p className="pl-6 mt-1 text-sm text-left text-amber-700">
            ✅ <span className="font-bold">Edit and customize</span> profiles at any time.
          </p>
        </div>
      </div>

      <div className='text-center max-w-3xl relative w-full'>
        {/* Geometric Elements - UPDATED COLORS */}
        <div className='absolute -top-10 -left-10 w-20 h-20 md:-top-20 md:-left-20 md:w-40 md:h-40 border border-yellow-200 rounded-full opacity-40'></div>
        <div className='absolute -bottom-8 -right-1 w-16 h-16 md:-bottom-16 md:-right-[-5.9rem] md:w-32 md:h-32 bg-yellow-200 opacity-30 rounded-2xl'></div>

        <div className='relative z-10'>
          <div className='flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-8'>
            <div className='w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full'></div>
            <div className='w-4 h-4 md:w-6 md:h-6 border-2 border-amber-400'></div>
            <div className='w-3 h-3 md:w-4 md:h-4 bg-amber-600 rotate-45'></div>
          </div>

          <h1 className='text-3xl md:text-5xl font-light text-amber-900 mb-4 md:mb-6'>
            My Professional Profiles
            <span className='block text-xl md:text-3xl font-extralight text-yellow-600 mt-1 md:mt-2'>
              Dashboard
            </span>
          </h1>

          <p className='text-base md:text-lg text-amber-700 mb-6 md:mb-10 max-w-xl mx-auto font-light'>
            Manage your professional profiles, showcase your expertise, and update your content.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <button
              onClick={() => navigate('/professional/select')}
              className='bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 md:px-8 md:py-4 font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 rounded-lg w-full sm:w-auto text-sm md:text-base'
            >
              + Add New Profile
            </button>
            <div className='w-px h-8 md:h-12 bg-yellow-300 hidden sm:block'></div>
            <button className='text-amber-700 hover:text-amber-900 transition-colors duration-300 text-sm md:text-base sm:mt-0 mt-2'>
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
/* Dropdown Filter Component - UNCHANGED */
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
  specialtyFilter,
  onSpecialtyChange,
  sortBy,
  onSortChange,
  specialties,
  isMobileSidebarOpen,
  onCloseMobileSidebar
}) => {
  const sortOptions: string[] = [
    "Sort by Name",
    "Sort by Location",
    "Sort by Date",
    "Sort by Specialty",
  ];
  const navigate = useNavigate();

  return (
    <div className={`bg-yellow-50 p-4 md:p-8 h-fit md:sticky md:top-0 border-r border-gray-100 
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
              placeholder='Search profiles...'
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
              className='w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-gray-50 transition-colors'
            />
          </div>
        </div>

        {/* Specialty Filter */}
        <div className='space-y-3'>
          <label className='text-sm font-medium text-gray-900 block'>
            Specialty
          </label>
          <MinimalisticDropdown
            value={specialtyFilter}
            onChange={onSpecialtyChange}
            options={specialties}
            placeholder='Select specialty'
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
            onSpecialtyChange("All Specialties");
            onSortChange("Sort by Name");
          }}
          className='text-sm text-gray-500 hover:text-gray-700 transition-colors underline underline-offset-2'
        >
          Clear all filters
        </button>

        {/* Divider */}
        <div className='border-t border-gray-100'></div>


         <motion.button
        whileTap={{ scale: [0.9, 1] }}
        className="bg-blue-300 p-2 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 duration-200"
      >
        <Link to={"/user/companies"}>Companies </Link>
      </motion.button>


        {/* CTA Section */}
        <div className='space-y-3'>
          <p className='text-sm text-gray-600'>Ready to showcase your expertise?</p>
          <button 
            onClick={()=>navigate("/professional/select")}
            className='w-full bg-gray-900 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors'
          >
            Create New Profile
          </button>
        </div>
      </div>
    </div>
  );
};

// Profile Card Component with Edit/Preview Buttons
const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEdit, onPreview }) => {
  // Create a placeholder image using profile name
  const placeholderImg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6' rx='8'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='%23374151' font-size='20' font-family='Arial' font-weight='bold'%3E${
    profile.professionalName?.charAt(0) || "P"
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
  const getStatusBadge = (status: string) => {
    const statusLower = (status).toLowerCase();
    
    switch (statusLower) {
      case 'active':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          label: 'Under Review'
        };
      case 'approved':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          label: 'Published'
        };
      case 'rejected':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          label: 'Rejected'
        };
      default:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          label: 'Published'
        };
    }
  };

  const statusStyle = getStatusBadge(profile.status);

  return (
    <div className='overflow-hidden w-full h-full bg-gray-50  rounded-2xl border-l-8 shadow-lg transition-all duration-300 hover:shadow-xl border-gradient-to-b group'>
      <div className='p-4 md:p-6 lg:p-8'>
        <div className='flex items-center justify-between mb-4 md:mb-6'>
          <div className='flex items-center gap-3 md:gap-4'>
            <div className='w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden shadow-md bg-white p-1 md:p-2 flex items-center justify-center group-hover:shadow-lg group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110'>
              <img
                src={profile.previewImage || placeholderImg}
                alt={`${profile.professionalName} profile`}
                className='w-full h-full object-contain transition-all duration-500 group-hover:rotate-[-3deg] group-hover:scale-110'
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.target as HTMLImageElement;
                  target.src = placeholderImg;
                }}
              />
            </div>
            <div className="max-w-[calc(100%-60px)] md:max-w-none">
              <h3 className='text-lg md:text-xl font-bold text-gray-900 line-clamp-2'>
                {profile.professionalName || 'Unnamed Profile'}
              </h3>
              <div className='flex items-center text-gray-600 mt-1'>
                <MapPin className='w-3 h-3 mr-1' />
                <span className='text-xs md:text-sm'>{profile.location || 'Location not specified'}</span>
              </div>
              {profile.jobTitle && (
                <div className='flex items-center text-gray-600 mt-1'>
                  <Briefcase className='w-3 h-3 mr-1' />
                  <span className='text-xs md:text-sm'>{profile.jobTitle}</span>
                </div>
              )}
            </div>
          </div>
          <div className='text-right hidden sm:block'>
            <div className={`inline-flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium`}>
              <User className='w-3 h-3' />
              {statusStyle.label}
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className='mb-4 md:mb-6'>
          <div className='flex flex-wrap gap-1 md:gap-2'>
            {(profile.specialties && profile.specialties.length > 0 ? profile.specialties : ['General']).map((specialty: string, index: number) => (
              <span
                key={index}
                className='px-2 py-1 md:px-3 md:py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Skills (if available) */}
        {profile.skills && profile.skills.length > 0 && (
          <div className='mb-4 md:mb-6'>
            <div className='flex flex-wrap gap-1 md:gap-2'>
              {profile.skills.slice(0, 3).map((skill: string, index: number) => (
                <span
                  key={index}
                  className='px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full'
                >
                  {skill}
                </span>
              ))}
              {profile.skills.length > 3 && (
                <span className='px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full'>
                  +{profile.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Date and Actions Row */}
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-3 md:gap-6'>
            <div className='flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1 md:px-4 md:py-2'>
              <span className='font-bold text-purple-600 text-xs md:text-sm'>
                {profile.publishedDate ? formatDate(profile.publishedDate) : 'Date not available'}
              </span>
              <span className='text-xs text-gray-600 hidden md:block'>Published</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-2 justify-end'>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                const url = `${window.location.origin}/form/${profile.professionalId}/${profile.userId}/${profile.submissionId}`;
                window.open(url, "_blank");
              }}
              className="px-3 py-2 md:px-4 md:py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2"
            >
              <Edit className="w-3 h-3 md:w-4 md:h-4" />
              Edit Data
            </button>

            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onPreview(profile.professionalId, profile.templateSelection || "");
              }}
              className='px-3 py-2 md:px-4 md:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2'
            >
              <Eye className='w-3 h-3 md:w-4 md:h-4' />
              Preview
            </button>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onEdit(profile.professionalId, profile.templateSelection || "" );
              }}
              className='px-3 py-2 md:px-4 md:py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2'
            >
              <Edit className='w-3 h-3 md:w-4 md:h-4' />
              Edit
            </button>
          </div>
        </div>

        {/* Published ID (small text at bottom) */}
        <div className='mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100'>
          <div className='flex justify-between items-center text-xs text-gray-400'>
            <span className="truncate mr-2">ID: {profile.professionalId || 'No ID'}</span>
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
    <span className='ml-4 text-gray-600'>Loading profiles...</span>
  </div>
);

// Error Component
const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => (
  <div className='text-center py-16'>
    <div className='text-6xl mb-4'>⚠</div>
    <p className='text-xl text-red-600 mb-2'>Error loading profiles</p>
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
  profiles,
  currentPage,
  totalPages,
  loading,
  error,
  onRetry,
  totalCount,
  hasMore,
  onOpenMobileSidebar,
  onEdit,
  onPreview,
  searchTerm,
  specialtyFilter,
  sortBy,
  onClearFilters
}) => {
  const navigate = useNavigate();
  
  if (loading)
    return (
      <div className='flex-1 bg-yellow-50 px-4 md:px-8 py-8'>
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className='flex-1 bg-yellow-50 px-4 md:px-8 py-8'>
        <ErrorMessage error={error} onRetry={onRetry} />
      </div>
    );

  return (
    <div className='flex-1 bg-yellow-50 px-4 md:px-8 py-8'>
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
          My Professional Profiles ({totalCount || profiles.length})
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

      {/* Profile Grid */}
      {profiles.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
          {profiles.map((profile: ProfessionalProfile, index: number) => (
            <div key={profile.professionalId || index} className='animate-fadeIn'>
              <ProfileCard 
                profile={profile}
                onEdit={onEdit}
                onPreview={onPreview}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Check if filters are applied */}
          {searchTerm || specialtyFilter !== "All Specialties" || sortBy !== "Sort by Name" ? (
            // Empty State with Filters Applied
            <div className='text-center py-12 md:py-16'>
              <div className='text-6xl mb-4'>🔍</div>
              <p className='text-xl text-gray-700 mb-2'>No profiles match your filters</p>
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
            // Empty State - No profiles at all
            <div className='text-center py-12 md:py-16'>
              <div className='text-6xl mb-4'>👤</div>
              <p className='text-xl text-gray-700 mb-2'>No profiles found</p>
              <p className='text-gray-500 mb-6'>
                You haven't created any professional profiles yet.
              </p>
              <button 
                onClick={() => navigate('/user/professionals/template-selection')}
                className='bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors'
              >
                Create Your First Professional Profile
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// API Service for Professional Profiles
const apiService = {
  async fetchProfiles(userId: string): Promise<ApiResponse> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error("Valid user ID is required");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    console.log("userId",userId);
    
    try {
      const url = new URL(`https://zgkue3u9cl.execute-api.ap-south-1.amazonaws.com/prod/professional-dashboard-cards?viewType=user&userId=${userId.trim()}`);
      // url.searchParams.append('userId', userId.trim());
      
      // console.log('Fetching profiles from:', url.toString());
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'X-User-ID': userId.trim(),
          'Accept': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorText = 'Unknown error occurred';
        let errorJson = null;
        
        try {
          const contentType = response.headers.get('content-type');
          
          if (contentType && contentType.includes('application/json')) {
            errorJson = await response.json();
            errorText = errorJson.message || errorJson.error || errorJson.errorMessage || `HTTP ${response.status}`;
            
          } else {
            errorText = await response.text();
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
          errorText = `HTTP ${response.status} - Unable to parse error response`;
        }
        
        console.error("API Error Response:", { status: response.status, error: errorText, details: errorJson });
        
        switch (response.status) {
          case 400:
            throw new Error("Invalid request. Please check your user ID and try again.");
          case 401:
            throw new Error("Authentication required. Please log in to view your profiles.");
          case 403:
            throw new Error("Access denied. You don't have permission to view these profiles.");
          case 404:
            throw new Error("Service not found. Please contact support if this persists.");
          case 429:
            throw new Error("Too many requests. Please wait a moment and try again.");
          case 500:
            throw new Error("Server error. Please try again later.");
          case 502:
          case 503:
          case 504:
            throw new Error("Service temporarily unavailable. Please try again in a few minutes.");
          default:
            throw new Error(`Request failed (${response.status}): ${errorText}`);
        }
      }

      let data;
      try {
        const responseText = await response.text();
        if (!responseText) {
          throw new Error("Empty response from server");
        }
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        throw new Error("Invalid response format from server");
      }

      console.log("API Response:", data);

      if (typeof data !== 'object' || data === null) {
        throw new Error("Invalid response format: expected object");
      }

      const cards = data.cards || data.items || data.profiles || [];
      
      if (!Array.isArray(cards)) {
        console.warn("Cards is not an array:", cards);
        return {
          cards: [],
          totalCount: 0,
          hasMore: false,
          nextKey: null,
        };
      }

      const sanitizedCards = cards.map((card, index) => {
        try {
          return {
            professionalId: String(card.professionalId || card.id || `temp-${index}`),
            professionalName: String(card.professionalName || card.name || 'Unnamed Profile'),
            location: String(card.location || 'Location not specified'),
            specialties: Array.isArray(card.specialties) ? card.specialties.map(s => String(s)) : (card.specialties ? [String(card.specialties)] : ['General']),
            status: String(card.status || card.reviewStatus || 'approved').toLowerCase(),
            publishedDate: card.publishedDate || card.createdAt || card.date || new Date().toISOString(),
            previewImage: card.previewImage || card.profileImage || card.image || '',
            userId: String(card.userId || ''),
            submissionId: String(card.submissionId || ''),
            jobTitle: card.jobTitle || card.title || '',
            experience: card.experience || '',
            skills: Array.isArray(card.skills) ? card.skills : [],
            education: Array.isArray(card.education) ? card.education : [],
            templateSelection: String(card.templateSelection)
          };
        } catch (cardError) {
          console.error(`Error processing card at index ${index}:`, cardError);
          return null;
        }
      }).filter(Boolean) as ProfessionalProfile[];

      return {
        cards: sanitizedCards,
        totalCount: data.totalCount || sanitizedCards.length,
        hasMore: Boolean(data.hasMore),
        nextKey: data.nextKey || null,
      };

    } catch (error) {
      clearTimeout(timeoutId);
      
      console.error("Error fetching profiles:", error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Network error. Please check your internet connection and try again.");
      }
      
      if (error.name === 'AbortError') {
        throw new Error("Request timed out. Please try again.");
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error("An unexpected error occurred while fetching profiles");
    }
  },


};

// Main Professional Directory Component
const ProfessionalDirectory: React.FC = () => {
  const { user }: { user: User | null } = useUserAuth();
  const navigate = useNavigate();

  // State management
  const [profiles, setProfiles] = useState<ProfessionalProfile[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("All Specialties");
  const [sortBy, setSortBy] = useState<string>("Sort by Name");
  const [currentPage] = useState<number>(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
 
  // Navigation handlers
  const handleEdit = async (professionalId: string ,templateSelection:string): Promise<void> => {
    try {
      if (!user?.userData?.email) {
        throw new Error("User not authenticated");
      }
      
      // const details = await apiService.fetchPublishedDetails(
      //   professionalId,
      //   user.userData.email,
      //   setFinaleDataReview
      // );

      if(templateSelection === "template-1"){
        navigate(`/user/professionals/edit/1/${professionalId}/${user.userData.email}`);
      }else if(templateSelection === "template-2"){
        navigate(`/user/professionals/edit/2/${professionalId}/${user.userData.email}`);
      }

    } catch (error) {
      console.error("Error loading template for editing:", error);
      toast.error("Failed to load template for editing. Please try again.");
    }
  };

  const handlePreview = async (professionalId: string, templateSelection:string): Promise<void> => {
    try {
      if (!user?.userData?.email) {
        throw new Error("User not authenticated");
      }
      // const details = await apiService.fetchPublishedDetails(
      //   professionalId,
      //   user.userData.email,
      //   setFinaleDataReview
      // );
    console.log("template ID",templateSelection);
    
      if(templateSelection === "template-1"){
        navigate(`/user/professionals/preview/1/${professionalId}/${user.userData.email}`);
      }else if(templateSelection === "template-2"){
        navigate(`/user/professionals/preview/2/${professionalId}/${user.userData.email}`);
      }
    } catch (error) {
      console.error("Error loading template for preview:", error);
      alert("Failed to load template for preview. Please try again.");
    }
  };

  // Clear filters function
  const handleClearFilters = (): void => {
    setSearchTerm("");
    setSpecialtyFilter("All Specialties");
    setSortBy("Sort by Name");
  };

  // Fetch profiles from API
  const fetchProfiles = async (): Promise<void> => {
    try {
      if (!user) {
        throw new Error("User not authenticated. Please log in to view your profiles.");
      }

      if (!user.userData.email || user.userData.email.trim() === '') {
        throw new Error("User ID is missing. Please log in again.");
      }

      console.log('Fetching profiles for user:', { 
        userId: user.userData.email, 
        userType: typeof user.userData.email,
        userExists: !!user 
      });

      setLoading(true);
      setError(null);
      
      const data = await apiService.fetchProfiles(user.userData.email);

      console.log('Profiles fetch successful:', {
        cardsCount: data.cards?.length || 0,
        totalCount: data.totalCount,
        hasMore: data.hasMore
      });
      
      setProfiles(data.cards || []);
      setTotalCount(data.totalCount || 0);
      setHasMore(data.hasMore || false);
      
    } catch (err) {
      console.error('Error in fetchProfiles:', err);
      
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch profiles";
      setError(errorMessage);
      
      if (errorMessage.includes("not authenticated") || 
          errorMessage.includes("User ID") || 
          errorMessage.includes("log in")) {
        console.log('Authentication error detected');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    console.log('ProfessionalDirectory useEffect triggered:', { 
      user: !!user, 
      userId: user?.userData?.email,
      timestamp: new Date().toISOString()
    });
    
    const initializeData = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));

      if (user && user.userData?.email && user.userData.email.trim() !== '') {
        console.log('User validated, fetching profiles...');
        fetchProfiles();
      } else if (user === null) {
        console.log('No authenticated user found');
        setError("Please log in to view your profiles");
        setLoading(false);
      }
    };
    
    initializeData();
  }, [user]);

  // Get unique specialties from profiles
  const specialties: string[] = [
    "All Specialties",
    ...Array.from(new Set(profiles.flatMap((p: ProfessionalProfile) => p.specialties || []))).sort(),
  ];

  // Filter and sort profiles
  const filteredProfiles = profiles.filter((profile: ProfessionalProfile) => {
    const matchesSearch = !searchTerm || 
      (profile.professionalName && profile.professionalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (profile.location && profile.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (profile.specialties && profile.specialties.some((specialty: string) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )) ||
      (profile.jobTitle && profile.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty =
      specialtyFilter === "All Specialties" ||
      (profile.specialties && profile.specialties.includes(specialtyFilter));
    
    return matchesSearch && matchesSpecialty;
  });

  // Sort profiles
  const sortedProfiles = [...filteredProfiles].sort((a: ProfessionalProfile, b: ProfessionalProfile) => {
    switch (sortBy) {
      case "Sort by Location":
        return (a.location || "").localeCompare(b.location || "");
      case "Sort by Date":
        const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
        const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
        return dateB - dateA;
      case "Sort by Specialty":
        const specialtyA = a.specialties && a.specialties.length > 0 ? a.specialties[0] : "";
        const specialtyB = b.specialties && b.specialties.length > 0 ? b.specialties[0] : "";
        return specialtyA.localeCompare(specialtyB);
      default:
        return (a.professionalName || "").localeCompare(b.professionalName || "");
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedProfiles.length / 12));

  return (
    <div className='min-h-screen bg-blue-100'>
      <Header />

      {/* Main Layout Container */}
      <div className='flex flex-col md:flex-row bg-gray-50 min-h-screen'>
        {/* Left Sidebar */}
        <Sidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          specialtyFilter={specialtyFilter}
          onSpecialtyChange={setSpecialtyFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          specialties={specialties}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <MainContent
          profiles={sortedProfiles}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          error={error}
          onRetry={fetchProfiles}
          totalCount={totalCount}
          hasMore={hasMore}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onEdit={handleEdit}
          onPreview={handlePreview}
          searchTerm={searchTerm}
          specialtyFilter={specialtyFilter}
          sortBy={sortBy}
          onClearFilters={handleClearFilters}
        />
      </div>
    </div>
  );
};

export default ProfessionalDirectory;