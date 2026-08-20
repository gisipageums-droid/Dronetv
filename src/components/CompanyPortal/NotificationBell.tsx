import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Inbox } from "lucide-react";
import { useUserAuth } from "../context/context";
import { getMyCompany, LEADS_API, LAMBDA } from "./api";

interface Lead {
  leadId: string;
  company: string;
  subject: string;
  submittedAt: string;
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

export default function NotificationBell() {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [open, setOpen] = useState(false);
  const [newLeads, setNewLeads] = useState<Lead[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;
    getMyCompany(userId).then((c) => {
      if (!c?.publishedId) return;
      const base = LEADS_API || LAMBDA.profile;
      fetch(`${base}/leads?userId=${encodeURIComponent(userId)}&mode=all&limit=50&offset=0&filter=all&publishedId=${c.publishedId}`)
        .then((r) => r.json())
        .then((data) => {
          const leads = (data.leads || data.data || []) as any[];
          setNewLeads(leads.filter((l) => !l.viewed).slice(0, 8));
        })
        .catch(() => {});
    });
  }, [userId]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="text-white/50 hover:text-white p-1.5 relative" title="Notifications">
        <Bell size={17} />
        {newLeads.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-status-error border-2 border-ink" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-ink border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 text-sm font-bold text-white">
            Notifications {newLeads.length > 0 && <span className="text-white/40 font-normal">({newLeads.length} new)</span>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {newLeads.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-white/40">No new notifications</div>
            ) : (
              newLeads.map((l) => (
                <button
                  key={l.leadId}
                  onClick={() => { setOpen(false); navigate("/company-portal/leads"); }}
                  className="w-full text-left px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex gap-3 items-start"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-yellow/15 text-brand-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Inbox size={13} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">New lead: {l.subject || "Inquiry"}</div>
                    <div className="text-[11px] text-white/40 truncate">{l.company}</div>
                    <div className="text-[10px] text-white/30 mt-0.5">{timeAgo(l.submittedAt)}</div>
                  </div>
                </button>
              ))
            )}
          </div>
          {newLeads.length > 0 && (
            <button
              onClick={() => { setOpen(false); navigate("/company-portal/leads"); }}
              className="w-full py-2.5 text-center text-xs font-semibold text-brand-yellow hover:bg-white/5 border-t border-white/10 transition-colors"
            >
              View all leads
            </button>
          )}
        </div>
      )}
    </div>
  );
}
