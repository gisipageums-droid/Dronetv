import { useEffect, useRef, useState } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle2, XCircle, AlertTriangle, Copy, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { COMPANY_API } from "../../lib/apiConfig";
import { authHeader } from "../../lib/authService";

// Fixes-doc #2 - replaces the manual bulk_import.py CLI script (still kept,
// unchanged) with a real in-app super-admin page: upload the same .xlsx
// template, watch live per-row progress, see a results breakdown instead of
// a CSV file left on someone's laptop. Backend runs this as a background
// job (Surepass + a website crawl can take real time per row), so this page
// polls for status rather than waiting on one long request.
const API = `${COMPANY_API}/admin/bulk-import`;
const POLL_MS = 3000;

interface Row {
  rowNumber: number;
  companyName: string | null;
  status: "PENDING" | "VERIFIED" | "DUPLICATE" | "INVALID" | "FAILED" | "LISTED";
  publicUrl: string | null;
  notes: string | null;
}

interface Job {
  jobId: string;
  uploadedBy: string;
  fileName: string;
  env: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  totalRows: number;
  processedRows: number;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
  rows?: Row[];
  counts?: Record<string, number>;
}

const STATUS_STYLE: Record<string, string> = {
  LISTED: "bg-emerald-100 text-emerald-800",
  DUPLICATE: "bg-amber-100 text-amber-800",
  INVALID: "bg-slate-200 text-slate-700",
  FAILED: "bg-red-100 text-red-800",
  PENDING: "bg-blue-100 text-blue-800",
  VERIFIED: "bg-blue-100 text-blue-800",
};

const COUNT_CARDS: { key: string; label: string; icon: any; tone: string }[] = [
  { key: "LISTED", label: "Listed", icon: CheckCircle2, tone: "text-emerald-600" },
  { key: "DUPLICATE", label: "Duplicates", icon: Copy, tone: "text-amber-600" },
  { key: "INVALID", label: "Invalid rows", icon: AlertTriangle, tone: "text-slate-500" },
  { key: "FAILED", label: "Failed", icon: XCircle, tone: "text-red-600" },
];

export default function AdminBulkImport() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [pastJobs, setPastJobs] = useState<Job[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadPastJobs = () => {
    fetch(API, { headers: authHeader() })
      .then((r) => r.json())
      .then((d) => setPastJobs(d.jobs || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadPastJobs();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const pollJob = (jobId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API}/${jobId}`, { headers: authHeader() });
        const data = await res.json();
        setJob(data.job);
        if (data.job.status === "COMPLETED" || data.job.status === "FAILED") {
          if (pollRef.current) clearInterval(pollRef.current);
          loadPastJobs();
        }
      } catch { /* transient - keep polling */ }
    }, POLL_MS);
  };

  const upload = async () => {
    if (!file) { toast.error("Choose a .xlsx file first"); return; }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      // Dev only, deliberately - no prod option exposed here yet, matching
      // this whole batch of work's standing "dev only until told otherwise" rule.
      const res = await fetch(`${API}?env=dev`, { method: "POST", headers: authHeader(), body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");
      toast.success(`Started - ${data.totalRows} rows queued`);
      setFile(null);
      pollJob(data.jobId);
      const res2 = await fetch(`${API}/${data.jobId}`, { headers: authHeader() });
      setJob((await res2.json()).job);
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openJob = async (jobId: string) => {
    const res = await fetch(`${API}/${jobId}`, { headers: authHeader() });
    const data = await res.json();
    setJob(data.job);
    if (data.job.status === "PENDING" || data.job.status === "RUNNING") pollJob(jobId);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1100px] mx-auto">
      <h1 className="text-lg sm:text-xl font-bold text-ink mb-1">Bulk Company Import</h1>
      <p className="text-sm text-ink-paragraph mb-5">
        Upload the same Excel template used by the CLI script (GSTIN/CIN verified via Surepass, listing auto-published, credentials emailed to the director). Every company created here starts <strong>unclaimed</strong> until the real owner logs in - dev only for now.
      </p>

      <div className="bg-white border border-ink-light rounded-xl p-5 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-ink-light rounded-lg cursor-pointer hover:border-brand-yellow transition-colors">
            <FileSpreadsheet size={16} className="text-ink-caption" />
            <span className="text-sm text-ink-paragraph">{file ? file.name : "Choose .xlsx file..."}</span>
            <input type="file" accept=".xlsx,.xlsm" className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <button
            onClick={upload}
            disabled={!file || uploading}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-yellow text-ink rounded-lg font-semibold text-sm hover:bg-brand-gold transition disabled:opacity-50"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            {uploading ? "Starting..." : "Upload & Run"}
          </button>
        </div>
      </div>

      {job && (
        <div className="bg-white border border-ink-light rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <div className="text-sm font-bold text-ink">{job.fileName}</div>
              <div className="text-xs text-ink-caption mt-0.5">
                Job {job.jobId} · {job.env} · {new Date(job.createdAt).toLocaleString("en-IN")}
              </div>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap ${
              job.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800"
                : job.status === "FAILED" ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}>{job.status}</span>
          </div>

          {(job.status === "PENDING" || job.status === "RUNNING") && (
            <div className="mb-4">
              <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
                <div className="h-full bg-brand-yellow transition-all duration-500"
                  style={{ width: `${job.totalRows ? Math.round((job.processedRows / job.totalRows) * 100) : 0}%` }} />
              </div>
              <div className="text-xs text-ink-caption mt-1.5">
                {job.processedRows} / {job.totalRows} rows processed - verification and website checks take real time per row, this can run for several minutes on a large file.
              </div>
            </div>
          )}

          {job.errorMessage && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
              Job-level error: {job.errorMessage}
            </div>
          )}

          {job.counts && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {COUNT_CARDS.map(({ key, label, icon: Icon, tone }) => (
                <div key={key} className="border border-ink-light rounded-lg p-3 flex items-center gap-2.5">
                  <Icon size={18} className={tone} />
                  <div>
                    <div className="text-lg font-extrabold text-ink leading-none">{job.counts?.[key] || 0}</div>
                    <div className="text-[10.5px] text-ink-caption uppercase tracking-wide">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {job.rows && job.rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10.5px] text-ink-caption uppercase tracking-wide border-b border-ink-light">
                    <th className="py-2 pr-3">Row</th>
                    <th className="py-2 pr-3">Company</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Notes / Link</th>
                  </tr>
                </thead>
                <tbody>
                  {job.rows.map((r) => (
                    <tr key={r.rowNumber} className="border-b border-ink-light/50">
                      <td className="py-2 pr-3 text-ink-caption">{r.rowNumber}</td>
                      <td className="py-2 pr-3 text-ink font-medium">{r.companyName || "—"}</td>
                      <td className="py-2 pr-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLE[r.status] || "bg-slate-100 text-slate-600"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-ink-paragraph">
                        {r.publicUrl ? (
                          <a href={r.publicUrl} target="_blank" rel="noreferrer" className="text-brand-link hover:underline">{r.publicUrl}</a>
                        ) : r.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {pastJobs.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-ink mb-2">Past Imports</h2>
          <div className="space-y-2">
            {pastJobs.map((j) => (
              <button key={j.jobId} onClick={() => openJob(j.jobId)}
                className="w-full text-left bg-white border border-ink-light rounded-lg px-4 py-2.5 hover:border-brand-yellow transition-colors flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{j.fileName}</div>
                  <div className="text-xs text-ink-caption">{new Date(j.createdAt).toLocaleString("en-IN")} · {j.totalRows} rows</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                  j.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800"
                    : j.status === "FAILED" ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}>{j.status}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
