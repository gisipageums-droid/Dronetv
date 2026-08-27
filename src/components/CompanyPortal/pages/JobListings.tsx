import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, Trash2, MapPin, IndianRupee, Users, X, FileText, Mail, Phone } from "lucide-react";
import { toast } from "react-toastify";
import { fetchMyContent, deleteContent, updateContent, MediaItem } from "../../../lib/mediaApi";
import { fetchApplications, updateApplication, getResumeViewUrl, JobApplication } from "../../../lib/jobApplicationsApi";
import { useUserAuth } from "../../context/context";
import PostContentCTA from "../../common/PostContentCTA";
import { PageHeader, Card, CardHeader, EmptyState, Badge, Btn } from "../ui";

const STATUS_TONE: Record<JobApplication["status"], "success" | "warning" | "info" | "error" | "neutral"> = {
  Applied: "neutral",
  Shortlisted: "info",
  Interviewing: "warning",
  Hired: "success",
  Rejected: "error",
};

const STATUS_OPTIONS: JobApplication["status"][] = ["Applied", "Shortlisted", "Interviewing", "Hired", "Rejected"];

export default function JobListings() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [applicantsJob, setApplicantsJob] = useState<MediaItem | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchMyContent(undefined, "job")
      .then(setItems)
      .catch(() => toast.error("Failed to load job listings"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const togglePublish = async (item: MediaItem) => {
    try {
      await updateContent({ contentType: item.contentType, contentId: item.contentId, isPublished: !item.isPublished });
      toast.success(item.isPublished ? "Unpublished" : "Published");
      load();
    } catch { toast.error("Failed to update"); }
  };

  const remove = async (item: MediaItem) => {
    try {
      await deleteContent(item.contentType, item.contentId);
      toast.success("Deleted");
      load();
    } catch { toast.error("Failed to delete"); }
  };

  const openApplicants = async (item: MediaItem) => {
    setApplicantsJob(item);
    setApplications([]);
    setAppsLoading(true);
    try {
      const apps = await fetchApplications(item.contentId, userId);
      setApplications(apps);
    } catch {
      toast.error("Failed to load applicants");
    } finally {
      setAppsLoading(false);
    }
  };

  const closeApplicants = () => setApplicantsJob(null);

  const changeStatus = async (app: JobApplication, status: JobApplication["status"]) => {
    setUpdatingId(app.applicationId);
    try {
      await updateApplication(app.jobId, app.applicationId, { status }, userId);
      setApplications((prev) => prev.map((a) => a.applicationId === app.applicationId ? { ...a, status } : a));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const viewResume = async (app: JobApplication) => {
    if (!app.resumeKey) { toast.error("No resume attached"); return; }
    try {
      const url = await getResumeViewUrl(app.resumeKey);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Failed to open resume");
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <PageHeader title="Job Listings" sub="Post openings and manage the jobs your company has listed" />
        <PostContentCTA contentType="job" typeLabel="Job" onSuccess={load} variant="button" />
      </div>

      {loading ? (
        <Card className="text-center py-16 text-white/40">Loading...</Card>
      ) : items.length === 0 ? (
        <Card><EmptyState text='No job listings yet. Click "Add Content" to post your first opening.' /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.contentId} className="overflow-hidden min-w-0">
              {item.imageUrl && (
                <img src={item.imageUrl} alt="" className="w-full h-36 object-cover" />
              )}
              <div className="p-3.5 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-white text-sm line-clamp-2 min-w-0">{item.title}</h3>
                  <Badge tone={item.isPublished ? "success" : "neutral"}>{item.isPublished ? "Published" : "Draft"}</Badge>
                </div>
                {item.category && <div className="text-xs text-brand-gold font-semibold mb-1.5">{item.category}</div>}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/40 mb-2">
                  {item.location && (
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                  )}
                  {item.salary && (
                    <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> {item.salary}</span>
                  )}
                </div>
                <p className="text-xs text-white/40 line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center gap-2">
                  <Btn size="sm" variant="outline" onClick={() => openApplicants(item)} className="flex-1 justify-center">
                    <Users className="w-3.5 h-3.5" /> Applicants
                  </Btn>
                  <button onClick={() => togglePublish(item)} title={item.isPublished ? "Unpublish" : "Publish"}
                    className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-status-success transition-colors">
                    {item.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => remove(item)} title="Delete"
                    className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-status-error transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {applicantsJob && (
        <div className="fixed inset-0 z-[1000] bg-ink/60 flex items-center justify-center p-4" onClick={closeApplicants}>
          <div className="bg-ink border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-sm font-bold text-white">Applicants</h3>
                <p className="text-xs text-white/40 mt-0.5">{applicantsJob.title}</p>
              </div>
              <button onClick={closeApplicants} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {appsLoading ? (
                <div className="p-8 text-center text-white/40 text-sm">Loading...</div>
              ) : applications.length === 0 ? (
                <div className="p-8"><EmptyState text="No applications yet for this job." /></div>
              ) : (
                <div className="divide-y divide-white/10">
                  {applications.map((app) => (
                    <div key={app.applicationId} className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white">{app.fullName}</div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/40 mt-1">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {app.email}</span>
                            {app.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {app.phone}</span>}
                          </div>
                        </div>
                        <Badge tone={STATUS_TONE[app.status]}>{app.status}</Badge>
                      </div>
                      {app.professionalSummary && (
                        <p className="text-xs text-white/60 mb-3 line-clamp-3">{app.professionalSummary}</p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <select
                          value={app.status}
                          disabled={updatingId === app.applicationId}
                          onChange={(e) => changeStatus(app, e.target.value as JobApplication["status"])}
                          className="text-xs bg-white/5 border border-white/15 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-brand-yellow disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-ink">{s}</option>)}
                        </select>
                        {app.resumeKey && (
                          <Btn size="sm" variant="outline" onClick={() => viewResume(app)}>
                            <FileText className="w-3.5 h-3.5" /> Resume
                          </Btn>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
