import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Briefcase, Search, FileText, User, Award, FolderKanban, Paperclip, Activity, ExternalLink, GraduationCap, Code2, MessageSquare, X, SlidersHorizontal, Clock, MapPin, Trash2, AlertTriangle, ChevronLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchAdminContent, deleteContent, MediaItem } from '../../../lib/mediaApi';
import { fetchApplications, updateApplication, getResumeViewUrl, sendCandidateMessage, JobApplication } from '../../../lib/jobApplicationsApi';

const STATUS_OPTIONS: JobApplication['status'][] = ['Applied', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'];

const STATUS_COLORS: Record<string, string> = {
  Applied: 'bg-ink-light text-ink-paragraph',
  Shortlisted: 'bg-status-info/15 text-status-info',
  Interviewing: 'bg-brand-yellow-soft text-brand-gold',
  Hired: 'bg-status-success/15 text-status-success',
  Rejected: 'bg-status-error/15 text-status-error',
};

const STATUS_DOT: Record<string, string> = {
  Applied: 'bg-ink-caption',
  Shortlisted: 'bg-status-info',
  Interviewing: 'bg-brand-yellow',
  Hired: 'bg-status-success',
  Rejected: 'bg-status-error',
};

const AVATAR_PALETTE = ['bg-status-info/15 text-status-info', 'bg-brand-gold/15 text-brand-gold', 'bg-status-error/15 text-status-error', 'bg-status-success/15 text-status-success', 'bg-brand-yellow-soft text-brand-gold', 'bg-status-info/15 text-status-info'];

function initials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '?';
}

function colorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

type TabKey = 'overview' | 'resume' | 'education' | 'experience' | 'skills' | 'projects' | 'documents' | 'activity';
const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <User size={14} /> },
  { key: 'resume', label: 'Resume', icon: <FileText size={14} /> },
  { key: 'education', label: 'Education', icon: <GraduationCap size={14} /> },
  { key: 'experience', label: 'Experience', icon: <Briefcase size={14} /> },
  { key: 'skills', label: 'Skills', icon: <Award size={14} /> },
  { key: 'projects', label: 'Projects', icon: <Code2 size={14} /> },
  { key: 'documents', label: 'Documents', icon: <FolderKanban size={14} /> },
  { key: 'activity', label: 'Activity', icon: <Activity size={14} /> },
];

export default function AdminJobBoardDashboard() {
  const [jobs, setJobs] = useState<MediaItem[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobSearch, setJobSearch] = useState('');
  const [jobSort, setJobSort] = useState<'newest' | 'oldest'>('newest');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  // Below the lg breakpoint the three panes (jobs / candidates / profile)
  // don't fit side by side, so only one is shown at a time — this tracks
  // which one, and stays unused (all three render together) at lg+.
  const [mobileView, setMobileView] = useState<'jobs' | 'candidates' | 'profile'>('jobs');

  const selectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setMobileView('candidates');
  };

  const selectApplication = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setMobileView('profile');
  };

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const [deleteConfirmJob, setDeleteConfirmJob] = useState<MediaItem | null>(null);
  const [deletingJob, setDeletingJob] = useState(false);

  useEffect(() => {
    fetchAdminContent(undefined, 'job')
      .then(all => {
        const realJobs = all.filter(j => !j.title.startsWith('[Application]'));
        realJobs.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setJobs(realJobs);
        if (realJobs.length > 0) setSelectedJobId(realJobs[0].contentId);
      })
      .catch(() => toast.error('Failed to load job listings'))
      .finally(() => setLoadingJobs(false));
  }, []);

  const loadApplications = useCallback((jobId: string) => {
    setLoadingApplications(true);
    setSelectedApplicationId(null);
    fetchApplications(jobId)
      .then(items => {
        setApplications(items);
        if (items.length > 0) setSelectedApplicationId(items[0].applicationId);
      })
      .catch(() => toast.error('Failed to load candidates'))
      .finally(() => setLoadingApplications(false));
  }, []);

  useEffect(() => {
    if (selectedJobId) loadApplications(selectedJobId);
    else setApplications([]);
  }, [selectedJobId, loadApplications]);

  useEffect(() => {
    setActiveTab('overview');
    setResumeUrl(null);
  }, [selectedApplicationId]);

  const filteredJobs = useMemo(() => {
    const q = jobSearch.toLowerCase();
    const list = jobs.filter(j => !q || j.title.toLowerCase().includes(q) || (j.company || '').toLowerCase().includes(q));
    const sorted = [...list].sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
    return jobSort === 'newest' ? sorted.reverse() : sorted;
  }, [jobs, jobSearch, jobSort]);

  const filteredCandidates = useMemo(() => {
    const q = candidateSearch.toLowerCase();
    return applications.filter(a => !q || a.fullName.toLowerCase().includes(q));
  }, [applications, candidateSearch]);

  const selectedJob = jobs.find(j => j.contentId === selectedJobId) || null;
  const selectedApplication = applications.find(a => a.applicationId === selectedApplicationId) || null;

  const applicantCount = (jobId: string) => applications.length && selectedJobId === jobId ? applications.length : undefined;

  const handleStatusChange = async (status: JobApplication['status']) => {
    if (!selectedApplication) return;
    try {
      await updateApplication(selectedApplication.jobId, selectedApplication.applicationId, { status });
      toast.success(`Marked as ${status}`);
      loadApplications(selectedApplication.jobId);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleViewResume = async () => {
    if (!selectedApplication?.resumeKey) return;
    setResumeLoading(true);
    try {
      const url = await getResumeViewUrl(selectedApplication.resumeKey);
      setResumeUrl(url);
    } catch {
      toast.error('Failed to load resume');
    } finally {
      setResumeLoading(false);
    }
  };

  const confirmDeleteJob = async () => {
    if (!deleteConfirmJob) return;
    setDeletingJob(true);
    try {
      await deleteContent(deleteConfirmJob.contentType, deleteConfirmJob.contentId);
      toast.success('Job deleted');
      const remaining = jobs.filter(j => j.contentId !== deleteConfirmJob.contentId);
      setJobs(remaining);
      if (selectedJobId === deleteConfirmJob.contentId) {
        setSelectedJobId(remaining.length > 0 ? remaining[0].contentId : null);
      }
      setDeleteConfirmJob(null);
    } catch {
      toast.error('Failed to delete job');
    } finally {
      setDeletingJob(false);
    }
  };

  const openMessage = () => {
    if (!selectedApplication) return;
    setMessageText(`Hi ${selectedApplication.fullName}, we reviewed your profile for ${selectedApplication.jobTitle || 'the role'} and would love to schedule an interview...`);
    setMessageOpen(true);
  };

  const handleSendMessage = async () => {
    if (!selectedApplication || !messageText.trim()) return;
    setSendingMessage(true);
    try {
      await sendCandidateMessage(selectedApplication.jobId, selectedApplication.applicationId, messageText.trim());
      toast.success(`Message sent to ${selectedApplication.fullName}`);
      setMessageOpen(false);
      loadApplications(selectedApplication.jobId);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] min-h-[500px] bg-ink-offwhite border border-ink-light rounded-xl overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Jobs pane */}
        <div className={`w-full lg:w-[300px] flex-shrink-0 border-r border-ink-light bg-surface-card flex-col ${mobileView === 'jobs' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="p-3 border-b border-ink-light">
            <div className="text-xs font-bold text-ink-caption uppercase tracking-wide mb-2">Jobs ({jobs.length})</div>
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-caption" />
              <input value={jobSearch} onChange={e => setJobSearch(e.target.value)} placeholder="Search jobs..."
                className="w-full pl-8 pr-2 py-1.5 text-xs border border-ink-light rounded-lg focus:outline-none focus:border-brand-yellow" />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs font-semibold text-ink-caption">
                <SlidersHorizontal size={12} /> Filter
              </span>
              <select value={jobSort} onChange={e => setJobSort(e.target.value as 'newest' | 'oldest')}
                className="text-xs font-semibold text-ink-paragraph border border-ink-light rounded-md px-1.5 py-1 focus:outline-none focus:border-brand-yellow">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingJobs ? (
              <div className="p-4 text-xs text-ink-caption text-center">Loading jobs...</div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-4 text-xs text-ink-caption text-center">No job listings yet</div>
            ) : filteredJobs.map(job => (
              <div key={job.contentId}
                className={`group w-full px-3 py-3 border-b border-ink-offwhite hover:bg-ink-offwhite transition-colors flex gap-2.5 ${selectedJobId === job.contentId ? 'bg-surface-main border-l-2 border-l-brand-yellow' : ''}`}>
                <button onClick={() => selectJob(job.contentId)} className="flex gap-2.5 flex-1 min-w-0 text-left">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${colorFor(job.contentId)}`}>
                    <Briefcase size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink truncate">{job.title}</p>
                    <p className="text-xs text-ink-caption truncate">{job.company}{job.location ? ` · ${job.location}` : ''}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${job.isPublished ? 'bg-status-success/15 text-status-success' : 'bg-brand-yellow-soft text-brand-gold'}`}>
                        {job.isPublished ? 'Active' : 'Draft'}
                      </span>
                      {applicantCount(job.contentId) !== undefined && (
                        <span className="text-[10px] text-ink-caption">{applicantCount(job.contentId)} applicants</span>
                      )}
                    </div>
                  </div>
                </button>
                <button onClick={() => setDeleteConfirmJob(job)}
                  title="Delete job"
                  className="p-1.5 h-fit rounded hover:bg-status-error/10 text-ink-light hover:text-status-error transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Candidates pane */}
        <div className={`w-full lg:w-[300px] flex-shrink-0 border-r border-ink-light bg-surface-card flex-col ${mobileView === 'candidates' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="p-3 border-b border-ink-light">
            <button onClick={() => setMobileView('jobs')} className="lg:hidden flex items-center gap-1 text-xs font-semibold text-ink-caption hover:text-ink-paragraph mb-2">
              <ChevronLeft size={14} /> Jobs
            </button>
            <div className="text-xs font-bold text-ink-caption uppercase tracking-wide mb-2">Candidates ({applications.length})</div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-caption" />
              <input value={candidateSearch} onChange={e => setCandidateSearch(e.target.value)} placeholder="Search candidates..."
                className="w-full pl-8 pr-2 py-1.5 text-xs border border-ink-light rounded-lg focus:outline-none focus:border-brand-yellow" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {!selectedJobId ? (
              <div className="p-4 text-xs text-ink-caption text-center">Select a job to view candidates</div>
            ) : loadingApplications ? (
              <div className="p-4 text-xs text-ink-caption text-center">Loading candidates...</div>
            ) : filteredCandidates.length === 0 ? (
              <div className="p-4 text-xs text-ink-caption text-center">No applications yet</div>
            ) : filteredCandidates.map(app => (
              <button key={app.applicationId} onClick={() => selectApplication(app.applicationId)}
                className={`w-full text-left px-3 py-3 border-b border-ink-offwhite hover:bg-ink-offwhite transition-colors flex gap-2.5 ${selectedApplicationId === app.applicationId ? 'bg-surface-main border-l-2 border-l-brand-yellow' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold ${colorFor(app.applicationId)}`}>
                  {initials(app.fullName || '?')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ink truncate">{app.fullName || 'Unnamed'}</p>
                    <span className="flex items-center gap-1 flex-shrink-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[app.status]}`} />
                      <span className={`text-[10px] font-semibold ${STATUS_COLORS[app.status].split(' ')[1]}`}>{app.status}</span>
                    </span>
                  </div>
                  <p className="text-xs text-ink-caption truncate">
                    {app.experienceYears ? `${app.experienceYears} yrs` : app.currentRole || 'Applicant'}{app.location ? ` · ${app.location.split(',')[0]}` : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Profile pane */}
        <div className={`flex-1 min-w-0 flex-col overflow-hidden ${mobileView === 'profile' ? 'flex' : 'hidden'} lg:flex`}>
          {!selectedApplication ? (
            <div className="flex-1 flex items-center justify-center text-sm text-ink-caption">
              {selectedJob ? 'Select a candidate to view their profile' : 'Select a job to get started'}
            </div>
          ) : (
            <>
              <div className="px-4 sm:px-6 py-4 border-b border-ink-light bg-surface-card flex-shrink-0">
                <button onClick={() => setMobileView('candidates')} className="lg:hidden flex items-center gap-1 text-xs font-semibold text-ink-caption hover:text-ink-paragraph mb-3">
                  <ChevronLeft size={14} /> Candidates
                </button>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${colorFor(selectedApplication.applicationId)}`}>
                      {initials(selectedApplication.fullName || '?')}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-ink">{selectedApplication.fullName}</h2>
                      <p className="text-xs text-ink-caption truncate">
                        {selectedApplication.currentRole || 'Applicant'}{selectedApplication.currentCompany ? ` · ${selectedApplication.currentCompany}` : ''}
                        {selectedApplication.education ? ` · ${selectedApplication.education.split(',')[0]}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select value={selectedApplication.status} onChange={e => handleStatusChange(e.target.value as JobApplication['status'])}
                      className="text-xs font-semibold border border-ink-light rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-yellow">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={openMessage}
                      className="flex items-center gap-1.5 text-xs font-bold bg-brand-yellow text-ink px-3 py-1.5 rounded-lg hover:bg-brand-yellow-soft transition-colors">
                      <MessageSquare size={14} /> Message
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 ml-[60px]">
                  {selectedApplication.experienceYears && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-surface-main text-brand-gold border border-brand-yellow-soft px-2.5 py-1 rounded-full">
                      <Clock size={12} /> {selectedApplication.experienceYears} Years Experience
                    </span>
                  )}
                  {selectedApplication.location && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-ink-light text-ink-paragraph px-2.5 py-1 rounded-full">
                      <MapPin size={12} /> {selectedApplication.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex border-b border-ink-light bg-surface-card px-4 sm:px-6 flex-shrink-0 overflow-x-auto">
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === t.key ? 'border-brand-yellow text-ink' : 'border-transparent text-ink-caption hover:text-ink-paragraph'}`}>
                    {t.icon}{t.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {activeTab === 'overview' && (
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 min-w-0 space-y-6">
                      <div>
                        <h3 className="text-xs font-bold text-ink-caption uppercase tracking-wide mb-2">Professional Summary</h3>
                        <p className="text-sm text-ink-paragraph leading-relaxed">{selectedApplication.professionalSummary || 'No summary provided.'}</p>
                      </div>
                      {(selectedApplication.skills || []).length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold text-ink-caption uppercase tracking-wide mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedApplication.skills!.map((s, i) => (
                              <span key={i} className="text-xs font-semibold bg-ink-light text-ink-paragraph px-2.5 py-1 rounded-lg">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {(selectedApplication.experienceHighlights || []).length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold text-ink-caption uppercase tracking-wide mb-2">Experience Highlights</h3>
                          <div className="space-y-4">
                            {selectedApplication.experienceHighlights!.map((exp, i) => (
                              <div key={i} className="flex gap-3">
                                <div className="w-2 h-2 rounded-full bg-status-info mt-1.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-bold text-ink">{exp.title}</p>
                                  <p className="text-xs text-ink-caption">{exp.company}</p>
                                  <p className="text-xs text-ink-caption">{exp.period}</p>
                                  <ul className="list-disc list-inside text-sm text-ink-paragraph mt-1 space-y-0.5">
                                    {exp.bullets?.map((b, bi) => <li key={bi}>{b}</li>)}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="w-full lg:w-[260px] flex-shrink-0">
                      <h3 className="text-xs font-bold text-ink-caption uppercase tracking-wide mb-3">Personal Details</h3>
                      <div className="space-y-4">
                        <div><p className="text-[10px] text-ink-caption uppercase font-bold">Email</p><p className="text-sm text-ink-charcoal break-words">{selectedApplication.email}</p></div>
                        <div><p className="text-[10px] text-ink-caption uppercase font-bold">Phone</p><p className="text-sm text-ink-charcoal">{selectedApplication.phone || '—'}</p></div>
                        <div><p className="text-[10px] text-ink-caption uppercase font-bold">Location</p><p className="text-sm text-ink-charcoal">{selectedApplication.location || '—'}</p></div>
                        <div><p className="text-[10px] text-ink-caption uppercase font-bold">Current Company</p><p className="text-sm text-ink-charcoal">{selectedApplication.currentCompany || '—'}</p></div>
                        <div><p className="text-[10px] text-ink-caption uppercase font-bold">Education</p><p className="text-sm text-ink-charcoal">{selectedApplication.education || '—'}</p></div>
                        <div><p className="text-[10px] text-ink-caption uppercase font-bold">Expected Salary</p><p className="text-sm text-ink-charcoal">{selectedApplication.expectedSalary || '—'}</p></div>
                        <div><p className="text-[10px] text-ink-caption uppercase font-bold">Notice Period</p><p className="text-sm text-ink-charcoal">{selectedApplication.noticePeriod || '—'}</p></div>
                        <div><p className="text-[10px] text-ink-caption uppercase font-bold">Date of Birth</p><p className="text-sm text-ink-charcoal">{selectedApplication.dateOfBirth || '—'}</p></div>
                        <div><p className="text-[10px] text-ink-caption uppercase font-bold">Gender</p><p className="text-sm text-ink-charcoal">{selectedApplication.gender || '—'}</p></div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="max-w-2xl">
                    {!selectedApplication.education ? (
                      <p className="text-sm text-ink-caption">No education details provided.</p>
                    ) : (
                      <div className="bg-surface-card border border-ink-light rounded-xl p-4 flex items-start gap-3">
                        <GraduationCap size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-semibold text-ink-charcoal">{selectedApplication.education}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-3 max-w-2xl">
                    {(selectedApplication.projects || []).length === 0 ? (
                      <p className="text-sm text-ink-caption">No projects listed.</p>
                    ) : selectedApplication.projects!.map((p, i) => (
                      <div key={i} className="bg-surface-card border border-ink-light rounded-xl p-4">
                        <p className="text-sm font-bold text-ink">{p.name}</p>
                        {p.description && <p className="text-sm text-ink-paragraph mt-1">{p.description}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-4 max-w-2xl">
                    {(selectedApplication.experienceHighlights || []).length === 0 ? (
                      <p className="text-sm text-ink-caption">No experience details provided.</p>
                    ) : selectedApplication.experienceHighlights!.map((exp, i) => (
                      <div key={i} className="border-l-2 border-brand-yellow pl-4">
                        <p className="text-sm font-bold text-ink">{exp.title}</p>
                        <p className="text-xs text-ink-caption">{exp.company} · {exp.period}</p>
                        <ul className="list-disc list-inside text-sm text-ink-paragraph mt-1 space-y-0.5">
                          {exp.bullets?.map((b, bi) => <li key={bi}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="flex flex-wrap gap-2 max-w-2xl">
                    {(selectedApplication.skills || []).length === 0 ? (
                      <p className="text-sm text-ink-caption">No skills listed.</p>
                    ) : selectedApplication.skills!.map((s, i) => (
                      <span key={i} className="text-xs font-semibold bg-ink-light text-ink-paragraph px-2.5 py-1 rounded-lg">{s}</span>
                    ))}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-2 max-w-2xl">
                    {(selectedApplication.documents || []).length === 0 ? (
                      <p className="text-sm text-ink-caption">No additional documents uploaded.</p>
                    ) : selectedApplication.documents!.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 bg-surface-card border border-ink-light rounded-lg px-3 py-2 text-sm text-ink-paragraph">
                        <Paperclip size={14} className="text-ink-caption" />{d.name}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'resume' && (
                  <div className="max-w-2xl">
                    {!selectedApplication.resumeKey ? (
                      <p className="text-sm text-ink-caption">Candidate did not upload a resume.</p>
                    ) : (
                      <div className="bg-surface-card border border-ink-light rounded-xl p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={18} className="text-status-error flex-shrink-0" />
                          <p className="text-sm font-semibold text-ink-charcoal truncate">
                            {selectedApplication.resumeKey.split('/').pop()?.replace(/^[0-9a-f-]{36}-/, '')}
                          </p>
                        </div>
                        {resumeUrl ? (
                          <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-gold bg-surface-main border border-brand-yellow-soft rounded-lg px-3 py-1.5 hover:bg-brand-yellow-soft flex-shrink-0">
                            <ExternalLink size={14} /> Open Resume
                          </a>
                        ) : (
                          <button onClick={handleViewResume} disabled={resumeLoading}
                            className="inline-flex items-center gap-2 text-xs font-semibold bg-ink text-white rounded-lg px-3 py-1.5 hover:bg-ink-charcoal disabled:opacity-50 flex-shrink-0">
                            {resumeLoading ? 'Loading...' : 'View Resume'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-3 max-w-2xl">
                    {(selectedApplication.activity || []).slice().reverse().map((a, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-brand-yellow mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-ink-charcoal">{a.action}</p>
                          <p className="text-xs text-ink-caption">{new Date(a.timestamp).toLocaleString('en-IN')}</p>
                          {a.note && <p className="text-xs text-ink-caption mt-0.5">{a.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {deleteConfirmJob && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-ink/60 p-4">
          <div className="bg-surface-card rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-status-error/15 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={18} className="text-status-error" />
                </div>
                <h3 className="text-base font-bold text-ink">Delete Job</h3>
              </div>
              <p className="text-sm text-ink-paragraph">
                Delete <span className="font-semibold">"{deleteConfirmJob.title}"</span>? All applications for this job will remain accessible from the candidate records, but the listing will be removed from Job Board and the public site. This cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-ink-light bg-ink-offwhite">
              <button onClick={() => setDeleteConfirmJob(null)} disabled={deletingJob}
                className="px-4 py-2 border border-ink-light rounded-lg text-sm font-medium text-ink-paragraph hover:bg-ink-light disabled:opacity-50">
                Cancel
              </button>
              <button onClick={confirmDeleteJob} disabled={deletingJob}
                className="px-4 py-2 bg-status-error hover:bg-status-error text-white text-sm font-bold rounded-lg disabled:opacity-50">
                {deletingJob ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {messageOpen && selectedApplication && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-ink/60 p-4">
          <div className="bg-surface-card rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-ink">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare size={16} className="text-brand-yellow" /> Message {selectedApplication.fullName}
              </h2>
              <button onClick={() => setMessageOpen(false)} className="p-1 rounded hover:bg-white/10">
                <X size={16} className="text-white" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-ink-caption uppercase tracking-wide mb-1">Recipient</p>
                <p className="text-sm font-semibold text-ink-charcoal">{selectedApplication.fullName} ({selectedApplication.email})</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-ink-caption uppercase tracking-wide mb-1">Message Content</p>
                <textarea rows={5} value={messageText} onChange={e => setMessageText(e.target.value)}
                  className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow resize-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-ink-light">
              <button onClick={() => setMessageOpen(false)} className="text-sm font-semibold text-ink-caption hover:text-ink-paragraph">
                Cancel
              </button>
              <button onClick={handleSendMessage} disabled={sendingMessage || !messageText.trim()}
                className="bg-brand-yellow hover:bg-brand-yellow-soft text-ink text-sm font-bold px-4 py-2 rounded-lg disabled:opacity-50 transition-colors">
                {sendingMessage ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
