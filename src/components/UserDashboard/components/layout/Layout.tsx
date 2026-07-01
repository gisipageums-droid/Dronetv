import Sidebar from "../common/Sidbar";
import MobileBottomNav from "../common/MobileBottomNav";
import React from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <div className="flex fixed inset-0 pt-20 bg-gray-950 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Sidebar fills full height */}
      <div className="hidden lg:flex flex-shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 min-w-0 overflow-y-auto pb-20 lg:pb-0 overscroll-contain bg-gray-950">
        {children}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default Layout;
