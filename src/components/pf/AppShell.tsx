import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Hammer, Library, Bookmark, Info, Mail, Menu, X, Lock, Unlock, Sparkles } from "lucide-react";
import logoAsset from "@/assets/promptforge-logo.png.asset.json";
import { useUnlock, useLocal, K_WELCOME } from "@/lib/store";
import { UnlockModal } from "./UnlockModal";

const NAV = [
  { to: "/", label: "Builder", icon: Hammer },
  { to: "/library", label: "Library", icon: Library },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/about", label: "About", icon: Info },
  { to: "/contact", label: "Contact", icon: Mail },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const { unlocked, setUnlocked } = useUnlock();

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[color:var(--color-bg)] text-[color:var(--color-cream)]">
      <header className="sticky top-0 z-30 border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <img src={logoAsset.url} alt="PromptForge logo" className="h-10 w-10 rounded-lg object-cover" />
            <div className="leading-tight">
              <div className="font-display text-2xl sm:text-3xl">
                <span className="text-[color:var(--color-cream)]">Prompt</span>
                <span className="wordmark-forge">Forge</span>
              </div>
              <div className="hidden text-[11px] text-[color:var(--color-cream-dim)] sm:block">
                Build the perfect AI prompt in 60 seconds
              </div>
            </div>
          </Link>

          {/* desktop nav */}
          <div className="hidden items-center gap-2 lg:flex">
            <nav className="flex items-center rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{
                    className:
                      "bg-[color:var(--color-ember)] text-[color:var(--color-bg-deep)] flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold",
                  }}
                  inactiveProps={{
                    className:
                      "text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)] flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                  }}
                >
                  <n.icon size={15} />
                  {n.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => setUnlockOpen(true)}
              className={`flex min-h-11 items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                unlocked
                  ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] text-[color:var(--color-gold)]"
                  : "border-[color:var(--color-line)] bg-[color:var(--color-panel)] text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
              }`}
            >
              {unlocked ? <Unlock size={14} /> : <Lock size={14} />}
              {unlocked ? "Unlocked" : "Unlock"}
            </button>
          </div>

          {/* mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-panel)] text-[color:var(--color-cream)] lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-4 py-3 lg:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  onClick={() => setMenuOpen(false)}
                  activeProps={{
                    className:
                      "bg-[color:var(--color-ember)] text-[color:var(--color-bg-deep)] flex min-h-11 items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold",
                  }}
                  inactiveProps={{
                    className:
                      "text-[color:var(--color-cream-dim)] flex min-h-11 items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-[color:var(--color-panel)]",
                  }}
                >
                  <n.icon size={17} />
                  {n.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setUnlockOpen(true); }}
                className="mt-1 flex min-h-11 items-center gap-3 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-panel)] px-3 py-3 text-sm font-medium text-[color:var(--color-cream)]"
              >
                {unlocked ? <Unlock size={17} /> : <Lock size={17} />}
                {unlocked ? "Library unlocked" : "Unlock full library"}
              </button>
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-10">{children}</main>

      <footer className="mt-10 border-t border-[color:var(--color-line)]">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs leading-relaxed text-[color:var(--color-cream-dim)]">
          Built for social media managers, VAs, and creators learning to work with AI — one prompt at a time.
        </div>
      </footer>

      {unlockOpen && (
        <UnlockModal
          unlocked={unlocked}
          onClose={() => setUnlockOpen(false)}
          onUnlock={() => { setUnlocked(true); setUnlockOpen(false); }}
        />
      )}
      <WelcomeModal />
    </div>
  );
}

function WelcomeModal() {
  const [seen, setSeen, ready] = useLocal<boolean>(K_WELCOME, false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ready && !seen) setOpen(true);
  }, [ready, seen]);

  if (!open) return null;
  const close = () => { setSeen(true); setOpen(false); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="w-full max-w-md rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-6 text-center shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close welcome"
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
        >
          <X size={18} />
        </button>
        <Sparkles className="mx-auto text-[color:var(--color-gold)]" size={28} />
        <h2 id="welcome-title" className="font-display mt-3 text-3xl">Welcome to PromptForge</h2>
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-cream-dim)]">
          Build the perfect AI prompt in 60 seconds.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-cream-dim)]">
          Access a library of 1000+ expert-crafted prompts and a powerful custom builder.
        </p>
        <button
          type="button"
          onClick={close}
          className="mt-6 min-h-11 w-full rounded-lg bg-[color:var(--color-ember)] px-4 py-3 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
