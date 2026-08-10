import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search } from "lucide-react";
import { LIBRARY, CATEGORIES, isFreePrompt, type Prompt } from "@/lib/prompts";
import { PromptCard, PromptModal } from "@/components/pf/PromptCard";
import { UnlockBanner, UnlockModal } from "@/components/pf/UnlockModal";
import { useSavedPrompts } from "@/lib/store";
import { useAccess } from "@/lib/use-auth";
import { savePromptToAccount, removeAccountSavedByPromptId } from "@/lib/account.functions";
import { leafHead } from "@/lib/meta";
import { inputCls } from "@/components/pf/ui";

export const Route = createFileRoute("/library")({
  head: leafHead(
    "/library",
    "Prompt Library — 1,000+ expert AI prompts | PromptForge",
    "Search and filter 1,000+ expert-crafted AI prompts across 20 categories: social, SEO, email, sales, image generation and more.",
  ),
  component: LibraryPage,
});

const PAGE = 60;

function LibraryPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [limit, setLimit] = useState(PAGE);
  const [open, setOpen] = useState<Prompt | null>(null);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const { unlocked, user, markUnlockedLocal } = useAccess();
  const { saved, toggleSave } = useSavedPrompts();
  const queryClient = useQueryClient();
  const saveToAccount = useServerFn(savePromptToAccount);
  const removeFromAccount = useServerFn(removeAccountSavedByPromptId);

  // Bookmarking also syncs to the signed-in account so it appears on every device.
  const onToggleSave = (p: Prompt) => {
    const wasSaved = saved.includes(p.id);
    toggleSave(p.id);
    if (!user) return;
    const done = () => void queryClient.invalidateQueries({ queryKey: ["account-saved"] });
    if (wasSaved) void removeFromAccount({ data: { promptId: p.id } }).then(done).catch(() => {});
    else
      void saveToAccount({ data: { promptId: p.id, title: p.title, category: p.cat, promptText: p.prompt } })
        .then(done)
        .catch(() => {});
  };

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return LIBRARY.filter((p) => {
      if (cat !== "All" && p.cat !== cat) return false;
      if (!qq) return true;
      return (
        p.title.toLowerCase().includes(qq) ||
        p.prompt.toLowerCase().includes(qq) ||
        p.cat.toLowerCase().includes(qq)
      );
    });
  }, [q, cat]);

  const shown = filtered.slice(0, limit);

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl">PROMPT LIBRARY</h1>
      <p className="mt-1 mb-5 text-sm text-[color:var(--color-cream-dim)]">
        {LIBRARY.length.toLocaleString()} expert-crafted prompts across {CATEGORIES.length} categories.
      </p>

      <UnlockBanner unlocked={unlocked} onUnlock={() => setUnlockOpen(true)} />

      <div className="relative mt-5">
        <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--color-cream-dim)]" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }}
          placeholder={`Search ${LIBRARY.length.toLocaleString()} prompts…`}
          className={`${inputCls} bg-[color:var(--color-panel)] pl-9`}
        />
      </div>

      <div className="scrollbar-thin mt-3 flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((c) => {
          const active = cat === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => { setCat(c); setLimit(PAGE); }}
              className={`min-h-11 rounded-full border px-3.5 py-2 text-xs transition ${
                active
                  ? "border-[color:var(--color-ember)] bg-[color:var(--color-ember)] text-[color:var(--color-bg-deep)]"
                  : "border-[color:var(--color-line)] bg-[color:var(--color-panel)] text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-[color:var(--color-cream-dim)]">
        Showing {shown.length} of {filtered.length.toLocaleString()} prompts
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <PromptCard
            key={p.id}
            p={p}
            locked={!unlocked && !isFreePrompt(p.id)}
            saved={saved.includes(p.id)}
            onToggleSave={() => onToggleSave(p)}
            onUnlock={() => setUnlockOpen(true)}
            onOpen={() => setOpen(p)}
          />
        ))}
      </div>

      {shown.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-10 text-center text-sm text-[color:var(--color-cream-dim)]">
          No prompts match your search. Try another keyword or category.
        </div>
      )}

      {limit < filtered.length && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE)}
            className="min-h-11 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-panel)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream)] hover:border-[color:var(--color-gold)]"
          >
            Load more prompts
          </button>
        </div>
      )}

      {open && (
        <PromptModal
          p={open}
          saved={saved.includes(open.id)}
          onToggleSave={() => onToggleSave(open)}
          onClose={() => setOpen(null)}
        />
      )}
      {unlockOpen && (
        <UnlockModal
          unlocked={unlocked}
          onClose={() => setUnlockOpen(false)}
          onUnlock={() => { markUnlockedLocal(); setUnlockOpen(false); }}
        />
      )}
    </div>
  );
}
