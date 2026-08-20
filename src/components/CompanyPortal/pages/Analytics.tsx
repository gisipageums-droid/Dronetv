import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserAuth } from "../../context/context";
import { LEADS_API, AUTH_API, LAMBDA } from "../../../lib/apiConfig";
import { fetchMyContent } from "../../../lib/mediaApi";
import { getMyCompany } from "../api";
import { PageHeader, Card, CardHeader, KpiRow, KpiCard, EmptyState } from "../ui";

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

export default function Analytics() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [company, setCompany] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [contentCount, setContentCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    getMyCompany(userId).then((c) => {
      setCompany(c);
      const base = LEADS_API || LAMBDA.leads;
      const leadsUrl = c
        ? `${base}/leads?userId=${encodeURIComponent(userId)}&mode=all&limit=500&offset=0&filter=all&publishedId=${c.publishedId}`
        : `${base}/leads?userId=${encodeURIComponent(userId)}&mode=all&limit=500&offset=0&filter=all`;
      axios.get(leadsUrl).then((r) => setLeads(r.data?.leads || r.data?.data || [])).catch(() => {});
    }).finally(() => setLoading(false));

    fetchMyContent(undefined).then((items) => {
      setContentCount(items.length);
      setPublishedCount(items.filter((i) => i.isPublished).length);
    }).catch(() => {});

    axios.get(`${PROFILE_API}?userId=${userId}`)
      .then((r) => setTokenBalance(r.data?.profile?.tokenBalance ?? 0))
      .catch(() => {});
  }, [userId]);

  const viewedLeads = leads.filter((l) => l.viewed).length;
  const categoryBreakdown = leads.reduce((acc: Record<string, number>, l) => {
    const cat = l.category || "Other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCat = Math.max(1, ...topCategories.map(([, n]) => n));

  return (
    <div>
      <PageHeader title="Analytics" sub="How your company profile is performing" />

      {loading ? (
        <Card className="text-center py-16 text-white/40">Loading...</Card>
      ) : (
        <>
          <KpiRow>
            <KpiCard label="Profile Views" value={(company?.profileViews ?? 0).toLocaleString("en-IN")} note="Public page visits" accent="yellow" />
            <KpiCard label="Total Leads" value={leads.length} accent="green" />
            <KpiCard label="Leads Viewed" value={viewedLeads} accent="blue" />
            <KpiCard label="Product Listings" value={company?.productsCount ?? 0} accent="red" />
          </KpiRow>
          <KpiRow>
            <KpiCard label="Profile Completion" value={`${company?.completionPercentage ?? 0}%`} accent="red" />
            <KpiCard label="Content Posts" value={contentCount} note={`${publishedCount} published`} accent="blue" />
            <KpiCard label="Service Listings" value={company?.servicesCount ?? 0} accent="green" />
            <KpiCard label="Token Balance" value={tokenBalance.toLocaleString("en-IN")} accent="yellow" />
          </KpiRow>

          <Card>
            <CardHeader title="Lead Inquiries by Category" />
            <div className="p-4">
              {topCategories.length === 0 ? (
                <EmptyState text="No lead data yet." />
              ) : (
                <div className="space-y-3">
                  {topCategories.map(([cat, count]) => (
                    <div key={cat} className="min-w-0">
                      <div className="flex justify-between text-xs text-white/70 mb-1">
                        <span className="truncate">{cat}</span>
                        <span className="font-bold flex-shrink-0">{count}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-yellow rounded-full" style={{ width: `${(count / maxCat) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
