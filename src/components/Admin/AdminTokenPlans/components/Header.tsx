import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ setSidebarOpen }: HeaderProps) {
  return (
    <header className="bg-white/40 backdrop-blur-xl border-b border-yellow-200/50 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-yellow-800 hover:text-yellow-900 p-2 hover:bg-yellow-300/20 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div>
            <h2 className="text-yellow-900">Token Plan Management</h2>
            <p className="text-xs text-yellow-700/70">Manage your token plans and pricing</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-yellow-300/20 rounded-lg transition-colors text-yellow-800 hover:text-yellow-900 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-yellow-300/20 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block text-yellow-900">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
