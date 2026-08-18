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
- [ ] Verify email/password, Google, GitHub, magic-link, and recovery entry states on the deployed site.
- [ ] Save a checkpoint containing the authentication fix.
