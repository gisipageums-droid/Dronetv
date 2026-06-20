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
      className="h-screen w-screen overflow-hidden flex items-center justify-center p-4"
      style={{ fontFamily: "'Poppins', sans-serif", background: "#111827" }}
    >
      {/* Card */}
      <div className="w-full max-w-[420px] rounded-2xl overflow-hidden shadow-2xl">

        {/* Card header */}
        <div className="bg-yellow-400 px-8 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-black/15 flex items-center justify-center flex-shrink-0">
            <Tv size={19} className="text-black" />
          </div>
          <div>
            <div className="text-black font-black text-lg leading-tight tracking-tight">
              DroneTv.in
            </div>
            <div className="text-black/50 text-[11px] font-semibold uppercase tracking-widest">
              Admin Panel
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="px-8 py-8" style={{ background: "#1e293b" }}>
          <div className="mb-7">
            <h2 className="text-white font-black text-2xl tracking-tight mb-1">
              Sign in
            </h2>
            <p className="text-white/40 text-sm">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={onChange}
                placeholder="admin@dronetv.in"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none transition-all"
                style={{
                  background: "#0f172a",
                  border: "1.5px solid rgba(255,255,255,0.08)",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "#facc15")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2"
              >
                Password
              </label>
              <div
                className="flex items-center rounded-xl transition-all overflow-hidden"
                style={{ background: "#0f172a", border: "1.5px solid rgba(255,255,255,0.08)" }}
                onFocus={() => {}}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="flex-1 px-4 py-3 bg-transparent text-white text-sm placeholder-white/20 outline-none"
                  onFocus={e => {
                    const parent = e.currentTarget.parentElement!;
                    parent.style.borderColor = "#facc15";
                  }}
                  onBlur={e => {
                    const parent = e.currentTarget.parentElement!;
                    parent.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(p => !p)}
                  className="px-4 text-white/25 hover:text-yellow-400 transition-colors flex-shrink-0"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-black text-sm bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-1"
              style={{ boxShadow: "0 4px 24px rgba(250,204,21,0.3)" }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-white/20 text-xs mt-7">
            Restricted to authorized administrators only
          </p>
        </div>
      </div>
    </div>
  );
}
