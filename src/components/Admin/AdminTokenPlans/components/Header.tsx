import { Menu, Bell, User, X } from 'lucide-react';
import { useState } from 'react';
import { useUserAuth } from "../../../context/context";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ setSidebarOpen }: HeaderProps) {
  const { admin } = useUserAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("admin data", admin);

  return (
    <>
      <header className="bg-white/40 backdrop-blur-xl w-[70vw] border-b rounded-md border-yellow-200/50 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between ">
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
            
            {/* Admin data button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-yellow-300/20 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block text-yellow-900">{admin?.name}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-xl p-6 max-w-md w-full mx-4 border border-yellow-200/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-yellow-900">Admin Profile</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-yellow-700 hover:text-yellow-900 p-1 hover:bg-yellow-300/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-900">{admin?.name}</h4>
                  <p className="text-sm text-yellow-700/70">{admin?.adminData?.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-yellow-700/70">Email:</label>
                  <p className="text-yellow-900">{admin?.adminData?.email}</p>
                </div>
                <div>
                  <label className="text-yellow-700/70">Username:</label>
                  <p className="text-yellow-900">{admin?.adminData?.userName}</p>
                </div>
                <div>
                  <label className="text-yellow-700/70">City:</label>
                  <p className="text-yellow-900">{admin?.adminData?.city}</p>
                </div>
                <div>
                  <label className="text-yellow-700/70">State:</label>
                  <p className="text-yellow-900">{admin?.adminData?.state}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-yellow-700/70">login time:</label>
                  <p className="text-yellow-900">
                    {admin?.timestamp ? new Date(admin.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-yellow-200/50">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  {admin?.adminData?.isAdmin ? 'Administrator' : 'User'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}