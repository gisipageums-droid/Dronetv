import { Menu, Bell, User, X } from 'lucide-react';
import { useState } from 'react';
import { useUserAuth } from "../../../context/context";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ setSidebarOpen }: HeaderProps) {
  const { admin } = useUserAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white w-full border-b border-gray-200 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-sm font-bold text-gray-900">Token Plan Management</p>
              <p className="text-xs text-gray-400">Manage your token plans and pricing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center">
                <User className="w-4 h-4 text-black" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">{admin?.name}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-gray-900">Admin Profile</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                  <User className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{admin?.name}</p>
                  <p className="text-xs text-gray-500">{admin?.adminData?.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-400 mb-0.5">Email</p>
                  <p className="font-medium text-gray-800">{admin?.adminData?.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Username</p>
                  <p className="font-medium text-gray-800">{admin?.adminData?.userName}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">City</p>
                  <p className="font-medium text-gray-800">{admin?.adminData?.city}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">State</p>
                  <p className="font-medium text-gray-800">{admin?.adminData?.state}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 mb-0.5">Login Time</p>
                  <p className="font-medium text-gray-800">
                    {admin?.timestamp ? new Date(admin.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-400 text-black rounded-full text-xs font-bold">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                  {admin?.adminData?.isAdmin ? 'Administrator' : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}