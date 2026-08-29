import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserPlus, Check } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { getMyProfessional, getSuggestedConnections, getMyConnections, sendConnectionRequest, acceptConnectionRequest } from "../api";
import { PageHeader, Card, KpiRow, KpiCard, Btn, EmptyState } from "../ui";

export default function Networking() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState("");
  const [suggested, setSuggested] = useState<any[]>([]);
  const [connections, setConnections] = useState<{ accepted: any[]; pendingIncoming: any[]; pendingOutgoing: any[] }>({ accepted: [], pendingIncoming: [], pendingOutgoing: [] });
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  const load = async (pid: string) => {
    const [sug, conn] = await Promise.all([getSuggestedConnections(pid), getMyConnections(pid)]);
    setSuggested(sug);
    setConnections(conn);
  };

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      try {
        const card = await getMyProfessional(userId);
        if (!card) { setLoading(false); return; }
        setProfessionalId(card.professionalId);
        await load(card.professionalId);
      } catch {
        toast.error("Failed to load networking data");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const connect = async (targetId: string) => {
    try {
      await sendConnectionRequest(professionalId, targetId);
      setSentIds(prev => new Set(prev).add(targetId));
      toast.success("Connection request sent");
    } catch {
      toast.error("Failed to send connection request");
    }
  };

  const accept = async (connectionId: string) => {
    try {
      await acceptConnectionRequest(connectionId);
      toast.success("Connection accepted");
      await load(professionalId);
    } catch {
      toast.error("Failed to accept connection");
    }
  };

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;
  if (!professionalId) return <Card className="text-center py-16 text-white/40">No professional profile found for this account.</Card>;

  return (
    <div>
      <PageHeader title="Networking" sub="Connect with drone professionals, recruiters, and company contacts across India" />
      <KpiRow>
        <KpiCard label="Connections" value={connections.accepted.length} accent="green" />
        <KpiCard label="Pending Requests" value={connections.pendingIncoming.length} />
        <KpiCard label="Requests Sent" value={connections.pendingOutgoing.length} accent="blue" />
      </KpiRow>

      {connections.pendingIncoming.length > 0 && (
        <>
          <div className="text-sm font-bold text-white mb-3">Pending Requests</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
            {connections.pendingIncoming.map(c => (
              <Card key={c.connectionId} className="p-4 text-center">
                <div className="w-[52px] h-[52px] rounded-full bg-brand-yellow/20 flex items-center justify-center text-lg font-bold text-brand-yellow mx-auto mb-2.5">
                  {(c.fullName || "P").slice(0, 2).toUpperCase()}
                </div>
                <div className="text-[13px] font-bold text-white mb-0.5">{c.fullName}</div>
                <div className="text-[11px] text-white/40 mb-2.5">{c.location}</div>
                <Btn size="sm" onClick={() => accept(c.connectionId)}><Check size={13} /> Accept</Btn>
              </Card>
            ))}
          </div>
        </>
      )}

      <div className="text-sm font-bold text-white mb-3">Suggested Connections</div>
      {suggested.length === 0 ? (
        <EmptyState text="No suggested connections available right now." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {suggested.map(p => {
            const sent = sentIds.has(p.professionalId);
            return (
              <Card key={p.professionalId} className="p-4 text-center">
                <div className="w-[52px] h-[52px] rounded-full bg-status-info/20 flex items-center justify-center text-lg font-bold text-status-info mx-auto mb-2.5">
                  {(p.fullName || "P").slice(0, 2).toUpperCase()}
                </div>
                <div className="text-[13px] font-bold text-white mb-0.5 truncate">{p.fullName}</div>
                <div className="text-[11px] text-white/40 mb-2.5 truncate">{p.location}</div>
                <Btn size="sm" disabled={sent} onClick={() => connect(p.professionalId)}>
                  {sent ? "Requested ✓" : <><UserPlus size={13} /> Connect</>}
                </Btn>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
