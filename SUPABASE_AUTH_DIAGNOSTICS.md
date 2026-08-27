# Supabase Auth diagnostics — 2026-08-26

The connected project is `prompt4orge-cceab860` (`rupzljrpzdfrehgvbwdt`) and reports `ACTIVE_HEALTHY`.

The Supabase Auth Providers page was inspected without changing settings. The following states were confirmed:

- Allow new users to sign up: enabled.
- Confirm email: enabled.
- Email provider: enabled.
- Google provider: enabled.
- GitHub provider: disabled.

The application now sends the paid-domain or active-origin `/auth` URL as `emailRedirectTo` for signup, signup-confirmation resend, magic-link, password-reset, and social OAuth flows. A confirmation-resend action is available after signup.

The screenshot code `PF-356B9D-BBEA2E` exists in the production `unlock_codes` table, is marked used, and is bound to user id `2550001` (`saintpaulek@gmail.com`). Before repair, that user row had `isUnlocked = 0`, `unlockCode = NULL`, and `unlockedAt = NULL`; this was corrected after the live `unlockedAt` column migration was applied.

The tracked Vercel API bundle was rebuilt from `server/vercelApi.ts` so production receives the current redemption status contract (`success`, `invalid`, and `already_used`) rather than the stale boolean response.

Remaining email-delivery risk: the Auth dashboard state alone does not prove inbox delivery. If emails are accepted by Supabase but not received, custom SMTP must be configured in Supabase Authentication email settings; credentials should be entered in the dashboard by the owner and not shared in chat.


Additional verification:

- Opening `https://www.promptforge.com.ng/account` without a site session redirected to `https://www.promptforge.com.ng/auth`, confirming protected account access is enforced.
- Supabase Authentication → Emails exposes both a Templates panel and an SMTP Settings panel. The templates page was still loading its editor when inspected, so no template or SMTP values were changed.


SMTP inspection confirmed that **Enable custom SMTP** is currently off in Supabase Authentication → Emails → SMTP Settings. This means the project is relying on Supabase’s shared/default mailer rather than a user-configured SMTP sender. The dashboard exposes a Save changes control but no settings were altered.


The loaded Templates page states: “Set up custom SMTP to edit templates. Emails will be sent using the default templates.” The Confirm sign up template is present, but custom SMTP must be enabled before the subject/body can be customized. This confirms that missing inbox delivery is not caused by a missing confirmation-template record; sender delivery remains dependent on the default shared mailer until custom SMTP is configured.


Supabase documentation source: https://supabase.com/docs/guides/auth/auth-smtp. It states that the shared/default SMTP server is intended for exploration and testing, only sends to pre-authorized team addresses, is subject to changing rate limits, and has no delivery or uptime SLA. Production applications should configure a custom SMTP provider in Authentication → Emails → SMTP Settings.


SMTP re-check on 2026-08-26: Supabase Authentication → Emails → SMTP Settings is populated with sender `no-reply@promptforge.com.ng`, sender name `Prompt Forge`, host `smtp.resend.com`, port `465`, minimum interval `60` seconds, and username `resend`. The password field is intentionally blank/masked because Supabase does not reveal a saved password. The custom SMTP toggle and Save changes control are present; no password value was read or exposed.


SMTP transport test on 2026-08-26: the already-confirmed owner account `saintpaulek@gmail.com` received a Supabase Auth OTP request through the production project using `create_user:false`; the Auth endpoint returned HTTP 200. This confirms the saved SMTP configuration was accepted by Supabase at the request layer. The test does not prove inbox placement; verify the message in the inbox/spam folder and in Resend Logs. A new unconfirmed test account is still required to test the signup-confirmation template specifically.


Verification redirect investigation on 2026-08-26: Supabase Authentication → Emails → Templates lists a separate `Confirm sign up` template and a separate `Magic link or OTP` template. The legacy Lovable URL is not present in the checked-in PromptForge source, so the next check is the saved Confirm sign up template content and the project URL Configuration allowlist.


Confirmation-template check on 2026-08-26: Supabase Confirm sign up uses the standard `<a href="{{ .ConfirmationURL }}">` template variable and contains no hard-coded `prompt4orge.lovable.app` URL. Therefore the legacy host is coming from the redirect/site configuration or from a previously generated confirmation email, not from the current template body.


URL Configuration check on 2026-08-26: Supabase Site URL is `https://www.promptforge.com.ng`. The six redirect URLs are `https://promptforge.com.ng/**`, `https://www.promptforge.com.ng/**`, `http://localhost:3000/**`, `https://promptforge-pbatmedic.vercel.app/`, `https://promptforge-pbatmedic.vercel.app/**`, and `https://promptforge-onsswa7f.manus.space/**`. No `prompt4orge.lovable.app` entry is present.


Production/Vercel investigation on 2026-08-26: the live `https://www.promptforge.com.ng/auth` JavaScript bundle references `https://ifvqvwxzhlqefylmnels.supabase.co` and a Supabase publishable key, while the Supabase dashboard project where Resend SMTP was saved is `rupzljrpzdfrehgvbwdt`. The linked Vercel project `promptforge` (team `pbatmedic`) serves the paid-domain aliases and latest production deployment `dpl_FutAMzanJVQ6sCW8dA2uyhepGM7P`, whose source commit is the older GitHub main commit `cabfc420...`; local PromptForge checkpoint `914ab578` is not yet in GitHub main. This project mismatch/stale Vercel build explains why email still arrives from `no-reply@mail.lovable-app.email` despite the SMTP settings saved in `rupzljrpzdfrehgvbwdt`.


Vercel inspection checkpoint on 2026-08-27: the signed-in environment-variable page shows separate Development, Preview, and Production `VITE_SUPABASE_URL` entries. The Production row menu was opened visually, but its menu items were not exposed to scripted DOM inspection; no Vercel value was changed. The previously inspected Production `NEXT_PUBLIC_SUPABASE_URL` value is `https://rupzljrpzdfrehgvbwdt.supabase.co`.


Vercel visibility finding on 2026-08-27: Production `VITE_SUPABASE_URL` is currently stored as a write-only Secret. Vercel’s edit form rejects this combination for a public `VITE_` variable and disables the Config option, so correcting it requires deleting/recreating that Production variable as Config. No deletion or save has yet been performed.


## 2026-08-27 Vercel production correction
- Replaced the stale Production `VITE_SUPABASE_URL` entry with a public Config variable pointing to `https://rupzljrpzdfrehgvbwdt.supabase.co`.
- Added the matching public anon key as `VITE_SUPABASE_ANON_KEY` in Production; no service-role key was accessed or exposed.
- Triggered production redeployment `dpl_E2JyJTvd99Lo33fwE4PuVsFvjpNW`; Vercel reports `READY` and assigns the paid-domain aliases.
- Live `https://www.promptforge.com.ng/` returned HTTP 200. Its fetched JavaScript bundle contains zero references to legacy project `ifvqvwxzhlqefylmnels`, one reference to active project `rupzljrpzdfrehgvbwdt`, and zero references to `mail.lovable-app.email`.
