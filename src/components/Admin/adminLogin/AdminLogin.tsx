import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { toast } from "react-toastify";
import { AUTH_API, LAMBDA } from '../../../lib/apiConfig';

interface LoginData {
  email: string;
  password: string;
}

// Admin login lives in the auth service (issues the same JWT scheme as
// regular login, just checks a staff role) — not the admin service, which
// only handles content/form management and has no login route at all.
const ADMIN_LOGIN_API = AUTH_API ? `${AUTH_API}/admin-login` : `${LAMBDA.adminLogin}/dev`;

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
        // Auth service returns userData (fullName/isAdmin/...); the old
        // Lambda fallback returned adminData (userName/...) - accept either.
        const info = data.userData || data.adminData || {};
        toast.success(data.message || "Admin login successful!");
        adminLogin({
          token: data.token,
          email: info.email || loginData.email,
          name: info.fullName || info.userName || "Admin User",
          adminData: {
            ...info,
            city: info.city,
            role: info.role,
            isAdmin: info.isAdmin,
            state: info.state,
            userName: info.fullName || info.userName,
          },
        });
        setLoginData({ email: "", password: "" });
        navigate("/admin/plans");
      } else {
        toast.error(data.detail || data.message || "Login failed. Please check your credentials.");
      }
    } catch {
      toast.error("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center px-4"
      style={{ fontFamily: "'Poppins', sans-serif", background: "#0f172a" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-[400px] rounded-2xl overflow-hidden"
        style={{
          background: "#1e293b",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Yellow top strip */}
        <div className="h-1 w-full bg-yellow-400" />

        <div className="p-8">
          {/* Logo inside card */}
          <div className="flex justify-center mb-7">
            <img src="/images/Drone tv .in.png" alt="Drone TV" className="h-24 w-auto" />
          </div>

          <div className="mb-7">
            <h2 className="text-white font-black text-2xl mb-1">Welcome back</h2>
            <p className="text-white/40 text-sm">Sign in to your admin account</p>
          </div>

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
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none transition-all"
                style={{ background: "#0f172a", border: "1.5px solid rgba(255,255,255,0.08)" }}
                placeholder="admin@dronetv.in"
                required
                autoComplete="email"
                onFocus={e => (e.currentTarget.style.borderColor = "#facc15")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2" htmlFor="password">
                Password
              </label>
              <div
                className="flex items-center rounded-xl overflow-hidden"
                style={{ background: "#0f172a", border: "1.5px solid rgba(255,255,255,0.08)" }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={onChange}
                  className="flex-1 px-4 py-3 bg-transparent text-white text-sm placeholder-white/20 outline-none"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  onFocus={e => { (e.currentTarget.parentElement as HTMLElement).style.borderColor = "#facc15"; }}
                  onBlur={e => { (e.currentTarget.parentElement as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(p => !p)}
                  className="px-3 text-white/25 hover:text-yellow-400 transition-colors"
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
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-1.5">
            <Shield size={11} className="text-white/20" />
            <p className="text-[11px] text-white/20">Restricted to authorized administrators</p>
          </div>
        </div>
      </div>
    </div>
  );
}
