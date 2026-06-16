import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, Zap, Users, BarChart3 } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { toast } from "react-toastify";

interface LoginData {
  email: string;
  password: string;
}

const ADMIN_LOGIN_API = "https://mwbeqdpn09.execute-api.ap-south-1.amazonaws.com/prod/dev";

const FEATURES = [
  { icon: <Users size={16} />, text: "Manage companies, professionals & events" },
  { icon: <BarChart3 size={16} />, text: "Revenue analytics & package control" },
  { icon: <Zap size={16} />, text: "Real-time media & content moderation" },
  { icon: <Shield size={16} />, text: "Secure role-based access control" },
];

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "" });

  const { adminLogin } = useUserAuth();
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please enter both email and password");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(ADMIN_LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginData.email, password: loginData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Admin login successful!");
        adminLogin({
          email: data.adminData?.email || loginData.email,
          name: data.adminData?.userName || "Admin User",
          adminData: {
            ...data.adminData,
            city: data.adminData?.city,
            role: data.adminData?.role,
            isAdmin: data.adminData?.isAdmin,
            state: data.adminData?.state,
            userName: data.adminData?.userName,
          },
        });
        setLoginData({ email: "", password: "" });
        navigate("/admin/plans");
      } else {
        toast.error(data.message || "Login failed. Please check your credentials.");
      }
    } catch {
      toast.error("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-950">
      {/* Left panel — branding (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #111827 0%, #1a1a2e 50%, #0f1117 100%)" }}>

        {/* Decorative background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #F5C518 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #F5C518 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
            <span className="text-black text-lg font-black">D</span>
          </div>
          <div>
            <div className="text-white font-extrabold text-xl leading-none">DroneTv</div>
            <div className="text-yellow-400 text-xs font-semibold tracking-widest uppercase">Admin Panel</div>
          </div>
        </div>

        {/* Main headline */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5 mb-6">
            <Shield size={13} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold tracking-wide uppercase">Secure Admin Access</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
            Control Centre<br />
            <span className="text-yellow-400">for DroneTv</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-sm">
            Manage your entire drone media ecosystem from one powerful dashboard.
          </p>

          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                  {f.icon}
                </div>
                <span className="text-gray-300 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-gray-600 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            All systems operational
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
            <span className="text-black text-lg font-black">D</span>
          </div>
          <div>
            <div className="text-white font-extrabold text-xl leading-none">DroneTv</div>
            <div className="text-yellow-400 text-xs font-semibold tracking-widest uppercase">Admin Panel</div>
          </div>
        </div>

        <div className="w-full max-w-sm xl:max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Sign in</h2>
            <p className="text-gray-500 text-sm">Enter your admin credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="email">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={onChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                placeholder="admin@dronetv.in"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400 transition-colors">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={onChange}
                  className="flex-1 px-4 py-3 bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-gray-600 hover:text-yellow-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 font-bold text-black bg-yellow-400 rounded-xl hover:bg-yellow-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-gray-700 text-center mt-8 flex items-center justify-center gap-1.5">
            <Shield size={11} className="text-gray-600" />
            Restricted to authorized administrators only
          </p>
        </div>
      </div>
    </div>
  );
}
