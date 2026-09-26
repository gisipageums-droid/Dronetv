import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// The V2 redesign's toolbar filter pills (Category/Sector/State/Package/...)
// were copy-pasted from the reference mockup with an onClick that only
// re-opened the (already permanently-visible-on-desktop) sidebar - so on
// desktop, clicking any of them visibly did nothing. This is a real
// dropdown: it opens its own small popover of that filter's actual real
// options, right under the button, closes on an outside click.

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} className={buttonClassName}>
        {label}{(badgeCount ?? selected?.length ?? 0) > 0 ? ` (${badgeCount ?? selected?.length})` : ''} <ChevronDown className="size-4" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-64 w-56 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
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
        </div>
      )}
    </div>
  );
};

export default ToolbarFilterDropdown;
