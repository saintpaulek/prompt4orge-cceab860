import { useState } from "react";
import { Lock, Unlock, Star, X, Check, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { redeemUnlockCode } from "@/lib/codes.functions";
import { FULL_ACCESS_BENEFITS, FULL_ACCESS_PRICE, PLAN_COMPARISON } from "@/lib/copy";
import { inputCls } from "./ui";

export function UnlockBanner({ unlocked, onUnlock }: { unlocked: boolean; onUnlock: () => void }) {
  if (unlocked) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] p-4">
        <Unlock className="shrink-0 text-[color:var(--color-gold)]" size={18} />
        <div className="text-sm text-[color:var(--color-cream)]">
          You have Full Access to the whole prompt library. Thank you!
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-4 shadow-sm md:flex-row md:items-center md:gap-4">
      <div className="flex items-center gap-3">
        <Star className="shrink-0 text-[color:var(--color-gold)]" size={18} />
        <div className="text-sm text-[color:var(--color-cream)]">
          <span className="font-display mr-1 text-lg">FREE PLAN IS LIMITED</span>— get everything unlimited for{" "}
          <span className="font-semibold text-[color:var(--color-gold)]">{FULL_ACCESS_PRICE}</span>.
        </div>
      </div>
      <button
        type="button"
        onClick={onUnlock}
        className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-[color:var(--color-ember)] px-4 py-2 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110 md:ml-auto"
      >
        <Unlock size={15} /> Unlock Full Access
      </button>
    </div>
  );
}

export function UnlockModal({
  unlocked, onClose, onUnlock,
}: { unlocked: boolean; onClose: () => void; onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const redeem = useServerFn(redeemUnlockCode);

  const submit = async () => {
    if (!code.trim()) { setErr("Enter your unlock code."); return; }
    setBusy(true); setErr("");
    try {
      const res = await redeem({ data: { code } });
      if (res.ok) onUnlock();
      else setErr(res.reason);
    } catch {
      setErr("Couldn't check that code right now. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="unlock-title"
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-5 shadow-2xl sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div id="unlock-title" className="font-display text-2xl">UNLOCK FULL ACCESS</div>
            <div className="mt-1 text-xs text-[color:var(--color-cream-dim)]">
              {unlocked ? "You already have Full Access." : `${FULL_ACCESS_PRICE} — no subscription.`}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="min-h-11 min-w-11 shrink-0 rounded-lg text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
          >
            <X size={18} className="mx-auto" />
          </button>
        </div>

        {!unlocked && (
          <>
            <div className="mt-5">
              <div className="mb-2 text-xs tracking-wider text-[color:var(--color-gold)] uppercase">
                What you get with Full Access
              </div>
              <ul className="space-y-2">
                {FULL_ACCESS_BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-[color:var(--color-cream)]">
                    <Check size={15} className="mt-0.5 shrink-0 text-[color:var(--color-gold)]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {PLAN_COMPARISON.map((p, i) => (
                <div
                  key={p.label}
                  className={`rounded-xl border p-3 ${
                    i === 1
                      ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)]"
                      : "border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)]"
                  }`}
                >
                  <div className={`text-xs font-semibold uppercase ${i === 1 ? "text-[color:var(--color-gold)]" : "text-[color:var(--color-cream-dim)]"}`}>
                    {p.label}
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-[color:var(--color-cream)]">{p.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <label htmlFor="unlock-code" className="mb-1.5 block text-xs tracking-wider text-[color:var(--color-gold)] uppercase">
                Have a one-time unlock code?
              </label>
              <input
                id="unlock-code"
                value={code}
                onChange={(e) => { setCode(e.target.value); setErr(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") void submit(); }}
                placeholder="PF-XXXX-XXXX"
                autoCapitalize="characters"
                className={inputCls}
              />
              {err && <div className="mt-2 text-xs text-[color:var(--color-ember)]">{err}</div>}

              <button
                type="button"
                disabled={busy}
                onClick={() => void submit()}
                className="mt-3 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-[color:var(--color-ember)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110 disabled:opacity-60"
              >
                {busy ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />} Unlock Full Access
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 flex min-h-11 w-full items-center justify-center rounded-lg border border-[color:var(--color-line)] px-4 py-2.5 text-sm font-medium text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
              >
                Continue with Free
              </button>
              <p className="mt-3 text-[11px] leading-relaxed text-[color:var(--color-cream-dim)]">
                Codes are issued after payment. Email saintpaulek@gmail.com if you need help with yours.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
