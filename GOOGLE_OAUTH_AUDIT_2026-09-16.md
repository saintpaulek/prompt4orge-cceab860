# Google OAuth audit — 2026-09-16

The connected active Supabase project is `prompt4orge-cceab860` with ref `rupzljrpzdfrehgvbwdt`.

Supabase Authentication → Sign In / Providers shows **Google: Enabled**. The provider panel contains an existing Google Client ID and a masked OAuth Client Secret; no secret values were copied into project files, logs, or chat. Supabase reports the provider callback URL as `https://rupzljrpzdfrehgvbwdt.supabase.co/auth/v1/callback`.

Supabase Authentication → URL Configuration currently shows Site URL `https://www.promptforge.com.ng` and these redirect entries: `https://promptforge.com.ng/**`, `https://www.promptforge.com.ng/**`, `http://localhost:3000/**`, `https://promptforge-pbatmedic.vercel.app/`, `https://promptforge-pbatmedic.vercel.app/**`, and `https://promptforge-onsswa7f.manus.space/**`.

The PromptForge client already calls Supabase `signInWithOAuth({ provider: "google", redirectTo: getSupabaseAuthRedirectUrl(window.location.origin) })`. The paid domain redirects to `https://www.promptforge.com.ng/auth`; the Manus origin redirects to its `/auth` route. Based on this audit, provider activation is already complete; remaining work is a controlled live sign-in test and, if desired, tightening the wildcard allowlist after confirming all required flows.
