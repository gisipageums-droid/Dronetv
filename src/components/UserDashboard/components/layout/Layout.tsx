import Sidebar from "../common/Sidbar";
import React from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen py-20 flex bg-gray-50 text-gray-900 p-6 space-x-5">
      <main className="h-screen w-full flex gap-2">
        {/* sidebar */}
        <Sidebar />

        {/* content */}
        <div className="flex-1 w-full overflow-y-auto rounded-lg shadow-lg border border-yellow-200">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
