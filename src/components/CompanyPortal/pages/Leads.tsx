import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MessageCircle, Send, X } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { LEADS_API, LAMBDA } from "../../../lib/apiConfig";
import { getMyCompany, authHeaders } from "../api";
import { PageHeader, Card, KpiRow, KpiCard, Btn, Chip, EmptyState } from "../ui";

interface Lead {
  leadId: string;
  company: string;
  category: string;
  subject: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  message: string;
  submittedAt: string;
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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

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

  const fetchLeads = useCallback(async () => {
    if (!userId || !publishedId) return;
    try {
      const base = LEADS_API || LAMBDA.profile;
      const res = await fetch(`${base}/leads?userId=${encodeURIComponent(userId)}&mode=all&limit=50&offset=0&filter=all&publishedId=${publishedId}`, { headers: authHeaders() });
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
    fetchLeads().finally(() => setLoading(false));
  }, [companyLoading, publishedId, fetchLeads]);

  const openChat = (lead: Lead) => {
    setChatLead(lead);
    setChatMessages([]);
    fetchChatMessages(lead, true);
    if (chatPollRef.current) clearInterval(chatPollRef.current);
    chatPollRef.current = window.setInterval(() => fetchChatMessages(lead, false), 8000);
  };

  // Lets the Analytics page's "Recent Lead Messages" cards deep-link
  // straight into a reply, e.g. /company-portal/leads?openChat=<leadId> -
  // Analytics itself only ever showed messages read-only, no way to reply.
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const leadId = searchParams.get("openChat");
    if (!leadId || leads.length === 0) return;
    const lead = leads.find((l) => l.leadId === leadId);
    if (lead) openChat(lead);
    setSearchParams((prev) => { prev.delete("openChat"); return prev; }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads, searchParams]);

  const closeChat = () => {
    setChatLead(null);
    if (chatPollRef.current) clearInterval(chatPollRef.current);
  };

  const fetchChatMessages = async (lead: Lead, isInitial = false) => {
    try {
      const base = LEADS_API || LAMBDA.leadsChat;
      const res = await fetch(`${base}/chat/messages?leadId=${lead.leadId}&userId=${encodeURIComponent(userId)}&markAsRead=false`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      // A failed request (e.g. 401 on a stale/missing token) returns
      // {detail: "..."}, not {messages: [...]} - that silently fell through
      // this check and left the chat box on its initial empty state with
      // zero indication anything went wrong, indistinguishable from a lead
      // that genuinely has no messages yet. Only surface this on the
      // initial open, not on every 8s background poll retry.
      if (!res.ok) {
        if (isInitial) toast.error(data?.detail || "Couldn't load messages. Please try again.");
        return;
      }
      if (Array.isArray(data?.messages)) {
        setChatMessages(data.messages.map((m: any) => ({
          id: m.messageId || m.id || `${m.timestamp}-${Math.random()}`,
          senderType: m.senderType === "company" ? "user" : "lead",
          senderName: m.senderName || m.sender,
          message: m.message,
          timestamp: new Date(m.timestamp),
        })));
      }
    } catch {
      if (isInitial) toast.error("Couldn't load messages — check your connection.");
    }
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
        headers: authHeaders(),
        body: JSON.stringify({ leadId: chatLead.leadId, userId, message: text, senderType: "company", senderName: "Company" }),
      });
      if (!res.ok) {
        setChatMessages((prev) => prev.filter((m) => m.id !== temp.id));
        toast.error("Failed to send message");
        return;
      }
      const data = await res.json();
      if (!data.messageId) {
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
    const matchesSearch = !search || l.company?.toLowerCase().includes(search.toLowerCase()) || l.subject?.toLowerCase().includes(search.toLowerCase()) || `${l.firstName} ${l.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || l.subject === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
      </KpiRow>

      <Card className="p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-3">
          <input
            className="px-3.5 py-2.5 rounded-lg border border-white/10 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                    <span className="font-bold text-white">{lead.firstName} {lead.lastName}</span>
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">{lead.company}</div>
                  <p className="text-sm text-white/70 mt-2 line-clamp-2">{lead.message || "No message provided."}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-white/40">
                    {lead.subject && <span>Enquiry: {lead.subject}</span>}
                    <span>{timeAgo(lead.submittedAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Btn size="sm" variant="outline" onClick={() => setDetailsLead(lead)}>Details</Btn>
                  <Btn size="sm" onClick={() => openChat(lead)}><MessageCircle size={13} /> Chat</Btn>
                </div>
              </div>
            </Card>
          ))}
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
                <div><div className="text-[10px] font-bold text-white/40 uppercase">Company</div><div className="text-white">{detailsLead.company || "—"}</div></div>
                <div><div className="text-[10px] font-bold text-white/40 uppercase">Email</div><div className="text-white truncate">{detailsLead.email}</div></div>
                <div><div className="text-[10px] font-bold text-white/40 uppercase">Phone</div><div className="text-white">{detailsLead.phone || "—"}</div></div>
                <div><div className="text-[10px] font-bold text-white/40 uppercase">Subject</div><div className="text-white">{detailsLead.subject}</div></div>
                <div><div className="text-[10px] font-bold text-white/40 uppercase">Submitted</div><div className="text-white">{new Date(detailsLead.submittedAt).toLocaleDateString("en-IN")}</div></div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-white/40 uppercase mb-1.5">Message</div>
                <div className="bg-white/5 rounded-lg p-3 text-sm text-white/70 border border-white/10">{detailsLead.message || "No message provided."}</div>
              </div>
              <Btn onClick={() => { const l = detailsLead; setDetailsLead(null); openChat(l); }} className="w-full justify-center"><MessageCircle size={14} /> Reply via Chat</Btn>
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
