import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Clipboard, Copy, KeyRound, Loader2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { trpc } from "@/lib/trpc";

function formatDate(value: Date | string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminUnlocks() {
  const [, navigate] = useLocation();
  const { user, loading } = useSupabaseAuth();
  const profile = trpc.profile.me.useQuery(undefined, { enabled: !!user, retry: false });
  const isAdmin = profile.data?.role === "admin";
  const codes = trpc.admin.unlocks.list.useQuery({ limit: 100 }, { enabled: isAdmin, retry: false });
  const [count, setCount] = useState("10");
  const [generated, setGenerated] = useState<string[]>([]);
  const generate = trpc.admin.unlocks.generate.useMutation({
    onSuccess: ({ codes: nextCodes }) => {
      setGenerated(nextCodes);
      void codes.refetch();
      toast.success(`${nextCodes.length} unlock code${nextCodes.length === 1 ? "" : "s"} forged`);
    },
    onError: error => toast.error(error.message || "Could not generate unlock codes"),
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!profile.isLoading && profile.data && profile.data.role !== "admin") navigate("/account");
  }, [profile.data, profile.isLoading, navigate]);

  const stats = useMemo(() => {
    const rows = codes.data ?? [];
    return { total: rows.length, available: rows.filter(row => !row.isUsed).length, used: rows.filter(row => row.isUsed).length };
  }, [codes.data]);

  const copyCode = async (code: string) => {
    await navigator.clipboard?.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const copyAll = async () => {
    if (!generated.length) return;
    await navigator.clipboard?.writeText(generated.join("\n"));
    toast.success("Generated codes copied");
  };

  if (loading || profile.isLoading) return <main className="account-page"><div className="page-loading"><Loader2 className="spin" size={20}/> Checking admin access…</div></main>;
  if (!user || !isAdmin) return <main className="account-page"><div className="access-denied"><ShieldCheck size={28}/><div><h1>Admin access required.</h1><p>This workshop door is reserved for PromptForge administrators.</p></div><Link href="/account" className="text-link">Return to account <ArrowLeft size={15}/></Link></div></main>;

  return <main className="admin-page access-bench">
    <div className="admin-head"><Link href="/account" className="back-link"><ArrowLeft size={15}/> Back to account</Link><div className="eyebrow"><span className="pulse"/> ACCESS BENCH / 05</div><div className="admin-title-row"><div><h1>Forge unlock codes.</h1><p>Create one-time member keys, distribute them securely, and audit their status.</p></div><div className="admin-badge"><ShieldCheck size={15}/> ADMIN ONLY</div></div></div>
    <section className="admin-stats"><div className="admin-stat"><span>Total codes</span><strong>{stats.total}</strong><small>Last 100 generated</small></div><div className="admin-stat"><span>Available</span><strong>{stats.available}</strong><small>Ready to distribute</small></div><div className="admin-stat"><span>Redeemed</span><strong>{stats.used}</strong><small>Already tied to members</small></div></section>
    <section className="admin-grid"><div className="admin-panel generator-panel"><div className="section-kicker">CODE PRESS <span>Single-use keys</span></div><div className="panel-icon"><KeyRound size={20}/></div><h2>Press a new batch.</h2><p>Each key is unique, stored securely, and unlocks one member account once.</p><label className="field"><span>How many codes?</span><select value={count} onChange={event => setCount(event.target.value)}><option value="1">1 code</option><option value="5">5 codes</option><option value="10">10 codes</option><option value="25">25 codes</option><option value="50">50 codes</option></select></label><button className="forge-button" onClick={() => generate.mutate({ count: Number(count) })} disabled={generate.isPending}><Sparkles size={16}/>{generate.isPending ? "Forging batch…" : "Generate unlock codes"}</button><div className="security-note"><ShieldCheck size={14}/> Codes are shown once after generation. Copy them into your secure distribution workflow.</div></div><div className="admin-panel generated-panel"><div className="section-kicker">FRESH FROM THE PRESS <span>{generated.length ? `${generated.length} new codes` : "Awaiting a batch"}</span></div>{generated.length ? <><div className="generated-toolbar"><strong>Generated codes</strong><button onClick={copyAll}><Clipboard size={14}/> Copy all</button></div><div className="generated-list">{generated.map(code => <div className="generated-code" key={code}><code>{code}</code><button aria-label={`Copy ${code}`} onClick={() => void copyCode(code)}><Copy size={15}/></button></div>)}</div><div className="generated-note"><Check size={14}/> Keep this list private. Codes become unusable after redemption.</div></> : <div className="empty-generated"><KeyRound size={28}/><strong>No fresh codes yet.</strong><span>Choose a batch size and press generate to create a new inventory.</span></div>}</div></section>
    <section className="admin-panel inventory-panel"><div className="inventory-head"><div><div className="section-kicker">CODE INVENTORY <span>Audit trail</span></div><h2>Recent keys.</h2></div><button className="refresh-button" onClick={() => void codes.refetch()} disabled={codes.isFetching}><Loader2 size={14} className={codes.isFetching ? "spin" : ""}/> Refresh</button></div>{codes.isLoading ? <div className="page-loading"><Loader2 className="spin" size={18}/> Loading inventory…</div> : codes.data?.length ? <div className="inventory-table"><div className="inventory-row inventory-labels"><span>Code</span><span>Status</span><span>Created</span><span>Used by</span><span></span></div>{codes.data.map(row => <div className="inventory-row" key={row.id}><code>{row.code}</code><span className={row.isUsed ? "inventory-status used" : "inventory-status available"}>{row.isUsed ? "Redeemed" : "Available"}</span><span>{formatDate(row.createdAt)}</span><span>{row.usedBy ? `Member #${row.usedBy}` : "—"}</span><button aria-label={`Copy ${row.code}`} onClick={() => void copyCode(row.code)}><Copy size={14}/></button></div>)}</div> : <div className="empty-generated"><Users size={28}/><strong>No codes in inventory.</strong><span>Generate your first batch above.</span></div>}</section>
  </main>;
}
