import React, { useState } from "react";
import {
  Building2,
  Users,
  Calendar,
  Menu,
  X,
  User,
  Wallet,
  Clock1,
  MessageSquare,
  Brain,
  LogOut,
  Globe,
  FileText,
  Tv,
  Video,
  ShoppingBag,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../../context/context";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
const navLinks = [
    { icon: User, label: "Dashboard", href: "/user-dashboard" },
    { icon: Building2, label: "Companies", href: "/user-companies" },
    { icon: Users, label: "Professionals", href: "/user-professionals" },
    { icon: Calendar, label: "Events", href: "/user-events" },
    { icon: Video, label: "Media Hub", href: "/user-media-hub" },
    { icon: ShoppingBag, label: "Addons", href: "/user-addons" },
    { icon: FileText, label: "Leads", href: "/user-leads" },
    { icon: Globe, label: "Website", href: "/user-website" },
    { icon: Wallet, label: "Recharge", href: "/user-recharge" },
    { icon: Clock1, label: "Transaction History", href: "/user-transactions" },
    { icon: MessageSquare, label: "Contacted People", href: "/user-contacted" },
    ...(user?.email === 'dronesimulatorpro@gmail.com'
      ? [{ icon: Brain, label: "AI", href: "/user-ai" }]
      : []),
  ];
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
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X size={16} />
            </button>
          )}
          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="mx-auto p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Menu size={16} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {navLinks.map(({ icon: Icon, label, href }) => (
            <NavLink
              key={href}
              to={href}
              title={!isOpen ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border-l-[3px] ${
                  isActive
                    ? "bg-yellow-400/15 text-yellow-400 border-yellow-400"
                    : "text-white/60 hover:bg-white/6 hover:text-white border-transparent"
                }`
              }
            >
              <Icon size={18} className={`flex-shrink-0 ${!isOpen && "mx-auto"}`} />
              {isOpen && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Profile Section */}
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
