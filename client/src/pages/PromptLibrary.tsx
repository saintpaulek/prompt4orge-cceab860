// Production catalog marker: this page is the database-backed prompt library.
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, LockKeyhole, Search, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { trpc } from "@/lib/trpc";

const categories = ["ALL", "SMM", "VA Tasks", "Customer Service", "Automation Logic", "SEO", "Email Marketing", "Sales & Copywriting", "Content Strategy", "Image Generation", "Video & Shorts", "Blogging & Articles", "Ecommerce & Product", "Freelancing & Clients", "Branding & Identity", "Ads & Paid Media", "ChatGPT Productivity", "Business & Strategy", "Education & Learning", "Personal Development", "Finance & Admin"];

type AccessFilter = "ALL" | "FREE" | "LOCKED";

export default function PromptLibrary() {
  const { user } = useSupabaseAuth();
  const profile = trpc.profile.me.useQuery(undefined, { enabled: !!user, retry: false });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [access, setAccess] = useState<AccessFilter>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const input = useMemo(() => ({ search: query.trim() || undefined, category, access, limit: 60, offset: 0 }), [query, category, access]);
  const catalog = trpc.catalog.list.useQuery(input, { retry: false });
  const isUnlocked = profile.data?.isUnlocked === 1 || profile.data?.role === "admin";
  const items = catalog.data?.items ?? [];

  return <main className="simple-page library-data-page">
    <div className="page-intro editorial-intro"><div className="intro-side">SHELF / 01<br/><span>DATABASE CATALOG</span></div><div><div className="eyebrow">PROMPT LIBRARY / {catalog.data?.total?.toLocaleString() ?? "3,000"}</div><h1>Borrow a head start.</h1><p>Search the live PromptForge catalog, filter by discipline or access level, and open a work order when you are ready to build.</p></div></div>
    <section className="catalog-toolbar"><div className="search"><Search size={17}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search 3,000 prompts..." aria-label="Search prompts"/></div><label className="catalog-select"><span>Category</span><select value={category} onChange={event => setCategory(event.target.value)}>{categories.map(item => <option key={item} value={item}>{item === "ALL" ? "All categories" : item}</option>)}</select><ChevronDown size={15}/></label></section>
    <div className="access-tabs" role="tablist" aria-label="Prompt access filter">{(["ALL", "FREE", "LOCKED"] as AccessFilter[]).map(item => <button key={item} className={access === item ? "active" : ""} onClick={() => setAccess(item)}>{item === "ALL" ? "All prompts" : item === "FREE" ? "Free prompts" : "Locked prompts"}</button>)}</div>
    <div className="catalog-meta"><span>{catalog.isLoading ? "Loading catalog…" : `${items.length.toLocaleString()} prompts loaded`}</span><span>{isUnlocked ? "MEMBER ACCESS" : "FREE WORKSHOP VIEW"}</span></div>
    {catalog.isError ? <div className="catalog-empty"><BookOpen size={28}/><strong>Catalog connection interrupted.</strong><span>Refresh the page and try again.</span></div> : items.length ? <div className="library-grid live-library-grid">{items.map((item, index) => { const locked = item.access === "LOCKED" && !isUnlocked; const expanded = expandedId === item.id; return <article className={locked ? "library-card locked-card" : "library-card"} key={item.id}><div className="card-stamp"><span>{locked ? "LOCKED WORK ORDER" : item.access === "FREE" ? "FREE WORK ORDER" : "MEMBER WORK ORDER"}</span><span>PF-{item.id}</span></div><div className="card-meta"><span>{item.category}</span><span>{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span></div><h3>{item.title}</h3><p>{item.role}. Tagged {item.tags}.</p>{expanded && !locked && <pre className="catalog-prompt-preview">{item.promptBody}</pre>}<div className="card-bottom">{locked ? <button className="card-action" onClick={() => toast.info("Unlock this work order from your account")}>Unlock to view <LockKeyhole size={14}/></button> : <button className="card-action" onClick={() => setExpandedId(expanded ? null : item.id)}>{expanded ? "Hide work order" : "View work order"} <ArrowRight size={14}/></button>}{locked && <LockKeyhole size={16} className="lock"/>}</div></article>; })}</div> : <div className="catalog-empty"><Sparkles size={28}/><strong>No prompts match this filter.</strong><span>Try another category, access level, or search term.</span></div>}
    <div className="catalog-footer"><span>Showing the first {Math.min(items.length, 60)} of {catalog.data?.total?.toLocaleString() ?? "3,000"} catalog records.</span>{!user && <Link href="/auth" className="text-link">Sign in to save prompts <ArrowRight size={15}/></Link>}</div>
  </main>;
}
