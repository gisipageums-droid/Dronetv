import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { fetchMyApplications, JobApplication } from "../../../lib/jobApplicationsApi";
import { PageHeader, Card, KpiRow, KpiCard, Badge, EmptyState } from "../ui";

const STATUS_TONE: Record<JobApplication["status"], "info" | "success" | "warning" | "error" | "neutral"> = {
  Applied: "info",
  Shortlisted: "warning",
  Interviewing: "warning",
  Hired: "success",
  Rejected: "error",
};

export default function Applications() {
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<JobApplication[]>([]);

  useEffect(() => {
    fetchMyApplications()
      .then(setApps)
      .catch(() => toast.error("Failed to load your applications"))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => ({
    total: apps.length,
    underReview: apps.filter(a => a.status === "Applied" || a.status === "Shortlisted").length,
    interviewing: apps.filter(a => a.status === "Interviewing").length,
    rejected: apps.filter(a => a.status === "Rejected").length,
  }), [apps]);

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;

  return (
    <div>
      <PageHeader title="My Applications" sub="Track the status of every drone job application you've submitted through DroneTv.in" />
      <KpiRow>
        <KpiCard label="Total Applied" value={counts.total} accent="blue" />
        <KpiCard label="Under Review" value={counts.underReview} />
        <KpiCard label="Interviewing" value={counts.interviewing} accent="green" />
        <KpiCard label="Rejected" value={counts.rejected} accent="red" />
      </KpiRow>

      {apps.length === 0 ? (
        <EmptyState text="You haven't applied to any jobs yet — browse the Job Board to get started." />
      ) : (
        apps.map(app => (
          <Card key={app.applicationId} className="mb-3 p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[14px] font-bold text-white truncate">{app.jobTitle || "Untitled Role"}</div>
              <div className="text-[12px] text-white/40 truncate">{app.company} {app.expectedSalary && `· ${app.expectedSalary}`}</div>
              <div className="text-[11px] text-white/30 mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</div>
            </div>
            <Badge tone={STATUS_TONE[app.status]}>{app.status}</Badge>
          </Card>
        ))
      )}
    </div>
  );
}
