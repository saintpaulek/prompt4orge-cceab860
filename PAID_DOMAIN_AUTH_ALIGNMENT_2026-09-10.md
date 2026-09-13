# Paid-domain auth alignment — 2026-09-10

The linked Vercel project `prj_78KbiXJgW6mecaUaq7VQ4Y94tXJ9` received production deployment `dpl_EEsn8AHmCUE6zbj6C4EgjBb5ZoEc` from GitHub commit `38dbb2c0d7ba5f3d73811ec974ac499b8c996cbe` (`Align paid-domain auth and admin recovery flow`). Vercel reported the deployment as READY and aliased it to `www.promptforge.com.ng`, `promptforge.com.ng`, and the project aliases.

Before the redeploy, the paid-domain JavaScript bundle was `index-BZCwO3jA.js` and contained no `promptforge_recovery_pending` or `flow=recovery` marker. After the redeploy, the paid-domain bundle is `index-CNncujWQ.js`; it contains `promptforge_recovery_pending` once and `flow=recovery` once, contains the active Supabase project reference `rupzljrpzdfrehgvbwdt`, contains no retired reference `uvbcdcmbzgrgadtgyezk`, and contains the owner/admin route strings.

The live paid-domain Auth page returned HTTP 200 and rendered the current PromptForge sign-in screen. Browser sign-in and `/admin/unlocks` verification still require the owner’s user-controlled authenticated session.
