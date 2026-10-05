import axios from 'axios';

// One place that notices an expired login and sends the person to the right login screen.
// Login tokens last 7 days; without this the page kept looking logged in and every screen showed its
// own error ("Could not load ...") instead.

const USER_KEYS = ['token', 'user'];
const ADMIN_KEYS = ['adminToken', 'admin', 'adminData'];
// Areas of the site that need a user login; elsewhere an expired user session is simply cleared.
const USER_AREAS = /^\/(company-portal|professional-portal|user-)/;
const EXPIRED_TEXT = /not authenticated|invalid or expired token|invalid token|token has expired|signature has expired/i;

let handling = false;

function jwtExpired(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

function isOurApi(url: string): boolean {
  try {
    const host = new URL(url, window.location.href).hostname;
    return host.endsWith('.dronetv.in') && host !== window.location.hostname;
  } catch {
    return false;
  }
}

function tokenFromHeaders(headers: HeadersInit | undefined): string | null {
  if (!headers) return null;
  let value: string | null | undefined;
  if (headers instanceof Headers) value = headers.get('Authorization');
  else if (Array.isArray(headers)) value = headers.find(([k]) => k.toLowerCase() === 'authorization')?.[1];
  else value = Object.entries(headers).find(([k]) => k.toLowerCase() === 'authorization')?.[1] as string | undefined;
  return value && value.startsWith('Bearer ') ? value.slice(7) : null;
}

export function expireSession(kind: 'admin' | 'user'): void {
  if (handling) return;
  handling = true;
  try {
    (kind === 'admin' ? ADMIN_KEYS : USER_KEYS).forEach(k => localStorage.removeItem(k));
    if (kind === 'user') delete axios.defaults.headers.common['Authorization'];
  } catch { /* storage blocked: the redirect below still happens */ }
  const path = window.location.pathname;
  if (kind === 'admin' && path.startsWith('/admin')) {
    if (path.startsWith('/admin/login')) { handling = false; return; }
    window.location.assign('/admin/login?expired=1');
  } else if (kind === 'user' && USER_AREAS.test(path)) {
    window.location.assign('/login?expired=1');
  } else {
    window.location.replace(`${path}${window.location.search ? window.location.search + '&' : '?'}expired=1`);
  }
}

function kindOf(token: string | null): 'admin' | 'user' | null {
  if (!token) return null;
  if (token === localStorage.getItem('adminToken')) return 'admin';
  if (token === localStorage.getItem('token')) return 'user';
  return null;
}

function checkStoredTokens(): void {
  if (jwtExpired(localStorage.getItem('adminToken'))) expireSession('admin');
  else if (jwtExpired(localStorage.getItem('token'))) expireSession('user');
}

export function installSessionGuard(): void {
  const original = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const res = await original(input, init);
    if (res.status === 401) {
      try {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
        const token = tokenFromHeaders(init?.headers) || (input instanceof Request ? tokenFromHeaders(input.headers) : null);
        const kind = kindOf(token);
        if (kind && isOurApi(url)) {
          const body = await res.clone().json().catch(() => null);
          if (EXPIRED_TEXT.test(String(body?.detail ?? body?.message ?? ''))) expireSession(kind);
        }
      } catch { /* never let the guard break a request */ }
    }
    return res;
  };

  axios.interceptors.response.use(undefined, (error) => {
    const res = error?.response;
    if (res?.status === 401) {
      const auth = error.config?.headers?.Authorization ?? error.config?.headers?.authorization ?? (typeof error.config?.headers?.get === 'function' ? error.config.headers.get('Authorization') : undefined);
      const token = typeof auth === 'string' && auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const kind = kindOf(token);
      const url = String(error.config?.baseURL ?? '') + String(error.config?.url ?? '');
      if (kind && isOurApi(url) && EXPIRED_TEXT.test(String(res.data?.detail ?? res.data?.message ?? ''))) expireSession(kind);
    }
    return Promise.reject(error);
  });

  checkStoredTokens();
  window.setInterval(checkStoredTokens, 60_000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkStoredTokens(); });
}
