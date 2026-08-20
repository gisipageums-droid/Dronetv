import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Package, Users, FileText, Coins, ArrowRight, CheckCircle2 } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { LEADS_API, AUTH_API, LAMBDA } from "../../../lib/apiConfig";
import { getMyCompany } from "../api";
import { PageHeader, Card, CardHeader, KpiRow, KpiCard, Badge, Btn, EmptyState } from "../ui";

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

export default function Dashboard() {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [company, setCompany] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [packageType, setPackageType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    getMyCompany(userId).then((c) => {
      setCompany(c);
      if (c) {
        const base = LEADS_API || LAMBDA.leads;
        axios.get(`${base}/leads?userId=${encodeURIComponent(userId)}&mode=all&limit=5&offset=0&filter=all&publishedId=${c.publishedId}`)
          .then((r) => setLeads(r.data?.leads || r.data?.data || []))
          .catch(() => {});
      }
    }).finally(() => setLoading(false));

    axios.get(`${PROFILE_API}?userId=${userId}`)
      .then((r) => {
        setTokenBalance(r.data?.profile?.tokenBalance ?? 0);
        setPackageType(r.data?.profile?.packageType ?? "");
      })
      .catch(() => {});
  }, [userId]);

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;

  if (!company) {
    return (
      <div>
        <PageHeader title="Dashboard" sub="Welcome to your company portal" />
        <Card><EmptyState text="No published company yet. Complete your Company Profile to get started." /></Card>
      </div>
    );
  }

  const quickLinks = [
    { label: "Company Profile", path: "/company-portal/profile", icon: CheckCircle2 },
    { label: "Product Listings", path: "/company-portal/listings", icon: Package },
    { label: "B2B Leads", path: "/company-portal/leads", icon: Users },
    { label: "My Content", path: "/company-portal/content", icon: FileText },
    { label: "My Package", path: "/company-portal/package", icon: Coins },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" sub={`Welcome back, ${company.companyName}`} />

      <KpiRow>
        <KpiCard label="Profile Completion" value={`${company.completionPercentage ?? 0}%`} accent="yellow" />
        <KpiCard label="Total Leads" value={leads.length} note="Recent" accent="green" />
        <KpiCard label="Token Balance" value={tokenBalance.toLocaleString("en-IN")} note={packageType ? packageType.charAt(0).toUpperCase() + packageType.slice(1) + " plan" : undefined} accent="blue" />
        <KpiCard label="Listings" value={(company.productsCount ?? 0) + (company.servicesCount ?? 0)} accent="red" />
      </KpiRow>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <Card className="lg:col-span-2">
          <CardHeader title="Recent Leads" action={<Btn size="sm" variant="outline" onClick={() => navigate("/company-portal/leads")}>View All <ArrowRight className="w-3.5 h-3.5" /></Btn>} />
          <div className="p-4">
            {leads.length === 0 ? (
              <EmptyState text="No leads yet." />
            ) : (
              <div className="divide-y divide-ink-light">
                {leads.map((l: any) => (
                  <div key={l.leadId} className="py-3 flex items-center justify-between gap-3 min-w-0">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">{l.subject || l.category || "Inquiry"}</div>
                      <div className="text-xs text-white/40 line-clamp-1">{l.message}</div>
                    </div>
                    <Badge tone={l.viewed ? "success" : "warning"}>{l.viewed ? "Viewed" : "New"}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Quick Actions" />
          <div className="p-4 space-y-2">
            {quickLinks.map((q) => {
              const Icon = q.icon;
              return (
                <button key={q.path} onClick={() => navigate(q.path)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-white/10 hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors text-left">
                  <Icon className="w-4 h-4 text-brand-gold flex-shrink-0" />
                  <span className="text-sm font-medium text-white min-w-0 truncate">{q.label}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Company Snapshot" />
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-[11px] font-bold text-white/40 uppercase tracking-wide mb-1">Status</div>
            <Badge tone={company.reviewStatus === "approved" ? "success" : "warning"}>{company.reviewStatus || "pending"}</Badge>
          </div>
          <div>
            <div className="text-[11px] font-bold text-white/40 uppercase tracking-wide mb-1">Location</div>
            <div className="text-sm text-white">{company.location || "—"}</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-white/40 uppercase tracking-wide mb-1">Last Updated</div>
            <div className="text-sm text-white">{company.lastModified ? new Date(company.lastModified).toLocaleDateString("en-IN") : "—"}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
