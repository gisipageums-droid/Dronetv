import React, { useState } from "react";
import {
  ShieldCheck, Mail, Lock, CheckCircle2, LogOut,
  Loader2, User, AlertTriangle,
} from "lucide-react";
import { authApi, type EchoUser } from "./echoleadsApi";

function getStoredUser(): EchoUser | null {
  try {
    const raw = localStorage.getItem("echoleads_user");
    return raw ? (JSON.parse(raw) as EchoUser) : null;
  } catch {
    return null;
  }
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
      {status}
    </span>
  );
}

const AuthPanel: React.FC = () => {
  const [connectedAt] = useState<string>(() => new Date().toLocaleDateString());
  const [user, setUser] = useState<EchoUser | null>(() => getStoredUser());
  const [isConnected, setIsConnected] = useState<boolean>(
    () => !!localStorage.getItem("echoleads_api_key") && !!getStoredUser()
  );
  const [tab, setTab] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function resetForm() {
    setEmail(""); setPassword(""); setName(""); setError(""); setSuccess("");
  }

  async function handleLogin() {
    if (!email.trim() || !password) return;
    setLoading(true); setError("");
    try {
      const res = await authApi.login(email.trim(), password);
      const { accessToken, user: loggedInUser } = res.data;
      localStorage.setItem("echoleads_api_key", accessToken);
      localStorage.setItem("echoleads_user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setIsConnected(true);
    } catch {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!email.trim() || !password || !name.trim()) return;
    setLoading(true); setError(""); setSuccess("");
    try {
      await authApi.register({ email: email.trim(), password, name: name.trim() });
      setSuccess("Account created! Please sign in with your credentials.");
      setTab("login");
      setPassword(""); setName("");
    } catch {
      setError("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  }

  function handleDisconnect() {
    localStorage.removeItem("echoleads_api_key");
    localStorage.removeItem("echoleads_user");
    setUser(null); setIsConnected(false); resetForm();
  }

  if (isConnected && user) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-6">
        <div className="w-full max-w-sm space-y-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle2 size={18} className="text-green-600 shrink-0" />
            <span className="text-sm font-semibold text-green-700">Connected</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <User size={22} className="text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="ml-auto shrink-0">
                <StatusBadge status={user.status} />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Account Details</p>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">User ID</span>
                <span className="font-medium text-gray-700">#{user.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Connected since</span>
                <span className="font-medium text-gray-700">{connectedAt}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-gray-700 capitalize">{user.status}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="flex items-center justify-center gap-2 w-full py-2.5 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={15} />
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck size={28} className="text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 text-center">Connect AI Account</h2>
          <p className="text-sm text-gray-500 mt-1 text-center">Sign in to enable AI-powered lead management.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); resetForm(); }}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            <AlertTriangle size={15} className="shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
            <CheckCircle2 size={15} className="shrink-0" />
            {success}
          </div>
        )}

        <div className="space-y-3">
          {tab === "register" && (
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              />
            </div>
          )}

          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tab === "login" && handleLogin()}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            />
          </div>

          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tab === "login" && handleLogin()}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            />
          </div>

          <button
            onClick={tab === "login" ? handleLogin : handleRegister}
            disabled={loading || !email.trim() || !password || (tab === "register" && !name.trim())}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPanel;
