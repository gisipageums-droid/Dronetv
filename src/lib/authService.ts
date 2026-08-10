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
  role?: string;
  userData: UserData;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getToken(): string | null {
  // Admin login (context.tsx adminLogin) stores its JWT under a separate
  // "adminToken" key, not TOKEN_KEY - falling back to it here so every
  // admin-panel call that goes through authHeader()/getToken() actually
  // sends a token instead of silently making an unauthenticated request
  // (which 403s on any /admin or viewType=admin endpoint).
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('adminToken');
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
  if (res.token) localStorage.setItem(TOKEN_KEY, res.token);
  const userData = res.userData || (res as any);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('admin');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
}

// ─── Auth header helper ───────────────────────────────────────────────────────

export function authHeader(): Record<string, string> {
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
  if (AUTH_API) return post('/register', payload);
  const res = await fetch(LAMBDA.authRegister, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || 'Registration failed');
  return data;
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  if (AUTH_API) {
    const res = await post<LoginResponse>('/login', payload);
    saveSession(res);
    return res;
  }
  const res = await fetch(LAMBDA.authLogin, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || 'Login failed');

  const email = data.userData?.email || payload.email;
  const mapped: LoginResponse = {
    token: data.token || '',
    email,
    fullName: data.userData?.fullName || '',
    role: 'user',
    userData: { ...(data.userData || data), role: 'user' },
  };
  saveSession(mapped);

  // Fetch profile in background to update role without blocking login
  fetch(`${LAMBDA.profile}/profile?userId=${encodeURIComponent(email)}`)
    .then(r => r.ok ? r.json() : null)
    .then(profileData => {
      if (!profileData) return;
      const p = profileData.profile || {};
      let role = 'user';
      if (p.companies?.length > 0) role = 'company';
      else if (p.professionals?.length > 0) role = 'professional';
      else if (p.events?.length > 0) role = 'event_organizer';
      if (role !== 'user') {
        const stored = localStorage.getItem(USER_KEY);
        if (stored) {
          const u = JSON.parse(stored);
          u.role = role;
          if (u.userData) u.userData.role = role;
          localStorage.setItem(USER_KEY, JSON.stringify(u));
          window.dispatchEvent(new Event('user-role-updated'));
        }
      }
    })
    .catch(() => {/* ignore */});

  return mapped;
}

export async function googleLogin(token: string): Promise<LoginResponse> {
  if (AUTH_API) {
    const res = await post<LoginResponse>('/google-login', { token });
    saveSession(res);
    return res;
  }
  const res = await fetch(LAMBDA.authGoogle, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || 'Google login failed');

  const email = data.userData?.email || data.email || '';
  const mapped: LoginResponse = {
    token: data.token || '',
    email,
    fullName: data.userData?.fullName || data.fullName || '',
    role: 'user',
    userData: { ...(data.userData || data), role: 'user' },
  };
  saveSession(mapped);

  fetch(`${LAMBDA.profile}/profile?userId=${encodeURIComponent(email)}`)
    .then(r => r.ok ? r.json() : null)
    .then(profileData => {
      if (!profileData) return;
      const p = profileData.profile || {};
      let role = 'user';
      if (p.companies?.length > 0) role = 'company';
      else if (p.professionals?.length > 0) role = 'professional';
      else if (p.events?.length > 0) role = 'event_organizer';
      if (role !== 'user') {
        const stored = localStorage.getItem(USER_KEY);
        if (stored) {
          const u = JSON.parse(stored);
          u.role = role;
          if (u.userData) u.userData.role = role;
          localStorage.setItem(USER_KEY, JSON.stringify(u));
          window.dispatchEvent(new Event('user-role-updated'));
        }
      }
    })
    .catch(() => {/* ignore */});

  return mapped;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const res = await fetch(AUTH_API ? `${AUTH_API}/forgot-password` : LAMBDA.authForgot, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'Failed to send reset email');
  }
  return res.json();
}

export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  const res = await fetch(AUTH_API ? `${AUTH_API}/reset-password` : LAMBDA.authReset, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'Failed to reset password');
  }
  return res.json();
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
