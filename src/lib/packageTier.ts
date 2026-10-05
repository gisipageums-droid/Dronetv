import { useEffect, useState } from 'react';
import { PAYMENT_API } from './apiConfig';

// Package tier (silver / gold / platinum) of every account that bought Reach / Brand / Expand.
// The payment service returns it keyed by a hash of the owner's email, never the email itself.

function ownerKey(value: string): string {
  const s = (value || '').trim().toLowerCase();
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return String(4294967296 * (2097151 & h2) + (h1 >>> 0));
}

let tiers: Record<string, string> = {};
let loading: Promise<void> | null = null;
let loadedAt = 0;
const listeners = new Set<() => void>();

function load(): Promise<void> {
  if (loading) return loading;
  if (!PAYMENT_API) return Promise.resolve();
  loading = fetch(`${PAYMENT_API}/package-tiers`)
    .then(r => (r.ok ? r.json() : null))
    .then(d => { if (d?.tiers) { tiers = d.tiers; loadedAt = Date.now(); listeners.forEach(l => l()); } })
    .catch(() => undefined)
    .finally(() => { loading = null; });
  return loading;
}

export function packageTierFor(userId?: string | null): 'silver' | 'gold' | 'platinum' | null {
  if (!userId) return null;
  const t = tiers[ownerKey(userId)];
  return t === 'silver' || t === 'gold' || t === 'platinum' ? t : null;
}

// Call once in a page that shows tier badges: loads the tiers and re-renders when they arrive.
export function usePackageTiers(): void {
  const [, bump] = useState(0);
  useEffect(() => {
    const l = () => bump(n => n + 1);
    listeners.add(l);
    if (Date.now() - loadedAt > 60000) void load();
    return () => { listeners.delete(l); };
  }, []);
}
