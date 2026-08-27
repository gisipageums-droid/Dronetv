import { JOB_APPLICATIONS_API, LAMBDA } from './apiConfig';

const BASE = JOB_APPLICATIONS_API ? `${JOB_APPLICATIONS_API}` : `${LAMBDA.jobApplications}/job-applications`;

// Works for both admin (adminToken) and a company owner viewing their own
// job's applicants (token) - the backend enforces the actual ownership
// check either way (require_self_or_admin), this just needs to send
// whichever real session token the caller actually has.
function adminAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface ActivityEntry {
  action: string;
  timestamp: string;
  note?: string;
}

export interface ExperienceHighlight {
  title: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface JobApplication {
  jobId: string;
  applicationId: string;
  jobTitle?: string;
  company?: string;
  companyId?: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  currentCompany?: string;
  currentRole?: string;
  education?: string;
  experienceYears?: string;
  expectedSalary?: string;
  noticePeriod?: string;
  dateOfBirth?: string;
  gender?: string;
  professionalSummary?: string;
  skills?: string[];
  experienceHighlights?: ExperienceHighlight[];
  projects?: { name: string; description?: string }[];
  documents?: { name: string; key: string }[];
  resumeKey?: string;
  status: 'Applied' | 'Shortlisted' | 'Interviewing' | 'Hired' | 'Rejected';
  activity: ActivityEntry[];
  appliedAt: string;
  updatedAt: string;
}

export async function fetchApplications(jobId: string, companyId?: string): Promise<JobApplication[]> {
  const url = companyId
    ? `${BASE}?jobId=${encodeURIComponent(jobId)}&companyId=${encodeURIComponent(companyId)}`
    : `${BASE}?jobId=${encodeURIComponent(jobId)}`;
  const res = await fetch(url, { headers: adminAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch applications');
  const data = await res.json();
  return data.items || [];
}

export async function fetchApplication(jobId: string, applicationId: string): Promise<JobApplication> {
  const res = await fetch(`${BASE}?jobId=${encodeURIComponent(jobId)}&id=${encodeURIComponent(applicationId)}`, { headers: adminAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch application');
  const data = await res.json();
  return data.item;
}

export async function submitApplication(payload: Partial<JobApplication>): Promise<JobApplication> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit application');
  const data = await res.json();
  return data.item;
}

export async function updateApplication(
  jobId: string,
  applicationId: string,
  updates: Record<string, unknown>,
  companyId?: string
): Promise<void> {
  // Backend takes jobId/applicationId/companyId as query params (only
  // status/note come from the body) - this was sending all of it in the
  // JSON body instead, so every status update (from BOTH the admin ATS and
  // this new company view) 422'd on missing required query params.
  const params = new URLSearchParams({ jobId, applicationId });
  if (companyId) params.set('companyId', companyId);
  const res = await fetch(`${BASE}?${params.toString()}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update application');
}

export async function deleteApplication(jobId: string, applicationId: string): Promise<void> {
  const res = await fetch(`${BASE}?jobId=${encodeURIComponent(jobId)}&id=${encodeURIComponent(applicationId)}`, {
    method: 'DELETE',
    headers: adminAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete application');
}

export async function getResumeUploadUrl(fileName: string, contentType: string): Promise<{ uploadUrl: string; key: string }> {
  const res = await fetch(`${BASE}/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, contentType }),
  });
  if (!res.ok) throw new Error('Failed to get upload URL');
  return res.json();
}

export async function uploadResumeFile(file: File): Promise<string> {
  const { uploadUrl, key } = await getResumeUploadUrl(file.name, file.type || 'application/pdf');
  const putRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/pdf' },
    body: file,
  });
  if (!putRes.ok) throw new Error('Failed to upload resume');
  return key;
}

export async function getResumeViewUrl(key: string): Promise<string> {
  const res = await fetch(`${BASE}/resume-url?key=${encodeURIComponent(key)}`, { headers: adminAuthHeaders() });
  if (!res.ok) throw new Error('Failed to get resume URL');
  const data = await res.json();
  return data.url;
}

export async function sendCandidateMessage(jobId: string, applicationId: string, message: string): Promise<void> {
  const res = await fetch(`${BASE}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
    body: JSON.stringify({ jobId, applicationId, message }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to send message');
  }
}
