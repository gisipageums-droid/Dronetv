import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Eye, MessageCircle, Send, X, AlertTriangle } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { LEADS_API, LAMBDA } from "../../../lib/apiConfig";
import { getMyCompany } from "../api";
import { PageHeader, Card, KpiRow, KpiCard, Badge, Btn, Chip, EmptyState } from "../ui";

interface Lead {
  leadId: string;
  company: string;
  category: string;
  subject: string;
  email: string;
  phone: string;
  viewed: boolean;
  firstName: string;
  lastName: string;
  message: string;
  companyName: string;
  submittedAt: string;
  viewedAt?: string;
}

interface ChatMessage {
  id: string;
  senderType: "user" | "lead";
  senderName: string;
  message: string;
  timestamp: Date;
}

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function Leads() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [packageType, setPackageType] = useState("");
  const hasFreeLeads = packageType === "brand";
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "New" | "Viewed">("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showTokenModal, setShowTokenModal] = useState(false);
  const [detailsLead, setDetailsLead] = useState<Lead | null>(null);
  const [chatLead, setChatLead] = useState<Lead | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatPollRef = useRef<number | null>(null);

  useEffect(() => {
    if (!userId) { setCompanyLoading(false); return; }
    getMyCompany(userId).then((c) => setPublishedId(c?.publishedId || null)).finally(() => setCompanyLoading(false));
  }, [userId]);

  const fetchTokens = useCallback(async () => {
    if (!userId) return;
    try {
      const base = LEADS_API || LAMBDA.profile;
      const res = await fetch(`${base}/profile?userId=${userId}`);
      const data = await res.json();
      setTotalTokens(data.profile?.tokenBalance || 0);
      setPackageType((data.profile?.packageType || "").toLowerCase());
    } catch {}
  }, [userId]);

  const fetchLeads = useCallback(async () => {
    if (!userId || !publishedId) return;
    try {
      const base = LEADS_API || LAMBDA.profile;
      const res = await fetch(`${base}/leads?userId=${userId}&mode=all&limit=50&offset=0&filter=all&publishedId=${publishedId}`);
      const data = await res.json();
      setLeads(data.success && Array.isArray(data.leads) ? data.leads : []);
    } catch {
      setLeads([]);
    }
  }, [userId, publishedId]);

  useEffect(() => {
    if (companyLoading) return;
    if (!publishedId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([fetchTokens(), fetchLeads()]).finally(() => setLoading(false));
  }, [companyLoading, publishedId, fetchTokens, fetchLeads]);

  const handleUnlock = async (leadId: string) => {
    if (!hasFreeLeads && totalTokens < 10) {
      setShowTokenModal(true);
      return;
    }
    try {
      const base = LEADS_API || LAMBDA.profile;
      const res = await fetch(`${base}/leads/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, leadId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Lead unlocked");
        fetchTokens();
        fetchLeads();
      } else {
        toast.error(data.message || "Failed to unlock lead");
      }
    } catch {
      toast.error("Failed to unlock lead");
    }
  };

  const openChat = (lead: Lead) => {
    setChatLead(lead);
    setChatMessages([]);
    fetchChatMessages(lead);
    if (chatPollRef.current) clearInterval(chatPollRef.current);
    chatPollRef.current = window.setInterval(() => fetchChatMessages(lead), 8000);
  };

  const closeChat = () => {
    setChatLead(null);
    if (chatPollRef.current) clearInterval(chatPollRef.current);
  };

  const fetchChatMessages = async (lead: Lead) => {
    try {
      const base = LEADS_API || LAMBDA.leadsChat;
      const res = await fetch(`${base}/chat/messages?leadId=${lead.leadId}&userId=${userId}&markAsRead=false`, {
        headers: { "X-User-Email": userId },
      });
      const data = await res.json();
      if (Array.isArray(data?.messages)) {
        setChatMessages(data.messages.map((m: any) => ({
          id: m.messageId || m.id || `${m.timestamp}-${Math.random()}`,
          senderType: m.senderType === "user" ? "user" : "lead",
          senderName: m.senderName || m.sender,
          message: m.message,
          timestamp: new Date(m.timestamp),
        })));
      }
    } catch {}
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);
  useEffect(() => () => { if (chatPollRef.current) clearInterval(chatPollRef.current); }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatLead) return;
    const text = newMessage;
    setNewMessage("");
    const temp: ChatMessage = { id: `temp-${Date.now()}`, senderType: "user", senderName: "You", message: text, timestamp: new Date() };
    setChatMessages((prev) => [...prev, temp]);
    try {
      const base = LEADS_API || LAMBDA.leadsChat;
      const res = await fetch(`${base}/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-User-Email": userId },
        body: JSON.stringify({ leadId: chatLead.leadId, message: text, leadEmail: chatLead.email }),
      });
      const data = await res.json();
      if (!data.success) {
        setChatMessages((prev) => prev.filter((m) => m.id !== temp.id));
        toast.error("Failed to send message");
      }
    } catch {
      setChatMessages((prev) => prev.filter((m) => m.id !== temp.id));
      toast.error("Failed to send message");
    }
  };

  const categories = ["All", ...Array.from(new Set(leads.map((l) => l.subject).filter(Boolean)))];
  const filtered = leads.filter((l) => {
    const matchesSearch = !search || l.company?.toLowerCase().includes(search.toLowerCase()) || l.subject?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || (statusFilter === "New" ? !l.viewed : l.viewed);
    const matchesCategory = categoryFilter === "All" || l.subject === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const newCount = leads.filter((l) => !l.viewed).length;
  const viewedCount = leads.filter((l) => l.viewed).length;

  if (companyLoading || loading) {
    return (
      <div>
        <PageHeader title="B2B Leads" sub="Buyer inquiries submitted to your company profile" />
        <Card className="text-center py-16 text-white/40">Loading...</Card>
      </div>
    );
  }

  if (!publishedId) {
    return (
      <div>
        <PageHeader title="B2B Leads" sub="Buyer inquiries submitted to your company profile" />
        <Card><EmptyState text="No published company found. Publish your profile to start receiving leads." /></Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="B2B Leads" sub="Buyers who submitted enquiries through your DroneTv.in profile" />

      <KpiRow>
        <KpiCard label="Total Leads" value={leads.length} accent="yellow" />
        <KpiCard label="New / Unread" value={newCount} accent="green" />
        <KpiCard label="Viewed" value={viewedCount} accent="blue" />
      </KpiRow>

      <Card className="p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-3">
          <input
            className="px-3.5 py-2.5 rounded-lg border border-white/10 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            {(["All", "New", "Viewed"] as const).map((s) => (
              <Chip key={s} on={statusFilter === s} onClick={() => setStatusFilter(s)}>{s}</Chip>
            ))}
          </div>
        </div>
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Chip key={c} on={categoryFilter === c} onClick={() => setCategoryFilter(c)}>{c}</Chip>
            ))}
          </div>
        )}
      </Card>

      {filtered.length === 0 ? (
        <Card><EmptyState text={leads.length === 0 ? "No leads yet. Share your company page to start receiving enquiries." : "No leads match your filters."} /></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <Card key={lead.leadId} className="p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-bold text-white ${lead.viewed ? "" : "blur-sm select-none"}`}>
                      {lead.firstName} {lead.lastName}
                    </span>
                    <Badge tone={lead.viewed ? "success" : "warning"}>{lead.viewed ? "Viewed" : "New"}</Badge>
                  </div>
                  <div className={`text-xs text-white/40 mt-0.5 ${lead.viewed ? "" : "blur-sm select-none"}`}>{lead.company}</div>
                  <p className="text-sm text-white/70 mt-2 line-clamp-2">{lead.message || "No message provided."}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-white/40">
                    {lead.subject && <span>Enquiry: {lead.subject}</span>}
                    <span>{timeAgo(lead.submittedAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {lead.viewed ? (
                    <>
                      <Btn size="sm" variant="outline" onClick={() => setDetailsLead(lead)}>Details</Btn>
                      <Btn size="sm" onClick={() => openChat(lead)}><MessageCircle size={13} /> Chat</Btn>
                    </>
                  ) : (
                    <Btn size="sm" onClick={() => handleUnlock(lead.leadId)}>
                      <Eye size={13} /> {hasFreeLeads ? "View (Free)" : "View (10 tokens)"}
                    </Btn>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Token modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-[1000]">
          <div className="bg-ink rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-yellow-soft rounded-full p-3"><AlertTriangle size={24} className="text-brand-gold" /></div>
            </div>
            <h3 className="text-lg font-bold text-center text-white mb-2">Insufficient Tokens</h3>
            <p className="text-sm text-white/40 text-center mb-6">
              You need at least 10 tokens to view lead details. Current balance: <span className="font-bold text-white">{totalTokens}</span>
            </p>
            <div className="flex gap-3">
              <Btn variant="outline" className="flex-1 justify-center" onClick={() => setShowTokenModal(false)}>Cancel</Btn>
              <Btn className="flex-1 justify-center" onClick={() => setShowTokenModal(false)}>Buy Tokens</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Details modal */}
      {detailsLead && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-[1000]" onClick={() => setDetailsLead(null)}>
          <div className="bg-ink rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-ink px-5 py-4 rounded-t-2xl flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Lead Details</h3>
              <button onClick={() => setDetailsLead(null)} className="text-white/70 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-[10px] font-bold text-white/40 uppercase">Name</div><div className="text-white">{detailsLead.firstName} {detailsLead.lastName}</div></div>
                <div><div className="text-[10px] font-bold text-white/40 uppercase">Company</div><div className="text-white">{detailsLead.company}</div></div>
                <div><div className="text-[10px] font-bold text-white/40 uppercase">Subject</div><div className="text-white">{detailsLead.subject}</div></div>
                <div><div className="text-[10px] font-bold text-white/40 uppercase">Submitted</div><div className="text-white">{new Date(detailsLead.submittedAt).toLocaleDateString("en-IN")}</div></div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-white/40 uppercase mb-1.5">Message</div>
                <div className="bg-white/5 rounded-lg p-3 text-sm text-white/70 border border-white/10">{detailsLead.message || "No message provided."}</div>
              </div>
              <div className="p-3 bg-status-info/10 rounded-lg border border-status-info/25 text-xs text-status-info">
                Contact details are kept private. Use Chat to communicate with this lead directly.
              </div>
              <Btn onClick={() => { const l = detailsLead; setDetailsLead(null); openChat(l); }} className="w-full justify-center"><MessageCircle size={14} /> Open Chat</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Chat modal */}
      {chatLead && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-[1000]" onClick={closeChat}>
          <div className="bg-ink rounded-2xl shadow-xl w-full max-w-lg h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="bg-ink px-5 py-4 rounded-t-2xl flex justify-between items-center flex-shrink-0">
              <h3 className="text-sm font-bold text-white">{chatLead.firstName} {chatLead.lastName}</h3>
              <button onClick={closeChat} className="text-white/70 hover:text-white"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {chatMessages.length === 0 ? (
                <div className="text-center text-xs text-white/40 py-8">No messages yet. Say hello!</div>
              ) : chatMessages.map((m) => (
                <div key={m.id} className={`flex ${m.senderType === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.senderType === "user" ? "bg-brand-yellow text-ink" : "bg-white/10 text-white border border-white/10"}`}>
                    {m.message}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-white/10 flex gap-2 flex-shrink-0">
              <input
                className="flex-1 px-3.5 py-2.5 rounded-lg border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Btn onClick={sendMessage}><Send size={14} /></Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
