import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  CalendarRange,
  CalendarClock,
  X,
  Building2,
  User,
  LucideIcon,
  IndianRupeeIcon,
  History as HistoryIcon,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "token-price", label: "Token Price", icon: IndianRupeeIcon },
  {
    id: "transaction-history",
    label: "Transaction History",
    icon: HistoryIcon,
  },
  { id: "one-time", label: "One-Time Plans", icon: ShoppingBag },
  { id: "monthly", label: "Monthly Plans", icon: Calendar },
  { id: "Quarterly", label: "Quarterly Plans", icon: CalendarRange },
  { id: "yearly", label: "Yearly Plans", icon: CalendarClock },
];

const dashboardLinks: MenuItem[] = [
  {
    id: "events",
    label: "Events",
    icon: Calendar,
    path: "/admin/event/dashboard",
  },
  {
    id: "companies",
    label: "Companies",
    icon: Building2,
    path: "/admin/company/dashboard",
  },
  {
    id: "professionals",
    label: "Professionals",
    icon: User,
    path: "/admin/professional/dashboard",
  },
];

export function Sidebar({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gray-900 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center font-extrabold text-black text-sm">
                  ₹
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Token Admin</p>
                  <p className="text-xs text-gray-500">Plan Dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                    transition-all duration-150
                    ${
                      isActive
                        ? "bg-yellow-400 text-black font-bold"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="my-3 border-t border-gray-800"></div>
            <div className="px-3 mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
              Other Dashboards
            </div>

            <div className="space-y-0.5">
              {dashboardLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.path) {
                        window.location.href = item.path;
                      }
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
