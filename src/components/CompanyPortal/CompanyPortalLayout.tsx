import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Building2, Package, Inbox, Film, BookOpen, Megaphone,
  BarChart2, ShieldCheck, Receipt, Settings as SettingsIcon, Menu, X,
  Bell, ExternalLink, LogOut,
} from "lucide-react";
import { useUserAuth } from "../context/context";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    heading: "",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/company-portal" },
    ],
  },
  {
    heading: "Profile & Listings",
    items: [
      { id: "profile", label: "Company Profile", icon: Building2, path: "/company-portal/profile" },
      { id: "listings", label: "Product Listings", icon: Package, path: "/company-portal/listings" },
      { id: "leads", label: "B2B Leads", icon: Inbox, path: "/company-portal/leads" },
    ],
  },
  {
    heading: "Media Coverage",
    items: [
      { id: "content", label: "My Content", icon: Film, path: "/company-portal/content" },
      { id: "magazine", label: "Magazine", icon: BookOpen, path: "/company-portal/magazine" },
      { id: "press", label: "Press Releases", icon: Megaphone, path: "/company-portal/press" },
    ],
  },
  {
    heading: "Analytics & Reports",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart2, path: "/company-portal/analytics" },
    ],
  },
  {
    heading: "Account",
    items: [
      { id: "package", label: "My Package", icon: ShieldCheck, path: "/company-portal/package" },
      { id: "invoices", label: "Invoices", icon: Receipt, path: "/company-portal/invoices" },
      { id: "settings", label: "Settings", icon: SettingsIcon, path: "/company-portal/settings" },
    ],
  },
];

const TITLES: Record<string, string> = {
  "/company-portal": "Dashboard",
  "/company-portal/profile": "Company Profile",
  "/company-portal/listings": "Product & Service Listings",
  "/company-portal/leads": "B2B Leads",
  "/company-portal/content": "My Content",
  "/company-portal/magazine": "Magazine Coverage",
  "/company-portal/press": "Press Releases",
  "/company-portal/analytics": "Analytics",
  "/company-portal/package": "My Package",
  "/company-portal/invoices": "Invoices",
  "/company-portal/settings": "Account Settings",
};

export default function CompanyPortalLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUserAuth();

  const displayName = user?.userData?.fullName || user?.userData?.companyName || user?.email || "Company";
  const initials = displayName.slice(0, 2).toUpperCase();
  const pageTitle = TITLES[location.pathname] || "Dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-surface-main">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 bg-ink flex flex-col transition-all duration-200 overflow-hidden ${
          isOpen ? "w-[230px]" : "w-0 lg:w-[64px]"
        }`}
      >
        <div className="px-4 pt-5 pb-3.5 border-b border-white/10 flex items-center justify-between">
          {isOpen && (
            <div>
              <div className="text-base font-extrabold text-white">
                Drone<span className="text-brand-yellow">Tv</span>.in
              </div>
              <div className="text-[8.5px] text-white/30 uppercase tracking-widest mt-0.5">Company Portal</div>
            </div>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="text-white/50 hover:text-white p-1 flex-shrink-0" title="Toggle sidebar">
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {isOpen && (
          <div className="px-4 py-3.5 bg-brand-yellow/10 border-b border-white/5 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-brand-yellow flex items-center justify-center text-sm font-extrabold text-ink flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-[12.5px] font-bold text-white leading-tight truncate">{displayName}</div>
              <div className="text-[10px] text-brand-yellow font-semibold">🏅 Portal Active</div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-2.5">
          {NAV.map((section, si) => (
            <div key={si}>
              {isOpen && section.heading && (
                <div className="px-4 pt-3 pb-1 text-[9px] font-bold text-white/25 uppercase tracking-widest">
                  {section.heading}
                </div>
              )}
              {section.items.map(item => {
                const active = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    end={item.path === "/company-portal"}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] font-medium border-l-[3px] transition-colors whitespace-nowrap ${
                      active
                        ? "bg-brand-yellow/10 text-brand-yellow border-brand-yellow"
                        : "text-white/60 border-transparent hover:bg-white/5 hover:text-white"
                    }`}
                    title={!isOpen ? item.label : undefined}
                  >
                    <item.icon size={16} className="flex-shrink-0" />
                    {isOpen && <span>{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {isOpen && (
          <div className="px-4 py-3.5 border-t border-white/10">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center text-xs font-extrabold text-ink flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{displayName}</div>
                <div className="text-[10px] text-white/35 truncate">{user?.email}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-status-error hover:text-red-400">
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className={`flex-1 min-w-0 flex flex-col transition-all duration-200 ${isOpen ? "ml-[230px]" : "ml-0 lg:ml-[64px]"}`}>
        <header className="h-[58px] bg-white border-b border-ink-light flex items-center px-4 sm:px-6 gap-3 sm:gap-4 sticky top-0 z-30 shadow-sm">
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-ink-caption p-1" title="Toggle sidebar">
            <Menu size={18} />
          </button>
          <div className="flex-1 text-sm font-bold text-ink truncate">{pageTitle}</div>
          <a
            href="https://testdev.dronetv.in/listed-companies"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-ink-light rounded-lg text-xs font-semibold text-ink-paragraph hover:border-ink-dark"
          >
            <ExternalLink size={13} /> View Profile
          </a>
          <button className="text-ink-caption p-1.5 relative" title="Notifications">
            <Bell size={17} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-status-error border-2 border-white" />
          </button>
          <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-xs font-extrabold text-brand-yellow flex-shrink-0">
            {initials}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
