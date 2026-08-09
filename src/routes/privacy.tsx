import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { leafHead } from "@/lib/meta";

export const Route = createFileRoute("/privacy")({
  head: leafHead(
    "/privacy",
    "Privacy Policy — PromptForge",
    "How PromptForge collects, uses, and protects your account, unlock, and saved-prompt data.",
  ),
  component: PrivacyPage,
});

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "What we collect",
    body: [
      "Account data: if you create an account, we store your email address and a password hash (handled by our authentication provider — we never see your password).",
      "Access status: whether your account has Full Access, and when it was unlocked.",
      "Saved prompts: prompts you choose to save to your account (title, category, and prompt text).",
      "On-device data: if you use PromptForge without an account, your saved prompts, preferences, and unlock state are stored in your browser's local storage and never leave your device.",
    ],
  },
  {
    title: "How we use it",
    body: [
      "To sign you in, keep your Full Access status in sync across devices, and show your saved prompts.",
      "To respond when you contact us by email or phone.",
      "We do not sell, rent, or share your personal data with advertisers or data brokers.",
    ],
  },
  {
    title: "Payments",
    body: [
      "Full Access is a one-time payment. Card or transfer details are processed by our payment provider; PromptForge never sees or stores your full card number.",
      "We keep a record that your account has been unlocked so your access persists.",
    ],
  },
  {
    title: "Third-party services",
    body: [
      "PromptForge is hosted on infrastructure that provides our database and authentication. Their processing is limited to running the service.",
      "Prompts you copy are yours to paste into any AI tool — what those tools do with your text is governed by their own policies.",
    ],
  },
  {
    title: "Your controls",
    body: [
      "You can delete any saved prompt at any time from the Saved page.",
      "You can sign out at any time. To request account deletion or a copy of your data, email saintpaulek@gmail.com and we'll take care of it.",
      "Clearing your browser storage removes all on-device (guest) data.",
    ],
  },
  {
    title: "Changes",
    body: [
      "If this policy changes, the updated version will be posted on this page with a new effective date.",
    ],
  },
  {
    title: "Contact",
    body: ["Questions about privacy? Email saintpaulek@gmail.com or call +2347069573528."],
  },
];

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <ShieldCheck className="shrink-0 text-[color:var(--color-ember)]" size={26} />
        <h1 className="font-display text-3xl sm:text-4xl">PRIVACY POLICY</h1>
      </div>
      <p className="mt-2 text-xs text-[color:var(--color-cream-dim)]">Effective date: January 1, 2026</p>
      <p className="mt-4 text-base leading-relaxed text-[color:var(--color-cream-dim)]">
        PromptForge is built to be useful without collecting more than it needs. This page explains, in plain
        language, what we store and why.
      </p>

      <div className="mt-8 space-y-6">
        {SECTIONS.map((s) => (
          <section
            key={s.title}
            className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-6 shadow-sm"
          >
            <h2 className="font-display text-2xl">{s.title.toUpperCase()}</h2>
            <ul className="mt-3 space-y-2">
              {s.body.map((t) => (
                <li key={t} className="text-sm leading-relaxed text-[color:var(--color-cream-dim)]">
                  {t}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
