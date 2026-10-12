import React, { useState } from "react";
import { Search, MapPin, ChevronDown, ArrowRight, Star, Users, Calendar, Menu, X, Eye, Edit } from "lucide-react";

// TypeScript Interfaces
interface Event {
    publishedId: string;
    eventName: string;
    location: string;
    categories: string[];
    eventDate: string;
    previewImage?: string;
    status: string;
    userId: string;
    publicId: string;
    draftId: string;
    reviewStatus: string;
    attendees: number;
    rating: number;
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
    onEdit: (publishedId: string) => void;
    onPreview: (publishedId: string) => void;
}

interface MainContentProps {
    events: Event[];
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    totalCount: number;
    hasMore: boolean;
    onOpenMobileSidebar: () => void;
    onEdit: (publishedId: string) => void;
    onPreview: (publishedId: string) => void;
    searchTerm: string;
    categoryFilter: string;
    sortBy: string;
    onClearFilters: () => void;
}

interface ErrorMessageProps {
    error: string;
    onRetry: () => void;
}

// Header Component
const Header: React.FC = () => {
    return (
        <div className='h-[40vh] md:h-[60vh] bg-status-info/10 flex items-center justify-center px-4 sm:px-6'>
            {/* ===== Always Visible Popup ===== */}
            <div className="fixed right-12 top-28 z-10 animate-bounce">
                <div className="px-5 py-8 text-center bg-surface-card rounded-xl border border-status-info/40 shadow-lg">
                    <h2 className="text-base font-semibold text-status-info md:text-lg">
                        🎉 Free Trial
                    </h2>
                    <p className="mt-1 text-lg font-semibold text-status-info">
                        You have{" "}
                        <span className="font-bold text-status-info">90</span> free trial days
                        remaining.
                    </p>
                    <p className="pl-6 mt-4 text-sm text-left text-status-info">
                        ✅ Create <span className="font-bold text-status-info">unlimited events</span>.
                    </p>
                    <p className="pl-6 mt-1 text-sm text-left text-status-info">
                        ✅ <span className="font-bold">Edit and customize</span> events at any time.
                    </p>
                </div>
            </div>

            <div className='relative w-full max-w-3xl text-center'>
                {/* Geometric Elements */}
                <div className='absolute -top-10 -left-10 w-20 h-20 rounded-full border border-status-info/25 opacity-40 md:-top-20 md:-left-20 md:w-40 md:h-40'></div>
                <div className='absolute -bottom-8 -right-1 w-16 h-16 md:-bottom-16 md:-right-[-5.9rem] md:w-32 md:h-32 bg-status-info/25 opacity-30 rounded-2xl'></div>

                <div className='relative z-10'>
                    <div className='flex gap-2 justify-center items-center mb-4 md:gap-4 md:mb-8'>
                        <div className='w-2 h-2 bg-status-info rounded-full md:w-3 md:h-3'></div>
                        <div className='w-4 h-4 border-2 border-status-info md:w-6 md:h-6'></div>
                        <div className='w-3 h-3 bg-status-info rotate-45 md:w-4 md:h-4'></div>
                    </div>

                    <h1 className='mb-4 text-3xl font-light text-status-info md:text-5xl md:mb-6'>
                        My Events
                        <span className='block mt-1 text-xl font-extralight text-status-info md:text-3xl md:mt-2'>
                            Dashboard
                        </span>
                    </h1>

                    <p className='mx-auto mb-6 max-w-xl text-base font-light text-status-info md:text-lg md:mb-10'>
                        Manage your events, track attendance, and update event details.
                    </p>

                    <div className='flex flex-col gap-4 justify-center items-center sm:flex-row'>
                        <button
                            onClick={() => alert('Navigate to event creation')}
                            className='px-6 py-3 w-full text-sm font-semibold text-ink bg-gradient-to-r from-status-info to-status-info rounded-lg shadow-lg transition-all duration-300 transform md:px-8 md:py-4 hover:from-status-info hover:to-status-info hover:shadow-xl hover:-translate-y-1 sm:w-auto md:text-base'
                        >
                            + Create New Event
                        </button>
                        <div className='hidden w-px h-8 bg-status-info/40 md:h-12 sm:block'></div>
                        <button className='mt-2 text-sm text-status-info transition-colors duration-300 hover:text-status-info md:text-base sm:mt-0'>
                            View Analytics
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
                className='flex justify-between items-center px-4 py-3 w-full text-sm text-ink-paragraph bg-ink-offwhite rounded-lg border border-ink-light transition-colors hover:bg-ink-light focus:outline-none focus:ring-1 focus:ring-ink-light'
            >
                <span
                    className={value === options[0] ? "text-ink-caption" : "text-ink"}
                >
                    {value || placeholder}
                </span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className='absolute z-10 mt-1 w-full bg-surface-card rounded-lg border border-ink-light shadow-sm'>
                    {options.map((option: string, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => {
                                onChange(option);
                                setOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${value === option
                                ? "bg-ink-offwhite text-ink font-medium"
                                : "text-ink-paragraph hover:bg-ink-offwhite"
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
    onCloseMobileSidebar
}) => {
    const sortOptions: string[] = [
        "Sort by Name",
        "Sort by Location",
        "Sort by Date",
        "Sort by Category",
    ];

    return (
        <div className={`bg-status-info/10 p-4 md:p-8 h-fit md:sticky md:top-0 border-r border-ink-light 
      ${isMobileSidebarOpen ? 'overflow-y-auto fixed inset-0 z-50 w-full' : 'hidden md:block md:w-80'}`}
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
                    <label className='block text-sm font-medium text-ink'>
                        Search
                    </label>
                    <div className='relative'>
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <Search className="h-4 w-4 text-ink-caption" />
                        </div>
                        <input
                            type='text'
                            placeholder='Search events...'
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                            className='py-3 pr-4 pl-10 w-full text-sm bg-ink-offwhite rounded-lg border border-ink-light transition-colors focus:outline-none focus:ring-1 focus:ring-ink-light focus:border-ink-light'
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className='space-y-3'>
                    <label className='block text-sm font-medium text-ink'>
                        Category
                    </label>
                    <MinimalisticDropdown
                        value={categoryFilter}
                        onChange={onCategoryChange}
                        options={categories}
                        placeholder='Select category'
                    />
                </div>

                {/* Sort Filter */}
                <div className='space-y-3'>
                    <label className='block text-sm font-medium text-ink'>
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
                        onCategoryChange("All Categories");
                        onSortChange("Sort by Name");
                    }}
                    className='text-sm text-ink-caption underline transition-colors hover:text-ink-paragraph underline-offset-2'
                >
                    Clear all filters
                </button>

                {/* Divider */}
                <div className='border-t border-ink-light'></div>

                {/* CTA Section */}
                <div className='space-y-3'>
                    <p className='text-sm text-ink-paragraph'>Ready to create?</p>
                    <button
                        onClick={() => alert('Navigate to event creation')}
                        className='px-4 py-3 w-full text-sm font-medium text-white bg-ink rounded-lg transition-colors hover:bg-ink-charcoal'
                    >
                        Create New Event
                    </button>
                </div>
            </div>
        </div>
    );
};

// Event Card Component with Edit/Preview Buttons
const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onPreview }) => {
    // Create a placeholder image using event name
    const placeholderImg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6' rx='8'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='%23374151' font-size='20' font-family='Arial' font-weight='bold'%3E${event.eventName?.charAt(0) || "E"
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
                    bg: 'bg-status-info/15',
                    text: 'text-status-info',
                    label: 'Active'
                };
            case 'approved':
                return {
                    bg: 'bg-status-success/15',
                    text: 'text-status-success',
                    label: 'Published'
                };
            case 'rejected':
                return {
                    bg: 'bg-status-error/15',
                    text: 'text-status-error',
                    label: 'Rejected'
                };
            default:
                return {
                    bg: 'bg-status-info/15',
                    text: 'text-status-info',
                    label: 'Published'
                };
        }
    };

    const statusStyle = getStatusBadge(event.reviewStatus);

    return (
        <div className='overflow-hidden w-full h-full bg-gradient-to-br from-status-info/10 to-status-info/15 rounded-2xl border-l-8 border-status-info/40 shadow-lg transition-all duration-300 hover:shadow-xl group'>
            <div className='p-4 md:p-6 lg:p-8'>
                <div className='flex justify-between items-center mb-4 md:mb-6'>
                    <div className='flex gap-3 items-center md:gap-4'>
                        <div className='flex overflow-hidden justify-center items-center p-1 w-12 h-12 bg-surface-card rounded-xl shadow-md transition-all duration-500 md:w-14 md:h-14 lg:w-16 lg:h-16 md:p-2 group-hover:shadow-lg group-hover:bg-gradient-to-br group-hover:from-status-info/10 group-hover:to-status-info/10 group-hover:rotate-3 group-hover:scale-110'>
                            <img
                                src={event.previewImage || placeholderImg}
                                alt={`${event.eventName} preview`}
                                className='w-full h-full object-contain transition-all duration-500 group-hover:rotate-[-3deg] group-hover:scale-110'
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = placeholderImg;
                                }}
                            />
                        </div>
                        <div className="max-w-[calc(100%-60px)] md:max-w-none">
                            <h3 className='text-lg font-bold text-ink md:text-xl line-clamp-2'>
                                {event.eventName || 'Unnamed Event'}
                            </h3>
                            <div className='flex items-center mt-1 text-ink-paragraph'>
                                <MapPin className='mr-1 w-3 h-3' />
                                <span className='text-xs md:text-sm'>{event.location || 'Location not specified'}</span>
                            </div>
                        </div>
                    </div>
                    <div className='hidden text-right sm:block'>
                        <div className={`inline-flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium`}>
                            <Calendar className='w-3 h-3' />
                            {statusStyle.label}
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className='mb-4 md:mb-6'>
                    <div className='flex flex-wrap gap-1 md:gap-2'>
                        {(event.categories && event.categories.length > 0 ? event.categories : ['General']).map((category: string, index: number) => (
                            <span
                                key={index}
                                className='px-2 py-1 text-xs font-medium text-status-info bg-status-info/15 rounded-full md:px-3 md:py-1'
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Event Details */}
                <div className='flex gap-4 mb-4 text-sm text-ink-paragraph'>
                    <div className='flex gap-1 items-center'>
                        <Users className='w-4 h-4' />
                        <span>{event.attendees || 0} attendees</span>
                    </div>
                    <div className='flex gap-1 items-center'>
                        <Star className='w-4 h-4 text-brand-gold' />
                        <span>{event.rating || 0}/5</span>
                    </div>
                </div>

                {/* Date and Actions Row */}
                <div className='flex flex-col gap-3'>
                    <div className='flex gap-3 items-center md:gap-6'>
                        <div className='flex gap-2 items-center px-3 py-1 bg-ink-offwhite rounded-lg md:px-4 md:py-2'>
                            <Calendar className='w-3 h-3 text-status-info' />
                            <span className='text-xs font-bold text-status-info md:text-sm'>
                                {event.eventDate ? formatDate(event.eventDate) : 'Date not available'}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-2 justify-end'>
                        <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                alert(`Edit Data for: ${event.eventName}`);
                            }}
                            className="flex gap-2 items-center px-3 py-2 text-xs font-medium text-status-info bg-status-info/15 rounded-lg transition-colors md:px-4 md:py-2 hover:bg-status-info/25 md:text-sm"
                        >
                            <Edit className="w-3 h-3 md:w-4 md:h-4" />
                            Edit Data
                        </button>

                        <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                onPreview(event.publishedId);
                            }}
                            className='flex gap-2 items-center px-3 py-2 text-xs font-medium text-status-info bg-status-info/15 rounded-lg transition-colors md:px-4 md:py-2 hover:bg-status-info/25 md:text-sm'
                        >
                            <Eye className='w-3 h-3 md:w-4 md:h-4' />
                            Preview
                        </button>
                        <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                onEdit(event.publishedId);
                            }}
                            className='flex gap-2 items-center px-3 py-2 text-xs font-medium text-status-success bg-status-success/15 rounded-lg transition-colors md:px-4 md:py-2 hover:bg-status-success/25 md:text-sm'
                        >
                            <Edit className='w-3 h-3 md:w-4 md:h-4' />
                            Edit
                        </button>
                    </div>
                </div>

                {/* Published ID (small text at bottom) */}
                <div className='pt-3 mt-3 border-t border-ink-light md:mt-4 md:pt-4'>
                    <div className='flex justify-between items-center text-xs text-ink-caption'>
                        <span className="mr-2 truncate">ID: {event.publishedId || 'No ID'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Loading Component
const LoadingSpinner: React.FC = () => (
    <div className='flex justify-center items-center py-16'>
        <div className='w-12 h-12 rounded-full border-b-2 border-status-info animate-spin'></div>
        <span className='ml-4 text-ink-paragraph'>Loading events...</span>
    </div>
);

// Error Component
const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => (
    <div className='py-16 text-center'>
        <div className='mb-4 text-6xl'>⚠</div>
        <p className='mb-2 text-xl text-status-error'>Error loading events</p>
        <p className='mb-4 text-ink-caption'>{error}</p>
        <button
            onClick={onRetry}
            className='px-6 py-3 font-semibold text-white bg-status-error rounded-lg transition-colors hover:bg-status-error'
        >
            Try Again
        </button>
    </div>
);

// Main Content Area Component
const MainContent: React.FC<MainContentProps> = ({
    events,
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
    categoryFilter,
    sortBy,
    onClearFilters
}) => {
    if (loading)
        return (
            <div className='flex-1 px-4 py-8 bg-status-info/10 md:px-8'>
                <LoadingSpinner />
            </div>
        );
    if (error)
        return (
            <div className='flex-1 px-4 py-8 bg-status-info/10 md:px-8'>
                <ErrorMessage error={error} onRetry={onRetry} />
            </div>
        );

    return (
        <div className='flex-1 px-4 py-8 bg-status-info/10 md:px-8'>
            {/* Mobile filter button */}
            <button
                onClick={onOpenMobileSidebar}
                className="flex gap-2 items-center px-4 py-2 mb-6 bg-surface-card rounded-lg border border-ink-light shadow-sm md:hidden"
            >
                <Menu className="w-4 h-4" />
                <span>Filters</span>
            </button>

            {/* Results Header */}
            <div className='flex flex-wrap gap-3 justify-between items-center mb-6 md:mb-8 md:gap-4'>
                <h2 className='text-xl font-bold text-ink md:text-2xl'>
                    My Events ({totalCount || events.length})
                </h2>
                <div className='flex gap-2 items-center md:gap-4'>
                    <span className='text-sm font-medium text-ink md:text-base'>
                        Page {currentPage} of {totalPages}
                    </span>
                    {hasMore && (
                        <span className='px-2 py-1 text-xs text-ink-paragraph bg-status-info/15 rounded-full md:text-sm md:px-3 md:py-1'>
                            More available
                        </span>
                    )}
                </div>
            </div>

            {/* Event Grid */}
            {events.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6'>
                    {events.map((event: Event, index: number) => (
                        <div key={event.publishedId || index} className='animate-fadeIn'>
                            <EventCard
                                event={event}
                                onEdit={onEdit}
                                onPreview={onPreview}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Check if filters are applied */}
                    {searchTerm || categoryFilter !== "All Categories" || sortBy !== "Sort by Name" ? (
                        // Empty State with Filters Applied
                        <div className='py-12 text-center md:py-16'>
                            <div className='mb-4 text-6xl'>🔍</div>
                            <p className='mb-2 text-xl text-ink-paragraph'>No events match your filters</p>
                            <p className='mb-6 text-ink-caption'>Try adjusting your search criteria or clear all filters</p>
                            <button
                                onClick={onClearFilters}
                                className='px-6 py-3 font-semibold text-white bg-status-info rounded-lg transition-colors hover:bg-status-info'
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        // Empty State - No events at all
                        <div className='py-12 text-center md:py-16'>
                            <div className='mb-4 text-6xl'>🎪</div>
                            <p className='mb-2 text-xl text-ink-paragraph'>No events found</p>
                            <p className='mb-6 text-ink-caption'>You haven't created any events yet.</p>
                            <button
                                onClick={() => alert('Navigate to event creation')}
                                className='px-6 py-3 font-semibold text-ink bg-status-info rounded-lg transition-colors hover:bg-status-info'
                            >
                                Create Your First Event
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// Static demo data
const staticEvents: Event[] = [
    {
        publishedId: "1",
        eventName: "Tech Conference 2024",
        location: "San Francisco, CA",
        categories: ["Technology", "Conference"],
        eventDate: "2024-03-15",
        previewImage: "",
        status: "approved",
        userId: "user1",
        publicId: "tech-conference",
        draftId: "draft1",
        reviewStatus: "approved",
        attendees: 250,
        rating: 4.8
    },
    {
        publishedId: "2",
        eventName: "Music Festival",
        location: "Austin, TX",
        categories: ["Music", "Entertainment"],
        eventDate: "2024-04-10",
        previewImage: "",
        status: "active",
        userId: "user1",
        publicId: "music-festival",
        draftId: "draft2",
        reviewStatus: "active",
        attendees: 1500,
        rating: 4.5
    },
    {
        publishedId: "3",
        eventName: "Business Networking",
        location: "New York, NY",
        categories: ["Business", "Networking"],
        eventDate: "2024-02-05",
        previewImage: "",
        status: "approved",
        userId: "user1",
        publicId: "business-networking",
        draftId: "draft3",
        reviewStatus: "approved",
        attendees: 120,
        rating: 4.2
    },
    {
        publishedId: "4",
        eventName: "Art Exhibition",
        location: "Boston, MA",
        categories: ["Art", "Cultural"],
        eventDate: "2024-01-20",
        previewImage: "",
        status: "rejected",
        userId: "user1",
        publicId: "art-exhibition",
        draftId: "draft4",
        reviewStatus: "rejected",
        attendees: 80,
        rating: 4.0
    },
    {
        publishedId: "5",
        eventName: "Startup Workshop",
        location: "Los Angeles, CA",
        categories: ["Business", "Workshop"],
        eventDate: "2024-05-15",
        previewImage: "",
        status: "approved",
        userId: "user1",
        publicId: "startup-workshop",
        draftId: "draft5",
        reviewStatus: "approved",
        attendees: 60,
        rating: 4.7
    },
    {
        publishedId: "6",
        eventName: "Food Festival",
        location: "Chicago, IL",
        categories: ["Food", "Festival"],
        eventDate: "2024-06-10",
        previewImage: "",
        status: "active",
        userId: "user1",
        publicId: "food-festival",
        draftId: "draft6",
        reviewStatus: "active",
        attendees: 800,
        rating: 4.9
    }
];

// Main UserEvent Component
const UserEvent: React.FC = () => {
    // State management
    const [events] = useState<Event[]>(staticEvents);
    const [totalCount] = useState<number>(staticEvents.length);
    const [hasMore] = useState<boolean>(false);
    const [loading] = useState<boolean>(false);
    const [error] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
    const [sortBy, setSortBy] = useState<string>("Sort by Name");
    const [currentPage] = useState<number>(1);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

    // Simple handlers for demo
    const handleEdit = (publishedId: string): void => {
        alert(`Edit event with ID: ${publishedId}`);
    };

    const handlePreview = (publishedId: string): void => {
        alert(`Preview event with ID: ${publishedId}`);
    };

    const handleRetry = (): void => {
        alert("Retry functionality would be implemented here");
    };

    // Clear filters function
    const handleClearFilters = (): void => {
        setSearchTerm("");
        setCategoryFilter("All Categories");
        setSortBy("Sort by Name");
    };

    // Get unique categories from events
    const categories: string[] = [
        "All Categories",
        ...Array.from(new Set(events.flatMap((e: Event) => e.categories || []))).sort(),
    ];

    // Filter and sort events
    const filteredEvents = events.filter((event: Event) => {
        const matchesSearch = !searchTerm ||
            (event.eventName && event.eventName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (event.categories && event.categories.some((category: string) =>
                category.toLowerCase().includes(searchTerm.toLowerCase())
            ));

        const matchesCategory =
            categoryFilter === "All Categories" ||
            (event.categories && event.categories.includes(categoryFilter));

        return matchesSearch && matchesCategory;
    });

    // Sort events
    const sortedEvents = [...filteredEvents].sort((a: Event, b: Event) => {
        switch (sortBy) {
            case "Sort by Location":
                return (a.location || "").localeCompare(b.location || "");
            case "Sort by Date":
                const dateA = a.eventDate ? new Date(a.eventDate).getTime() : 0;
                const dateB = b.eventDate ? new Date(b.eventDate).getTime() : 0;
                return dateB - dateA;
            case "Sort by Category":
                const categoryA = a.categories && a.categories.length > 0 ? a.categories[0] : "";
                const categoryB = b.categories && b.categories.length > 0 ? b.categories[0] : "";
                return categoryA.localeCompare(categoryB);
            default:
                return (a.eventName || "").localeCompare(b.eventName || "");
        }
    });

    const totalPages = Math.max(1, Math.ceil(sortedEvents.length / 12));

    return (
        <div className='min-h-screen bg-status-info/15'>
            <Header />

            {/* Main Layout Container */}
            <div className='flex flex-col min-h-screen bg-ink-offwhite md:flex-row'>
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
                    events={sortedEvents}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    loading={loading}
                    error={error}
                    onRetry={handleRetry}
                    totalCount={totalCount}
                    hasMore={hasMore}
                    onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
                    onEdit={handleEdit}
                    onPreview={handlePreview}
                    searchTerm={searchTerm}
                    categoryFilter={categoryFilter}
                    sortBy={sortBy}
                    onClearFilters={handleClearFilters}
                />
            </div>
        </div>
    );
};

export default UserEvent;