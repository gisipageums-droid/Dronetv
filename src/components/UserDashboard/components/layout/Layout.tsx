import Sidebar from "../common/Sidbar";
import MobileBottomNav from "../common/MobileBottomNav";
import React, { useEffect } from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Sidebar fills full height */}
      <div className="hidden lg:flex flex-shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Content starts below navbar */}
      <div className="flex-1 min-w-0 mt-20 overflow-y-auto pb-20 lg:pb-0 overscroll-contain">
        {children}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default Layout;
