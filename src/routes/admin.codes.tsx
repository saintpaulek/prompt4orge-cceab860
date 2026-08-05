import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, KeyRound, Loader2, Plus, RefreshCw } from "lucide-react";
import { adminGenerateCodes, adminListCodes } from "@/lib/codes.functions";
import { inputCls } from "@/components/pf/ui";

export const Route = createFileRoute("/admin/codes")({
  head: () => ({
    meta: [
      { title: "Unlock code admin — PromptForge" },
      { name: "description", content: "Private area for generating PromptForge unlock codes." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminCodesPage,
});

type CodeRow = {
  id: string;
  code: string;
  is_used: boolean;
  used_at: string | null;
  created_at: string;
  note: string | null;
};

function AdminCodesPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [rows, setRows] = useState<CodeRow[]>([]);
  const [fresh, setFresh] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const listCodes = useServerFn(adminListCodes);
  const genCodes = useServerFn(adminGenerateCodes);

  const load = async (pw: string) => {
    setBusy(true); setErr("");
    try {
      const res = await listCodes({ data: { password: pw } });
      setRows(res.codes as CodeRow[]);
      setAuthed(true);
    } catch {
      setErr("Wrong password.");
      setAuthed(false);
    } finally {
      setBusy(false);
    }
  };

  const generate = async (count: number) => {
    setBusy(true); setErr("");
    try {
      const res = await genCodes({ data: { password, count, note: note.trim() || undefined } });
      const created = res.codes as CodeRow[];
      setFresh(created.map((c) => c.code));
      setRows((prev) => [...created, ...prev]);
    } catch {
      setErr("Could not generate codes. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(fresh.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm py-10">
        <h1 className="font-display text-3xl">ADMIN — UNLOCK CODES</h1>
        <p className="mt-2 text-sm text-[color:var(--color-cream-dim)]">Enter the admin password to continue.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErr(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") void load(password); }}
          placeholder="Admin password"
          className={`${inputCls} mt-4`}
        />
        {err && <div className="mt-2 text-xs text-[color:var(--color-ember)]">{err}</div>}
        <button
          type="button"
          disabled={busy}
          onClick={() => void load(password)}
          className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--color-ember)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-bg-deep)] disabled:opacity-60"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />} Sign in
        </button>
      </div>
    );
  }

  const unused = rows.filter((r) => !r.is_used).length;

  return (
    <div className="py-2">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display truncate text-3xl">UNLOCK CODES</h1>
          <p className="text-xs text-[color:var(--color-cream-dim)]">{rows.length} total · {unused} unused</p>
        </div>
        <button
          type="button"
          onClick={() => void load(password)}
          className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border border-[color:var(--color-line)] px-3 py-2 text-sm text-[color:var(--color-cream-dim)]"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <section className="mt-5 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-4">
        <label className="mb-1.5 block text-xs tracking-wider text-[color:var(--color-gold)] uppercase">
          Batch note (optional)
        </label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. For Instagram creators, Launch giveaway"
          className={inputCls}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void generate(10)}
            className="flex min-h-11 items-center gap-1.5 rounded-lg bg-[color:var(--color-ember)] px-4 py-2 text-sm font-semibold text-[color:var(--color-bg-deep)] disabled:opacity-60"
          >
            <Plus size={15} /> Generate 10 new codes
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void generate(1)}
            className="flex min-h-11 items-center gap-1.5 rounded-lg border border-[color:var(--color-gold)] px-4 py-2 text-sm font-semibold text-[color:var(--color-gold)] disabled:opacity-60"
          >
            <Plus size={15} /> Generate 1 code
          </button>
        </div>
        {err && <div className="mt-2 text-xs text-[color:var(--color-ember)]">{err}</div>}

        {fresh.length > 0 && (
          <div className="mt-4 rounded-xl border border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold text-[color:var(--color-gold)] uppercase">
                New codes ({fresh.length})
              </div>
              <button
                type="button"
                onClick={() => void copyAll()}
                className="flex min-h-9 items-center gap-1.5 rounded-lg bg-[color:var(--color-ember)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-bg-deep)]"
              >
                <Copy size={13} /> {copied ? "Copied" : "Copy all"}
              </button>
            </div>
            <ul className="mt-2 space-y-1 font-mono text-sm text-[color:var(--color-cream)]">
              {fresh.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        )}
      </section>

      <section className="mt-5 overflow-x-auto rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)]">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-xs text-[color:var(--color-cream-dim)] uppercase">
            <tr className="border-b border-[color:var(--color-line)]">
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-[color:var(--color-line)]/60">
                <td className="px-3 py-2 font-mono">{r.code}</td>
                <td className="px-3 py-2">
                  <span className={r.is_used ? "text-[color:var(--color-cream-dim)]" : "text-[color:var(--color-gold)]"}>
                    {r.is_used ? "used" : "unused"}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-[color:var(--color-cream-dim)]">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 text-xs text-[color:var(--color-cream-dim)]">{r.note ?? "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-6 text-center text-sm text-[color:var(--color-cream-dim)]">No codes yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
