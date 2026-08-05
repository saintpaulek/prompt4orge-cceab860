import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Trash2, Copy, Check } from "lucide-react";
import { LIBRARY, isFreePrompt, type Prompt } from "@/lib/prompts";
import { PromptCard, PromptModal } from "@/components/pf/PromptCard";
import { UnlockModal } from "@/components/pf/UnlockModal";
import { useLocal, useSavedPrompts, useUnlock } from "@/lib/store";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Prompts — your PromptForge collection" },
      { name: "description", content: "View, copy, and manage the AI prompts you saved from the PromptForge library and builder." },
      { property: "og:title", content: "Saved Prompts — your PromptForge collection" },
      { property: "og:description", content: "View, copy, and manage the AI prompts you saved in PromptForge." },
      { property: "og:image", content: "https://prompt4orge.lovable.app/og-image.png" },
      { name: "twitter:image", content: "https://prompt4orge.lovable.app/og-image.png" },
    ],
  }),
  component: SavedPage,
});

const K_MY = "pf.myprompts.v1";
type MyPrompt = { id: string; title: string; text: string; at: number };

function SavedPage() {
  const { saved, toggleSave, remove } = useSavedPrompts();
  const { unlocked, setUnlocked } = useUnlock();
  const [mine, setMine] = useLocal<MyPrompt[]>(K_MY, []);
  const [open, setOpen] = useState<Prompt | null>(null);
  const [unlockOpen, setUnlockOpen] = useState(false);

  const items = LIBRARY.filter((p) => saved.includes(p.id));
  const empty = items.length === 0 && mine.length === 0;

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl">SAVED PROMPTS</h1>
      <p className="mt-1 mb-6 text-sm text-[color:var(--color-cream-dim)]">
        Everything you bookmarked from the library, plus prompts you forged yourself.
      </p>

      {empty && (
        <div className="rounded-2xl border border-dashed border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-10 text-center">
          <Bookmark className="mx-auto text-[color:var(--color-gold)]" size={28} />
          <div className="font-display mt-3 text-2xl">NO SAVED PROMPTS YET</div>
          <p className="mt-2 text-sm text-[color:var(--color-cream-dim)]">
            Save a prompt from the library, or build your own and hit Save.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link
              to="/library"
              className="flex min-h-11 items-center rounded-lg bg-[color:var(--color-ember)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-bg-deep)]"
            >
              Browse the library
            </Link>
            <Link
              to="/"
              className="flex min-h-11 items-center rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-4 py-2.5 text-sm font-medium text-[color:var(--color-cream-dim)]"
            >
              Open the builder
            </Link>
          </div>
        </div>
      )}

      {mine.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xs tracking-wider text-[color:var(--color-gold)] uppercase">Your forged prompts</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((m) => (
              <MyCard key={m.id} m={m} onDelete={() => setMine((all) => all.filter((x) => x.id !== m.id))} />
            ))}
          </div>
        </section>
      )}

      {items.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs tracking-wider text-[color:var(--color-gold)] uppercase">From the library</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <PromptCard
                key={p.id}
                p={p}
                locked={!unlocked && !isFreePrompt(p.id)}
                saved
                onToggleSave={() => toggleSave(p.id)}
                onUnlock={() => setUnlockOpen(true)}
                onOpen={() => setOpen(p)}
                onDelete={() => remove(p.id)}
              />
            ))}
          </div>
        </section>
      )}

      {open && (
        <PromptModal p={open} saved onToggleSave={() => toggleSave(open.id)} onClose={() => setOpen(null)} />
      )}
      {unlockOpen && (
        <UnlockModal
          unlocked={unlocked}
          onClose={() => setUnlockOpen(false)}
          onUnlock={() => { setUnlocked(true); setUnlockOpen(false); }}
        />
      )}
    </div>
  );
}

function MyCard({ m, onDelete }: { m: MyPrompt; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="flex flex-col rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-2 py-0.5 text-[10px] tracking-wider text-[color:var(--color-gold)] uppercase">
          Built by you
        </span>
        <span className="text-[10px] text-[color:var(--color-cream-dim)]">{new Date(m.at).toLocaleDateString()}</span>
      </div>
      <h3 className="mt-2 font-semibold text-[color:var(--color-cream)]">{m.title}</h3>
      <pre
        className={`scrollbar-thin mt-3 flex-1 overflow-auto rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] p-3 text-xs leading-relaxed whitespace-pre-wrap text-[color:var(--color-cream)] ${
          expanded ? "max-h-96" : "max-h-32"
        }`}
      >
{m.text}
      </pre>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mt-2 self-start text-xs text-[color:var(--color-gold)] hover:underline"
      >
        {expanded ? "Show less" : "View full prompt"}
      </button>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(m.text);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            } catch {}
          }}
          className="flex min-h-11 items-center gap-1.5 rounded-lg bg-[color:var(--color-ember)] px-3.5 py-2 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete prompt"
          className="min-h-11 min-w-11 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] p-2 text-[color:var(--color-cream-dim)] hover:border-[color:var(--color-ember)] hover:text-[color:var(--color-ember)]"
        >
          <Trash2 size={15} className="mx-auto" />
        </button>
      </div>
    </article>
  );
}
