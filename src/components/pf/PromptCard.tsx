import { Bookmark, Lock, Image as ImageIcon, Trash2, X } from "lucide-react";
import { isFreePrompt, promptDesc, type Prompt } from "@/lib/prompts";
import { CopyButton } from "./ui";

export function PromptCard({
  p, locked, saved, onToggleSave, onUnlock, onOpen, onDelete,
}: {
  p: Prompt;
  locked: boolean;
  saved: boolean;
  onToggleSave: () => void;
  onUnlock: () => void;
  onOpen: () => void;
  onDelete?: () => void;
}) {
  const isImg = p.cat === "Image Generation";
  return (
    <article className="flex flex-col rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-4 shadow-sm transition hover:border-[color:var(--color-gold)]/50">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-2 py-0.5 text-[10px] tracking-wider text-[color:var(--color-gold)] uppercase">
          {isImg && <ImageIcon size={10} />}
          {p.cat}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-[color:var(--color-cream-dim)]">
          #{p.id.toString().padStart(4, "0")}
          {isFreePrompt(p.id) && (
            <span className="ml-1 rounded-full bg-[color:var(--color-ember-soft)] px-1.5 py-0.5 font-medium text-[color:var(--color-ember)]">
              FREE
            </span>
          )}
        </div>
      </div>

      <button type="button" onClick={locked ? onUnlock : onOpen} className="mt-2 text-left">
        <h3 className="font-semibold text-[color:var(--color-cream)]">{p.title}</h3>
        <p
          className={`mt-1.5 text-xs leading-relaxed text-[color:var(--color-cream-dim)] ${
            locked ? "blur-[3px] select-none" : ""
          }`}
        >
          {promptDesc(p)}
        </p>
      </button>

      <div className="mt-3 flex flex-1 flex-wrap items-end gap-1">
        {p.tags.map((t) => (
          <span key={t} className="text-[10px] text-[color:var(--color-cream-dim)]">#{t}</span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        {locked ? (
          <button
            type="button"
            onClick={onUnlock}
            className="flex min-h-11 items-center gap-1.5 rounded-lg bg-[color:var(--color-gold)] px-3.5 py-2 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110"
          >
            <Lock size={14} /> Unlock to view
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className="flex min-h-11 items-center gap-1.5 rounded-lg bg-[color:var(--color-ember)] px-3.5 py-2 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110"
          >
            View &amp; use
          </button>
        )}
        <div className="flex items-center gap-2">
          {!locked && <CopyButtonSmall text={p.prompt} />}
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete saved prompt"
              className="min-h-11 min-w-11 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] p-2 text-[color:var(--color-cream-dim)] transition hover:border-[color:var(--color-ember)] hover:text-[color:var(--color-ember)]"
            >
              <Trash2 size={15} className="mx-auto" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleSave}
              aria-label={saved ? "Remove from saved" : "Save prompt"}
              className={`min-h-11 min-w-11 rounded-lg border p-2 transition ${
                saved
                  ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] text-[color:var(--color-gold)]"
                  : "border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
              }`}
            >
              <Bookmark size={15} className="mx-auto" fill={saved ? "currentColor" : "none"} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function CopyButtonSmall({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {}
      }}
      aria-label="Copy prompt"
      className="min-h-11 min-w-11 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] p-2 text-[color:var(--color-cream-dim)] transition hover:text-[color:var(--color-cream)]"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
  );
}

export function PromptModal({
  p, saved, onToggleSave, onClose,
}: { p: Prompt; saved: boolean; onToggleSave: () => void; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={p.title}
        className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-t-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-5 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] tracking-wider text-[color:var(--color-gold)] uppercase">{p.cat}</div>
            <h2 className="mt-1 text-lg font-semibold text-[color:var(--color-cream)]">{p.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="min-h-11 min-w-11 rounded-lg text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
          >
            <X size={18} className="mx-auto" />
          </button>
        </div>
        <pre className="scrollbar-thin mt-4 max-h-[50vh] overflow-auto rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] p-4 text-sm leading-relaxed whitespace-pre-wrap text-[color:var(--color-cream)]">
{p.prompt}
        </pre>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <CopyButton text={p.prompt} label="Copy prompt" />
          <button
            type="button"
            onClick={onToggleSave}
            className={`flex min-h-11 items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
              saved
                ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] text-[color:var(--color-gold)]"
                : "border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
            }`}
          >
            <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
