import { LEADS_API } from './apiConfig';
import { authHeader } from './authService';

export interface Slot { start: string; label: string }
export interface DaySlots { date: string; slots: Slot[] }
export interface Availability {
  timezone: string;
  hostName: string;
  slotMinutes: number;
  windowDays: number;
  minDate: string;
  maxDate: string;
  days: DaySlots[];
}

export interface BookingInfo {
  id: string;
  name: string;
  status: 'confirmed' | 'cancelled';
  start: string;
  end: string;
  whenLabel: string;
  timezone: string;
  meetLink: string;
  topic: string;
  googleCalendarUrl: string;
  token?: string;
  manageUrl?: string;
}

export interface AdminBooking extends BookingInfo {
  email: string;
  phone: string;
  createdAt: string | null;
  cancelledBy: string | null;
  visitorTz: string | null;
  emails: { kind: string; to: string; status: 'sent' | 'skipped' | 'failed'; error: string | null }[];
}

export type WeeklyHours = Record<string, string[][]>;

export interface BookingSettings {
  meetLink: string;
  hostName: string;
  timezone: string;
  slotMinutes: number;
  bufferMinutes: number;
  windowDays: number;
  minNoticeHours: number;
  weeklyHours: WeeklyHours;
  blockedDates: string[];
  notifyEmail: string;
  siteUrl: string;
}

export const WEEKDAYS: { key: string; label: string }[] = [
  { key: 'mon', label: 'Monday' }, { key: 'tue', label: 'Tuesday' }, { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' }, { key: 'fri', label: 'Friday' }, { key: 'sat', label: 'Saturday' }, { key: 'sun', label: 'Sunday' },
];

export class BookingApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function base(): string {
  if (!LEADS_API) throw new BookingApiError('Booking is not available right now.', 503);
  return `${LEADS_API}/booking`;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${base()}${path}`, init);
  } catch {
    throw new BookingApiError('Could not reach the server. Check your connection and try again.', 0);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail;
    const message = typeof detail === 'string' ? detail : Array.isArray(detail) ? (detail[0]?.msg || 'Please check the details you entered.') : `Request failed (${res.status})`;
    throw new BookingApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

const json = (body: unknown, extra: Record<string, string> = {}): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...extra },
  body: JSON.stringify(body),
});

export const fetchAvailability = (from: string, to: string) =>
  call<Availability>(`/availability?from=${from}&to=${to}`);

export const createBooking = (payload: { name: string; email: string; phone: string; topic: string; start: string; tz: string; website: string }) =>
  call<BookingInfo | undefined>('', json(payload));

export const fetchBooking = (id: string, token: string) =>
  call<BookingInfo>(`/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`);

export const cancelBooking = (id: string, token: string) =>
  call<BookingInfo>(`/${encodeURIComponent(id)}/cancel`, json({ token }));

export const icsUrl = (id: string, token: string) =>
  `${base()}/${encodeURIComponent(id)}/ics?token=${encodeURIComponent(token)}`;

export const adminGetSettings = () => call<BookingSettings>('/admin/settings', { headers: authHeader() });

export const adminSaveSettings = (s: BookingSettings) =>
  call<BookingSettings>('/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(s) });

export const adminListBookings = (params: { status: string; when: string; q: string }) =>
  call<{ bookings: AdminBooking[]; count: number }>(
    `/admin/bookings?status=${params.status}&when=${params.when}&q=${encodeURIComponent(params.q)}`,
    { headers: authHeader() },
  );

export const adminCancelBooking = (id: string, notifyVisitor: boolean) =>
  call<BookingInfo>(`/admin/bookings/${id}/cancel`, json({ notifyVisitor }, authHeader()));

export const ymd = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
