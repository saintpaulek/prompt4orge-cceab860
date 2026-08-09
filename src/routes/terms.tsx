import { createFileRoute } from "@tanstack/react-router";
import { ScrollText } from "lucide-react";
import { leafHead } from "@/lib/meta";

export const Route = createFileRoute("/terms")({
  head: leafHead(
    "/terms",
    "Terms of Service — PromptForge",
    "The terms that govern your use of PromptForge: accounts, Full Access purchases, acceptable use, and your content.",
  ),
  component: TermsPage,
});

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "The service",
    body: [
      "PromptForge provides an AI prompt builder and a library of ready-made prompts. The free tier includes a rotating selection of library prompts and the full builder; Full Access unlocks the entire library.",
      "We may improve, change, or update prompts and features over time. Full Access includes future library updates at no extra cost.",
    ],
  },
  {
    title: "Accounts",
    body: [
      "You can use much of PromptForge without an account. Creating an account lets your Full Access status and saved prompts sync across devices.",
      "Keep your password private. You are responsible for activity on your account.",
    ],
  },
  {
    title: "Full Access purchases",
    body: [
      "Full Access is a one-time payment (₦5,000) — not a subscription. Once unlocked, your access does not expire.",
      "Unlock codes are single-use and tied to a purchase. Do not share or resell codes; codes found to be shared or abused may be deactivated.",
      "If a payment succeeds but your account is not unlocked, contact us and we will fix it promptly.",
    ],
  },
  {
    title: "Your content",
    body: [
      "Prompts you build or save are yours. You may use them — and the output you generate with them in any AI tool — for personal or commercial work.",
      "The PromptForge library itself (its collection, curation, and site design) may not be scraped, copied in bulk, or resold as a competing product.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      "Don't use PromptForge to create content that is unlawful, harmful, deceptive, or infringing.",
      "Don't attempt to bypass the free-tier limits, probe our systems, or interfere with other users.",
    ],
  },
  {
    title: "No warranty",
    body: [
      "PromptForge is provided “as is”. AI tools change frequently; we can't guarantee that every prompt produces identical results in every AI model.",
      "To the maximum extent permitted by law, PromptForge is not liable for indirect or consequential losses arising from use of the service.",
    ],
  },
  {
    title: "Changes & contact",
    body: [
      "If these terms change, the updated version will be posted on this page. Continued use after a change means you accept the new terms.",
      "Questions? Email saintpaulek@gmail.com or call +2347069573528.",
    ],
  },
];

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <ScrollText className="shrink-0 text-[color:var(--color-ember)]" size={26} />
        <h1 className="font-display text-3xl sm:text-4xl">TERMS OF SERVICE</h1>
      </div>
      <p className="mt-2 text-xs text-[color:var(--color-cream-dim)]">Effective date: January 1, 2026</p>
      <p className="mt-4 text-base leading-relaxed text-[color:var(--color-cream-dim)]">
        By using PromptForge you agree to these terms. They're written to be readable — no legalese walls.
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
