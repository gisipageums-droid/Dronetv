import React from "react";

// Shared, reusable building blocks for every Company Portal section - keeps
// visual consistency without each page reinventing card/kpi/badge markup.

export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <div className="text-xl font-extrabold text-ink">{title}</div>
      {sub && <div className="text-[12.5px] text-ink-caption mt-0.5">{sub}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface-card rounded-lg border border-ink-light shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="px-4 py-3.5 border-b border-ink-light flex items-center justify-between">
      <div className="text-sm font-bold text-ink">{title}</div>
      {action}
    </div>
  );
}

const KPI_BORDER: Record<string, string> = {
  yellow: "border-t-brand-yellow",
  red: "border-t-status-error",
  green: "border-t-status-success",
  blue: "border-t-status-info",
};

export function KpiCard({
  label, value, note, accent = "yellow",
}: { label: string; value: string | number; note?: string; accent?: "yellow" | "red" | "green" | "blue" }) {
  return (
    <div className={`bg-surface-card rounded-lg border border-ink-light border-t-[3px] ${KPI_BORDER[accent]} p-4 shadow-sm`}>
      <div className="text-[10px] font-bold text-ink-caption uppercase tracking-wide mb-1.5">{label}</div>
      <div className="text-[26px] font-extrabold text-ink leading-none">{value}</div>
      {note && <div className="text-[11px] text-ink-caption mt-1">{note}</div>}
    </div>
  );
}

export function KpiRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 mb-5">{children}</div>;
}

const BADGE_STYLE: Record<string, string> = {
  success: "bg-status-success/15 text-status-success",
  warning: "bg-brand-yellow-soft/40 text-[#7a5800]",
  neutral: "bg-ink-offwhite text-ink-caption",
  info: "bg-status-info/15 text-status-info",
  error: "bg-status-error/15 text-status-error",
};

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: keyof typeof BADGE_STYLE }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${BADGE_STYLE[tone]}`}>
      {children}
    </span>
  );
}

export function Btn({
  children, onClick, variant = "primary", size = "md", type = "button", disabled, className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "dark" | "danger";
  size?: "sm" | "md";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const base = "inline-flex items-center gap-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const sizeCls = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm";
  const variantCls = {
    primary: "bg-brand-yellow text-ink hover:bg-brand-gold",
    outline: "bg-white text-ink border border-ink-light hover:border-ink-dark",
    dark: "bg-ink text-brand-yellow hover:opacity-85",
    danger: "bg-status-error text-white hover:opacity-90",
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sizeCls} ${variantCls} ${className}`}>
      {children}
    </button>
  );
}

export function Field({
  label, required, children, wide,
}: { label: string; required?: boolean; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`flex flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <label className="text-[11.5px] font-bold text-ink uppercase tracking-wide">
        {label} {required && <span className="text-status-error">*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputCls =
  "w-full px-3 py-2.5 border border-ink-light rounded-md text-[13px] text-ink bg-white focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 transition-colors";

export function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

export function Chip({
  children, on, onClick,
}: { children: React.ReactNode; on?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs border transition-colors select-none ${
        on ? "bg-brand-yellow text-ink border-brand-yellow font-semibold" : "bg-white text-ink border-ink-light hover:border-ink-dark"
      }`}
    >
      {children}
    </button>
  );
}

export function ActionBar({ onSave, onCancel, saveLabel = "Save Changes" }: { onSave?: () => void; onCancel?: () => void; saveLabel?: string }) {
  return (
    <div className="flex gap-3 mt-6 pt-5 border-t border-ink-light">
      <Btn onClick={onSave}>{saveLabel}</Btn>
      {onCancel && <Btn variant="outline" onClick={onCancel}>Cancel</Btn>}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <div className="py-10 text-center text-sm text-ink-caption">{text}</div>;
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-[42px] h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-brand-yellow" : "bg-ink-light"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[19px]" : "translate-x-0.5"}`}
      />
    </button>
  );
}
