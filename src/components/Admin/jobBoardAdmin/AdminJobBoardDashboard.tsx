import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Briefcase, Search, FileText, User, Award, FolderKanban, Paperclip, Activity, ExternalLink, GraduationCap, Code2, MessageSquare, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchAdminContent, MediaItem } from '../../../lib/mediaApi';
import { fetchApplications, updateApplication, getResumeViewUrl, sendCandidateMessage, JobApplication } from '../../../lib/jobApplicationsApi';

const STATUS_OPTIONS: JobApplication['status'][] = ['Applied', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'];

const STATUS_COLORS: Record<string, string> = {
  Applied: 'bg-gray-100 text-gray-700',
  Shortlisted: 'bg-blue-100 text-blue-700',
  Interviewing: 'bg-amber-100 text-amber-700',
  Hired: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

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
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

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
    return jobs.filter(j => !q || j.title.toLowerCase().includes(q) || (j.company || '').toLowerCase().includes(q));
  }, [jobs, jobSearch]);

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
    <div className="flex flex-col h-[70vh] min-h-[500px] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Jobs pane */}
        <div className="w-[300px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Jobs ({jobs.length})</div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={jobSearch} onChange={e => setJobSearch(e.target.value)} placeholder="Search jobs..."
                className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingJobs ? (
              <div className="p-4 text-xs text-gray-400 text-center">Loading jobs...</div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-4 text-xs text-gray-400 text-center">No job listings yet</div>
            ) : filteredJobs.map(job => (
              <button key={job.contentId} onClick={() => setSelectedJobId(job.contentId)}
                className={`w-full text-left px-3 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedJobId === job.contentId ? 'bg-yellow-50 border-l-2 border-l-yellow-400' : ''}`}>
                <p className="text-sm font-semibold text-gray-900 truncate">{job.title}</p>
                <p className="text-xs text-gray-400 truncate">{job.company}{job.location ? ` · ${job.location}` : ''}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${job.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {job.isPublished ? 'Active' : 'Draft'}
                  </span>
                  {applicantCount(job.contentId) !== undefined && (
                    <span className="text-[10px] text-gray-400">{applicantCount(job.contentId)} applicants</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Candidates pane */}
        <div className="w-[300px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Candidates ({applications.length})</div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={candidateSearch} onChange={e => setCandidateSearch(e.target.value)} placeholder="Search candidates..."
                className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {!selectedJobId ? (
              <div className="p-4 text-xs text-gray-400 text-center">Select a job to view candidates</div>
            ) : loadingApplications ? (
              <div className="p-4 text-xs text-gray-400 text-center">Loading candidates...</div>
            ) : filteredCandidates.length === 0 ? (
              <div className="p-4 text-xs text-gray-400 text-center">No applications yet</div>
            ) : filteredCandidates.map(app => (
              <button key={app.applicationId} onClick={() => setSelectedApplicationId(app.applicationId)}
                className={`w-full text-left px-3 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedApplicationId === app.applicationId ? 'bg-yellow-50 border-l-2 border-l-yellow-400' : ''}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 truncate">{app.fullName || 'Unnamed'}</p>
                </div>
                <p className="text-xs text-gray-400 truncate">{app.currentRole || 'Applicant'}{app.currentCompany ? ` · ${app.currentCompany}` : ''}</p>
                <span className={`inline-block mt-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${STATUS_COLORS[app.status]}`}>{app.status}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Profile pane */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {!selectedApplication ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
              {selectedJob ? 'Select a candidate to view their profile' : 'Select a job to get started'}
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-base font-bold text-gray-900">{selectedApplication.fullName}</h2>
                  <p className="text-xs text-gray-500">
                    {selectedApplication.currentRole || 'Applicant'}{selectedApplication.currentCompany ? ` · ${selectedApplication.currentCompany}` : ''}
                    {selectedApplication.location ? ` · ${selectedApplication.location}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={selectedApplication.status} onChange={e => handleStatusChange(e.target.value as JobApplication['status'])}
                    className="text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-yellow-400">
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={openMessage}
                    className="flex items-center gap-1.5 text-xs font-bold bg-yellow-400 text-black px-3 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors">
                    <MessageSquare size={14} /> Message
                  </button>
                </div>
              </div>

              <div className="flex border-b border-gray-200 bg-white px-6 flex-shrink-0 overflow-x-auto">
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === t.key ? 'border-yellow-400 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    {t.icon}{t.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-5 max-w-2xl">
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Professional Summary</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedApplication.professionalSummary || 'No summary provided.'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-white border border-gray-200 rounded-xl p-4">
                      <div><p className="text-[10px] text-gray-400 uppercase font-bold">Email</p><p className="text-sm text-gray-800">{selectedApplication.email}</p></div>
                      <div><p className="text-[10px] text-gray-400 uppercase font-bold">Phone</p><p className="text-sm text-gray-800">{selectedApplication.phone || '—'}</p></div>
                      <div><p className="text-[10px] text-gray-400 uppercase font-bold">Education</p><p className="text-sm text-gray-800">{selectedApplication.education || '—'}</p></div>
                      <div><p className="text-[10px] text-gray-400 uppercase font-bold">Expected Salary</p><p className="text-sm text-gray-800">{selectedApplication.expectedSalary || '—'}</p></div>
                      <div><p className="text-[10px] text-gray-400 uppercase font-bold">Notice Period</p><p className="text-sm text-gray-800">{selectedApplication.noticePeriod || '—'}</p></div>
                      <div><p className="text-[10px] text-gray-400 uppercase font-bold">Applied On</p><p className="text-sm text-gray-800">{new Date(selectedApplication.appliedAt).toLocaleDateString('en-IN')}</p></div>
                    </div>
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="max-w-2xl">
                    {!selectedApplication.education ? (
                      <p className="text-sm text-gray-400">No education details provided.</p>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                        <GraduationCap size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-semibold text-gray-800">{selectedApplication.education}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-3 max-w-2xl">
                    {(selectedApplication.projects || []).length === 0 ? (
                      <p className="text-sm text-gray-400">No projects listed.</p>
                    ) : selectedApplication.projects!.map((p, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-sm font-bold text-gray-900">{p.name}</p>
                        {p.description && <p className="text-sm text-gray-600 mt-1">{p.description}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-4 max-w-2xl">
                    {(selectedApplication.experienceHighlights || []).length === 0 ? (
                      <p className="text-sm text-gray-400">No experience details provided.</p>
                    ) : selectedApplication.experienceHighlights!.map((exp, i) => (
                      <div key={i} className="border-l-2 border-yellow-400 pl-4">
                        <p className="text-sm font-bold text-gray-900">{exp.title}</p>
                        <p className="text-xs text-gray-500">{exp.company} · {exp.period}</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-0.5">
                          {exp.bullets?.map((b, bi) => <li key={bi}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="flex flex-wrap gap-2 max-w-2xl">
                    {(selectedApplication.skills || []).length === 0 ? (
                      <p className="text-sm text-gray-400">No skills listed.</p>
                    ) : selectedApplication.skills!.map((s, i) => (
                      <span key={i} className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">{s}</span>
                    ))}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-2 max-w-2xl">
                    {(selectedApplication.documents || []).length === 0 ? (
                      <p className="text-sm text-gray-400">No additional documents uploaded.</p>
                    ) : selectedApplication.documents!.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
                        <Paperclip size={14} className="text-gray-400" />{d.name}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'resume' && (
                  <div className="max-w-2xl">
                    {!selectedApplication.resumeKey ? (
                      <p className="text-sm text-gray-400">Candidate did not upload a resume.</p>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={18} className="text-red-500 flex-shrink-0" />
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {selectedApplication.resumeKey.split('/').pop()?.replace(/^[0-9a-f-]{36}-/, '')}
                          </p>
                        </div>
                        {resumeUrl ? (
                          <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5 hover:bg-yellow-100 flex-shrink-0">
                            <ExternalLink size={14} /> Open Resume
                          </a>
                        ) : (
                          <button onClick={handleViewResume} disabled={resumeLoading}
                            className="inline-flex items-center gap-2 text-xs font-semibold bg-gray-900 text-white rounded-lg px-3 py-1.5 hover:bg-gray-800 disabled:opacity-50 flex-shrink-0">
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
                        <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-800">{a.action}</p>
                          <p className="text-xs text-gray-400">{new Date(a.timestamp).toLocaleString('en-IN')}</p>
                          {a.note && <p className="text-xs text-gray-500 mt-0.5">{a.note}</p>}
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

      {messageOpen && selectedApplication && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-gray-900">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare size={16} className="text-yellow-400" /> Message {selectedApplication.fullName}
              </h2>
              <button onClick={() => setMessageOpen(false)} className="p-1 rounded hover:bg-white/10">
                <X size={16} className="text-white" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Recipient</p>
                <p className="text-sm font-semibold text-gray-800">{selectedApplication.fullName} ({selectedApplication.email})</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Message Content</p>
                <textarea rows={5} value={messageText} onChange={e => setMessageText(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400 resize-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100">
              <button onClick={() => setMessageOpen(false)} className="text-sm font-semibold text-gray-500 hover:text-gray-700">
                Cancel
              </button>
              <button onClick={handleSendMessage} disabled={sendingMessage || !messageText.trim()}
                className="bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold px-4 py-2 rounded-lg disabled:opacity-50 transition-colors">
                {sendingMessage ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
