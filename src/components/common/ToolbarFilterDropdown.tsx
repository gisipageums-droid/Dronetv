import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

// The V2 redesign's toolbar filter pills (Category/Sector/State/Package/...)
// were copy-pasted from the reference mockup with an onClick that only
// re-opened the (already permanently-visible-on-desktop) sidebar - so on
// desktop, clicking any of them visibly did nothing. This is a real
// dropdown: it opens its own small popover of that filter's actual real
// options, right under the button, closes on an outside click.
//
// Portaled to document.body and positioned with `fixed` coordinates
// (not `absolute` inside the button's own wrapper) - every toolbar row
// this renders into sits inside an `overflow-x-auto` scroll container for
// the mobile pill strip, which silently clips a plain `absolute` popover
// on desktop. Portaling escapes that entirely.

interface Props {
  label: string;
  options?: string[];
  selected?: string[];
  onToggle?: (value: string) => void;
  buttonClassName: string;
  badgeCount?: number;
  children?: React.ReactNode;
}

const ToolbarFilterDropdown: React.FC<Props> = ({ label, options, selected, onToggle, buttonClassName, badgeCount, children }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const place = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setCoords({ top: r.bottom + 4, left: r.left });
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

  return (
    <>
      <button ref={btnRef} type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} className={buttonClassName}>
        {label}{(badgeCount ?? selected?.length ?? 0) > 0 ? ` (${badgeCount ?? selected?.length})` : ''} <ChevronDown className="size-4" />
      </button>
      {open && createPortal(
        <div ref={popRef} style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 100000 }} className="max-h-64 w-56 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          {children ? children : (
            !options || options.length === 0 ? (
              <p className="px-2 py-1.5 text-xs text-slate-400">No options yet</p>
            ) : options.map(opt => (
              <label key={opt} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                <input type="checkbox" checked={!!selected?.includes(opt)} onChange={() => onToggle?.(opt)} className="size-3.5 accent-amber-500" />
                {opt}
              </label>
            ))
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default ToolbarFilterDropdown;
