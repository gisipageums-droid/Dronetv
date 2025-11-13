import React, { useState } from "react";
import {
  Building2,
  Users,
  Calendar,
  Menu,
  X,
  User,
  MessageSquare,

  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useUserAuth } from "../../../context/context";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
 const {user} = useUserAuth();
const navLinks = [
    { icon: User, label: "Dashboard", href: "/user-dashboard" },
    { icon: Building2, label: "Companies", href: "/user-companies" },
    {
      icon: Users,
      label: "Professionals",
      href: "/user-professionals",
    },
    { icon: Calendar, label: "Events", href: "/user-events" },
    { icon: MessageSquare, label: "Contacted People", href: "/user-contacted" },
  ];
  return (
    <aside className="flex h-screen rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <section
        className={`${
          isOpen ? "w-74" : "w-20"
        } bg-amber-50  text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-400">
          {isOpen && (
            <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 bg-yellow-200 hover:bg-yellow-300 hover:text-gray-900 rounded-lg transition-colors text-black ${
              !isOpen && "mx-auto"
            } cursor-pointer`}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navLinks.map(({ icon: Icon, label, href }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg transition-all duration-200 border ${
                  isActive
                    ? "bg-yellow-400 text-white font-semibold border-yellow-500"
                    : "border-yellow-400 text-black hover:bg-yellow-200 hover:text-gray-900"
                }`
              }
            >
              <Icon size={22} className={`${!isOpen && "mx-auto"}`} />
              {isOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="p-2">
          <div className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-yellow-200 hover:text-gray-900 transition-colors cursor-pointer border border-yellow-400">
            {/* Profile Info */}
            <NavLink to={"/user-profile"} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shrink-0">
                <User size={22} className="text-white" />
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
                className="text-red-400 hover:text-red-500 hover:scale-110 cursor-pointer transition-all"
                title="Logout"
              >
                <LogOut />
              </button>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;
