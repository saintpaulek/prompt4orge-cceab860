import { useState } from "react";
import { Lock, Unlock, Star, X } from "lucide-react";
import { isValidUnlockCode } from "@/lib/store";
import { inputCls } from "./ui";

export function UnlockBanner({ unlocked, onUnlock }: { unlocked: boolean; onUnlock: () => void }) {
  if (unlocked) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] p-4">
        <Unlock className="text-[color:var(--color-gold)]" size={18} />
        <div className="text-sm text-[color:var(--color-cream)]">
          You've unlocked the full 1000-prompt library. Thank you!
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-4 shadow-sm md:flex-row md:items-center md:gap-4">
      <div className="flex items-center gap-3">
        <Star className="text-[color:var(--color-gold)]" size={18} />
        <div className="text-sm text-[color:var(--color-cream)]">
          <span className="font-display mr-1 text-lg">100 PROMPTS ARE FREE</span>— unlock all 1000 for{" "}
          <span className="font-semibold text-[color:var(--color-gold)]">₦5,000</span> one-time.
        </div>
      </div>
      <button
        type="button"
        onClick={onUnlock}
        className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-[color:var(--color-ember)] px-4 py-2 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110 md:ml-auto"
      >
        <Unlock size={15} /> Unlock full library
      </button>
    </div>
  );
}

export function UnlockModal({
  unlocked, onClose, onUnlock,
}: { unlocked: boolean; onClose: () => void; onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-display text-2xl">UNLOCK FULL LIBRARY</div>
            <div className="mt-1 text-xs text-[color:var(--color-cream-dim)]">
              {unlocked ? "You already have full access." : "100 free — unlock all 1000 for ₦5,000 one-time."}
            </div>
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

        {!unlocked && (
          <div className="mt-5">
            <label className="mb-1.5 block text-xs tracking-wider text-[color:var(--color-gold)] uppercase">
              Enter unlock code
            </label>
            <input
              value={code}
              onChange={(e) => { setCode(e.target.value); setErr(""); }}
              placeholder="PF-XXXXXX-CC"
              className={inputCls}
            />
            {err && <div className="mt-2 text-xs text-[color:var(--color-ember)]">{err}</div>}
            <button
              type="button"
              onClick={() => (isValidUnlockCode(code) ? onUnlock() : setErr("That code isn't valid. Check and try again."))}
              className="mt-3 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-[color:var(--color-ember)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110"
            >
              <Lock size={15} /> Unlock
            </button>
            <p className="mt-3 text-[11px] leading-relaxed text-[color:var(--color-cream-dim)]">
              Codes are issued after payment. Email saintpaulek@gmail.com if you need help with yours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
