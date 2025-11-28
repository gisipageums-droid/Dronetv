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
        w-64 bg-white/40 backdrop-blur-xl border-r border-yellow-200/50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-yellow-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg font-bold text-white">
                  ₹
                </div>
                <div>
                  <h1 className="text-yellow-900">Token Admin</h1>
                  <p className="text-xs text-yellow-700/70">Plan Dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-yellow-800 hover:text-yellow-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-yellow-400/30 text-yellow-900 shadow-sm backdrop-blur-sm"
                        : "text-yellow-800/70 hover:bg-yellow-300/20 hover:text-yellow-900"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="my-4 border-t border-yellow-200/50"></div>
            <div className="px-2 mb-2 text-xs font-semibold text-yellow-800/50 uppercase tracking-wider">
              Other Dashboards
            </div>

            <div className="space-y-2">
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
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-white/50 border border-yellow-200/50 text-yellow-900 hover:bg-yellow-100 hover:shadow-sm group"
                  >
                    <div className="p-1.5 rounded-lg bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item.label}</span>
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
