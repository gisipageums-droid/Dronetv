import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type NavItem =
  | { type: "link"; icon: string; label: string; path: string }
  | { type: "section"; label: string };

const NAV: NavItem[] = [
  { type: "link", icon: "📊", label: "Dashboard", path: "/admin/company/dashboard" },
  { type: "section", label: "Management" },
  { type: "link", icon: "🏢", label: "Company Listings", path: "/admin/company/dashboard" },
  { type: "link", icon: "🧑‍✈️", label: "Professionals", path: "/admin/professional/dashboard" },
  { type: "link", icon: "📺", label: "Media Hub", path: "/admin/media/dashboard" },
  { type: "link", icon: "🏛️", label: "Events", path: "/admin/event/dashboard" },
  { type: "section", label: "Finance" },
  { type: "link", icon: "📦", label: "Packages & Revenue", path: "/admin/plans" },
  { type: "section", label: "System" },
  { type: "link", icon: "⚙️", label: "Settings", path: "#" },
];

const BREADCRUMBS: Record<string, string> = {
  "/admin/company/dashboard": "Company Listings",
  "/admin/professional/dashboard": "Professionals",
  "/admin/media/dashboard": "Media Hub",
  "/admin/event/dashboard": "Events",
  "/admin/plans": "Packages & Revenue",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const breadcrumb = BREADCRUMBS[location.pathname] || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Poppins', sans-serif", background: "#F4F5F7" }}>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col overflow-y-auto transition-all duration-200
          ${collapsed ? "w-[60px]" : "w-[240px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ background: "#0A0A0A" }}
      >
        {/* Brand */}
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
            Drone<span style={{ color: "#F5C518" }}>Tv</span>.in
          </div>
          {!collapsed && (
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 2 }}>
              Admin Panel
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 0" }}>
          {NAV.map((item, i) => {
            if (item.type === "section") {
              if (collapsed) return null;
              return (
                <div
                  key={i}
                  style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1.5px", padding: "14px 16px 4px" }}
                >
                  {item.label}
                </div>
              );
            }
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 16px",
                  color: isActive ? "#F5C518" : "rgba(255,255,255,0.6)",
                  fontSize: 12.5,
                  fontWeight: 500,
                  borderLeft: isActive ? "3px solid #F5C518" : "3px solid transparent",
                  background: isActive ? "rgba(245,197,24,0.1)" : "transparent",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                  }
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0, width: 20, textAlign: "center" }}>{item.icon}</span>
                {!collapsed && <span style={{ flex: 1, overflow: "hidden" }}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{ width: 30, height: 30, borderRadius: "50%", background: "#F5C518", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#0A0A0A", flexShrink: 0, cursor: "pointer" }}
              onClick={handleLogout}
              title="Logout"
            >
              DR
            </div>
            {!collapsed && (
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Dev R</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Super Admin</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div
        className={`flex flex-1 flex-col min-h-screen transition-all duration-200 ${collapsed ? "lg:ml-[60px]" : "lg:ml-[240px]"}`}
      >
        {/* Header */}
        <header
          className="sticky top-0 z-30 flex items-center gap-4 bg-white"
          style={{ height: 56, padding: "0 24px", borderBottom: "1px solid #E5E5E5", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
        >
          {/* Hamburger */}
          <button
            onClick={() => { setCollapsed(!collapsed); setMobileOpen(!mobileOpen); }}
            className="flex-shrink-0 rounded"
            style={{ fontSize: 18, color: "#444", cursor: "pointer", padding: 6, border: "none", background: "none" }}
            title="Toggle sidebar"
          >
            ☰
          </button>

          {/* Breadcrumb */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#777" }}>
            <span>DroneTv.in</span>
            <span style={{ color: "#E5E5E5" }}>›</span>
            <span style={{ color: "#1A1A1A", fontWeight: 600 }}>{breadcrumb}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://dronetv.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: "5px 12px", borderRadius: 6, border: "1.5px solid #E5E5E5", fontSize: 12.5, fontWeight: 600, color: "#1A1A1A", background: "#fff", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              View Site
            </a>
            <button style={{ position: "relative", padding: 6, border: "none", background: "none", fontSize: 18, color: "#444", cursor: "pointer" }}>
              🔔
              <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: "#CC1F1F", border: "2px solid #fff" }} />
            </button>
            <div
              style={{ width: 28, height: 28, borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#F5C518", cursor: "pointer" }}
              onClick={handleLogout}
              title="Logout"
            >
              DR
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
