import React, { useState } from "react";
import {
  Building2, Users, Calendar, User, Wallet, Clock1,
  MessageSquare, Globe, FileText, Brain, LogOut, X, Grid3X3,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../../context/context";

const MobileBottomNav: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();

  const allLinks = [
    { icon: User,         label: "Dashboard",   href: "/user-dashboard" },
    { icon: Building2,    label: "Companies",   href: "/user-companies" },
    { icon: FileText,     label: "Leads",       href: "/user-leads" },
    { icon: Globe,        label: "Website",     href: "/user-website" },
    { icon: Users,        label: "Professionals", href: "/user-professionals" },
    { icon: Calendar,     label: "Events",      href: "/user-events" },
    { icon: Wallet,       label: "Recharge",    href: "/user-recharge" },
    { icon: Clock1,       label: "Transactions", href: "/user-transactions" },
    { icon: MessageSquare, label: "Contacted",  href: "/user-contacted" },
    ...(user?.email === "dronesimulatorpro@gmail.com"
      ? [{ icon: Brain, label: "AI", href: "/user-ai" }]
      : []),
  ];

  const quickLinks = [
    { icon: User,      label: "Dashboard", href: "/user-dashboard" },
    { icon: Building2, label: "Companies", href: "/user-companies" },
    { icon: Wallet,    label: "Recharge",  href: "/user-recharge" },
    { icon: FileText,  label: "Leads",     href: "/user-leads" },
  ];

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Full nav sheet — slides up from bottom */}
      <div
        className={`fixed bottom-20 left-3 right-3 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 lg:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-800">All Pages</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {allLinks.map(({ icon: Icon, label, href }) => (
              <NavLink
                key={href}
                to={href}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 p-3 rounded-xl border transition-all text-center ${
                    isActive
                      ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-xs leading-tight">{label}</span>
              </NavLink>
            ))}
          </div>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Floating bottom bar */}
      <div className="fixed bottom-3 left-3 right-3 z-50 lg:hidden">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex items-center justify-around px-2 py-1">
          {quickLinks.map(({ icon: Icon, label, href }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-0 ${
                  isActive ? "text-yellow-500" : "text-gray-400 hover:text-gray-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-yellow-400" : ""}`}>
                    <Icon size={20} className={isActive ? "text-black" : ""} />
                  </div>
                  <span className={`text-xs font-medium truncate max-w-[52px] ${isActive ? "text-yellow-600" : ""}`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {/* More button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
              menuOpen ? "text-yellow-500" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${menuOpen ? "bg-yellow-400" : ""}`}>
              <Grid3X3 size={20} className={menuOpen ? "text-black" : ""} />
            </div>
            <span className={`text-xs font-medium ${menuOpen ? "text-yellow-600" : ""}`}>More</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileBottomNav;
