import React, { useState } from "react";
import { Coins, User, LogOut, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../../context/context";

const routeLabels: Record<string, string> = {
  "/user-dashboard":     "Overview",
  "/user-companies":     "Companies",
  "/user-leads":         "Leads",
  "/user-website":       "My Website",
  "/user-professionals": "Professionals",
  "/user-events":        "Events",
  "/user-recharge":      "Recharge",
  "/user-transactions":  "Transaction History",
  "/user-contacted":     "Contacted People",
  "/user-profile":       "Profile",
  "/user-ai":            "AI Suite",
};

const TopHeader: React.FC = () => {
  const { user, logout } = useUserAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const pageName = routeLabels[location.pathname] ?? "Dashboard";
  const tokenBalance = user?.userData?.tokenBalance ?? (user as any)?.tokenBalance ?? 0;
  const initials = (user?.userData?.fullName || user?.fullName || "U")[0].toUpperCase();
  const fullName = user?.userData?.fullName || user?.fullName || "User";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex-shrink-0 flex items-center h-14 px-4 gap-3 bg-yellow-400 shadow-md z-20">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="text-black/50 text-sm font-medium hidden sm:block whitespace-nowrap">DroneTv.in</span>
        <ChevronRight size={14} className="text-black/40 hidden sm:block flex-shrink-0" />
        <span className="text-black font-bold text-sm truncate">{pageName}</span>
      </div>

      {/* Token balance */}
      <Link
        to="/user-recharge"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-yellow-400 text-xs font-bold flex-shrink-0 hover:bg-gray-900 transition-colors"
      >
        <Coins size={13} />
        <span className="hidden sm:inline">{tokenBalance} Tokens</span>
        <span className="sm:hidden">{tokenBalance}</span>
      </Link>

      {/* Profile */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setProfileOpen(v => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center flex-shrink-0">
            <span className="text-yellow-400 text-[11px] font-black">{initials}</span>
          </div>
          <span className="text-black text-sm font-semibold hidden sm:block max-w-[140px] truncate">
            {fullName}
          </span>
        </button>

        {profileOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-bold text-sm text-gray-900 truncate">{fullName}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <Link
                to="/user-profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={14} />
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default TopHeader;
