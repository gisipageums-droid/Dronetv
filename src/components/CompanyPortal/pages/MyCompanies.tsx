import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ExternalLink, Building2, CheckCircle2, Clock, XCircle, PencilLine } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { getMyCompanies, getActivePublishedId, setActivePublishedId } from "../api";
import { PageHeader, Card, Badge, Btn } from "../ui";

type StatusTone = "success" | "warning" | "error" | "neutral";

function statusOf(reviewStatus: string): { label: string; tone: StatusTone; Icon: React.ElementType } {
  switch ((reviewStatus || "").toLowerCase()) {
    case "approved":
      return { label: "Published", tone: "success", Icon: CheckCircle2 };
    case "rejected":
      return { label: "Needs changes", tone: "error", Icon: XCircle };
    case "active":
    default:
      return { label: "Under review", tone: "warning", Icon: Clock };
  }
}

export default function MyCompanies() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(getActivePublishedId());

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    getMyCompanies(userId)
      .then((list) => {
        setCompanies(list);
        const stored = getActivePublishedId();
        if ((!stored || !list.some((c: any) => c.publishedId === stored)) && list[0]) {
          setActivePublishedId(list[0].publishedId);
          setActiveId(list[0].publishedId);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const manage = (publishedId: string) => {
    setActivePublishedId(publishedId);
    setActiveId(publishedId);
    // Full load so every portal page (and the header switcher) re-resolves
    // against the newly selected company, same as the header switcher does.
    window.location.assign("/company-portal/profile");
  };

  const registerAnother = () => navigate("/user/companies/template-selection");

  if (loading) return <div className="py-16 text-center text-sm text-white/40">Loading your companies...</div>;

  return (
    <div>
      <PageHeader
        title="My Companies"
        sub={
          companies.length
            ? `${companies.length} ${companies.length === 1 ? "company" : "companies"} on this account — pick one to manage its profile, listings and leads`
            : "You have not listed a company yet"
        }
      />

      {companies.length === 0 ? (
        <Card className="p-10 text-center">
          <Building2 className="w-10 h-10 mx-auto text-white/30 mb-3" />
          <div className="text-sm text-white/60 mb-5">Once you list a company it will show up here with its review status and profile progress.</div>
          <div className="flex justify-center">
            <Btn onClick={registerAnother}><Plus size={15} /> List your company</Btn>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {companies.map((c) => {
              const st = statusOf(c.reviewStatus);
              const isActive = c.publishedId === activeId;
              const pct = Math.max(0, Math.min(100, Number(c.completionPercentage) || 0));
              return (
                <Card key={c.publishedId} className={`p-4 ${isActive ? "border-brand-yellow/60" : ""}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {c.previewImage
                        ? <img src={c.previewImage} alt="" className="w-full h-full object-cover" />
                        : <span className="text-base font-extrabold text-brand-yellow">{(c.companyName || "C").charAt(0)}</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white truncate">{c.companyName || "Untitled company"}</span>
                        {isActive && <Badge tone="info">Managing</Badge>}
                      </div>
                      <div className="text-[11.5px] text-white/40 truncate mt-0.5">{c.location || "Location not set"}</div>
                      <div className="mt-1.5">
                        <Badge tone={st.tone}><st.Icon size={11} /> {st.label}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10.5px] text-white/40 mb-1">
                      <span>Profile completion</span><span>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-brand-yellow rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3.5">
                    <Btn size="sm" variant={isActive ? "outline" : "primary"} onClick={() => manage(c.publishedId)}>
                      <PencilLine size={13} /> {isActive ? "Manage" : "Manage this one"}
                    </Btn>
                    {c.reviewStatus?.toLowerCase() === "approved" && c.urlSlug && (
                      <a
                        href={`https://dev.dronetv.in/${c.templateSelection === "template-2" || c.templateSelection === "2" ? "t2" : "template"}?companyName=${encodeURIComponent(c.companyName || "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg font-semibold px-3 py-1.5 text-xs bg-transparent text-white/70 border border-white/15 hover:bg-white/5 hover:text-white"
                      >
                        <ExternalLink size={13} /> View
                      </a>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-4">
            <Btn variant="dark" onClick={registerAnother}><Plus size={15} /> Register another company</Btn>
          </div>
        </>
      )}
    </div>
  );
}
