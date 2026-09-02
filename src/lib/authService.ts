import { AUTH_API, LAMBDA, PROFESSIONAL_API, COMPANY_API } from './apiConfig';

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
  // "adminToken" key, not TOKEN_KEY - without this, every admin-panel call
  // that goes through authHeader()/getToken() silently sent no token at all
  // (403 on any /admin or viewType=admin endpoint). Checking adminToken
  // FIRST: an admin token is valid on both admin-gated and self-scoped
  // endpoints (backend's require_admin/require_self_or_admin both allow
  // admins through), so it's the strictly more useful one whenever both
  // happen to be present in the same browser (e.g. a dev session that's
  // logged into both a regular account and the admin panel).
  return localStorage.getItem('adminToken') || localStorage.getItem(TOKEN_KEY);
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

// ─── Role reconciliation ─────────────────────────────────────────────────────

// The auth service only knows the `role` column on the account row. When a
// plain "user" account later submits a company/professional listing through
// an existing-account path, that column isn't always updated, so /login keeps
// returning role:"user" and the app drops the person on the generic
// /user-dashboard instead of their portal. Re-derive the real role from the
// listing services and patch the stored session. Self-hosted only — the
// Lambda login path already does its own profile-based equivalent.
export async function reconcileSelfHostedRole(
  email: string,
  token: string
): Promise<string | null> {
  if (!email || !token || !AUTH_API) return null;
  const headers = { Authorization: `Bearer ${token}` };
  const hasCards = async (url: string): Promise<boolean> => {
    try {
      const r = await fetch(url, { headers });
      if (!r.ok) return false;
      const d = await r.json();
      return Array.isArray(d?.cards) && d.cards.length > 0;
    } catch {
      return false;
    }
  };

  const e = encodeURIComponent(email);
  let role: string | null = null;
  if (COMPANY_API && (await hasCards(`${COMPANY_API}/dashboard-cards?userId=${e}`))) {
    role = 'company';
  } else if (
    PROFESSIONAL_API &&
    (await hasCards(`${PROFESSIONAL_API}/professional-dashboard-cards?viewType=user&userId=${e}`))
  ) {
    role = 'professional';
  }
  if (!role) return null;

  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      const u = JSON.parse(raw);
      u.role = role;
      if (u.userData) u.userData.role = role;
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      window.dispatchEvent(new Event('user-role-updated'));
    }
  } catch {
    /* ignore */
  }
  return role;
}

async function applyRoleReconciliation(res: LoginResponse): Promise<void> {
  const currentRole = res.userData?.role || res.role;
  if (currentRole && currentRole !== 'user') return;
  const real = await Promise.race([
    reconcileSelfHostedRole(res.email, res.token),
    new Promise<null>((r) => setTimeout(() => r(null), 4000)),
  ]).catch(() => null);
  if (real) {
    res.role = real;
    if (res.userData) res.userData.role = real;
  }
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
    await applyRoleReconciliation(res);
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
    await applyRoleReconciliation(res);
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
