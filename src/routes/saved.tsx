import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bookmark, Trash2, Copy, Check, Cloud, UserRound, Hammer } from "lucide-react";
import { LIBRARY, isFreePrompt, type Prompt } from "@/lib/prompts";
import { PromptCard, PromptModal } from "@/components/pf/PromptCard";
import { UnlockModal } from "@/components/pf/UnlockModal";
import { useLocal, useSavedPrompts } from "@/lib/store";
import { useAccess } from "@/lib/use-auth";
import {
  listAccountSaved,
  deleteAccountSaved,
  savePromptToAccount,
  removeAccountSavedByPromptId,
} from "@/lib/account.functions";
import { leafHead } from "@/lib/meta";

export const Route = createFileRoute("/saved")({
  head: leafHead(
    "/saved",
    "Saved Prompts — your PromptForge collection",
    "View, copy, and manage the AI prompts you saved from the PromptForge library and builder.",
  ),
  component: SavedPage,
});

const K_MY = "pf.myprompts.v1";
type MyPrompt = { id: string; title: string; text: string; at: number };
type AccountItem = {
  id: string;
  prompt_id: number | null;
  title: string;
  category: string | null;
  prompt_text: string;
  created_at: string;
};

function SavedPage() {
  const { user, loading, unlocked, markUnlockedLocal } = useAccess();
  const { saved, toggleSave, remove } = useSavedPrompts();
  const [mine, setMine] = useLocal<MyPrompt[]>(K_MY, []);
  const [open, setOpen] = useState<Prompt | null>(null);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const queryClient = useQueryClient();
  const fetchSaved = useServerFn(listAccountSaved);
  const deleteSaved = useServerFn(deleteAccountSaved);
  const saveToAccount = useServerFn(savePromptToAccount);
  const removeFromAccount = useServerFn(removeAccountSavedByPromptId);

  const accountQ = useQuery({
    queryKey: ["account-saved"],
    queryFn: () => fetchSaved(),
    enabled: !!user,
  });
  const accountItems: AccountItem[] = accountQ.data?.items ?? [];

  const items = LIBRARY.filter((p) => saved.includes(p.id));
  const hasLocal = items.length > 0 || mine.length > 0;
  const empty = !hasLocal && accountItems.length === 0;

  const invalidateAccount = () => void queryClient.invalidateQueries({ queryKey: ["account-saved"] });

  const onToggleLibrarySave = (p: Prompt) => {
    const wasSaved = saved.includes(p.id);
    toggleSave(p.id);
    if (!user) return;
    if (wasSaved) void removeFromAccount({ data: { promptId: p.id } }).then(invalidateAccount).catch(() => {});
    else
      void saveToAccount({
        data: { promptId: p.id, title: p.title, category: p.cat, promptText: p.prompt },
      })
        .then(invalidateAccount)
        .catch(() => {});
  };

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl">SAVED PROMPTS</h1>
      <p className="mt-1 mb-6 text-sm text-[color:var(--color-cream-dim)]">
        Everything you bookmarked from the library, plus prompts you forged yourself.
      </p>

      {!loading && !user && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <UserRound className="shrink-0 text-[color:var(--color-gold)]" size={18} />
            <p className="text-sm text-[color:var(--color-cream)]">
              You're browsing as a guest — saved prompts live only on this device.{" "}
              <span className="text-[color:var(--color-cream-dim)]">Sign in to sync them to your account.</span>
            </p>
          </div>
          <Link
            to="/auth"
            search={{ redirect: "/saved" }}
            className="flex min-h-11 items-center justify-center rounded-lg bg-[color:var(--color-ember)] px-4 py-2 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110 sm:ml-auto"
          >
            Sign in
          </Link>
        </div>
      )}

      {user && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-xs tracking-wider text-[color:var(--color-gold)] uppercase">
            <Cloud size={13} /> Synced to your account
          </h2>
          {accountQ.isPending ? (
            <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-6 text-center text-sm text-[color:var(--color-cream-dim)]">
              Loading your account prompts…
            </div>
          ) : accountQ.isError ? (
            <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-6 text-center text-sm text-[color:var(--color-cream-dim)]">
              Couldn't load account prompts right now. Your on-device saves below are unaffected.
            </div>
          ) : accountItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-6 text-center text-sm text-[color:var(--color-cream-dim)]">
              Nothing synced yet — bookmark a library prompt or hit Save in the builder while signed in.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {accountItems.map((a) => (
                <AccountCard
                  key={a.id}
                  a={a}
                  onDelete={() =>
                    void deleteSaved({ data: { id: a.id } }).then(invalidateAccount).catch(() => {})
                  }
                />
              ))}
            </div>
          )}
        </section>
      )}

      {empty && (!user || accountQ.isSuccess || accountQ.isError) && (
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

      {hasLocal && (
        <div className="mb-3 text-[11px] tracking-wider text-[color:var(--color-cream-dim)] uppercase">
          On this device
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
                onToggleSave={() => onToggleLibrarySave(p)}
                onUnlock={() => setUnlockOpen(true)}
                onOpen={() => setOpen(p)}
                onDelete={() => {
                  remove(p.id);
                  if (user)
                    void removeFromAccount({ data: { promptId: p.id } }).then(invalidateAccount).catch(() => {});
                }}
              />
            ))}
          </div>
        </section>
      )}

      {open && (
        <PromptModal p={open} saved onToggleSave={() => onToggleLibrarySave(open)} onClose={() => setOpen(null)} />
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

function AccountCard({ a, onDelete }: { a: AccountItem; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="flex flex-col rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-2 py-0.5 text-[10px] tracking-wider text-[color:var(--color-gold)] uppercase">
          {a.category ?? "Saved"}
        </span>
        <span className="text-[10px] text-[color:var(--color-cream-dim)]">
          {new Date(a.created_at).toLocaleDateString()}
        </span>
      </div>
      <h3 className="mt-2 font-semibold text-[color:var(--color-cream)]">{a.title}</h3>
      <pre
        className={`scrollbar-thin mt-3 flex-1 overflow-auto rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] p-3 text-xs leading-relaxed whitespace-pre-wrap text-[color:var(--color-cream)] ${
          expanded ? "max-h-96" : "max-h-32"
        }`}
      >
{a.prompt_text}
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
              await navigator.clipboard.writeText(a.prompt_text);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            } catch {}
          }}
          className="flex min-h-11 items-center gap-1.5 rounded-lg bg-[color:var(--color-ember)] px-3.5 py-2 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy"}
        </button>
        {a.prompt_id != null && (
          <Link
            to="/"
            search={{ p: a.prompt_id }}
            aria-label="Use in builder"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] p-2 text-[color:var(--color-cream-dim)] hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-gold)]"
          >
            <Hammer size={15} />
          </Link>
        )}
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
