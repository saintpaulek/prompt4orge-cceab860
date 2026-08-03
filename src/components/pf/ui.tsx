import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-[color:var(--color-ember)]">{icon}</span>
      <h2 className="font-display text-xl text-[color:var(--color-cream)] md:text-2xl">{children}</h2>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block">
      <div className="mb-1.5 text-xs tracking-wider text-[color:var(--color-gold)] uppercase">{label}</div>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full min-h-11 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-3 py-2.5 text-sm outline-none focus:border-[color:var(--color-ember)]";

export function Select({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export function SelectChips({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`min-h-11 rounded-full border px-3.5 py-2 text-xs transition ${
              active
                ? "border-[color:var(--color-ember)] bg-[color:var(--color-ember)] text-[color:var(--color-bg-deep)]"
                : "border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({
  on, onChange, children,
}: { on: boolean; onChange: (b: boolean) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={`min-h-11 rounded-full border px-3.5 py-2 text-xs transition ${
        on
          ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] text-[color:var(--color-gold)]"
          : "border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
      }`}
    >
      {children}
    </button>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {}
      }}
      className="flex min-h-11 items-center gap-1.5 rounded-lg bg-[color:var(--color-ember)] px-3.5 py-2 text-sm font-semibold text-[color:var(--color-bg-deep)] shadow-sm transition hover:brightness-110"
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? "Copied" : label}
    </button>
  );
}

export function GhostButton({
  children, onClick, type = "button",
}: { children: React.ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex min-h-11 items-center gap-1.5 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-3.5 py-2 text-sm font-medium text-[color:var(--color-cream-dim)] transition hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-cream)]"
    >
      {children}
    </button>
  );
}
