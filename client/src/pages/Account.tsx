import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, CalendarClock, Check, CheckCircle2, FolderPlus, KeyRound, Loader2, RefreshCw, Save, ShieldCheck, Tag, UserRound, History } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { trpc } from "@/lib/trpc";

export function formatUnlockDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export type RedemptionFeedback = "success" | "invalid" | "already_used" | "auth_required" | "service_error";

export function getRedemptionCopy(status: RedemptionFeedback) {
  if (status === "success") return { title: "Unlock code accepted.", detail: "Your lifetime access is now attached to this account." };
  if (status === "already_used") return { title: "This unlock code has already been used.", detail: "Each code can be redeemed once and cannot be transferred to another account." };
  if (status === "auth_required") return { title: "Sign in required.", detail: "Sign in to the account that should receive lifetime access, then redeem the code again." };
  if (status === "service_error") return { title: "We could not check that code.", detail: "The authentication or access service did not respond. Please try again in a moment." };
  return { title: "Invalid unlock code.", detail: "Check the code and try again. Codes use the format PF-XXXXXX-XXXXXX." };
}

export default function Account() {
  const [, navigate] = useLocation();
  const { user, loading } = useSupabaseAuth();
  const profile = trpc.profile.me.useQuery(undefined, { enabled: !!user, retry: false });
  const utils = trpc.useUtils();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [redemptionState, setRedemptionState] = useState<"idle" | RedemptionFeedback>("idle");
  const [collectionName, setCollectionName] = useState("");
  const [tagDrafts, setTagDrafts] = useState<Record<number, string>>({});
  const [collectionForPrompt, setCollectionForPrompt] = useState<Record<number, string>>({});
  const googleName = typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name : typeof user?.user_metadata?.name === "string" ? user.user_metadata.name : undefined;

  const savedPrompts = trpc.prompts.list.useQuery(undefined, { enabled: !!user, retry: false });
  const collections = trpc.collections.list.useQuery(undefined, { enabled: !!user, retry: false });
  const createCollection = trpc.collections.create.useMutation({ onSuccess: () => { setCollectionName(""); void collections.refetch(); toast.success("Collection created"); } });
  const updateTags = trpc.prompts.tags.useMutation({ onSuccess: () => { void savedPrompts.refetch(); toast.success("Tags updated"); } });
  const createVersion = trpc.prompts.createVersion.useMutation({ onSuccess: () => toast.success("Version snapshot saved") });
  const addToCollection = trpc.collections.add.useMutation({ onSuccess: () => toast.success("Added to collection") });

  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => { void profile.refetch(); toast.success("Profile updated"); },
  });

  const redeemCode = trpc.profile.redeemCode.useMutation({
    onSuccess: result => {
      setRedemptionState(result.status);
      if (result.status === "success") {
        setCode("");
        void profile.refetch();
        void utils.profile.me.invalidate();
        toast.success("Workshop unlocked");
      }
    },
    onError: error => {
      const code = error.data?.code;
      setRedemptionState(code === "UNAUTHORIZED" ? "auth_required" : "service_error");
    },
  });

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [loading, user, navigate]);
  useEffect(() => { if (profile.data?.name) setName(profile.data.name); }, [profile.data?.name]);

  if (!user) return null;
  const isUnlocked = profile.data?.isUnlocked === 1;

  return <main className="account-page personal-shelf">
    <div className="account-page-head">
      <Link href="/" className="back-link"><ArrowLeft size={15}/> Back to builder</Link>
      <div className="eyebrow"><span className="pulse"/> PERSONAL SHELF / 04</div>
      <h1>Welcome back{googleName ? `, ${googleName.split(" ")[0]}` : ""}.</h1>
      <p>Manage your profile and member access.</p>
    </div>
    <div className="account-grid">
      <section className="settings-card">
        <div className="section-kicker">PROFILE CARD <span>Private account details</span></div>
        <div className="profile-identity"><div className="large-avatar">{(name || googleName || user.email || "P").slice(0, 1).toUpperCase()}</div><div><strong>{name || googleName || "PromptForge member"}</strong><span>{user.email}</span></div><button className="icon-action avatar-refresh" type="button" onClick={() => { void profile.refetch(); toast.success("Profile refreshed"); }} disabled={profile.isFetching} aria-label="Refresh profile" title="Refresh profile"><RefreshCw size={14} className={profile.isFetching ? "spin" : ""}/></button></div>
        <label className="field"><span>Display name</span><div className="input-with-icon"><UserRound size={15}/><input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"/></div></label>
        <button className="forge-button" onClick={() => updateProfile.mutate({ name: name.trim() })} disabled={!name.trim() || updateProfile.isPending}><Save size={16}/>{updateProfile.isPending ? "Saving profile" : "Save profile"}</button>
      </section>
      <section className="settings-card unlock-card">
        <div className="section-kicker">ACCESS STATUS <span>Lifetime access</span></div>
        <div className="unlock-status"><div className={isUnlocked ? "unlock-icon active" : "unlock-icon"}>{isUnlocked ? <CheckCircle2 size={20}/> : <KeyRound size={20}/>}</div><div><strong>{isUnlocked ? "Member access active" : "Free workshop access"}</strong><span>{isUnlocked ? "Your library and forging access are unlocked." : "Redeem a valid code to unlock the full workshop."}</span></div></div>

        {isUnlocked && profile.data?.unlockedAt && <div className="unlock-history" aria-label="Unlock history"><div className="history-row"><CalendarClock size={15}/><span>Unlocked</span><strong>{formatUnlockDate(profile.data.unlockedAt)}</strong></div><div className="history-row"><KeyRound size={15}/><span>Code used</span><code>{profile.data.unlockCode || "—"}</code></div></div>}

        {!isUnlocked && <div className="code-entry"><label className="field"><span>Unlock code</span><input value={code} onChange={e => { setCode(e.target.value.toUpperCase()); setRedemptionState("idle"); }} placeholder="PF-XXXX-XXXX" aria-describedby="redemption-help"/></label><button className="forge-button" onClick={() => redeemCode.mutate({ code })} disabled={!code.trim() || redeemCode.isPending}>{redeemCode.isPending ? <Loader2 className="spin" size={16}/> : <KeyRound size={16}/>} {redeemCode.isPending ? "Checking code" : "Redeem code"}</button></div>}

        {redemptionState !== "idle" && <div className={`redemption-feedback ${redemptionState === "success" ? "success unlock-success" : "error"}`} role={redemptionState === "success" ? "status" : "alert"}>{redemptionState === "success" ? <Check size={16}/> : <AlertCircle size={16}/>}<div><strong>{getRedemptionCopy(redemptionState).title}</strong><span>{getRedemptionCopy(redemptionState).detail}</span></div></div>}
        <div id="redemption-help" className="security-note"><ShieldCheck size={14}/> Codes are single-use and tied to the signed-in account.</div>
      </section>
    </div>
    <section className="settings-card personal-library-tools">
      <div className="section-kicker">PERSONAL LIBRARY <span>{savedPrompts.data?.length ?? 0} saved work orders</span></div>
      <div className="collection-create"><div><strong>Collections</strong><span>Group your saved work by campaign, client, or workflow.</span></div><div className="collection-create-form"><input value={collectionName} onChange={(event) => setCollectionName(event.target.value)} placeholder="New collection name" aria-label="New collection name"/><button className="card-action" onClick={() => createCollection.mutate({ name: collectionName.trim() })} disabled={!collectionName.trim() || createCollection.isPending}><FolderPlus size={14}/> {createCollection.isPending ? "Creating" : "Create"}</button></div></div>
      {collections.data?.length ? <div className="collection-chips">{collections.data.map((collection) => <span className="collection-chip" key={collection.id}>{collection.name}</span>)}</div> : <p className="shelf-empty">Create your first collection to keep related prompts together.</p>}
      <div className="saved-prompt-management">{savedPrompts.isLoading ? <span>Loading saved work orders…</span> : savedPrompts.data?.length ? savedPrompts.data.slice(0, 8).map((item) => <div className="saved-management-row" key={item.id}><div><strong>{item.title}</strong><span>{item.category}</span></div><label className="tag-input"><Tag size={13}/><input value={tagDrafts[item.id] ?? item.tags ?? ""} onChange={(event) => setTagDrafts(current => ({ ...current, [item.id]: event.target.value }))} placeholder="tags, comma separated" aria-label={`Tags for ${item.title}`}/></label><button className="icon-action" onClick={() => updateTags.mutate({ id: item.id, tags: (tagDrafts[item.id] ?? item.tags ?? "").trim() })} title="Save tags" aria-label={`Save tags for ${item.title}`}><Save size={14}/></button>{collections.data?.length ? <select className="collection-select" value={collectionForPrompt[item.id] ?? ""} onChange={(event) => { const value = event.target.value; setCollectionForPrompt(current => ({ ...current, [item.id]: value })); if (value) addToCollection.mutate({ collectionId: Number(value), savedPromptId: item.id }); }} aria-label={`Add ${item.title} to collection`}><option value="">Collection</option>{collections.data.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}</select> : null}<button className="icon-action" onClick={() => createVersion.mutate({ savedPromptId: item.id })} title="Create immutable version snapshot" aria-label={`Create version for ${item.title}`}><History size={14}/></button></div>) : <span>Save a forged prompt to manage it here.</span>}</div>
    </section>
  </main>;
}
