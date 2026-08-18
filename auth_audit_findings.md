# PromptForge authentication audit findings

Source: https://supabase.com/dashboard/project/uvbcdcmbzgrgadtgyezk/auth/url-configuration

On 2026-08-18, the Supabase project `uvbcdcmbzgrgadtgyezk` showed a healthy project and accepted:

- Site URL: https://promptforge-onsswa7f.manus.space
- Redirect URL: https://promptforge-onsswa7f.manus.space/**
- Redirect URL: https://promptforge-onsswa7f.manus.space/auth
- Redirect URL: https://promptforge-onsswa7f.manus.space/auth/callback
- Redirect URL: http://localhost:3000/**

The dashboard reported `Total URLs: 4` after saving the localhost entry.

Source: https://promptforge-onsswa7f.manus.space/auth

A production email/password request using a deliberately invalid test identity reached Supabase and returned the handled UI message: `That email and password combination is not recognized.` This confirms the prior raw `Failed to fetch` condition is not present for the email/password request path after the credential/client fix.

Before adding the provider guard, production Google and GitHub redirects reached:

- https://uvbcdcmbzgrgadtgyezk.supabase.co/auth/v1/authorize?provider=google&redirect_to=https%3A%2F%2Fpromptforge-onsswa7f.manus.space%2Fauth
- https://uvbcdcmbzgrgadtgyezk.supabase.co/auth/v1/authorize?provider=github&redirect_to=https%3A%2F%2Fpromptforge-onsswa7f.manus.space%2Fauth

Both returned JSON `{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}`. The code was updated to query `/auth/v1/settings`, disable unavailable social buttons, and show an inline notice instead of redirecting to the raw error page. This new UI still requires post-deployment verification.
