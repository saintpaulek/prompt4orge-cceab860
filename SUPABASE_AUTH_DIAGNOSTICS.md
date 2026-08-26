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
