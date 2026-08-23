# PromptForge Vercel Migration Handoff

## Current state

The current PromptForge application is deployed through the authenticated Vercel team `PBATMEDIC` in the `promptforge` project. The production deployment uses the current Workshop Noir application source from `/home/ubuntu/promptforge`, including the database-backed Library, category-specific Builder options, Pricing, About, Contact, Auth, and the Banking & Fintech catalog expansion.

The verified production aliases are `www.promptforge.com.ng`, `promptforge.com.ng`, and `promptforge-pbatmedic.vercel.app`. The latest successful production deployment is `dpl_DdWm8aGBJufC7imw33FYuaUZ8E8a`, and its state is `READY`.

## Backup and source

Before replacement, the prior legacy GitHub source was archived locally and preserved in a protected GitHub backup branch named `backup-before-promptforge-migration-2026-08-21`. The migration source is the current PromptForge project, not the legacy repository implementation.

## Vercel project settings

The successful deployment used the following build settings:

| Setting | Value |
| --- | --- |
| Framework | Vite-compatible build |
| Install command | `npm install --legacy-peer-deps --no-audit --no-fund` |
| Build command | `pnpm build` |
| Output directory | `dist/public` |
| Deployment target | Production |
| Node version | Vercel project default (`24.x`) |

The `--legacy-peer-deps` flag is required because the existing development plugin `@builder.io/vite-plugin-jsx-loc` declares a Vite 4/5 peer range while the current app uses Vite 7. The install command allows the production build to resolve the existing dependency tree without changing application behavior.

## SPA routing

The project includes `vercel.json` with a catch-all rewrite to `/index.html`. This is required because PromptForge uses client-side routing for `/library`, `/pricing`, `/about`, `/contact`, `/auth`, `/account`, and `/admin/unlocks`. Without the rewrite, direct navigation to a nested route returns Vercel `404: NOT_FOUND` even though the root page loads correctly.

## Environment requirements

The application expects its existing Manus/WebDev and database environment configuration to remain available. Important runtime values include the database connection, JWT/auth configuration, Manus Forge API values, OAuth values, and Supabase values already present in the managed PromptForge project. No secret values are stored in the repository or in this handoff note. If the Vercel project is recreated rather than reused, these values must be added to Vercel Project Settings → Environment Variables for Preview and Production before relying on authenticated features, database catalog queries, or server-side procedures.

## GitHub/Vercel permissions

The linked GitHub account is `saintpaulek`. Vercel’s GitHub App must have access to the target repository or namespace before a Git-connected deployment can be created. If the repository picker shows only the legacy `saintpaulekmultimedia` namespace, use Vercel’s **Adjust GitHub App Permissions** link and grant access to the user-owned repository, then reopen the Vercel Git settings page.

The direct production deployment path was used because the existing Vercel Git picker did not expose the current user-owned repository. This deployment is therefore verified as a production artifact under the existing Vercel project; a future Git-connected workflow can be enabled once the repository permission scope is available.

## DNS and HTTPS status

No additional Truhost DNS change was required during this migration. Both `www.promptforge.com.ng` and `promptforge.com.ng` resolved to the existing Vercel project and served the new production deployment over HTTPS. If the domain is later detached or moved to another Vercel project, preserve the existing Vercel DNS target and re-check HTTPS issuance before switching traffic.

## Verification performed

The following public routes were verified after the successful production deployment:

- `/` Builder shell with category-specific “What are you making?” options and live output.
- `/library` Library shell with search, category/access filters, sorting, and loading state.
- `/about` mission, differentiators, audience, and CTAs.
- `/contact` email, phone, WhatsApp Business product link, FAQ, and contact form.
- `www.promptforge.com.ng` and `promptforge.com.ng` both served the current PromptForge application.

## 2026-08-21 update: pbatmedic/promptforge verification

The production target is the explicitly provided Vercel project `pbatmedic/promptforge`. Its environment settings now include `DATABASE_URL` for Production and Preview; the value was not exposed during verification. The deployment includes a bundled `api/index.js` serverless entrypoint and an API-first SPA fallback so `/api/trpc/*` returns JSON while client routes continue to resolve to `/index.html`.

The latest production deployment is `dpl_4M6zXgbpAgbxP5qmT65M9E9FpcKQ`, which is Ready and aliased to `www.promptforge.com.ng`, `promptforge.com.ng`, and `promptforge-pbatmedic.vercel.app`. The public `catalog.list` endpoint returned HTTP 200 with 3,069 total prompt records and six records in the first page. The browser Library route rendered the catalog count, prompt cards, filters, and Load more control. Core routes `/`, `/library`, `/about`, `/contact`, and `/pricing` returned HTTP 200 on the custom domain.
