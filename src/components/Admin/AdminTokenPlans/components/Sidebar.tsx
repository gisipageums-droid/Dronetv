import { LayoutDashboard, DollarSign, ShoppingBag, Calendar, CalendarRange, CalendarClock, X } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'token-price', label: 'Token Price', icon: DollarSign },
  { id: 'one-time', label: 'One-Time Plans', icon: ShoppingBag },
  { id: 'monthly', label: 'Monthly Plans', icon: Calendar },
  { id: 'Quarterly', label: 'Quarterly Plans', icon: CalendarRange },
  { id: 'yearly', label: 'Yearly Plans', icon: CalendarClock },
];

export function Sidebar({ activePage, setActivePage, sidebarOpen, setSidebarOpen }: SidebarProps) {
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
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white/40 backdrop-blur-xl border-r border-yellow-200/50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-yellow-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
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
                    ${isActive 
                      ? 'bg-yellow-400/30 text-yellow-900 shadow-sm backdrop-blur-sm' 
                      : 'text-yellow-800/70 hover:bg-yellow-300/20 hover:text-yellow-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-yellow-200/50">
            <div className="bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-xl p-4 backdrop-blur-sm border border-yellow-300/30">
              <p className="text-xs text-yellow-900/70 mb-1">Admin Panel</p>
              <p className="text-yellow-900">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
