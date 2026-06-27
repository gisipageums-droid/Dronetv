import React, { useState } from "react";
import {
  Building2, Users, Calendar, Menu, X, User, Wallet,
  MessageSquare, Brain, LogOut, Globe, FileText, Tv, Video,
  ShoppingBag, Coins, ChevronDown, Share2, Briefcase, Award,
  GraduationCap, Users2, Newspaper, BookOpen, ImageIcon, Star,
  BarChart2, Cpu, ClipboardList, Factory, Bot, Handshake,
  Zap, Target, Layout, Receipt, Package,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../../context/context";
import axios from "axios";
import { AUTH_API, LAMBDA } from '../../../../lib/apiConfig';

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

interface SubItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface NavGroup {
  id: string;
  icon: React.ElementType;
  label: string;
  items: SubItem[];
  paths: string[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: "listings",
    icon: Building2,
    label: "My Listings",
    paths: ["/user-companies", "/user-professionals", "/user-events"],
    items: [
      { icon: Building2, label: "Companies",     href: "/user-companies" },
      { icon: Users,     label: "Professionals", href: "/user-professionals" },
      { icon: Calendar,  label: "Events",        href: "/user-events" },
    ],
  },
  {
    id: "professionals",
    icon: Users,
    label: "Professionals",
    paths: ["/professionals/"],
    items: [
      { icon: Briefcase,      label: "Job Board",       href: "/professionals/job-board" },
      { icon: User,           label: "Pilot Directory", href: "/professionals/pilot-directory" },
      { icon: Award,          label: "Certifications",  href: "/professionals/certifications" },
      { icon: GraduationCap,  label: "Training",        href: "/professionals/training" },
      { icon: Users2,         label: "Networking",      href: "/professionals/networking" },
      { icon: Users,          label: "Community",       href: "/professionals/community" },
    ],
  },
  {
    id: "events",
    icon: Calendar,
    label: "Events",
    paths: ["/events/"],
    items: [
      { icon: Calendar,      label: "Event Calendar", href: "/events/calendar" },
      { icon: Star,          label: "Expos",          href: "/events/expos" },
      { icon: Users,         label: "Conferences",    href: "/events/conferences" },
      { icon: GraduationCap, label: "Workshops",      href: "/events/workshops" },
      { icon: Award,         label: "Competitions",   href: "/events/competitions" },
      { icon: Video,         label: "Webinars",       href: "/events/webinars" },
      { icon: Users2,        label: "Meetups",        href: "/events/meetups" },
    ],
  },
  {
    id: "media",
    icon: Tv,
    label: "Media Hub",
    paths: ["/media/", "/user-media-hub"],
    items: [
      { icon: Newspaper,    label: "News Pulse",         href: "/media/news-pulse" },
      { icon: BookOpen,     label: "Magazine",           href: "/media/magazine" },
      { icon: Video,        label: "Video Spotlight",    href: "/media/video-spotlight" },
      { icon: ImageIcon,    label: "Impact Stories",     href: "/media/impact-stories" },
      { icon: BarChart2,    label: "Market Intelligence",href: "/media/market-intelligence" },
      { icon: Cpu,          label: "Tech Trends",        href: "/media/tech-trends" },
      { icon: FileText,     label: "Press Releases",     href: "/media/press-releases" },
      { icon: ClipboardList,label: "Industry Reports",   href: "/media/industry-reports" },
    ],
  },
  {
    id: "partnerships",
    icon: Handshake,
    label: "Partnerships",
    paths: ["/partnerships/"],
    items: [
      { icon: Factory,      label: "Drone Manufacturers", href: "/partnerships/drone-manufacturers" },
      { icon: Bot,          label: "AI & Tech Companies", href: "/partnerships/ai-tech" },
      { icon: Calendar,     label: "Event Organizers",    href: "/partnerships/event-organizers" },
      { icon: GraduationCap,label: "Education Partners",  href: "/partnerships/education-partners" },
      { icon: Briefcase,    label: "Industry Players",    href: "/partnerships/industry-players" },
      { icon: Handshake,    label: "Become a Partner",   href: "/partnerships/become-a-partner" },
    ],
  },
  {
    id: "content",
    icon: Share2,
    label: "Content",
    paths: ["/user-posts", "/user-addons"],
    items: [
      { icon: Share2,      label: "My Posts", href: "/user-posts" },
      { icon: ShoppingBag, label: "Addons",   href: "/user-addons" },
    ],
  },
  {
    id: "analytics",
    icon: FileText,
    label: "Analytics",
    paths: ["/user-leads", "/user-contacted"],
    items: [
      { icon: FileText,      label: "Leads",     href: "/user-leads" },
      { icon: MessageSquare, label: "Contacted", href: "/user-contacted" },
    ],
  },
  {
    id: "tokens",
    icon: Coins,
    label: "Tokens",
    paths: ["/user-recharge", "/user-buy", "/user-bid-keywords", "/user-page-placements"],
    items: [
      { icon: Wallet, label: "Token Wallet",    href: "/user-recharge" },
      { icon: Zap,    label: "Buy Tokens",      href: "/user-buy" },
      { icon: Target, label: "Bid for Keywords",href: "/user-bid-keywords" },
      { icon: Layout, label: "Page Placements", href: "/user-page-placements" },
    ],
  },
  {
    id: "account",
    icon: Globe,
    label: "Account",
    paths: ["/user-website", "/user-profile", "/user-plans", "/user-transactions"],
    items: [
      { icon: User,    label: "Profile",      href: "/user-profile" },
      { icon: Globe,   label: "Website",      href: "/user-website" },
      { icon: Package, label: "My Package",   href: "/user-plans" },
      { icon: Receipt, label: "Transactions", href: "/user-transactions" },
    ],
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => typeof window !== "undefined" && window.innerWidth >= 1024);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();

  const userId = user?.userData?.email || user?.email || "";

  const getInitialOpen = () => {
    const open: Record<string, boolean> = {};
    NAV_GROUPS.forEach(g => { open[g.id] = false; });
    open["listings"] = true;
    open["tokens"] = true;
    open["account"] = true;
    return open;
  };

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(getInitialOpen);

  React.useEffect(() => {
    if (!userId) return;
    axios.get(`${PROFILE_API}?userId=${userId}`)
      .then(r => setTokenBalance(r.data?.profile?.tokenBalance ?? 0))
      .catch(() => setTokenBalance(0));
  }, [userId]);

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="flex h-full">
      <section
        className={`${isOpen ? "w-64" : "w-16"} flex flex-col transition-all duration-300 overflow-x-hidden`}
        style={{ background: "#111827" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 border-b border-white/10 flex-shrink-0" style={{ paddingTop: "88px", paddingBottom: "16px" }}>
          <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center flex-shrink-0">
            <Tv size={16} className="text-black" />
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <div className="text-base font-black text-white leading-tight">
                Drone<span className="text-yellow-400">Tv</span>.in
              </div>
              <div className="text-[9px] text-white/35 uppercase tracking-widest">Member Portal</div>
            </div>
          )}
          {isOpen ? (
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
              <X size={16} />
            </button>
          ) : (
            <button onClick={() => setIsOpen(true)} className="mx-auto p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors">
              <Menu size={16} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {/* Dashboard — flat link */}
          <NavLink
            to="/user-dashboard"
            title={!isOpen ? "Dashboard" : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border-l-[3px] ${
                isActive
                  ? "bg-yellow-400/15 text-yellow-400 border-yellow-400"
                  : "text-white/60 hover:bg-white/6 hover:text-white border-transparent"
              }`
            }
          >
            <User size={18} className={`flex-shrink-0 ${!isOpen && "mx-auto"}`} />
            {isOpen && <span className="truncate">Dashboard</span>}
          </NavLink>

          {/* Accordion groups */}
          {NAV_GROUPS.map(group => {
            const GroupIcon = group.icon;
            const isGroupActive = group.paths.some(p => location.pathname.startsWith(p));
            const isGroupOpen = openGroups[group.id];

            if (!isOpen) {
              return (
                <div key={group.id} className="relative group/tip">
                  <button
                    onClick={() => { setIsOpen(true); setOpenGroups(prev => ({ ...prev, [group.id]: true })); }}
                    className={`w-full flex items-center justify-center py-2.5 rounded-lg transition-all border-l-[3px] ${
                      isGroupActive ? "bg-yellow-400/15 border-yellow-400" : "border-transparent hover:bg-white/6"
                    }`}
                    title={group.label}
                  >
                    <GroupIcon size={18} className={isGroupActive ? "text-yellow-400" : "text-white/60"} />
                  </button>
                </div>
              );
            }

            return (
              <div key={group.id}>
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-[3px] ${
                    isGroupActive && !isGroupOpen
                      ? "bg-yellow-400/10 text-yellow-400 border-yellow-400"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5 border-transparent"
                  }`}
                >
                  <GroupIcon size={18} className="flex-shrink-0" />
                  <span className="flex-1 truncate text-left">{group.label}</span>
                  <ChevronDown
                    size={14}
                    className={`flex-shrink-0 transition-transform duration-200 ${isGroupOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isGroupOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-2">
                    {group.items.map(item => {
                      const ItemIcon = item.icon;
                      return (
                        <NavLink
                          key={item.href}
                          to={item.href}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border-l-[2px] ${
                              isActive
                                ? "bg-yellow-400/15 text-yellow-400 border-yellow-400"
                                : "text-white/50 hover:bg-white/6 hover:text-white border-transparent"
                            }`
                          }
                        >
                          <ItemIcon size={15} className="flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* AI link — gated */}
          {user?.email === "dronesimulatorpro@gmail.com" && (
            <NavLink
              to="/user-ai"
              title={!isOpen ? "AI" : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border-l-[3px] ${
                  isActive
                    ? "bg-yellow-400/15 text-yellow-400 border-yellow-400"
                    : "text-white/60 hover:bg-white/6 hover:text-white border-transparent"
                }`
              }
            >
              <Brain size={18} className={`flex-shrink-0 ${!isOpen && "mx-auto"}`} />
              {isOpen && <span className="truncate">AI</span>}
            </NavLink>
          )}
        </nav>

        {/* Token balance */}
        {isOpen && tokenBalance !== null && (
          <NavLink
            to="/user-recharge"
            className="mx-3 mb-1 flex items-center justify-between px-3 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Coins size={14} className="text-yellow-400 flex-shrink-0" />
              <span className="text-xs text-white/60">Tokens</span>
            </div>
            <span className="text-sm font-black text-yellow-400">{tokenBalance.toLocaleString()}</span>
          </NavLink>
        )}
        {!isOpen && tokenBalance !== null && (
          <NavLink to="/user-recharge" className="flex justify-center mb-1 px-2" title={`${tokenBalance} tokens`}>
            <div className="flex flex-col items-center gap-0.5">
              <Coins size={16} className="text-yellow-400" />
              <span className="text-[9px] font-black text-yellow-400">{tokenBalance > 999 ? `${Math.floor(tokenBalance / 1000)}k` : tokenBalance}</span>
            </div>
          </NavLink>
        )}

        {/* Profile */}
        <div className="flex-shrink-0 border-t border-white/10 p-3">
          <NavLink to="/user-profile" className="flex items-center gap-2 min-w-0 mb-2">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-black text-black">
                {user?.userData?.fullName?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            {isOpen && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.userData?.fullName}</p>
                <p className="text-[10px] text-white/40 truncate">{user?.userData?.email}</p>
              </div>
            )}
          </NavLink>
          {isOpen && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/6 transition-all text-sm"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;
