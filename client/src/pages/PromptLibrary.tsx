// Production catalog marker: this page is the database-backed prompt library.
// Library discovery upgrade propagation marker: c837bcd7-refresh-2.
import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, ChevronsUpDown, LockKeyhole, Search, X } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { trpc } from "@/lib/trpc";

const categories = ["ALL", "SMM", "VA Tasks", "Customer Service", "Automation Logic", "SEO", "Email Marketing", "Sales & Copywriting", "Content Strategy", "Image Generation", "Video & Shorts", "Blogging & Articles", "Ecommerce & Product", "Freelancing & Clients", "Branding & Identity", "Ads & Paid Media", "ChatGPT Productivity", "Business & Strategy", "Education & Learning", "Personal Development", "Finance & Admin", "Banking & Fintech Engagement"];

type AccessFilter = "ALL" | "FREE" | "LOCKED";
type CatalogSort = "NEWEST" | "OLDEST" | "POPULAR";

export const CATALOG_SKELETON_COUNT = 6;
export const getCatalogRetryLabel = (isFetching: boolean) => isFetching ? "Retrying…" : "Retry catalog";
export const buildCatalogInput = (search: string, category: string, access: AccessFilter, sort: CatalogSort = "NEWEST", offset = 0) => ({ search: search.trim() || undefined, category, access, sort, limit: 60, offset });
export const getRetryFeedback = (success: boolean, itemCount = 0) => success ? { title: "Catalog refreshed", description: `${itemCount} work orders are ready.` } : { title: "Catalog refresh failed", description: "Check your connection and try again." };

export function CatalogSkeleton() {
  return <div className="library-grid live-library-grid catalog-skeleton" aria-label="Loading prompt catalog" aria-busy="true">{Array.from({ length: CATALOG_SKELETON_COUNT }, (_, index) => <article className="library-card skeleton-card" key={index}><div className="skeleton-line skeleton-stamp"/><div className="skeleton-line skeleton-meta"/><div className="skeleton-line skeleton-title"/><div className="skeleton-line skeleton-copy"/><div className="skeleton-line skeleton-copy short"/><div className="skeleton-line skeleton-action"/></article>)}</div>;
}

export function CatalogErrorState({ isFetching, onRetry }: { isFetching: boolean; onRetry: () => void | Promise<void> }) {
  return <div className="catalog-empty catalog-error" role="alert"><BookOpen size={28}/><strong>Catalog unavailable.</strong><span>We could not load the prompt shelf. Try again.</span><button className="card-action retry-catalog" onClick={onRetry} disabled={isFetching} aria-busy={isFetching}>{getCatalogRetryLabel(isFetching)} <ArrowRight size={14}/></button></div>;
}

export function CatalogEmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return <div className="catalog-empty catalog-no-results"><div className="empty-illustration" aria-hidden="true"><svg viewBox="0 0 120 100" role="presentation"><path d="M16 76h88"/><path d="M24 76V28h72v48"/><path d="M33 40h54M33 51h54M33 62h31"/><path d="m80 60 11 11-11 11-11-11 11-11Z"/><path d="m80 65 0 12"/></svg></div><strong>{hasFilters ? "No work orders match this search." : "The shelf is ready for its first work order."}</strong><span>{hasFilters ? "Try another keyword or clear the active filters." : "The catalog is available, but no items are currently listed."}</span>{hasFilters && <button className="card-action" onClick={onClear}>Clear filters <X size={14}/></button>}</div>;
}

export default function PromptLibrary() {
  const { user } = useSupabaseAuth();
  const profile = trpc.profile.me.useQuery(undefined, { enabled: !!user, retry: false });
  const [query, setQuery] = useState(() => typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("search") ?? "");
  const [category, setCategory] = useState(() => typeof window === "undefined" ? "ALL" : new URLSearchParams(window.location.search).get("category") ?? "ALL");
  const [access, setAccess] = useState<AccessFilter>("ALL");
  const [sort, setSort] = useState<CatalogSort>(() => typeof window === "undefined" ? "NEWEST" : (new URLSearchParams(window.location.search).get("sort") as CatalogSort) || "NEWEST");
  const [offset, setOffset] = useState(0);
  const [loadedItems, setLoadedItems] = useState<Array<{ id: string; title: string; category: string; role: string; tags: string; access: "FREE" | "LOCKED"; promptBody: string }>>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const input = useMemo(() => buildCatalogInput(query, category, access, sort, offset), [query, category, access, sort, offset]);
  const catalog = trpc.catalog.list.useQuery(input, { retry: 2, retryDelay: attempt => Math.min(800 * (attempt + 1), 2400), refetchOnMount: "always", refetchOnWindowFocus: true });
  const isUnlocked = profile.data?.isUnlocked === 1 || profile.data?.role === "admin";
  const items = loadedItems.length ? loadedItems : (catalog.data?.items ?? []);
  const total = catalog.data?.total ?? 0;
  const hasMore = items.length < total;
  const hasFilters = Boolean(query.trim()) || category !== "ALL" || access !== "ALL";
  useEffect(() => {
    setOffset(0);
    setLoadedItems([]);
    setExpandedId(null);
  }, [query, category, access, sort]);
  useEffect(() => {
    if (!catalog.data) return;
    setLoadedItems(current => offset === 0 ? catalog.data.items : [...current, ...catalog.data.items.filter(item => !current.some(existing => existing.id === item.id))]);
  }, [catalog.data, offset]);
  const clearFilters = () => { setQuery(""); setCategory("ALL"); setAccess("ALL"); setSort("NEWEST"); };
  const retryCatalog = async () => {
    const result = await catalog.refetch();
    if (result.isError) {
      const feedback = getRetryFeedback(false);
      toast.error(feedback.title, { description: feedback.description });
      return;
    }
    const feedback = getRetryFeedback(true, result.data?.items.length ?? 0);
    toast.success(feedback.title, { description: feedback.description });
  };

  return <main className="simple-page library-data-page">
    <div className="page-intro editorial-intro"><div className="intro-side">SHELF / 01<br/><span>DATABASE CATALOG</span></div><div><div className="eyebrow">PROMPT LIBRARY / {catalog.data?.total?.toLocaleString() ?? "3,000"}</div><h1>Start with a proven brief.</h1><p>Search 3,000 prompts by discipline or access level, then open the structure you need.</p></div></div>
    <section className="catalog-toolbar"><div className="search"><Search size={17}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search 3,000 prompts..." aria-label="Search prompts"/><span className="search-count" aria-live="polite">{query ? `${items.length} matches` : "Search"}</span>{query && <button className="clear-search" type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={15}/></button>}</div><label className="catalog-select"><span>Category</span><select value={category} onChange={event => setCategory(event.target.value)}>{categories.map(item => <option key={item} value={item}>{item === "ALL" ? "All categories" : item}</option>)}</select><ChevronDown size={15}/></label><label className="catalog-select sort-select"><span>Sort by</span><select value={sort} onChange={event => setSort(event.target.value as CatalogSort)}><option value="NEWEST">Date added: newest</option><option value="OLDEST">Date added: oldest</option><option value="POPULAR">Popularity / featured</option></select><ChevronsUpDown size={15}/></label></section>
    <div className="access-tabs" role="tablist" aria-label="Prompt access filter">{(["ALL", "FREE", "LOCKED"] as AccessFilter[]).map(item => <button key={item} className={access === item ? "active" : ""} onClick={() => setAccess(item)}>{item === "ALL" ? "All prompts" : item === "FREE" ? "Free prompts" : "Locked prompts"}</button>)}</div>
    <div className="catalog-meta"><span>{catalog.isLoading ? "Loading prompts…" : `${items.length.toLocaleString()} shown`}</span><span>{isUnlocked ? "MEMBER ACCESS" : "FREE VIEW"}</span></div>
    {catalog.isLoading && !items.length ? <CatalogSkeleton/> : catalog.isError ? <CatalogErrorState isFetching={catalog.isFetching} onRetry={retryCatalog}/> : items.length ? <div className="library-grid live-library-grid">{items.map((item, index) => { const locked = item.access === "LOCKED" && !isUnlocked; const expanded = expandedId === item.id; return <article className={locked ? "library-card locked-card" : "library-card"} key={item.id}><div className="card-stamp"><span>{locked ? "LOCKED WORK ORDER" : item.access === "FREE" ? "FREE WORK ORDER" : "MEMBER WORK ORDER"}</span><span>PF-{item.id}</span></div><div className="card-meta"><span>{item.category}</span><span>{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span></div><h3>{item.title}</h3><p>{item.role}. Tagged {item.tags}.</p>{expanded && !locked && <pre className="catalog-prompt-preview">{item.promptBody}</pre>}<div className="card-bottom">{locked ? <button className="card-action" onClick={() => toast.info("Unlock this work order from your account")}>Unlock to view <LockKeyhole size={14}/></button> : <button className="card-action" onClick={() => setExpandedId(expanded ? null : item.id)}>{expanded ? "Hide work order" : "View work order"} <ArrowRight size={14}/></button>}{locked && <LockKeyhole size={16} className="lock"/>}</div></article>; })}</div> : <CatalogEmptyState hasFilters={hasFilters} onClear={clearFilters}/>}
    {items.length > 0 && hasMore && <div className="catalog-load-more"><button className="card-action load-more" onClick={() => setOffset(items.length)} disabled={catalog.isFetching} aria-busy={catalog.isFetching}>{catalog.isFetching ? "Loading more…" : "Load more work orders"} <ArrowRight size={14}/></button><span>{items.length.toLocaleString()} of {total.toLocaleString()} loaded</span></div>}
    <div className="catalog-footer"><span aria-live="polite">{catalog.isFetching && offset > 0 ? "Loading more work orders…" : catalog.isFetching ? "Refreshing catalog…" : `Showing ${items.length.toLocaleString()} of ${total.toLocaleString()} prompts.`}</span>{!user && <Link href="/auth" className="text-link">Sign in to save prompts <ArrowRight size={15}/></Link>}</div>
  </main>;
}
