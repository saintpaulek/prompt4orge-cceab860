import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Hammer, Library, Bookmark, Info, Mail, Menu, X, Lock, Unlock, Sparkles, LogIn, LogOut, UserRound,
} from "lucide-react";
import logoAsset from "@/assets/promptforge-wordmark.png.asset.json";
import { useLocal, K_WELCOME } from "@/lib/store";
import { useAccess } from "@/lib/use-auth";
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
  const [acctOpen, setAcctOpen] = useState(false);
  const { user, unlocked, loading, signOut, markUnlockedLocal } = useAccess();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    setAcctOpen(false);
    setMenuOpen(false);
    void navigate({ to: "/", replace: true });
  };

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[color:var(--color-bg)] text-[color:var(--color-cream)]">
      <header className="sticky top-0 z-30 border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2" onClick={() => setMenuOpen(false)}>
            <span className="font-display truncate text-2xl tracking-wide sm:text-3xl">
              Prompt
              <span className="bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-ember)] bg-clip-text text-transparent">
                Forge
              </span>
            </span>
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
              {unlocked ? "Full Access" : "Unlock Full Access"}
            </button>

            {/* auth affordance — reflects session state */}
            {loading ? null : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAcctOpen((o) => !o)}
                  aria-expanded={acctOpen}
                  aria-label="Account menu"
                  className="flex min-h-11 items-center gap-1.5 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-panel)] px-3 py-2 text-sm font-medium text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
                >
                  <UserRound size={14} /> Account
                </button>
                {acctOpen && (
                  <div className="absolute right-0 z-40 mt-2 w-64 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-3 shadow-2xl">
                    <div className="truncate text-xs text-[color:var(--color-cream-dim)]">{user.email}</div>
                    <div
                      className={`mt-1 text-xs font-semibold ${
                        unlocked ? "text-[color:var(--color-gold)]" : "text-[color:var(--color-cream-dim)]"
                      }`}
                    >
                      {unlocked ? "Full Access" : "Free plan"}
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleSignOut()}
                      className="mt-3 flex min-h-11 w-full items-center gap-2 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-3 py-2 text-sm font-medium text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-ember)]"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex min-h-11 items-center gap-1.5 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-panel)] px-3 py-2 text-sm font-medium text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
              >
                <LogIn size={14} /> Sign in
              </Link>
            )}
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
                {unlocked ? "Full Access active" : "Unlock Full Access"}
              </button>

              {loading ? null : user ? (
                <div className="mt-1 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-panel)] px-3 py-3">
                  <div className="flex items-center gap-3 text-sm font-medium text-[color:var(--color-cream)]">
                    <UserRound size={17} className="shrink-0 text-[color:var(--color-gold)]" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="mt-1 pl-8 text-xs font-semibold text-[color:var(--color-cream-dim)]">
                    {unlocked ? "Full Access" : "Free plan"}
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSignOut()}
                    className="mt-2 ml-8 flex min-h-11 items-center gap-2 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-3 py-2 text-sm font-medium text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-ember)]"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 flex min-h-11 items-center gap-3 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-panel)] px-3 py-3 text-sm font-medium text-[color:var(--color-cream)]"
                >
                  <LogIn size={17} /> Sign in / Create account
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-10">{children}</main>

      <footer className="mt-10 border-t border-[color:var(--color-line)]">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs leading-relaxed text-[color:var(--color-cream-dim)]">
          <nav className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
            <Link to="/privacy" className="hover:text-[color:var(--color-cream)]">Privacy</Link>
            <span aria-hidden="true">|</span>
            <Link to="/terms" className="hover:text-[color:var(--color-cream)]">Terms</Link>
            <span aria-hidden="true">|</span>
            <Link to="/about" className="hover:text-[color:var(--color-cream)]">About</Link>
            <span aria-hidden="true">|</span>
            <Link to="/contact" className="hover:text-[color:var(--color-cream)]">Contact</Link>
          </nav>
          <p>
            Built for social media managers, VAs, and creators learning to work with AI — one prompt at a time.
          </p>
          <p className="mt-2">© 2026 PromptForge</p>
        </div>
      </footer>

      {unlockOpen && (
        <UnlockModal
          unlocked={unlocked}
          onClose={() => setUnlockOpen(false)}
          onUnlock={() => { markUnlockedLocal(); setUnlockOpen(false); }}
        />
      )}
      <WelcomeModal />
    </div>
  );
}

const SLIDES = [
  {
    kind: "logo" as const,
    title: "Welcome to PromptForge",
    body: ["Build the perfect AI prompt in 60 seconds.", "Access a library of 1000+ expert-crafted prompts and a powerful custom builder."],
  },
  {
    kind: "icon" as const,
    title: "Forge in seconds",
    body: ["Pick a category, platform, tone and goal.", "Your prompt is written live — copy it straight into any AI tool."],
  },
  {
    kind: "icon" as const,
    title: "Save what works",
    body: ["Bookmark prompts you love and find them again on the Saved page.", "Unlock Full Access anytime for unlimited saves and every template."],
  },
];

function WelcomeModal() {
  const [seen, setSeen, ready] = useLocal<boolean>(K_WELCOME, false);
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (ready && !seen) setOpen(true);
  }, [ready, seen]);

  if (!open) return null;
  const close = () => { setSeen(true); setOpen(false); };
  const slide = SLIDES[i];
  const last = i === SLIDES.length - 1;

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

        {slide.kind === "logo" ? (
          <img
            src={logoAsset.url}
            alt="PromptForge — build the perfect AI prompt in 60 seconds"
            className="mx-auto h-auto w-full max-w-[300px] object-contain"
          />
        ) : (
          <Sparkles className="mx-auto text-[color:var(--color-gold)]" size={28} />
        )}

        <h2 id="welcome-title" className="font-display mt-4 text-3xl">{slide.title}</h2>
        {slide.body.map((t) => (
          <p key={t} className="mt-3 text-sm leading-relaxed text-[color:var(--color-cream-dim)]">{t}</p>
        ))}

        <div className="mt-6 flex items-center justify-center gap-2">
          {SLIDES.map((s, idx) => (
            <span
              key={s.title}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-6 bg-[color:var(--color-ember)]" : "w-1.5 bg-[color:var(--color-line)]"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => (last ? close() : setI((n) => n + 1))}
          className="mt-4 min-h-11 w-full rounded-lg bg-[color:var(--color-ember)] px-4 py-3 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110"
        >
          {last ? "Get Started" : "Next"}
        </button>
        {!last && (
          <button
            type="button"
            onClick={close}
            className="mt-2 min-h-11 w-full text-xs font-medium text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
