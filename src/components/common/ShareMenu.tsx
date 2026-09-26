import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Share2, Copy, Check } from 'lucide-react';

// Real per-platform share links (WhatsApp/Facebook/LinkedIn all have
// genuine public web share-intent URLs, opened in a new tab - not a
// fabricated "share" that does nothing). Instagram deliberately dropped -
// it has no public web share-intent for an arbitrary external URL (no
// equivalent of facebook.com/sharer or wa.me exists for IG), and a
// copy-link-then-open-the-app workaround isn't a real "share", so rather
// than show a platform option that doesn't actually share anything, it's
// left out entirely (user call, 20260926).
// Portaled to document.body with fixed positioning (same reason as
// ToolbarFilterDropdown - escapes ancestor overflow/stacking clipping).

interface Props {
  url: string;
  title: string;
  buttonClassName?: string;
  iconClassName?: string;
}

const ShareMenu: React.FC<Props> = ({ url, title, buttonClassName, iconClassName }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const place = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setCoords({ top: r.bottom + 4, left: Math.min(r.left, window.innerWidth - 220) });
  };

  useEffect(() => {
    if (!open) return;
    place();
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || popRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  const copyLink = () => {
    navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => {});
  };

  // Facebook/LinkedIn's own share dialogs are designed as small popups (that's
  // how their official share buttons behave) - a constrained window is right
  // for those. WhatsApp Web is a full page app, not a dialog - forcing it into
  // a 600x600 popup breaks its own compose flow (shows a bare QR/loading
  // screen instead of the prefilled-message picker), so it gets a plain new
  // tab instead, same as opening whatsapp.com directly.
  const openPopup = (href: string) => window.open(href, '_blank', 'noopener,noreferrer,width=600,height=600');
  const openTab = (href: string) => window.open(href, '_blank', 'noopener,noreferrer');

  const platforms = [
    // api.whatsapp.com/send (not wa.me, which needs a phone number in the
    // path to reliably prefill text) - the documented "share text, let the
    // user pick who to send it to" endpoint, works with no recipient.
    { name: 'WhatsApp', color: '#25D366', action: () => openTab(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`) },
    { name: 'Facebook', color: '#1877F2', action: () => openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`) },
    { name: 'LinkedIn', color: '#0A66C2', action: () => openPopup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`) },
  ];

  return (
    <>
      <button ref={btnRef} type="button" onClick={e => { e.stopPropagation(); setOpen(v => !v); }} aria-label="Share" className={buttonClassName ?? 'flex size-7 items-center justify-center'}>
        <Share2 className={iconClassName ?? 'size-5'} />
      </button>
      {open && createPortal(
        <div ref={popRef} onClick={e => e.stopPropagation()} style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 100000 }} className="w-52 overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg">
          {platforms.map(p => (
            <button key={p.name} type="button" onClick={() => { p.action(); setOpen(false); }} className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </button>
          ))}
          <div className="my-1 border-t border-slate-100" />
          <button type="button" onClick={() => { copyLink(); }} className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50">
            {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>,
        document.body
      )}
    </>
  );
};

export default ShareMenu;
