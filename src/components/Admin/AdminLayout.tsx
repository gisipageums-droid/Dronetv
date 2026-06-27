import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Handshake,
  Receipt,
  UserCircle,
  CalendarRange,
  Factory,
  Bot,
  ClipboardList,
  Users2,
  Layers,
  IndianRupee,
  History,
  Coins,
  Gavel,
  BarChart,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { COMPANY_API, EVENTS_API, PROFESSIONAL_API, LAMBDA } from '../../lib/apiConfig';

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
  path?: string;
  sub?: SubItem[];
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
        id: "users",
        label: "Users",
        icon: <UserCircle size={17} />,
        path: "/admin/users",
      },
      {
        id: "companies",
        label: "Company Listings",
        icon: <Building2 size={17} />,
        sub: [
          { label: "All Companies",   path: "/admin/company/dashboard?view=all",            icon: <ListChecks size={14} /> },
          { label: "Lead Management", path: "/admin/company/dashboard?view=leads",          icon: <Users2 size={14} /> },
          { label: "Subscriptions",   path: "/admin/company/dashboard?view=subscriptions",  icon: <Layers size={14} /> },
        ],
      },
      {
        id: "professionals",
        label: "Professionals",
        icon: <Users size={17} />,
        sub: [
          { label: "Job Board",       path: "/admin/media/dashboard?type=job",           icon: <Briefcase size={14} /> },
          { label: "Pilot Directory", path: "/admin/professional/dashboard",             icon: <UserCircle size={14} /> },
          { label: "Certifications",  path: "/admin/media/dashboard?type=certification", icon: <Award size={14} /> },
          { label: "Portfolio",       path: "/admin/media/dashboard?type=portfolio",     icon: <Layers size={14} /> },
          { label: "Training / RPTOs",path: "/admin/media/dashboard?type=training",      icon: <GraduationCap size={14} /> },
          { label: "Career Path",     path: "/professionals/career-path",                icon: <Zap size={14} /> },
          { label: "Networking",      path: "/admin/media/dashboard?type=networking",    icon: <Users2 size={14} /> },
          { label: "Community",       path: "/admin/media/dashboard?type=community",     icon: <Users size={14} /> },
        ],
      },
      {
        id: "media",
        label: "Media Hub",
        icon: <Tv size={17} />,
        sub: [
          { label: "News Pulse",          path: "/admin/media/dashboard?type=news",               icon: <Newspaper size={14} /> },
          { label: "Magazine",            path: "/admin/media/dashboard?type=magazine",            icon: <BookOpen size={14} /> },
          { label: "Video Spotlight",     path: "/admin/media/dashboard?type=video",              icon: <Video size={14} /> },
          { label: "Gallery",             path: "/admin/media/dashboard?type=gallery",             icon: <ImageIcon size={14} /> },
          { label: "Impact Stories",      path: "/admin/media/dashboard?type=impact-story",        icon: <Star size={14} /> },
          { label: "Market Intelligence", path: "/admin/media/dashboard?type=market-intelligence", icon: <BarChart2 size={14} /> },
          { label: "Tech Trends",         path: "/admin/media/dashboard?type=tech-trends",         icon: <Cpu size={14} /> },
          { label: "Press Releases",      path: "/admin/media/dashboard?type=press-release",       icon: <FileText size={14} /> },
          { label: "Industry Reports",    path: "/admin/media/dashboard?type=industry-report",     icon: <ClipboardList size={14} /> },
        ],
      },
      {
        id: "events",
        label: "Events",
        icon: <CalendarDays size={17} />,
        sub: [
          { label: "Event Calendar", path: "/admin/event/dashboard",                         icon: <CalendarRange size={14} /> },
          { label: "Expos",          path: "/admin/event/dashboard?view=expos",              icon: <Star size={14} /> },
          { label: "Conferences",    path: "/admin/event/dashboard?view=conferences",        icon: <Users size={14} /> },
          { label: "Workshops",      path: "/admin/event/dashboard?view=workshops",          icon: <GraduationCap size={14} /> },
          { label: "Competitions",   path: "/admin/media/dashboard?type=competition",        icon: <Award size={14} /> },
          { label: "Webinars",       path: "/admin/media/dashboard?type=webinar",            icon: <Video size={14} /> },
          { label: "Meetups",        path: "/admin/media/dashboard?type=meetup",             icon: <Users2 size={14} /> },
        ],
      },
      {
        id: "partnerships",
        label: "Partnerships",
        icon: <Handshake size={17} />,
        sub: [
          { label: "Applications",       path: "/admin/media/dashboard?type=applications",       icon: <ClipboardList size={14} /> },
          { label: "Drone Manufacturers",path: "/admin/media/dashboard?type=manufacturer",        icon: <Factory size={14} /> },
          { label: "AI & Tech Companies",path: "/admin/media/dashboard?type=ai-company",          icon: <Bot size={14} /> },
          { label: "Event Organizers",   path: "/admin/media/dashboard?type=event-organizer",     icon: <CalendarDays size={14} /> },
          { label: "Education Partners", path: "/admin/media/dashboard?type=education-partner",   icon: <GraduationCap size={14} /> },
          { label: "Industry Players",   path: "/admin/media/dashboard?type=industry-player",     icon: <Briefcase size={14} /> },
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
        path: "/admin/plans",
      },
      {
        id: "invoices",
        label: "Invoices",
        icon: <Receipt size={17} />,
        path: "/admin/invoices",
      },
    ],
  },
  {
    heading: "Token Economy",
    items: [
      {
        id: "token-economy",
        label: "Token Economy",
        icon: <Coins size={17} />,
        sub: [
          { label: "Token Revenue",  path: "/admin/tokens/revenue",    icon: <IndianRupee size={14} /> },
          { label: "Live Auctions",  path: "/admin/tokens/auctions",   icon: <Gavel size={14} /> },
          { label: "Token Ledger",   path: "/admin/tokens/ledger",     icon: <History size={14} /> },
          { label: "Slot Management",path: "/admin/tokens/slots",      icon: <Layers size={14} /> },
          { label: "Phase Gate",     path: "/admin/tokens/phase-gate", icon: <ShieldCheck size={14} /> },
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
        path: "/admin/settings",
      },
    ],
  },
];

// ── Path → group id ────────────────────────────────────────────────
const PATH_TO_ID: Record<string, string> = {
  "/admin/users": "users",
  "/admin/professional/dashboard": "professionals",
  "/admin/media/dashboard": "media",
  "/admin/event/dashboard": "events",
  "/admin/plans": "plans",
  "/admin/invoices": "invoices",
  "/admin/settings": "settings",
  "/admin/tokens/revenue": "token-economy",
  "/admin/tokens/auctions": "token-economy",
  "/admin/tokens/ledger": "token-economy",
  "/admin/tokens/slots": "token-economy",
  "/admin/tokens/phase-gate": "token-economy",
};

const BREADCRUMBS: Record<string, string> = {
  "/admin/users": "Users",
  "/admin/company/dashboard": "Company Listings",
  "/admin/professional/dashboard": "Professionals",
  "/admin/media/dashboard": "Media Hub",
  "/admin/event/dashboard": "Events",
  "/admin/plans": "Packages & Revenue",
  "/admin/invoices": "Invoices",
  "/admin/settings": "Settings",
  "/admin/tokens/revenue": "Token Revenue",
  "/admin/tokens/auctions": "Live Auctions",
  "/admin/tokens/ledger": "Token Ledger",
  "/admin/tokens/slots": "Slot Management",
  "/admin/tokens/phase-gate": "Phase Gate",
};

const PARTNERSHIPS_CMS = new Set(["manufacturer","ai-company","event-organizer","education-partner","industry-player","applications"]);
const EVENTS_CMS = new Set(["competition","webinar","meetup"]);
const PROFESSIONALS_CMS = new Set(["job","training","certification","networking","community"]);

function computeGroupId(pathname: string, search: string): string {
  const sp = new URLSearchParams(search);
  const type = sp.get("type") ?? "";
  const section = sp.get("section") ?? "";
  const view = sp.get("view") ?? "";
  const tab  = sp.get("tab") ?? "";

  if (pathname === "/admin/media/dashboard") {
    if (PARTNERSHIPS_CMS.has(type) || section === "partnerships") return "partnerships";
    if (EVENTS_CMS.has(type) || section === "events-cms") return "events";
    if (PROFESSIONALS_CMS.has(type) || section === "professionals-cms") return "professionals";
    return "media";
  }
  if (pathname === "/admin/company/dashboard") return view ? "companies" : "dashboard";
  return PATH_TO_ID[pathname] ?? "dashboard";
}

function computeBreadcrumb(groupId: string, pathname: string): string {
  if (groupId === "dashboard") return "Dashboard";
  if (groupId === "partnerships") return "Partnerships";
  if (groupId === "invoices") return "Invoices";
  if (groupId === "events") return "Events";
  if (groupId === "professionals") return "Professionals";
  return BREADCRUMBS[pathname] ?? "Admin";
}

// ── Component ──────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Which group the current route belongs to
  const currentGroupId = computeGroupId(location.pathname, location.search);
  const breadcrumb = computeBreadcrumb(currentGroupId, location.pathname);

  // Only one accordion open at a time; auto-opens on route change
  const [openGroup, setOpenGroup] = useState<string>(currentGroupId);
  // Track which sub-item was explicitly clicked (label-based, since multiple sub-items share the same path)
  const [activeSub, setActiveSub] = useState<string | null>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const [pendingItems, setPendingItems] = useState<{ label: string; count: number; path: string }[]>([]);
  const pendingTotal = pendingItems.reduce((s, i) => s + i.count, 0);

  // Sync open group and reset activeSub when route changes
  useEffect(() => {
    setOpenGroup(currentGroupId);
    setActiveSub(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const fetchPendingCounts = async () => {
      const sources = [
        {
          url: COMPANY_API ? `${COMPANY_API}/dashboard-cards?viewType=admin` : `${LAMBDA.company}/dashboard-cards?viewType=admin`,
          label: "Companies",
          path: "/admin/company/dashboard",
        },
        {
          url: EVENTS_API ? `${EVENTS_API}/events-dashboard?viewType=admin` : `${LAMBDA.events}/events-dashboard?viewType=admin`,
          label: "Events",
          path: "/admin/event/dashboard",
        },
        {
          url: PROFESSIONAL_API ? `${PROFESSIONAL_API}/professional-dashboard-cards?viewType=admin` : `${LAMBDA.professional}/professional-dashboard-cards?viewType=admin`,
          label: "Professionals",
          path: "/admin/professional/dashboard",
        },
      ];
      const results = await Promise.allSettled(
        sources.map(s =>
          fetch(s.url).then(r => r.json()).then(d => ({
            label: s.label,
            path: s.path,
            count: (d?.cards ?? d?.data ?? []).filter(
              (c: any) => c.reviewStatus === "under_review" || c.status === "under_review"
            ).length,
          }))
        )
      );
      const items = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
        .map(r => r.value)
        .filter(i => i.count > 0);
      setPendingItems(items);
    };
    fetchPendingCounts();
    const interval = setInterval(fetchPendingCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname, location.search]);

  const handleParentClick = (item: NavGroup) => {
    if (item.path) {
      // Direct link — navigate and clear sub selection
      navigate(item.path);
      return;
    }
    // Accordion toggle — exclusive: only one open at a time
    setOpenGroup(prev => (prev === item.id ? "" : item.id));
  };

  const handleSubClick = (groupId: string, sub: SubItem) => {
    setActiveSub(sub.label);
    setOpenGroup(groupId);
    // sub.path may include query params — navigate handles both forms
    const [pathname, search] = sub.path.split("?");
    navigate({ pathname, search: search ? `?${search}` : "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  // ── Sidebar ──────────────────────────────────────────────────────
  const SidebarContent = () => (
    <>
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

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map((section, si) => (
          <div key={si} className={si > 0 ? "mt-3" : ""}>
            {section.heading && (
              <div className="px-3 py-1.5 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                {section.heading}
              </div>
            )}
            {section.items.map(item => {
              const isGroupActive = currentGroupId === item.id;
              const isOpen = openGroup === item.id;

              if (!item.sub) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleParentClick(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 text-left ${
                      isGroupActive
                        ? "bg-yellow-400/15 text-yellow-400 border-l-[3px] border-yellow-400"
                        : "text-white/60 hover:bg-white/6 hover:text-white border-l-[3px] border-transparent"
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              }

              return (
                <div key={item.id} className="mb-0.5">
                  <button
                    onClick={() => handleParentClick(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isGroupActive
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

                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-4 mt-0.5 border-l border-white/10 pl-3 pb-1">
                      {item.sub!.map(sub => {
                        const fullCurrent = location.pathname + location.search;
                        const isSubActive = isGroupActive && (
                          activeSub === sub.label ||
                          fullCurrent === sub.path ||
                          (activeSub === null && !location.search && item.sub![0].label === sub.label)
                        );
                        return (
                          <button
                            key={sub.label}
                            onClick={() => handleSubClick(item.id, sub)}
                            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-150 mb-0.5 text-left ${
                              isSubActive
                                ? "text-yellow-400 bg-yellow-400/10"
                                : "text-white/50 hover:text-white hover:bg-white/6"
                            }`}
                          >
                            <span className="flex-shrink-0">{sub.icon}</span>
                            <span className="truncate">{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

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

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 flex flex-col overflow-x-hidden transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-2xl`}
        style={{ background: "#111827" }}
      >
        <SidebarContent />
      </aside>

      <div className="flex flex-col flex-1 min-h-screen lg:ml-64">

        <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 flex items-center h-14 px-4 gap-3 bg-yellow-400 shadow-md">

          <button
            onClick={() => setMobileOpen(v => !v)}
            className="flex-shrink-0 p-2 rounded-lg text-black hover:bg-yellow-300 transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-black/60 text-sm font-medium hidden sm:block truncate">DroneTv.in</span>
            <span className="text-black/40 hidden sm:block">›</span>
            <span className="text-black font-bold text-sm truncate">{breadcrumb}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">

            <a
              href="https://dronetv.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-yellow-400 text-xs font-bold hover:bg-gray-900 transition-colors whitespace-nowrap"
            >
              <Globe size={13} />
              View Site
            </a>

            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative p-2 rounded-lg text-black hover:bg-yellow-300 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {pendingTotal > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 border-2 border-yellow-400 text-white text-[9px] font-black flex items-center justify-center">
                    {pendingTotal > 99 ? "99+" : pendingTotal}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="font-bold text-sm text-gray-900">Pending Reviews</p>
                    {pendingTotal > 0 && (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingTotal} pending</span>
                    )}
                  </div>
                  {pendingItems.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-400">All clear — no pending reviews</div>
                  ) : (
                    <div className="py-1">
                      {pendingItems.map(item => (
                        <button
                          key={item.path}
                          onClick={() => { navigate(item.path); setNotifOpen(false); }}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-yellow-50 transition-colors text-left"
                        >
                          <span className="text-sm font-medium text-gray-800">{item.label} pending review</span>
                          <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full ml-2 flex-shrink-0">{item.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="px-4 py-2 border-t border-gray-100 text-center">
                    <span className="text-xs text-gray-400">Refreshes every minute</span>
                  </div>
                </div>
              )}
            </div>

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

        <main className="flex-1 mt-14 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
