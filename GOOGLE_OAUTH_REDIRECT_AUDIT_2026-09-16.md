# Google OAuth redirect audit — 2026-09-16

The Supabase Google provider is enabled and reports callback URL `https://rupzljrpzdfrehgvbwdt.supabase.co/auth/v1/callback`.

The Google Cloud console opened under the signed-in account `saintpaulek@gmail.com` with the selected project **My First Project** (`future-union-506007-c2`). Its Credentials page reports **No OAuth clients to display**. Therefore, this selected Google Cloud project cannot be the project that owns the client ID currently configured in Supabase. The screenshot’s `redirect_uri_mismatch` is consistent with the Google client being configured in another Google Cloud project or with the Supabase callback not being registered there.

The Supabase provider panel showed the configured client ID prefix `83605249738-...`, so the next step is to switch Google Cloud to the project that owns that client ID, open its OAuth web client, and add the exact Supabase callback URL. No client secret was copied or exposed.


The Google Cloud project selector under `saintpaulek@gmail.com` currently exposes only **My First Project** (`future-union-506007-c2`). Searching for the Supabase client’s project-number prefix `83605249738` did not produce a matching project result. This indicates the OAuth client may belong to another Google account, another organization, or a project not accessible from the current account. No Google Cloud credential was changed.


The matching Google OAuth client `Promptforge` in project `fabled-imagery-360506` was found using the project number `83605249738`. Its old authorized redirect URI pointed to `uvbcdcmbzgrgadtgyezk.supabase.co`. With user confirmation, that URI was replaced by `https://rupzljrpzdfrehgvbwdt.supabase.co/auth/v1/callback`. Google Cloud displayed **OAuth client saved**.
