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
    { icon: FileText, label: "Leads", href: "/user-leads" },
    { icon: Globe, label: "Website", href: "/user-website" },
    {
      icon: Users,
      label: "Professionals",
      href: "/user-professionals",
    },
    { icon: Calendar, label: "Events", href: "/user-events" },
    { icon: Wallet, label: "Recharge", href: "/user-recharge" },
    { icon: Clock1, label: "Transaction History", href: "/user-transactions" },
    { icon: MessageSquare, label: "Contacted People", href: "/user-contacted" },
    ...(user?.email === 'dronesimulatorpro@gmail.com'
      ? [{ icon: Brain, label: "AI", href: "/user-ai" }]
      : []),
  ];
  return (
    <aside className="flex h-screen rounded-lg shadow-sm overflow-hidden">
      {/* Sidebar */}
      <section
        className={`${
          isOpen ? "w-74" : "w-20"
        } bg-white border-r border-gray-200 text-gray-900 transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {isOpen && (
            <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 ${
              !isOpen && "mx-auto"
            } cursor-pointer`}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map(({ icon: Icon, label, href }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-yellow-400 text-black font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={20} className={`${!isOpen && "mx-auto"} flex-shrink-0`} />
              {isOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            {/* Profile Info */}
            <NavLink to={"/user-profile"} className="flex items-center space-x-2 min-w-0">
              <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                <User size={18} className="text-black" />
              </div>

              {isOpen && (
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate text-gray-900">
                    {user?.userData?.fullName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.userData?.email}
                  </p>
                </div>
              )}
            </NavLink>

            {/* Logout Button */}
            {isOpen && (
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-500 hover:scale-110 cursor-pointer transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;
