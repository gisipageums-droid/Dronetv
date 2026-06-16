import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Tv,
  CalendarDays,
  Package,
  Settings,
  ChevronDown,
  Menu,
  X,
  Bell,
  Globe,
  LogOut,
  ListChecks,
  Newspaper,
  BookOpen,
  Video,
  ImageIcon,
  Star,
  BarChart2,
  Cpu,
  FileText,
  Briefcase,
  Award,
  GraduationCap,
  IndianRupee,
  History,
  Users2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
interface SubItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;        // direct link (no submenu)
  sub?: SubItem[];      // submenu items
}

interface Section {
  heading: string;
  items: NavGroup[];
}

// ── Navigation tree ────────────────────────────────────────────────
const NAV: Section[] = [
  {
    heading: "",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard size={17} />,
        path: "/admin/company/dashboard",
      },
    ],
  },
  {
    heading: "Management",
    items: [
      {
        id: "companies",
        label: "Company Listings",
        icon: <Building2 size={17} />,
        sub: [
          { label: "All Companies", path: "/admin/company/dashboard", icon: <ListChecks size={14} /> },
          { label: "Lead Management", path: "/admin/company/dashboard", icon: <Users2 size={14} /> },
        ],
      },
      {
        id: "professionals",
        label: "Professionals",
        icon: <Users size={17} />,
        sub: [
          { label: "All Professionals", path: "/admin/professional/dashboard", icon: <ListChecks size={14} /> },
          { label: "Certifications", path: "/admin/professional/dashboard", icon: <Award size={14} /> },
          { label: "Training / RPTOs", path: "/admin/professional/dashboard", icon: <GraduationCap size={14} /> },
          { label: "Job Board", path: "/admin/professional/dashboard", icon: <Briefcase size={14} /> },
        ],
      },
      {
        id: "media",
        label: "Media Hub",
        icon: <Tv size={17} />,
        sub: [
          { label: "News Pulse", path: "/admin/media/dashboard", icon: <Newspaper size={14} /> },
          { label: "Magazine", path: "/admin/media/dashboard", icon: <BookOpen size={14} /> },
          { label: "Video Spotlight", path: "/admin/media/dashboard", icon: <Video size={14} /> },
          { label: "Gallery", path: "/admin/media/dashboard", icon: <ImageIcon size={14} /> },
          { label: "Impact Stories", path: "/admin/media/dashboard", icon: <Star size={14} /> },
          { label: "Market Intelligence", path: "/admin/media/dashboard", icon: <BarChart2 size={14} /> },
          { label: "Tech Trends", path: "/admin/media/dashboard", icon: <Cpu size={14} /> },
          { label: "Press Releases", path: "/admin/media/dashboard", icon: <FileText size={14} /> },
          { label: "Industry Reports", path: "/admin/media/dashboard", icon: <FileText size={14} /> },
        ],
      },
      {
        id: "events",
        label: "Events",
        icon: <CalendarDays size={17} />,
        sub: [
          { label: "All Events", path: "/admin/event/dashboard", icon: <ListChecks size={14} /> },
          { label: "Expos", path: "/admin/event/dashboard", icon: <Star size={14} /> },
          { label: "Conferences", path: "/admin/event/dashboard", icon: <Users size={14} /> },
          { label: "Workshops", path: "/admin/event/dashboard", icon: <GraduationCap size={14} /> },
          { label: "Competitions", path: "/admin/event/dashboard", icon: <Award size={14} /> },
          { label: "Webinars", path: "/admin/event/dashboard", icon: <Video size={14} /> },
          { label: "Meetups", path: "/admin/event/dashboard", icon: <Users2 size={14} /> },
        ],
      },
    ],
  },
  {
    heading: "Finance",
    items: [
      {
        id: "plans",
        label: "Packages & Revenue",
        icon: <Package size={17} />,
        sub: [
          { label: "Plans Management", path: "/admin/plans", icon: <Package size={14} /> },
          { label: "Token Price", path: "/admin/plans", icon: <IndianRupee size={14} /> },
          { label: "Transactions", path: "/admin/plans", icon: <History size={14} /> },
        ],
      },
    ],
  },
  {
    heading: "System",
    items: [
      {
        id: "settings",
        label: "Settings",
        icon: <Settings size={17} />,
        path: "#",
      },
    ],
  },
];

// ── Path → group id map ────────────────────────────────────────────
const PATH_TO_ID: Record<string, string> = {
  "/admin/company/dashboard": "companies",
  "/admin/professional/dashboard": "professionals",
  "/admin/media/dashboard": "media",
  "/admin/event/dashboard": "events",
  "/admin/plans": "plans",
};

const BREADCRUMBS: Record<string, string> = {
  "/admin/company/dashboard": "Company Listings",
  "/admin/professional/dashboard": "Professionals",
  "/admin/media/dashboard": "Media Hub",
  "/admin/event/dashboard": "Events",
  "/admin/plans": "Packages & Revenue",
};

// ── Component ──────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const activeId = PATH_TO_ID[location.pathname] ?? "dashboard";
  const breadcrumb = BREADCRUMBS[location.pathname] ?? "Admin";

  // Start with the current section's submenu open
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => ({ [activeId]: true }));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  // ── Sidebar content ──────────────────────────────────────────────
  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center flex-shrink-0">
          <Tv size={16} className="text-black" />
        </div>
        <div>
          <div className="text-base font-black text-white leading-tight">
            Drone<span className="text-yellow-400">Tv</span>.in
          </div>
          <div className="text-[9px] text-white/35 uppercase tracking-widest">Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map((section, si) => (
          <div key={si} className={si > 0 ? "mt-3" : ""}>
            {section.heading && (
              <div className="px-3 py-1.5 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                {section.heading}
              </div>
            )}
            {section.items.map(item => {
              const isActive = activeId === item.id || (item.path === location.pathname && !item.sub);
              const isOpen = !!openMenus[item.id];

              if (!item.sub) {
                // Direct link
                return (
                  <Link
                    key={item.id}
                    to={item.path!}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 ${
                      isActive
                        ? "bg-yellow-400/15 text-yellow-400 border-l-[3px] border-yellow-400"
                        : "text-white/60 hover:bg-white/6 hover:text-white border-l-[3px] border-transparent"
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              }

              // Accordion (submenu)
              return (
                <div key={item.id} className="mb-0.5">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-yellow-400/15 text-yellow-400 border-l-[3px] border-yellow-400"
                        : "text-white/60 hover:bg-white/6 hover:text-white border-l-[3px] border-transparent"
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    <ChevronDown
                      size={14}
                      className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Submenu */}
                  <div
                    className={`overflow-hidden transition-all duration-250 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="ml-4 mt-0.5 border-l border-white/10 pl-3 pb-1">
                      {item.sub!.map(sub => (
                        <Link
                          key={sub.path + sub.label}
                          to={sub.path}
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-150 mb-0.5 ${
                            location.pathname === sub.path
                              ? "text-yellow-400 bg-yellow-400/10"
                              : "text-white/50 hover:text-white hover:bg-white/6"
                          }`}
                        >
                          <span className="flex-shrink-0">{sub.icon}</span>
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="flex-shrink-0 border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-[11px] font-black text-black flex-shrink-0">
            DR
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">Dev R</div>
            <div className="text-[10px] text-white/40">Super Admin</div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-white/40 hover:text-red-400 transition-colors p-1 rounded"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar (desktop: fixed; mobile: slide-in) ── */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 flex flex-col transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-2xl`}
        style={{ background: "#111827" }}
      >
        <SidebarContent />
      </aside>

      {/* ── Main area ── */}
      <div className="flex flex-col flex-1 min-h-screen lg:ml-64">

        {/* ── Top header (yellow DroneTv theme) ── */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 flex items-center h-14 px-4 gap-3 bg-yellow-400 shadow-md">

          {/* Hamburger (mobile) / Menu toggle */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="flex-shrink-0 p-2 rounded-lg text-black hover:bg-yellow-300 transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-black/60 text-sm font-medium hidden sm:block truncate">DroneTv.in</span>
            <span className="text-black/40 hidden sm:block">›</span>
            <span className="text-black font-bold text-sm truncate">{breadcrumb}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">

            {/* View Site */}
            <a
              href="https://dronetv.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-yellow-400 text-xs font-bold hover:bg-gray-900 transition-colors whitespace-nowrap"
            >
              <Globe size={13} />
              View Site
            </a>

            {/* Notification bell */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative p-2 rounded-lg text-black hover:bg-yellow-300 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-yellow-400" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-xl z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-bold text-sm text-gray-900">Notifications</p>
                  </div>
                  <div className="px-4 py-6 text-center text-sm text-gray-400">
                    No new notifications
                  </div>
                </div>
              )}
            </div>

            {/* User avatar */}
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserOpen(v => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-[10px] font-black text-yellow-400">
                  DR
                </div>
                <span className="hidden sm:block text-xs font-bold text-black">Dev R</span>
                <ChevronDown size={13} className={`text-black hidden sm:block transition-transform ${userOpen ? "rotate-180" : ""}`} />
              </button>

              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-bold text-sm text-gray-900">Dev R</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 mt-14 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
