import { AUTH_API, LAMBDA } from './apiConfig';

export interface UserData {
  id: string;
  email: string;
  fullName: string;
  city?: string;
  state?: string;
  phone?: string;
  role?: string;
  isAdmin?: boolean;
}

export interface LoginResponse {
  token: string;
  email: string;
  fullName: string;
  userData: UserData;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): UserData | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(res: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, res.token);
  localStorage.setItem(USER_KEY, JSON.stringify(res.userData));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('admin');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
}

// ─── Auth header helper ───────────────────────────────────────────────────────

function authHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── API calls ────────────────────────────────────────────────────────────────

async function post<T>(path: string, body: unknown, withAuth = false): Promise<T> {
  const base = AUTH_API || LAMBDA.auth;
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(withAuth ? authHeader() : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || 'Request failed');
  return data;
}

async function get<T>(path: string): Promise<T> {
  const base = AUTH_API || LAMBDA.auth;
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || 'Request failed');
  return data;
}

async function put<T>(path: string, body: unknown): Promise<T> {
  const base = AUTH_API || LAMBDA.auth;
  const res = await fetch(`${base}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || 'Request failed');
  return data;
}

// ─── Public auth methods ──────────────────────────────────────────────────────

export async function register(payload: {
  email: string;
  fullName: string;
  password: string;
  city?: string;
  state?: string;
  phone?: string;
}): Promise<{ message: string }> {
  return post('/register', payload);
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await post<LoginResponse>('/login', payload);
  saveSession(res);
  return res;
}

export async function googleLogin(token: string): Promise<LoginResponse> {
  const res = await post<LoginResponse>('/google-login', { token });
  saveSession(res);
  return res;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return post('/forgot-password', { email });
}

export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  return post('/reset-password', { token, newPassword });
}

// ─── Protected auth methods ───────────────────────────────────────────────────

export async function getMe(): Promise<UserData> {
  return get<UserData>('/me');
}

export async function updateMe(payload: {
  fullName?: string;
  city?: string;
  state?: string;
  phone?: string;
}): Promise<UserData> {
  const res = await put<UserData>('/me', payload);
  const stored = getStoredUser();
  if (stored) {
    localStorage.setItem(USER_KEY, JSON.stringify({ ...stored, ...res }));
  }
  return res;
}

export async function validateToken(): Promise<boolean> {
  try {
    const res = await get<{ valid: boolean }>('/validate-token');
    return res.valid;
  } catch {
    return false;
  }
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
