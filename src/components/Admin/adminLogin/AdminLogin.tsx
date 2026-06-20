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
      className="h-screen w-screen flex items-center justify-center bg-gray-950 px-4 overflow-y-auto"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Card */}
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">

        {/* Header bar */}
        <div className="bg-yellow-400 px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center flex-shrink-0">
            <Tv size={16} className="text-black" />
          </div>
          <div>
            <div className="text-black font-black text-base leading-tight">
              Drone<span className="text-white/80">Tv</span>.in
            </div>
            <div className="text-black/60 text-[10px] font-semibold uppercase tracking-widest">
              Admin Panel
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-6">
          <h2 className="text-white font-bold text-xl mb-1">Sign In</h2>
          <p className="text-white/40 text-xs mb-6">Authorized administrators only</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={onChange}
                className="w-full px-3 py-2.5 bg-gray-800 border border-white/10 rounded-lg text-white text-sm placeholder-white/20 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                placeholder="admin@dronetv.in"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="flex items-center bg-gray-800 border border-white/10 rounded-lg focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400 transition-colors">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={onChange}
                  className="flex-1 px-3 py-2.5 bg-transparent text-white text-sm placeholder-white/20 focus:outline-none"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-white/30 hover:text-yellow-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 font-bold text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-1"
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
        </div>
      </div>
    </div>
  );
}
