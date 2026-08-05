import { createFileRoute, Link } from "@tanstack/react-router";
import { Library, Hammer, Target } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About PromptForge — prompt engineering made simple" },
      { name: "description", content: "PromptForge helps anyone create high-quality AI prompts in under 60 seconds — no experience needed. Learn about our mission and what we offer." },
      { property: "og:title", content: "About PromptForge — prompt engineering made simple" },
      { property: "og:description", content: "Our mission: make professional prompt engineering simple and accessible for creators, marketers, students, and businesses." },
      { property: "og:image", content: "https://prompt4orge.lovable.app/og-image.png" },
      { name: "twitter:image", content: "https://prompt4orge.lovable.app/og-image.png" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl sm:text-4xl">ABOUT PROMPTFORGE</h1>
      <p className="mt-4 text-base leading-relaxed text-[color:var(--color-cream-dim)]">
        PromptForge helps anyone create high-quality AI prompts in under 60 seconds — no experience needed.
      </p>

      <section className="mt-8 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Target className="text-[color:var(--color-ember)]" size={18} />
          <h2 className="font-display text-2xl">OUR MISSION</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-cream-dim)]">
          Our mission is to make professional prompt engineering simple and accessible for creators, marketers,
          students, and businesses.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Library className="text-[color:var(--color-ember)]" size={18} />
          <h2 className="font-display text-2xl">WHAT WE OFFER</h2>
        </div>
        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[color:var(--color-cream-dim)]">
          {[
            "A library of 1000+ expert-crafted prompts",
            "A powerful custom prompt builder",
            "Ready-to-use outputs for any platform, tone, or goal",
          ].map((t) => (
            <li key={t} className="flex gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-gold)]" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-6 text-sm leading-relaxed text-[color:var(--color-cream-dim)]">
        Whether you're writing social media captions, emails, product descriptions, or creative content,
        PromptForge gives you better results faster.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-2 rounded-lg bg-[color:var(--color-ember)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110"
        >
          <Hammer size={15} /> Start building
        </Link>
        <Link
          to="/library"
          className="flex min-h-11 items-center gap-2 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-panel)] px-4 py-2.5 text-sm font-medium text-[color:var(--color-cream)] hover:border-[color:var(--color-gold)]"
        >
          <Library size={15} /> Browse the library
        </Link>
      </div>
    </div>
  );
}
