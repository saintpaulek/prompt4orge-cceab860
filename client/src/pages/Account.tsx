import { useEffect, useState } from "react";
import { ArrowLeft, Check, KeyRound, Loader2, Save, ShieldCheck, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { trpc } from "@/lib/trpc";

export default function Account() {
  const [, navigate] = useLocation();
  const { user, loading } = useSupabaseAuth();
  const profile = trpc.profile.me.useQuery(undefined, { enabled: !!user, retry: false });
  const utils = trpc.useUtils();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const updateProfile = trpc.profile.update.useMutation({ onSuccess: () => { void profile.refetch(); toast.success("Profile updated"); } });
  const redeemCode = trpc.profile.redeemCode.useMutation({ onSuccess: ({ success }) => { setMessage(success ? "Unlock code accepted. Your workshop is now unlocked." : "That unlock code is not valid or has already been used."); if (success) { void profile.refetch(); void utils.profile.me.invalidate(); toast.success("Workshop unlocked"); } } });
  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [loading, user, navigate]);
  useEffect(() => { if (profile.data?.name) setName(profile.data.name); }, [profile.data?.name]);
  if (!user) return null;
  return <main className="account-page"><div className="account-page-head"><Link href="/" className="back-link"><ArrowLeft size={15}/> Back to builder</Link><div className="eyebrow"><span className="pulse"/> YOUR WORKSHOP / 04</div><h1>Account settings.</h1><p>Keep your identity, access, and saved materials in order.</p></div><div className="account-grid"><section className="settings-card"><div className="section-kicker">PROFILE CARD <span>Visible only to you</span></div><div className="profile-identity"><div className="large-avatar">{(name || user.email || "P").slice(0, 1).toUpperCase()}</div><div><strong>{name || "PromptForge member"}</strong><span>{user.email}</span></div></div><label className="field"><span>Display name</span><div className="input-with-icon"><UserRound size={15}/><input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"/></div></label><button className="forge-button" onClick={() => updateProfile.mutate({ name: name.trim() })} disabled={!name.trim() || updateProfile.isPending}><Save size={16}/>{updateProfile.isPending ? "Saving profile" : "Save profile"}</button></section><section className="settings-card unlock-card"><div className="section-kicker">ACCESS STATUS <span>Lifetime unlock</span></div><div className="unlock-status"><div className={profile.data?.isUnlocked ? "unlock-icon active" : "unlock-icon"}><KeyRound size={20}/></div><div><strong>{profile.data?.isUnlocked ? "Member access active" : "Free workshop access"}</strong><span>{profile.data?.isUnlocked ? "Your library and forging access are unlocked." : "Redeem a valid code to unlock the full workshop."}</span></div></div><div className="code-entry"><label className="field"><span>Unlock code</span><input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="PF-XXXX-XXXX" disabled={!!profile.data?.isUnlocked}/></label><button className="forge-button" onClick={() => redeemCode.mutate({ code })} disabled={!code.trim() || !!profile.data?.isUnlocked || redeemCode.isPending}>{redeemCode.isPending ? <Loader2 className="spin" size={16}/> : <KeyRound size={16}/>} Redeem code</button></div>{message && <div className={message.includes("accepted") ? "auth-message success" : "auth-message error"}><Check size={15}/>{message}</div>}<div className="security-note"><ShieldCheck size={14}/> Codes are single-use and tied to your member account.</div></section></div></main>;
}
