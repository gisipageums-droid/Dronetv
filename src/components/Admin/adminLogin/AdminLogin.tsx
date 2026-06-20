import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Tv } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { toast } from "react-toastify";

interface LoginData {
  email: string;
  password: string;
}

const ADMIN_LOGIN_API = "https://mwbeqdpn09.execute-api.ap-south-1.amazonaws.com/prod/dev";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "" });

  const { adminLogin } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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
    <div
      className="h-screen w-screen flex"
      style={{ fontFamily: "'Poppins', sans-serif", background: "#111827" }}
    >
      {/* Left — branding sidebar (same style as admin sidebar) */}
      <div
        className="hidden lg:flex flex-col justify-between w-80 flex-shrink-0 px-8 py-10"
        style={{ background: "#111827", borderRight: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-yellow-400 flex items-center justify-center flex-shrink-0">
            <Tv size={17} className="text-black" />
          </div>
          <div>
            <div className="text-white font-black text-lg leading-tight">
              Drone<span className="text-yellow-400">Tv</span>.in
            </div>
            <div className="text-white/30 text-[10px] font-semibold uppercase tracking-widest">Admin Panel</div>
          </div>
        </div>

        {/* Center text */}
        <div>
          <div className="w-10 h-1 bg-yellow-400 rounded-full mb-6" />
          <h1 className="text-white font-black text-3xl leading-snug mb-4">
            Manage your<br />
            <span className="text-yellow-400">drone ecosystem</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed">
            Companies, professionals, events, media and partnerships — all from one place.
          </p>
        </div>

        {/* Bottom status */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-white/30 text-xs">All systems operational</span>
        </div>
      </div>

      {/* Right — login form (white, matches admin content area) */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 px-6">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-lg bg-yellow-400 flex items-center justify-center">
            <Tv size={17} className="text-black" />
          </div>
          <div>
            <div className="font-black text-lg leading-tight" style={{ color: "#111827" }}>
              Drone<span className="text-yellow-400">Tv</span>.in
            </div>
            <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest">Admin Panel</div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          {/* Yellow top accent — matches admin header */}
          <div className="h-1.5 w-12 bg-yellow-400 rounded-full mb-6" />

          <h2 className="text-2xl font-black text-gray-900 mb-1">Sign in</h2>
          <p className="text-gray-400 text-sm mb-8">Enter your admin credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                placeholder="admin@dronetv.in"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="flex items-center bg-white border border-gray-200 rounded-xl focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20 transition-all">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={onChange}
                  className="flex-1 px-4 py-3 bg-transparent text-gray-900 text-sm placeholder-gray-300 focus:outline-none"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-gray-300 hover:text-yellow-500 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-bold text-black bg-yellow-400 rounded-xl hover:bg-yellow-300 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-8">
            Restricted to authorized administrators only
          </p>
        </div>
      </div>
    </div>
  );
}
