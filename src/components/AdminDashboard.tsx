import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Menu,
  X,
  FileText,
  Package,
  Info,
  Building2,
  UserCheck,
  Calendar,
  ChevronLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface DashboardProps {
  showToast: (message: string, type: "success" | "error") => void;
}

// Toast Component
interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

const ToastComponent: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div
        className={`flex items-center p-4 rounded-lg shadow-lg border ${
          type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
        ) : (
          <XCircle className="w-5 h-5 mr-3 text-red-600" />
        )}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className={`ml-4 p-1 rounded-full hover:bg-opacity-20 ${
            type === "success" ? "hover:bg-green-600" : "hover:bg-red-600"
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<DashboardProps> = ({ showToast }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminId");
    showToast("Logged out successfully", "success");
    navigate("/");
  };

  const handleCardClick = (cardType: string) => {
    if (cardType === "company") {
      navigate("/admin-dashboard/company-form");
    }
  };

  const sidebarItems = [
    { id: "forms", label: "Forms", icon: FileText },
    { id: "products", label: "Products", icon: Package },
    { id: "about", label: "About", icon: Info },
  ];

  const formCards = [
    {
      id: "company",
      title: "Company",
      icon: Building2,
      description: "Manage company information",
    },
    {
      id: "professional",
      title: "Professional",
      icon: UserCheck,
      description: "Professional profiles",
    },
    {
      id: "events",
      title: "Events",
      icon: Calendar,
      description: "Event management",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 border-r border-yellow-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-yellow-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all ${
                currentView === item.id
                  ? "bg-yellow-400 text-white shadow-md"
                  : "hover:bg-yellow-50 text-gray-700 hover:text-yellow-600"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-yellow-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-4"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-800 capitalize">
                {currentView === "forms" && currentView
                  ? "Forms Management"
                  : "Dashboard"}
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, Admin #{localStorage.getItem("adminId")}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8">
          {currentView === "dashboard" && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-yellow-200">
                <div className="text-center">
                  <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Building2 className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome to Admin Dashboard
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                    Manage your business operations efficiently with our
                    comprehensive admin panel. Use the sidebar to navigate
                    between different sections.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-12 place-items-center">
  {sidebarItems.map((item) => (
    <div
      key={item.id}
      className="w-44 h-44 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 hover:shadow-md transition-all flex flex-col justify-between items-center p-4 hover:scale-105 cursor-pointer"
    >
      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mt-2 group-hover:bg-yellow-500 transition-colors shadow-md">
        <item.icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-center px-2">
        <h3 className="text-sm font-bold text-gray-800">{item.label}</h3>
        <p className="text-xs text-gray-600">
          {item.id === "forms" && "Manage application forms"}
          {item.id === "products" && "Product catalog management"}
          {item.id === "about" && "Company information"}
        </p>
      </div>
      <div className="w-full h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  ))}
</div>

                </div>
              </div>
            </div>
          )}

          {currentView === "forms" && (
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Back to Dashboard
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-yellow-200">
                <div className="text-center mb-8">
                  <FileText className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Forms Management
                  </h2>
                  <p className="text-gray-600">
                    Choose a form category to manage
                  </p>
                </div>

                {/* 🔥 Updated Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 place-items-center">
                  {formCards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      className="w-44 h-44 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 hover:shadow-lg transition-all cursor-pointer group hover:scale-105 flex flex-col justify-between items-center p-4"
                    >
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mt-2 group-hover:bg-yellow-500 transition-colors shadow-md">
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-center px-2">
                        <h3 className="text-sm font-bold text-gray-800">
                          {card.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {card.description}
                        </p>
                      </div>
                      <div className="w-full h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === "products" && (
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Back to Dashboard
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-yellow-200 text-center">
                <Package className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Products Management
                </h2>
                <p className="text-gray-600 text-lg">
                  Product management features will be implemented here.
                </p>
              </div>
            </div>
          )}

          {currentView === "about" && (
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Back to Dashboard
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-yellow-200 text-center">
                <Info className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  About Section
                </h2>
                <p className="text-gray-600 text-lg">
                  Company information and about section will be managed here.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
