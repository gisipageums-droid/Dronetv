import Sidebar from "../common/Sidbar";
import MobileBottomNav from "../common/MobileBottomNav";
import React from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen pt-20 pb-4 px-2 md:px-6 flex bg-gray-50 text-gray-900">
      <main className="flex-1 min-h-0 w-full flex gap-2">
        {/* Sidebar — desktop only */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Content */}
        <div className="flex-1 w-full overflow-y-auto rounded-lg shadow-sm border border-gray-200 pb-20 lg:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
