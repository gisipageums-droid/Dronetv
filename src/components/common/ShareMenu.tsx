import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Share2, Copy, Check, Mail } from 'lucide-react';

// Real per-platform share links, opened in a new tab: WhatsApp, Facebook, LinkedIn, X and Telegram all have
// public web share-intent URLs. Instagram has none for an outside link, so it hands over to the phone's share
// sheet when the page supplies a picture (onInstagram), and otherwise copies the link and opens Instagram.
// Portaled to document.body with fixed positioning (same reason as ToolbarFilterDropdown - escapes ancestor
// overflow/stacking clipping).

type IconProps = { className?: string };
const WhatsAppIcon = ({ className }: IconProps) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.100 3.200 5.100 4.500.7.3 1.300.5 1.700.6.700.2 1.400.2 1.900.1.600-.1 1.800-.7 2-1.400.3-.7.3-1.300.2-1.400-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.500 15.200L2 22l4.900-1.500A10 10 0 1 0 12 2zm0 18.200c-1.500 0-3-.4-4.200-1.200l-.3-.2-2.900.9.9-2.800-.2-.3A8.200 8.200 0 1 1 12 20.200z" /></svg>);
const FacebookIcon = ({ className }: IconProps) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8.200h2.800l.4-3.300h-3.200V8.400c0-.9.3-1.600 1.600-1.600h1.700V3.900c-.3 0-1.300-.1-2.400-.1-2.400 0-4.100 1.500-4.100 4.200v2.500H7.500v3.300h2.800V22h3.200z" /></svg>);
const LinkedInIcon = ({ className }: IconProps) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M4.500 8.700h3.600V20H4.500V8.700zM6.300 3.500a2.100 2.100 0 1 1 0 4.200 2.100 2.100 0 0 1 0-4.200zM10.300 8.700h3.400v1.600h.1c.5-.9 1.600-1.900 3.400-1.900 3.600 0 4.300 2.400 4.300 5.500V20h-3.600v-5.500c0-1.300 0-3-1.800-3s-2.100 1.400-2.100 2.900V20h-3.600V8.700z" /></svg>);
const XIcon = ({ className }: IconProps) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M17.800 3h3.100l-6.800 7.700L22 21h-6.200l-4.900-6.300L5.300 21H2.200l7.300-8.300L2 3h6.400l4.400 5.800L17.800 3zm-1.100 16.200h1.700L7.400 4.700H5.600l11.100 14.500z" /></svg>);
const InstagramIcon = ({ className }: IconProps) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.500" cy="6.500" r="1" fill="currentColor" stroke="none" /></svg>);
const TelegramIcon = ({ className }: IconProps) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M21.500 3.500 2.700 10.800c-.8.300-.8 1.400 0 1.700l4.700 1.500 1.800 5.600c.2.600 1 .8 1.500.3l2.600-2.500 4.800 3.500c.6.400 1.400.1 1.600-.6l3.200-15.200c.2-.9-.7-1.600-1.400-1.200zM9.500 13.500l8.300-5.200-6.700 6.300-.3 3-1.300-4.100z" /></svg>);

interface Props {
  url: string;
  title: string;
  // Called when the visitor picks Instagram: lets the page share a picture through the phone's share sheet.
  onInstagram?: () => void;
  buttonClassName?: string;
  iconClassName?: string;
}

const ShareMenu: React.FC<Props> = ({ url, title, onInstagram, buttonClassName, iconClassName }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const POP_HEIGHT = 250; // approx rendered height, used to flip above when there's no room below

  const place = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const left = Math.min(Math.max(r.left, 8), window.innerWidth - 300);
    const fitsBelow = r.bottom + 4 + POP_HEIGHT <= window.innerHeight;
    const top = fitsBelow ? r.bottom + 4 : Math.max(8, r.top - 4 - POP_HEIGHT);
    setCoords({ top, left });
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

  const openInstagram = () => {
    if (onInstagram) { onInstagram(); return; }
    copyLink();
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  const text = encodeURIComponent(`${title} ${url}`);
  const platforms: { name: string; bg: string; Icon: React.ComponentType<IconProps>; action: () => void }[] = [
    { name: 'WhatsApp', bg: '#25D366', Icon: WhatsAppIcon, action: () => openTab(`https://api.whatsapp.com/send?text=${text}`) },
    { name: 'Instagram', bg: 'linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)', Icon: InstagramIcon, action: openInstagram },
    { name: 'LinkedIn', bg: '#0A66C2', Icon: LinkedInIcon, action: () => openPopup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`) },
    { name: 'Facebook', bg: '#1877F2', Icon: FacebookIcon, action: () => openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`) },
    { name: 'X', bg: '#000000', Icon: XIcon, action: () => openPopup(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`) },
    { name: 'Telegram', bg: '#229ED9', Icon: TelegramIcon, action: () => openPopup(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`) },
    { name: 'Email', bg: '#6b7280', Icon: ({ className }: IconProps) => <Mail className={className} />, action: () => { window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${text}`; } },
  ];

  return (
    <>
      <button ref={btnRef} type="button" onClick={e => { e.stopPropagation(); setOpen(v => !v); }} aria-label="Share" className={buttonClassName ?? 'flex size-7 items-center justify-center'}>
        <Share2 className={iconClassName ?? 'size-5'} />
      </button>
      {open && createPortal(
        <div ref={popRef} onClick={e => e.stopPropagation()} role="menu" aria-label="Share" style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 100000000 }} className="w-72 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
          <div className="grid grid-cols-4 gap-x-2 gap-y-3">
            {platforms.map(p => (
              <button key={p.name} type="button" role="menuitem" onClick={() => { p.action(); setOpen(false); }} className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-700">
                <span className="flex size-11 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-105" style={{ background: p.bg }}><p.Icon className="size-5" /></span>
                {p.name}
              </button>
            ))}
            <button type="button" role="menuitem" onClick={copyLink} className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-700">
              <span className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-sm transition-transform hover:scale-105">{copied ? <Check className="size-5 text-green-600" /> : <Copy className="size-5" />}</span>
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ShareMenu;
