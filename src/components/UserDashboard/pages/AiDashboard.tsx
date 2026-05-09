import React, { useState, Suspense, lazy } from "react";
import {
  ShieldCheck, Bot, Megaphone, Users, Wrench, Server, Filter,
  PhoneCall, PhoneOff, Phone, CalendarCheck, CreditCard,
  MessageCircle, Clock, CheckCircle2, AlertCircle,
  LayoutTemplate, UsersRound, Headphones, Loader2,
  Camera, ChevronDown,
} from "lucide-react";

const AgentsPanel       = lazy(() => import("../ai/AgentsPanel"));
const AuthPanel         = lazy(() => import("../ai/AuthPanel"));
const CampaignsPanel    = lazy(() => import("../ai/CampaignsPanel"));
const ContactsPanel     = lazy(() => import("../ai/ContactsPanel"));
const ToolsPanel        = lazy(() => import("../ai/ToolsPanel"));
const ProvidersPanel    = lazy(() => import("../ai/ProvidersPanel"));
const FunnelPanel       = lazy(() => import("../ai/FunnelPanel"));
const CallLogsPanel     = lazy(() => import("../ai/CallLogsPanel"));
const DncPanel          = lazy(() => import("../ai/DncPanel"));
const PhoneNumbersPanel = lazy(() => import("../ai/PhoneNumbersPanel"));
const CalendarPanel     = lazy(() => import("../ai/CalendarPanel"));
const PaygPanel         = lazy(() => import("../ai/PaygPanel"));
const WaTemplatesPanel     = lazy(() => import("../ai/WaTemplatesPanel"));
const WaContactGroupsPanel = lazy(() => import("../ai/WaContactGroupsPanel"));
const WaCampaignsPanel     = lazy(() => import("../ai/WaCampaignsPanel"));
const WaAgentsPanel        = lazy(() => import("../ai/WaAgentsPanel"));
const WaLiveChatPanel      = lazy(() => import("../ai/WaLiveChatPanel"));

type TabStatus = "active" | "beta" | "coming-soon";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  status: TabStatus;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { id: "authentication",   label: "Authentication",   icon: ShieldCheck,   status: "active" },
  {
    id: "ai-caller", label: "AI Caller Agents", icon: PhoneCall, status: "active",
    children: [
      { id: "caller-agents",  label: "Agents",        icon: Bot,       status: "active" },
      { id: "caller-campaigns", label: "Campaigns",   icon: Megaphone, status: "active" },
      { id: "phone-numbers",  label: "Phone Numbers", icon: Phone,     status: "active" },
      { id: "call-logs",      label: "Call Logs",     icon: PhoneCall, status: "active" },
      { id: "dnc",            label: "DNC List",      icon: PhoneOff,  status: "active" },
    ],
  },
  {
    id: "whatsapp", label: "WhatsApp", icon: MessageCircle, status: "active",
    children: [
      { id: "wa-templates",      label: "Templates",      icon: LayoutTemplate, status: "active" },
      { id: "wa-contact-groups", label: "Contact Groups", icon: UsersRound,     status: "active" },
      { id: "wa-campaigns",      label: "Campaigns",      icon: Megaphone,      status: "active" },
      { id: "wa-agents",         label: "Agents",         icon: Bot,            status: "active" },
      { id: "wa-live-chat",      label: "Live Chat",      icon: Headphones,     status: "active" },
    ],
  },
  { id: "instagram-agents", label: "Instagram Agents", icon: Camera,        status: "active" },
  { id: "contacts",         label: "Contacts",         icon: Users,         status: "active" },
  { id: "tools",            label: "Tools",            icon: Wrench,        status: "active" },
  { id: "providers",        label: "Providers",        icon: Server,        status: "active" },
  { id: "funnel",           label: "Funnel",           icon: Filter,        status: "active" },
  { id: "calendar",         label: "Calendar Booking", icon: CalendarCheck, status: "active" },
  { id: "payg",             label: "Pay As You Go",    icon: CreditCard,    status: "active" },
];

const statusConfig: Record<TabStatus, { label: string; color: string; bg: string }> = {
  active:        { label: "Active", color: "text-green-700", bg: "bg-green-100"  },
  beta:          { label: "Beta",   color: "text-blue-700",  bg: "bg-blue-100"   },
  "coming-soon": { label: "Soon",   color: "text-amber-700", bg: "bg-amber-100"  },
};

function ComingSoonPanel({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
        <Clock size={28} className="text-amber-500" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">{label} — Coming Soon</h2>
      <p className="text-sm text-gray-400 max-w-xs">This feature is under development and will be available soon.</p>
    </div>
  );
}

function PanelLoader() {
  return (
    <div className="flex items-center justify-center h-full py-24 text-gray-300">
      <Loader2 size={28} className="animate-spin" />
    </div>
  );
}

function renderPanel(panelId: string) {
  switch (panelId) {
    case "authentication":    return <AuthPanel />;
    case "instagram-agents":  return <AgentsPanel />;
    case "contacts":          return <ContactsPanel />;
    case "tools":             return <ToolsPanel />;
    case "providers":         return <ProvidersPanel />;
    case "funnel":            return <FunnelPanel />;
    case "calendar":          return <CalendarPanel />;
    case "payg":              return <PaygPanel />;
    case "caller-agents":     return <AgentsPanel />;
    case "caller-campaigns":  return <CampaignsPanel />;
    case "phone-numbers":     return <PhoneNumbersPanel />;
    case "call-logs":         return <CallLogsPanel />;
    case "dnc":               return <DncPanel />;
    case "wa-templates":      return <WaTemplatesPanel />;
    case "wa-contact-groups": return <WaContactGroupsPanel />;
    case "wa-campaigns":      return <WaCampaignsPanel />;
    case "wa-agents":         return <WaAgentsPanel />;
    case "wa-live-chat":      return <WaLiveChatPanel />;
    default:                  return null;
  }
}

const AiDashboard: React.FC = () => {
  const [activePanel, setActivePanel]     = useState("authentication");
  const [expanded, setExpanded]           = useState<Set<string>>(new Set());

  function toggleGroup(groupId: string, firstChildId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
        setActivePanel(firstChildId);
      }
      return next;
    });
  }

  function selectLeaf(id: string) {
    setActivePanel(id);
  }

  return (
    <div className="flex h-full bg-white rounded-lg overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 bg-amber-50 border-r border-amber-100 overflow-y-auto">
        <div className="px-4 py-4 border-b border-amber-200">
          <h2 className="text-xs font-bold text-amber-800 uppercase tracking-widest">AI Suite</h2>
        </div>
        <nav className="py-2">
          {navItems.map((item) => {
            const isGroupExpanded = expanded.has(item.id);
            const isLeafActive    = activePanel === item.id;
            const isGroupActive   = item.children?.some((c) => c.id === activePanel) ?? false;
            const cfg             = statusConfig[item.status];

            if (item.children) {
              return (
                <div key={item.id}>
                  {/* Parent row */}
                  <button
                    onClick={() => toggleGroup(item.id, item.children![0].id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all duration-150 border-l-4 ${
                      isGroupActive
                        ? "border-amber-400 bg-amber-50 text-amber-800"
                        : "border-transparent text-gray-700 hover:bg-amber-100 hover:border-amber-300"
                    }`}
                  >
                    <item.icon size={16} className="shrink-0" />
                    <span className="flex-1 text-sm font-semibold truncate">{item.label}</span>
                    <ChevronDown
                      size={14}
                      className={`shrink-0 text-gray-400 transition-transform duration-200 ${isGroupExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Children */}
                  {isGroupExpanded && (
                    <div className="bg-amber-50/60 border-l-2 border-amber-200 ml-4">
                      {item.children.map((child) => {
                        const isActive = activePanel === child.id;
                        const childCfg = statusConfig[child.status];
                        return (
                          <button
                            key={child.id}
                            onClick={() => selectLeaf(child.id)}
                            className={`w-full flex items-center gap-2 pl-4 pr-3 py-2 text-left transition-all duration-150 border-l-2 ${
                              isActive
                                ? "border-amber-500 bg-amber-400 text-white"
                                : "border-transparent text-gray-600 hover:bg-amber-100 hover:text-gray-800"
                            }`}
                          >
                            <child.icon size={13} className="shrink-0" />
                            <span className="flex-1 text-xs font-medium truncate">{child.label}</span>
                            {child.status !== "active" && (
                              <span className={`text-[8px] font-bold px-1 py-0.5 rounded-full ${childCfg.bg} ${childCfg.color}`}>
                                {childCfg.label}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => selectLeaf(item.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all duration-150 border-l-4 ${
                  isLeafActive
                    ? "bg-amber-400 border-amber-600 text-white"
                    : "border-transparent text-gray-700 hover:bg-amber-100 hover:border-amber-300"
                }`}
              >
                <item.icon size={16} className="shrink-0" />
                <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
                {!isLeafActive && item.status !== "active" && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color} hidden lg:block whitespace-nowrap`}>
                    {cfg.label}
                  </span>
                )}
                {!isLeafActive && item.status === "active" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Content area ── */}
      <main className="flex-1 overflow-y-auto p-7">
        <Suspense fallback={<PanelLoader />}>
          {renderPanel(activePanel)}
        </Suspense>
      </main>
    </div>
  );
};

export default AiDashboard;
