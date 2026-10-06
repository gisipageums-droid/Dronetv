import { LEADS_API } from './apiConfig';
import { authHeader } from './authService';
import { BookingApiError } from './bookingApi';
import type { BookingSettings } from './bookingApi';

export type ApptStatus = 'upcoming' | 'needs_update' | 'completed' | 'followup' | 'no_show' | 'cancelled' | 'payment_review';

export interface Appt {
  id: string; ref: string; name: string; email: string; phone: string; company: string; city: string;
  topic: string; topicLabel: string; message: string; start: string; end: string; date: string; dateLabel: string;
  timeLabel: string; timeRangeLabel: string; durationMinutes: number; bookingStatus: string; sessionStatus: string;
  status: ApptStatus; meetLink: string; amountPaise: number; feeLabel: string; paymentMethod: string; paymentId: string;
  refunded: boolean; notesCount: number; openFollowUps: number; nextFollowUp: string | null; nextFollowUpAt: string | null;
  minutesUntil?: number;
}
export interface Note { id: string; body: string; author: string; createdAt: string; createdLabel: string }
export interface FollowUp { id: string; note: string; status: 'open' | 'done'; dueAt: string; dueLabel: string }
export interface ApptDetail extends Appt { notes: Note[]; followUps: FollowUp[]; emails: { kind: string; to: string; status: string }[] }
export interface Access { doctor: boolean; admin: boolean; allowed: boolean; email: string }
export interface Me { email: string; isAdmin: boolean; doctorName: string; doctorTitle: string; timezone: string; meetLink: string; feeLabel: string }
export interface Summary {
  month: string; monthLabel: string; todayLabel: string; attention: number;
  stats: { total: number; completed: number; upcoming: number; cancelled: number; needsUpdate: number; noShow: number };
  today: Appt[]; next: Appt | null;
  recentNotes: { id: string; bookingId: string; client: string; company: string; body: string; createdAt: string; dateLabel: string }[];
  followUps: { id: string; bookingId: string; client: string; note: string; dueAt: string; dueLabel: string; overdue: boolean }[];
}
export type Tab = 'all' | 'upcoming' | 'completed' | 'followup' | 'cancelled';
export interface ApptList { appointments: Appt[]; counts: Record<Tab, number> }
export interface NoteRow { id: string; bookingId: string; ref: string; client: string; company: string; topicLabel: string; body: string; author: string; createdAt: string; createdLabel: string }
export interface FollowUpRow { id: string; bookingId: string; ref: string; client: string; company: string; phone: string; email: string; topicLabel: string; note: string; status: 'open' | 'done'; dueAt: string; dueLabel: string; overdue: boolean }
export interface ClientRow { email: string; name: string; company: string; city: string; phone: string; consultations: number; completed: number; cancelled: number; paidLabel: string; openFollowUps: number; lastSession: string | null; nextSession: string | null }
export interface Report {
  start: string; end: string;
  totals: { appointments: number; completed: number; upcoming: number; cancelled: number; noShow: number; needsUpdate: number; clients: number; revenuePaise: number; revenueLabel: string; refundedLabel: string };
  byTopic: { topic: string; count: number }[]; byDay: { date: string; count: number }[];
}

function base(): string {
  if (!LEADS_API) throw new BookingApiError('The portal is not available right now.', 503);
  return `${LEADS_API}/doctor/portal`;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${base()}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...authHeader(), ...(init?.headers || {}) } });
  } catch {
    throw new BookingApiError('Could not reach the server. Check your connection and try again.', 0);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail;
    const message = typeof detail === 'string' ? detail : Array.isArray(detail) ? (detail[0]?.msg || 'Please check the details you entered.') : `Request failed (${res.status})`;
    throw new BookingApiError(message, res.status);
  }
  return res.json();
}

const send = (method: string, body?: unknown): RequestInit => ({ method, body: body === undefined ? undefined : JSON.stringify(body) });
const qs = (o: Record<string, string | undefined>) => {
  const p = Object.entries(o).filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`).join('&');
  return p ? `?${p}` : '';
};

export const portalAccess = () => call<Access>('/access');
export const portalMe = () => call<Me>('/me');
export const portalSummary = (month?: string) => call<Summary>(`/summary${qs({ month })}`);
export const portalAppointments = (p: { tab?: Tab; q?: string; start?: string; end?: string }) => call<ApptList>(`/appointments${qs(p)}`);
export const portalAppointment = (id: string) => call<ApptDetail>(`/appointments/${id}`);
export const portalSetSession = (id: string, status: 'scheduled' | 'completed' | 'no_show') => call<ApptDetail>(`/appointments/${id}/session`, send('PUT', { status }));
export const portalAddNote = (id: string, body: string) => call<ApptDetail>(`/appointments/${id}/notes`, send('POST', { body }));
export const portalDeleteNote = (id: string) => call<{ message: string }>(`/notes/${id}`, send('DELETE'));
export const portalNotes = (q?: string) => call<{ notes: NoteRow[] }>(`/notes${qs({ q })}`);
export const portalAddFollowUp = (id: string, dueDate: string, dueTime: string, note: string) => call<ApptDetail>(`/appointments/${id}/followups`, send('POST', { dueDate, dueTime, note }));
export const portalPatchFollowUp = (id: string, patch: { status?: 'open' | 'done'; dueDate?: string; dueTime?: string; note?: string }) => call<{ message: string }>(`/followups/${id}`, send('PATCH', patch));
export const portalFollowUps = (status: 'open' | 'done' | 'all') => call<{ followUps: FollowUpRow[] }>(`/followups${qs({ status })}`);
export const portalClients = (q?: string) => call<{ clients: ClientRow[] }>(`/clients${qs({ q })}`);
export const portalReport = (start?: string, end?: string) => call<Report>(`/reports${qs({ start, end })}`);
export const portalSettings = () => call<BookingSettings>('/settings');
export const portalSaveSettings = (s: BookingSettings) => call<BookingSettings>('/settings', send('PUT', s));

export async function portalDownloadCsv(start?: string, end?: string): Promise<void> {
  const res = await fetch(`${base()}/reports.csv${qs({ start, end })}`, { headers: authHeader() });
  if (!res.ok) throw new BookingApiError('Could not export the report.', res.status);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `drone-doctor-${start || 'month'}-${end || 'today'}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Admin helpers (doctor access list and manual bookings) live under /doctor/admin.
function adminBase(): string {
  if (!LEADS_API) throw new BookingApiError('Not available.', 503);
  return `${LEADS_API}/doctor/admin`;
}
async function adminCall<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${adminBase()}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...authHeader() } });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail;
    throw new BookingApiError(typeof detail === 'string' ? detail : Array.isArray(detail) ? (detail[0]?.msg || 'Check the details.') : `Request failed (${res.status})`, res.status);
  }
  return res.json();
}
export const adminGetDoctors = () => adminCall<{ emails: string[] }>('/doctors');
export const adminSetDoctors = (emails: string[]) => adminCall<{ emails: string[] }>('/doctors', send('PUT', { emails }));
export const adminManualBooking = (b: { name: string; email: string; phone: string; company: string; city: string; topic: string; message: string; start: string; paid: boolean; notify: boolean }) =>
  adminCall<{ id: string; ref: string }>('/bookings/manual', send('POST', b));
