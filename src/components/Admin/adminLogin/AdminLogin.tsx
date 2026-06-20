import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Tv, Shield } from "lucide-react";
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
      className="h-screen w-screen overflow-hidden flex"
      style={{ fontFamily: "'Poppins', sans-serif", background: "#0f172a" }}
    >
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex flex-col h-full w-[42%] flex-shrink-0 relative overflow-hidden"
        style={{ background: "#111827" }}
      >
        {/* Decorative yellow glow */}
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 65%)", transform: "translate(-30%, 30%)" }}
        />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        {/* Logo — top */}
        <div className="relative z-10 px-10 pt-10 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center flex-shrink-0">
              <Tv size={18} className="text-black" />
            </div>
            <div>
              <div className="text-white font-black text-lg leading-none">
                Drone<span className="text-yellow-400">Tv</span>.in
              </div>
              <div className="text-white/30 text-[10px] font-semibold tracking-widest uppercase mt-0.5">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Center content — vertically centered */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10">
          <div className="w-10 h-1 bg-yellow-400 rounded-full mb-7" />
          <h1 className="text-white font-black text-4xl leading-tight mb-5">
            Your control<br />centre for<br />
            <span className="text-yellow-400">DroneTv</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Manage companies, professionals, events, media and partnerships — all from one powerful dashboard.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Company & professional approvals",
              "Media content management",
              "Revenue & package control",
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                <span className="text-white/50 text-xs">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="relative z-10 px-10 pb-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: "0 0 6px #4ade80" }} />
            <span className="text-white/25 text-xs">All systems operational</span>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{ background: "#0f172a", minHeight: "100vh" }}
      >
        {/* Subtle top-right glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 60%)", transform: "translate(20%, -20%)" }}
        />

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
            <Tv size={18} className="text-black" />
          </div>
          <div>
            <div className="text-white font-black text-lg leading-none">
              Drone<span className="text-yellow-400">Tv</span>.in
            </div>
            <div className="text-white/30 text-[10px] font-semibold tracking-widest uppercase mt-0.5">Admin Panel</div>
          </div>
        </div>

        {/* Card */}
        <div
          className="relative z-10 w-full max-w-[400px] rounded-2xl overflow-hidden"
          style={{ background: "#1e293b", boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)" }}
        >
          {/* Yellow top strip */}
          <div className="h-1 w-full bg-yellow-400" />

          <div className="p-8">
            {/* Header */}
            <div className="mb-7">
              <h2 className="text-white font-black text-2xl mb-1">Welcome back</h2>
              <p className="text-white/40 text-sm">Sign in to your admin account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2" htmlFor="email">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-all"
                  style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)" }}
                  placeholder="admin@dronetv.in"
                  required
                  autoComplete="email"
                  onFocus={e => (e.target.style.borderColor = "rgba(250,204,21,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2" htmlFor="password">
                  Password
                </label>
                <div
                  className="flex items-center rounded-xl transition-all"
                  style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)" }}
                  onFocus={() => {}}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={onChange}
                    className="flex-1 px-4 py-3 bg-transparent text-white text-sm placeholder-white/20 focus:outline-none"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3 text-white/25 hover:text-yellow-400 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 font-bold text-black bg-yellow-400 rounded-xl hover:bg-yellow-300 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm mt-2"
                style={{ boxShadow: "0 4px 20px rgba(250,204,21,0.25)" }}
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

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-1.5">
              <Shield size={11} className="text-white/20" />
              <p className="text-[11px] text-white/20">Restricted to authorized administrators</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
