import Sidebar from "../common/Sidbar";
import MobileBottomNav from "../common/MobileBottomNav";
import React from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Sidebar fills full height from top-0, navbar overlaps it */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Content starts below navbar */}
      <div className="flex-1 min-w-0 mt-20 overflow-y-auto pb-20 lg:pb-0">
        {children}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default Layout;
