import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, UserCircle, Award, FolderKanban, Wrench, Briefcase,
  ClipboardList, GraduationCap, TrendingUp, Users, MessagesSquare,
  CalendarDays, Settings as SettingsIcon, Menu, X, ExternalLink, LogOut, Bell,
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
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/professional-portal" },
    ],
  },
  {
    heading: "My Profile",
    items: [
      { id: "profile", label: "Edit Profile", icon: UserCircle, path: "/professional-portal/profile" },
      { id: "certifications", label: "DGCA Certifications", icon: Award, path: "/professional-portal/certifications" },
      { id: "portfolio", label: "My Portfolio", icon: FolderKanban, path: "/professional-portal/portfolio" },
      { id: "skills", label: "Skills & Tools", icon: Wrench, path: "/professional-portal/skills" },
    ],
  },
  {
    heading: "Jobs",
    items: [
      { id: "jobs", label: "Browse Jobs", icon: Briefcase, path: "/professional-portal/jobs" },
      { id: "applications", label: "My Applications", icon: ClipboardList, path: "/professional-portal/applications" },
    ],
  },
  {
    heading: "Learn & Grow",
    items: [
      { id: "training", label: "Training / RPTOs", icon: GraduationCap, path: "/professional-portal/training" },
      { id: "career", label: "Career Path", icon: TrendingUp, path: "/professional-portal/career" },
    ],
  },
  {
    heading: "Community",
    items: [
      { id: "networking", label: "Networking", icon: Users, path: "/professional-portal/networking" },
      { id: "community", label: "Community Forum", icon: MessagesSquare, path: "/professional-portal/community" },
      { id: "events", label: "Events Near Me", icon: CalendarDays, path: "/professional-portal/events" },
    ],
  },
  {
    heading: "Account",
    items: [
      { id: "settings", label: "Settings", icon: SettingsIcon, path: "/professional-portal/settings" },
    ],
  },
];

const TITLES: Record<string, string> = {
  "/professional-portal": "Dashboard",
  "/professional-portal/profile": "Edit Profile",
  "/professional-portal/certifications": "DGCA Certifications",
  "/professional-portal/portfolio": "My Portfolio",
  "/professional-portal/skills": "Skills & Tools",
  "/professional-portal/jobs": "Browse Jobs",
  "/professional-portal/applications": "My Applications",
  "/professional-portal/training": "Training / RPTOs",
  "/professional-portal/career": "Career Path",
  "/professional-portal/networking": "Networking",
  "/professional-portal/community": "Community Forum",
  "/professional-portal/events": "Events Near Me",
  "/professional-portal/settings": "Account Settings",
};

interface SidebarContentProps {
  expanded: boolean;
  displayName: string;
  initials: string;
  email?: string;
  pathname: string;
  onToggle?: () => void;
  onNavigate?: () => void;
  onLogout: () => void;
}

function SidebarContent({ expanded, displayName, initials, email, pathname, onToggle, onNavigate, onLogout }: SidebarContentProps) {
  return (
    <>
      <div className="px-4 pt-5 pb-3.5 border-b border-white/10 flex items-center justify-between">
        {expanded && (
          <div>
            <div className="text-base font-extrabold text-white">
              Drone<span className="text-brand-yellow">Tv</span>.in
            </div>
            <div className="text-[8.5px] text-white/30 uppercase tracking-widest mt-0.5">Professional Portal</div>
          </div>
        )}
        {onToggle && (
          <button onClick={onToggle} className="text-white/50 hover:text-white p-1 flex-shrink-0" title="Toggle sidebar">
            {expanded ? <X size={16} /> : <Menu size={16} />}
          </button>
        )}
      </div>

      {expanded && (
        <div className="px-4 py-3.5 bg-brand-yellow/10 border-b border-white/5 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-brand-yellow flex items-center justify-center text-sm font-extrabold text-ink flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-[12.5px] font-bold text-white leading-tight truncate">{displayName}</div>
            <div className="text-[10px] text-brand-yellow font-semibold">🏅 Profile Live</div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-2.5">
        {NAV.map((section, si) => (
          <div key={si}>
            {expanded && section.heading && (
              <div className="px-4 pt-3 pb-1 text-[9px] font-bold text-white/25 uppercase tracking-widest">
                {section.heading}
              </div>
            )}
            {section.items.map(item => {
              const active = pathname === item.path;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === "/professional-portal"}
                  onClick={onNavigate}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] font-medium border-l-[3px] transition-colors whitespace-nowrap ${
                    active
                      ? "bg-brand-yellow/10 text-brand-yellow border-brand-yellow"
                      : "text-white/60 border-transparent hover:bg-white/5 hover:text-white"
                  }`}
                  title={!expanded ? item.label : undefined}
                >
                  <item.icon size={16} className="flex-shrink-0" />
                  {expanded && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {expanded && (
        <div className="px-4 py-3.5 border-t border-white/10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center text-xs font-extrabold text-ink flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{displayName}</div>
              <div className="text-[10px] text-white/35 truncate">{email}</div>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-xs text-status-error hover:text-red-400">
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      )}
    </>
  );
}

export default function ProfessionalPortalLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUserAuth();

  const displayName = (user as any)?.userData?.fullName || user?.email || "Professional";
  const initials = displayName.slice(0, 2).toUpperCase();
  const pageTitle = TITLES[location.pathname] || "Dashboard";
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex fixed inset-0 pt-20 bg-ink">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-shrink-0 h-full bg-ink flex-col transition-all duration-200 overflow-hidden ${
          isOpen ? "w-[230px]" : "w-[64px]"
        }`}
      >
        <SidebarContent
          expanded={isOpen}
          displayName={displayName}
          initials={initials}
          email={user?.email}
          pathname={location.pathname}
          onToggle={() => setIsOpen(!isOpen)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[230px] h-full bg-ink flex flex-col">
            <SidebarContent
              expanded
              displayName={displayName}
              initials={initials}
              email={user?.email}
              pathname={location.pathname}
              onToggle={() => setMobileOpen(false)}
              onNavigate={() => setMobileOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <header className="h-[58px] bg-ink border-b border-white/10 flex items-center px-4 sm:px-6 gap-3 sm:gap-4 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-white/50 p-1" title="Open menu">
            <Menu size={18} />
          </button>
          <div className="flex-1 text-sm font-bold text-white truncate">{pageTitle}</div>
          <a
            href="https://dev.dronetv.in/professionals"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/15 rounded-lg text-xs font-semibold text-white/70 hover:border-white/30 hover:text-white"
          >
            <ExternalLink size={13} /> View Profile
          </a>
          <div className="relative text-white/50 hover:text-white p-1.5 cursor-default" title="Notifications">
            <Bell size={17} />
          </div>
          <div className="w-8 h-8 rounded-full bg-brand-yellow/15 flex items-center justify-center text-xs font-extrabold text-brand-yellow flex-shrink-0">
            {initials}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
