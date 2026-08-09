import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, LogIn, LogOut, MailCheck, Unlock, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { leafHead } from "@/lib/meta";
import { inputCls } from "@/components/pf/ui";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } =>
    typeof s.redirect === "string" && s.redirect.startsWith("/") && !s.redirect.startsWith("//")
      ? { redirect: s.redirect }
      : {},
  head: leafHead(
    "/auth",
    "Sign in — PromptForge",
    "Sign in or create a free PromptForge account to keep Full Access and your saved prompts synced across devices.",
  ),
  component: AuthPage,
});

function AuthPage() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [confirmSent, setConfirmSent] = useState(false);

  const goOn = () => void navigate({ to: redirect ?? "/" });

  const submit = async () => {
    if (!email.trim() || !password) {
      setErr("Enter your email and a password.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) {
          setErr(error.message);
          return;
        }
        goOn();
      } else {
        if (password.length < 6) {
          setErr("Password must be at least 6 characters.");
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) {
          setErr(error.message);
          return;
        }
        if (!data.session) setConfirmSent(true);
        else goOn();
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-3xl sm:text-4xl">{user ? "YOUR ACCOUNT" : "SIGN IN"}</h1>
      <p className="mt-1 mb-6 text-sm text-[color:var(--color-cream-dim)]">
        {user
          ? "Manage your PromptForge session."
          : "Keep Full Access and your saved prompts synced across every device."}
      </p>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-10">
          <Loader2 className="animate-spin text-[color:var(--color-gold)]" size={22} />
        </div>
      ) : user ? (
        <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-6">
          <div className="flex items-center gap-3">
            <UserRound className="shrink-0 text-[color:var(--color-gold)]" size={20} />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-[color:var(--color-cream)]">{user.email}</div>
              <div
                className={`mt-0.5 flex items-center gap-1 text-xs font-semibold ${
                  profile?.is_unlocked ? "text-[color:var(--color-gold)]" : "text-[color:var(--color-cream-dim)]"
                }`}
              >
                {profile?.is_unlocked && <Unlock size={12} />}
                {profile?.is_unlocked ? "Full Access" : "Free plan"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={goOn}
            className="mt-5 flex min-h-11 w-full items-center justify-center rounded-lg bg-[color:var(--color-ember)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110"
          >
            Continue to PromptForge
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-2 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-[color:var(--color-line)] px-4 py-2.5 text-sm font-medium text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-ember)]"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      ) : confirmSent ? (
        <div className="rounded-2xl border border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] p-6 text-center">
          <MailCheck className="mx-auto text-[color:var(--color-gold)]" size={28} />
          <div className="font-display mt-3 text-2xl">CHECK YOUR EMAIL</div>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-cream)]">
            We sent a confirmation link to <span className="font-semibold">{email.trim()}</span>. Click it to
            activate your account, then sign in.
          </p>
          <button
            type="button"
            onClick={() => {
              setConfirmSent(false);
              setMode("signin");
            }}
            className="mt-4 min-h-11 w-full rounded-lg border border-[color:var(--color-line)] px-4 py-2.5 text-sm font-medium text-[color:var(--color-cream)]"
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-6">
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setErr("");
                }}
                aria-pressed={mode === m}
                className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  mode === m
                    ? "bg-[color:var(--color-ember)] text-[color:var(--color-bg-deep)]"
                    : "text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
                }`}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <label htmlFor="auth-email" className="mb-1.5 block text-xs tracking-wider text-[color:var(--color-gold)] uppercase">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErr("");
            }}
            placeholder="you@example.com"
            className={inputCls}
          />

          <label
            htmlFor="auth-password"
            className="mt-4 mb-1.5 block text-xs tracking-wider text-[color:var(--color-gold)] uppercase"
          >
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErr("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") void submit();
            }}
            placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
            className={inputCls}
          />

          {err && <div className="mt-3 text-xs text-[color:var(--color-ember)]">{err}</div>}

          <button
            type="button"
            disabled={busy}
            onClick={() => void submit()}
            className="mt-4 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-[color:var(--color-ember)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110 disabled:opacity-60"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-[color:var(--color-cream-dim)]">
            Free to create an account — you only ever pay the one-time Full Access unlock. By continuing you agree
            to our{" "}
            <Link to="/terms" className="text-[color:var(--color-gold)] underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-[color:var(--color-gold)] underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
