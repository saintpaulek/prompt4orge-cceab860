import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, CalendarClock, Check, CheckCircle2, KeyRound, Loader2, Save, ShieldCheck, UserRound } from "lucide-react";
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

export function getRedemptionCopy(status: "success" | "invalid" | "already_used") {
  if (status === "success") return { title: "Unlock code accepted.", detail: "Your lifetime access is now attached to this account." };
  if (status === "already_used") return { title: "This unlock code has already been used.", detail: "Each code can be redeemed once and cannot be transferred to another account." };
  return { title: "Invalid unlock code.", detail: "Check the code and try again. Codes use the format PF-XXXXXX-XXXXXX." };
}

export default function Account() {
  const [, navigate] = useLocation();
  const { user, loading } = useSupabaseAuth();
  const profile = trpc.profile.me.useQuery(undefined, { enabled: !!user, retry: false });
  const utils = trpc.useUtils();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [redemptionState, setRedemptionState] = useState<"idle" | "success" | "invalid" | "already_used">("idle");

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
    onError: () => setRedemptionState("invalid"),
  });

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [loading, user, navigate]);
  useEffect(() => { if (profile.data?.name) setName(profile.data.name); }, [profile.data?.name]);

  if (!user) return null;
  const isUnlocked = profile.data?.isUnlocked === 1;

  return <main className="account-page personal-shelf">
    <div className="account-page-head">
      <Link href="/" className="back-link"><ArrowLeft size={15}/> Back to builder</Link>
      <div className="eyebrow"><span className="pulse"/> PERSONAL SHELF / 04</div>
      <h1>Your workshop shelf.</h1>
      <p>Manage your profile and member access.</p>
    </div>
    <div className="account-grid">
      <section className="settings-card">
        <div className="section-kicker">PROFILE CARD <span>Private account details</span></div>
        <div className="profile-identity"><div className="large-avatar">{(name || user.email || "P").slice(0, 1).toUpperCase()}</div><div><strong>{name || "PromptForge member"}</strong><span>{user.email}</span></div></div>
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
  </main>;
}
