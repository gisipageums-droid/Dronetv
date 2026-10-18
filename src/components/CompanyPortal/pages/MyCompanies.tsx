import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ExternalLink, Building2, CheckCircle2, Clock, XCircle, PencilLine, ChevronDown, ChevronRight, GitBranch } from "lucide-react";
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
  // Verticals start expanded under their parent - a company with 2-3
  // verticals (the common case) is more useful fully open than collapsed.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

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
    // against the newly selected company/vertical, same as the header
    // switcher does - every portal page already reads whichever publishedId
    // is active, so a vertical "just works" as a dashboard the same way a
    // standalone company does.
    window.location.assign("/company-portal/profile");
  };

  // "+ Add New Company" - a brand-new, separate legal entity. No parent is
  // passed, so the registration form requires its own GST/CIN even if this
  // account already owns other companies.
  const registerAnother = () => navigate("/user/companies/template-selection");

  // "+ Add Vertical" - a new sub-brand under an existing legal company.
  // Carries the parent through Select.tsx -> CompanyRegistrationForm, which
  // skips the GST/CIN requirement and the server inherits the parent's
  // legal identity.
  const addVertical = (parent: any) =>
    navigate("/user/companies/template-selection", {
      state: { parentCompanyId: parent.publishedId, parentCompanyName: parent.companyName },
    });

  if (loading) return <div className="py-16 text-center text-sm text-white/40">Loading your companies...</div>;

  const topLevel = companies.filter((c) => !c.parentCompanyId);
  const verticalsOf = (publishedId: string) => companies.filter((c) => c.parentCompanyId === publishedId);

  const renderCard = (c: any, opts: { vertical?: boolean } = {}) => {
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
              {/* min-w-0 on the span itself, not just the ancestor - a flex
                  item's default min-width is its own content width, so
                  without this the long real company names (e.g.
                  "BHARATROHAN AIRBORNE INNOVATIONS LIMITED") never actually
                  shrank enough for truncate to engage, overflowing the card
                  past the screen edge on mobile instead of the intended
                  ellipsis. */}
              <span className="min-w-0 truncate text-sm font-bold text-white">{c.companyName || "Untitled company"}</span>
              {opts.vertical && <Badge tone="neutral"><GitBranch size={10} /> Vertical</Badge>}
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

        <div className="flex flex-wrap gap-2 mt-3.5">
          <Btn size="sm" variant={isActive ? "outline" : "primary"} onClick={() => manage(c.publishedId)}>
            <PencilLine size={13} /> {isActive ? "Manage" : "Manage this one"}
          </Btn>
          {c.reviewStatus?.toLowerCase() === "approved" && c.urlSlug && (
            <a
              href={`/${c.templateSelection === "template-2" || c.templateSelection === "2" ? "companies" : "company"}/${c.urlSlug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg font-semibold px-3 py-1.5 text-xs bg-transparent text-white/70 border border-white/15 hover:bg-white/5 hover:text-white"
            >
              <ExternalLink size={13} /> View
            </a>
          )}
          {!opts.vertical && (
            <Btn size="sm" variant="dark" onClick={() => addVertical(c)}>
              <Plus size={13} /> Add Vertical
            </Btn>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div>
      <PageHeader
        title="My Companies"
        sub={
          companies.length
            ? `${topLevel.length} ${topLevel.length === 1 ? "company" : "companies"} on this account — pick one to manage its profile, listings and leads`
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
          <div className="space-y-5">
            {topLevel.map((c) => {
              const verticals = verticalsOf(c.publishedId);
              const isCollapsed = collapsed[c.publishedId];
              return (
                <div key={c.publishedId}>
                  {renderCard(c)}
                  {verticals.length > 0 && (
                    <div className="mt-2 ml-4 pl-4 border-l border-white/10">
                      <button
                        type="button"
                        onClick={() => setCollapsed((p) => ({ ...p, [c.publishedId]: !p[c.publishedId] }))}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50 hover:text-white/80 mb-2"
                      >
                        {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                        {verticals.length} {verticals.length === 1 ? "vertical" : "verticals"}
                      </button>
                      {!isCollapsed && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {verticals.map((v) => renderCard(v, { vertical: true }))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5">
            <Btn variant="dark" onClick={registerAnother}><Plus size={15} /> Add New Company</Btn>
          </div>
        </>
      )}
    </div>
  );
}
