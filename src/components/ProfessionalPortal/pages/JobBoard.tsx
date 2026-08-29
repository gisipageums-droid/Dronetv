import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { fetchContent, MediaItem } from "../../../lib/mediaApi";
import { submitApplication } from "../../../lib/jobApplicationsApi";
import { getMyProfessional } from "../api";
import { PageHeader, Card, Btn, Badge, inputCls, EmptyState } from "../ui";

export default function JobBoard() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [applying, setApplying] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [professional, setProfessional] = useState<any>(null);

  useEffect(() => {
    fetchContent("job").then(setJobs).catch(() => toast.error("Failed to load jobs")).finally(() => setLoading(false));
    if (userId) getMyProfessional(userId).then(setProfessional).catch(() => {});
  }, [userId]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(jobs.map(j => j.category).filter(Boolean) as string[]))], [jobs]);

  const filtered = jobs.filter(j => {
    const matchesCategory = category === "All" || j.category === category;
    const matchesSearch = !search || `${j.title} ${j.company} ${j.description}`.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const apply = async (job: MediaItem) => {
    if (!professional) {
      toast.error("Complete your professional profile before applying");
      return;
    }
    setApplying(job.contentId);
    try {
      await submitApplication({
        jobId: job.contentId,
        jobTitle: job.title,
        company: job.company,
        fullName: professional.fullName || professional.professionalName,
        email: professional.email || userId,
        phone: professional.phone,
        location: professional.location,
        professionalSummary: professional.professionalDescription,
      });
      setAppliedIds(prev => new Set(prev).add(job.contentId));
      toast.success(`Application submitted for ${job.title}`);
    } catch {
      toast.error("Failed to submit application");
    } finally {
      setApplying(null);
    }
  };

  return (
    <div>
      <PageHeader title="Job Board" sub="Drone industry jobs — Agriculture, Survey, Cinematography, Inspection roles across India" />

      <div className="flex flex-wrap gap-2.5 mb-5">
        <div className="flex items-center gap-2 bg-white/5 border border-white/15 rounded-md px-3 py-2 flex-1 min-w-[200px] max-w-[320px]">
          <Search size={15} className="text-white/40" />
          <input className="bg-transparent outline-none text-[13px] text-white placeholder-white/30 w-full" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className={`${inputCls} w-auto`} value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <Card className="text-center py-16 text-white/40">Loading jobs...</Card>
      ) : filtered.length === 0 ? (
        <EmptyState text="No job postings match your filters right now." />
      ) : (
        filtered.map(job => {
          const applied = appliedIds.has(job.contentId);
          return (
            <Card key={job.contentId} className="mb-3.5">
              <div className="p-4">
                <div className="flex gap-4 items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-white mb-1">{job.title}</div>
                    <div className="text-[12px] text-white/40 mb-2">{job.company} {job.location && `· ${job.location}`}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.category && <Badge tone="warning">{job.category}</Badge>}
                      {job.tags?.map(t => <Badge key={t} tone="info">{t}</Badge>)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {job.salary && <div className="text-[15px] font-extrabold text-status-error">{job.salary}</div>}
                    {job.location && <div className="text-[11px] text-white/40 mt-1">📍 {job.location}</div>}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="text-[11.5px] text-white/40">
                    {job.date && `Posted ${job.date}`}{job.applicationDeadline && ` · Apply by ${job.applicationDeadline}`}
                  </div>
                  <Btn onClick={() => apply(job)} disabled={applied || applying === job.contentId}>
                    {applied ? "Applied ✓" : applying === job.contentId ? "Applying..." : "Apply Now"}
                  </Btn>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
