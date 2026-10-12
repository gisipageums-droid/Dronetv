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
      <header className="bg-surface-card w-full border-b border-ink-light px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-ink-caption hover:text-ink-paragraph p-2 hover:bg-ink-light rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-sm font-bold text-ink">Token Plan Management</p>
              <p className="text-xs text-ink-caption">Manage your token plans and pricing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-ink-light rounded-lg transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-brand-yellow flex items-center justify-center">
                <User className="w-4 h-4 text-ink" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-ink-paragraph">{admin?.name}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface-card rounded-xl p-6 max-w-md w-full mx-4 border border-ink-light shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-ink">Admin Profile</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-caption hover:text-ink-paragraph p-1 hover:bg-ink-light rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center">
                  <User className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <p className="font-bold text-ink text-sm">{admin?.name}</p>
                  <p className="text-xs text-ink-caption">{admin?.adminData?.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-ink-caption mb-0.5">Email</p>
                  <p className="font-medium text-ink-charcoal">{admin?.adminData?.email}</p>
                </div>
                <div>
                  <p className="text-ink-caption mb-0.5">Username</p>
                  <p className="font-medium text-ink-charcoal">{admin?.adminData?.userName}</p>
                </div>
                <div>
                  <p className="text-ink-caption mb-0.5">City</p>
                  <p className="font-medium text-ink-charcoal">{admin?.adminData?.city}</p>
                </div>
                <div>
                  <p className="text-ink-caption mb-0.5">State</p>
                  <p className="font-medium text-ink-charcoal">{admin?.adminData?.state}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-ink-caption mb-0.5">Login Time</p>
                  <p className="font-medium text-ink-charcoal">
                    {admin?.timestamp ? new Date(admin.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-ink-light">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-yellow text-ink rounded-full text-xs font-bold">
                  <div className="w-1.5 h-1.5 bg-ink rounded-full"></div>
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