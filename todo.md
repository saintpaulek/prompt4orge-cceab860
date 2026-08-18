# PromptForge authentication upgrade

- [x] Read the full-stack web app guidance and inspect current project configuration.
- [x] Add the backend/auth capability required for real accounts and persistence.
- [x] Implement sign-in, sign-up, Google login, magic link, password recovery, loading, and error states.
- [x] Add profile, saved prompt, favorite, and unlock-state persistence with secure access rules.
- [x] Integrate authenticated header state, guest save prompts, builder save flow, library state, and sign-out.
- [x] Verify desktop and mobile auth UX, run checks/build, and save a stable checkpoint.

- [x] Complete password-reset return flow with a new-password form and verify auth paths in-browser.
- [x] Wire profile update, favorite, and unlock-state persistence end-to-end.
- [x] Implement guest prompt capture and post-login save handoff.
- [x] Verify auth on desktop and save a fresh authenticated checkpoint.

- [x] Exercise the sign-in, sign-up, social, magic-link, forgot-password, and reset-password entry points in the browser where provider configuration permits.
- [x] Add a profile editing surface for display name and account settings.
- [x] Add a redeemable unlock-code flow that updates persisted unlock state.
- [x] Save a new checkpoint after the final authenticated verification pass.
- [x] Make unlock-code redemption atomic-safe and handle duplicate redemption correctly.
- [x] Replace the unlock modal placeholder redeem action with navigation to the real account redemption UI.

- [x] Audit production Supabase URL, anon key, client initialization, and browser console/network errors.
- [x] Add safe Supabase configuration diagnostics and clear auth error mapping.
- [x] Configure production auth site and redirect URLs where the connected Supabase project permits.
- [x] Verify email/password, Google, GitHub, magic-link, and recovery entry states on the deployed site.
- [x] Save a checkpoint containing the authentication fix.
- [x] Detect disabled Supabase social providers before redirecting and show an inline unavailable-provider message instead of the raw Supabase 400 page.
- [x] Add visible inline guidance when Google or GitHub is disabled and verify it on the deployed auth page.
- [x] Re-test the deployed auth page after the social-provider guard change.

- [x] Add admin-only unlock-code generation and list procedures with secure role checks.
- [x] Build the protected `/admin/unlocks` workspace for generating, copying, and reviewing unlock codes.
- [x] Add admin navigation from the authenticated account area and a non-admin access state.
- [x] Test admin authorization, code generation, list refresh, responsive UI, and save a checkpoint.
- [x] Exercise `/admin/unlocks` as an authenticated admin: generate a batch, verify fresh codes and inventory refresh, and confirm non-admin/signed-out states.
- [x] Save the final admin unlock workspace checkpoint after authenticated verification.
- [x] Harden production matching for `/admin/unlocks` so direct navigation cannot fall through to the generic 404 route.

- [x] Identify the currently signed-in PromptForge account without requesting credentials.
- [x] Promote only that account to `admin` in the application database.
- [x] Verify the admin navigation and protected unlock workspace access.
- [x] Verify `/admin/unlocks` in-browser with a temporary non-admin role rollback, then restore the promoted account to admin.
- [x] Save a checkpoint after the completed admin and non-admin verification pass.

- [x] Inspect and validate the attached prompt JSON structure and record counts by category/access.
- [x] Add the `prompts` table with id, title, category, role, tags, access, and prompt_body columns.
- [x] Seed all attached prompt records into the database with duplicate-safe import behavior.
- [x] Add prompt catalog procedures with search, category, and FREE/locked access filtering.
- [x] Wire the Library page to the database catalog and verify free/locked states, then save a checkpoint.
- [ ] Save a checkpoint containing the prompts table, seeded 3,000-record catalog, catalog procedures, and database-backed Library after the completed filter verification.
- [ ] Re-open the published `/library` route after checkpointing to confirm the seeded catalog is available in production.
