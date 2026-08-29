import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/context";
import { getMyProfessional, getPortalProfile, getMyConnections, getForumThreads } from "../api";
import { fetchMyApplications } from "../../../lib/jobApplicationsApi";
import { PageHeader, Card, CardHeader, KpiRow, KpiCard, ProgressBar, Badge } from "../ui";

interface DashboardData {
  fullName: string;
  location: string;
  description: string;
  skillsCount: number;
  servicesCount: number;
  profileViews: number;
  portfolioViews: number;
  portfolioCount: number;
  applicationsCount: number;
  connectionsCount: number;
  communityPosts: number;
  hasCertifications: boolean;
  hasPhoto: boolean;
  hasSkills: boolean;
  hasPortfolio: boolean;
  hasBio: boolean;
}

export default function Dashboard() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      try {
        const card = await getMyProfessional(userId);
        if (!card) { setLoading(false); return; }
        const [portal, apps, connections, threads] = await Promise.all([
          getPortalProfile(card.professionalId),
          fetchMyApplications().catch(() => []),
          getMyConnections(card.professionalId),
          getForumThreads().catch(() => []),
        ]);
        const portfolioItems = portal.portfolioItems || [];
        const skills = portal.skills || {};
        const communityPosts = threads.filter((t: any) => t.professionalId === card.professionalId).length;

        setData({
          fullName: card.fullName || "Professional",
          location: card.location || "",
          description: card.professionalDescription || "",
          skillsCount: card.skillsCount || 0,
          servicesCount: card.servicesCount || 0,
          profileViews: card.profileViews || 0,
          portfolioViews: portfolioItems.reduce((s: number, i: any) => s + (i.views || 0), 0),
          portfolioCount: portfolioItems.length,
          applicationsCount: apps.length,
          connectionsCount: connections.accepted.length,
          communityPosts,
          hasCertifications: (portal.certifications || []).length > 0,
          hasPhoto: !!card.previewImage,
          hasSkills: (skills.flightSkills || []).length > 0 || (skills.softwareSkills || []).length > 0,
          hasPortfolio: portfolioItems.length > 0,
          hasBio: !!card.professionalDescription,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;
  if (!data) return <Card className="text-center py-16 text-white/40">No professional profile found for this account.</Card>;

  const checklist = [
    { label: "Basic Info & Contact", done: true },
    { label: "Professional Bio", done: data.hasBio },
    { label: "Profile Photo", done: data.hasPhoto },
    { label: "Skills Added", done: data.hasSkills },
    { label: "Certifications Added", done: data.hasCertifications },
    { label: "Portfolio Item Uploaded", done: data.hasPortfolio },
  ];
  const completion = Math.round((checklist.filter(c => c.done).length / checklist.length) * 100);

  return (
    <div>
      <PageHeader title={`Welcome back, ${data.fullName.split(" ")[0]}`} sub="Your DroneTv.in professional profile overview" />

      <div className="bg-white/[0.03] border border-brand-yellow/20 rounded-lg p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-yellow" />
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div className="flex gap-5 items-center">
            <div className="w-20 h-20 rounded-full bg-brand-yellow flex items-center justify-center text-2xl font-extrabold text-ink flex-shrink-0">
              {data.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-xl font-extrabold text-white mb-1">{data.fullName}</div>
              <div className="text-[12.5px] text-white/50 mb-2">{data.description.slice(0, 120)}{data.description.length > 120 ? "…" : ""}</div>
              <div className="flex flex-wrap gap-2">
                {data.location && <Badge tone="neutral">📍 {data.location}</Badge>}
                <Badge tone="success">{data.skillsCount} Skills</Badge>
                <Badge tone="info">{data.servicesCount} Services</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-6 text-center flex-shrink-0">
            <div><div className="text-xl font-extrabold text-brand-yellow">{data.profileViews}</div><div className="text-[10px] text-white/40 uppercase mt-1">Profile<br />Views</div></div>
            <div><div className="text-xl font-extrabold text-brand-yellow">{data.portfolioCount}</div><div className="text-[10px] text-white/40 uppercase mt-1">Portfolio<br />Items</div></div>
            <div><div className="text-xl font-extrabold text-brand-yellow">{data.connectionsCount}</div><div className="text-[10px] text-white/40 uppercase mt-1">Connections</div></div>
          </div>
        </div>
      </div>

      <KpiRow>
        <KpiCard label="Profile Views" value={data.profileViews} accent="green" />
        <KpiCard label="Portfolio Views" value={data.portfolioViews} accent="blue" />
        <KpiCard label="Applications Sent" value={data.applicationsCount} accent="red" />
        <KpiCard label="Connections" value={data.connectionsCount} accent="green" />
        <KpiCard label="Community Posts" value={data.communityPosts} />
      </KpiRow>

      <Card>
        <CardHeader title="Profile Completeness" action={<span className="text-[13px] font-bold text-status-success">{completion}% Complete</span>} />
        <div className="p-4">
          <div className="mb-4"><ProgressBar pct={completion} accent="green" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {checklist.map((c, i) => (
              <div key={i} className={`flex items-center gap-2 text-[12.5px] ${c.done ? "text-status-success" : "text-white/40"}`}>
                {c.done ? "✅" : "○"} {c.label}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
