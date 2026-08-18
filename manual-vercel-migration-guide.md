# Manual Vercel Migration Guide for PromptForge

## Purpose and current situation

The domain `www.promptforge.com.ng` is currently attached to the Vercel project **`prompt4orge`** in the **PBATMEDIC** Vercel team. That project is connected to the public GitHub repository `saintpaulek/prompt4orge`, but it is serving an older Lovable/TanStack version of PromptForge rather than the current Manus build.

The safest migration is to keep the existing Vercel project and its domain assignments, preserve the old source in a backup branch, replace the repository’s `main` branch with the current PromptForge source, configure the required Vercel environment variables, and then redeploy. **Do not delete the Vercel project or remove the domain first.**

The current domain assignments are:

| Domain | Purpose |
|---|---|
| `www.promptforge.com.ng` | Primary public hostname requested for PromptForge |
| `promptforge.com.ng` | Apex domain currently attached to the same Vercel project |

Vercel manages custom domains from **Project → Settings → Domains**. For a subdomain such as `www.promptforge.com.ng`, Vercel normally provides a project-specific CNAME target; the exact target must be copied from the Vercel dashboard rather than guessed.[1]

## Phase 1: Confirm the correct accounts

Sign in to the GitHub account that owns or can write to `saintpaulek/prompt4orge`. The account must be able to push commits and create branches. In GitHub, open the repository and confirm that **Settings → Collaborators and teams** gives your active account write or maintain permission.

Then sign in to the Vercel account or team that owns the existing project. In Vercel, select the **PBATMEDIC** team and confirm that the project named `prompt4orge` is visible. The project should already show both `www.promptforge.com.ng` and `promptforge.com.ng` under its Domains settings.

If GitHub shows the repository but refuses pushes with a 403 error, reconnect the GitHub integration using the repository-owner account or grant the connected account repository **Contents: Read and write** permission. Do not proceed with source replacement while the account is read-only.

## Phase 2: Back up the old Vercel source

Open `https://github.com/saintpaulek/prompt4orge` and record the current commit shown on the `main` branch. At the time of the migration assessment, the old source was at commit `7d257e7243beb4810b079922998d5d87e49fa776`.

Create a backup branch before replacing `main`:

```bash
git clone https://github.com/saintpaulek/prompt4orge.git
cd prompt4orge
git checkout -b backup-before-manus-promptforge
git push origin backup-before-manus-promptforge
```

Confirm that the branch appears on GitHub. If you prefer a tag, create one as well:

```bash
git tag old-vercel-before-manus-migration
git push origin old-vercel-before-manus-migration
```

The backup branch or tag is the rollback point. Do not delete it until the new Vercel deployment has been tested in production.

## Phase 3: Prepare the current PromptForge source

Use the current PromptForge project as the source of truth. It is located locally at `/home/ubuntu/promptforge` in the Manus workspace. Confirm that the current source builds before copying it:

```bash
cd /home/ubuntu/promptforge
pnpm install
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

Do not copy any `.env` files, private keys, database dumps, or local build output into GitHub. The repository should contain source code and configuration only. Secrets must be entered in Vercel’s Environment Variables panel, not committed to the repository.

Replace the old repository contents using one of these methods.

### Recommended method: replace the repository from a clean working copy

Make a second clone of the repository for the migration and preserve its `.git` directory:

```bash
git clone https://github.com/saintpaulek/prompt4orge.git prompt4orge-migration
cd prompt4orge-migration
git checkout main
```

Copy the current PromptForge project into that clone while excluding Git metadata, dependencies, local secrets, and build output. On Linux, an example is:

```bash
rsync -a --delete \
  --exclude='.git/' \
  --exclude='node_modules/' \
  --exclude='dist/' \
  --exclude='.env' \
  --exclude='.env.*' \
  /home/ubuntu/promptforge/ ./
```

Review the resulting file list carefully. Confirm that important files such as `package.json`, `pnpm-lock.yaml`, `vite.config.ts`, `drizzle/`, `server/`, `client/`, `shared/`, and `README.md` are present. Confirm that no `.env` file or secret value was copied.

Run the same checks from the migration clone:

```bash
pnpm install
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

Commit the replacement to a migration branch first:

```bash
git checkout -b migrate-current-manus-promptforge
git add -A
git commit -m "Replace legacy app with current PromptForge build"
git push origin migrate-current-manus-promptforge
```

Review the branch on GitHub. Only after the diff looks correct should you merge it into `main`:

```bash
git checkout main
git pull origin main
git merge --no-ff migrate-current-manus-promptforge -m "Deploy current PromptForge build"
git push origin main
```

The Vercel project is configured to deploy from the GitHub repository’s production branch. A new commit on `main` should create a new production deployment, but confirm this in Vercel before considering the migration complete.

## Phase 4: Configure Vercel project settings

Open **Vercel Dashboard → PBATMEDIC → prompt4orge → Settings**.

### Build settings

Use the current repository’s `package.json` scripts as the starting point. Confirm the following values against the current source before saving:

| Setting | Recommended value |
|---|---|
| Framework preset | Vite or the project’s detected Node/Vite preset |
| Install command | `pnpm install` or the project’s detected pnpm command |
| Build command | `pnpm build` |
| Output directory | The directory produced by the current Vite build, normally `dist` or the value shown by the project’s build configuration |
| Production branch | `main` |

Do not blindly keep the old `tanstack-start-lovable` framework preset if it conflicts with the current PromptForge `vite.config.ts`. If Vercel detects the current repository as Vite, use the detected Vite preset. If the build fails, inspect the Vercel build log before changing source code.

### Environment variables

Open **Settings → Environment Variables** and add every variable required by the current PromptForge project for the **Production** environment. If Preview deployments will also be tested, add the appropriate values to **Preview** as well. Vercel environment-variable changes apply only to new deployments, so redeploy after saving them.[2]

Use the Manus project configuration and the current server environment definitions as the checklist. Do not paste credentials into GitHub issues, chat messages, source files, or screenshots.

The current application uses variables in these groups:

| Group | Examples to configure | Notes |
|---|---|---|
| Database | `DATABASE_URL` | Must point to the production MySQL/TiDB database reachable from Vercel server functions. |
| Application/auth | `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `OWNER_OPEN_ID`, `OWNER_NAME` | Keep server-only secrets server-side. |
| Supabase server | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | The service-role key must never be exposed to the browser. |
| Supabase browser | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Use the production Supabase project values. The URL must not have a trailing slash. |
| Built-in APIs | `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY` | Configure only if the current source expects the Manus built-in API integration in Vercel. |
| Analytics/app branding | `VITE_ANALYTICS_ENDPOINT`, `VITE_ANALYTICS_WEBSITE_ID`, `VITE_APP_LOGO`, `VITE_APP_TITLE` | Use the current PromptForge production values. |

Do not invent values for any variable. Copy them from the authorized production configuration or obtain fresh credentials from the relevant provider. If a value is unknown, leave the deployment blocked rather than using a placeholder.

After adding variables, trigger a new production deployment. Existing deployments do not automatically receive newly added environment variables.[2]

## Phase 5: Deploy safely in Vercel

First push the migration branch and allow Vercel to create a **Preview** deployment if the project is configured to build previews. Open the preview URL and test the Builder, Library, About, Contact, authentication entry points, and unlock CTA.

If the preview works, merge the migration branch into `main` and monitor the new production deployment in **Deployments**. Wait for the deployment state to become **Ready**. If it fails, open the deployment’s build logs and fix the first error in the chain rather than repeatedly redeploying.

The old Vercel deployment remains available through its deployment URL while the new deployment is evaluated. Do not delete the previous deployment until the custom domain, authentication, database-backed Library, Contact form, and WhatsApp CTAs have been tested.

## Phase 6: Keep the custom domain attached

Because the existing project already contains `www.promptforge.com.ng` and `promptforge.com.ng`, do not remove and re-add them unless Vercel explicitly reports a domain ownership conflict.

If Vercel asks for DNS changes, open **Project → Settings → Domains**, select the affected domain, and copy the exact record values Vercel displays. Vercel normally uses a CNAME for a subdomain such as `www` and an A record for an apex domain such as `promptforge.com.ng`.[1]

In Truehost, go to **Domains → Manage DNS** and edit the DNS zone for `promptforge.com.ng`. Truehost’s current guidance says this DNS manager is accessed from the client area and warns not to delete or change the assigned nameserver records.[4]

For the subdomain, the record will generally have this shape, but the value must come from Vercel:

| Type | Host/name | Value |
|---|---|---|
| CNAME | `www` | Exact CNAME target displayed by Vercel |

Remove only conflicting `www` A or CNAME records that point to the old deployment. Do not remove MX records, SPF, DKIM, DMARC, or unrelated records used for email. Do not change nameservers unless you intentionally want Vercel or another provider to become the authoritative DNS provider.

If Vercel reports that the domain is already in use by another Vercel account, use Vercel’s domain-access verification flow. Vercel may require a TXT record to prove control of the domain before allowing the domain to be used in the connected project.[1]

## Phase 7: Production verification checklist

Verify the exact custom hostnames over HTTPS:

```text
https://www.promptforge.com.ng/
https://promptforge.com.ng/
https://www.promptforge.com.ng/library
https://www.promptforge.com.ng/about
https://www.promptforge.com.ng/contact
https://www.promptforge.com.ng/auth
```

Check the following behaviors:

| Area | Verification |
|---|---|
| Builder | Category switching keeps the live prompt preview populated. Platform lists remain category-specific and complete. |
| Library | The database-backed catalog loads, search works, and FREE/LOCKED states remain correct. |
| Authentication | Email/password and recovery entry states render without raw configuration errors. |
| Contact | Form validation, loading/success/error states, contact links, and WhatsApp links work. |
| Unlock CTA | The button opens the requested PromptForge WhatsApp Business product page. |
| HTTPS | Both the `www` and apex hostnames load securely without certificate warnings. |
| Routing | Direct navigation to `/library`, `/about`, `/contact`, and `/auth` does not fall through to a 404. |

Use a private browser window or clear cache when comparing the new Vercel deployment with the old site. Also check the Vercel deployment URL directly so you can distinguish DNS caching from an application build problem.

## Rollback plan

If the new deployment is broken, immediately use Vercel’s deployment controls to assign the previous Ready deployment back to production or redeploy the backup GitHub commit. If the repository merge itself must be reversed, create a revert commit rather than deleting history:

```bash
git checkout main
git pull origin main
git revert <migration-merge-commit>
git push origin main
```

Keep the backup branch and old deployment available until the new Vercel version has passed production verification for at least one complete test cycle.

## Important safety notes

Do not post any Supabase service-role key, database password, JWT secret, OAuth secret, or notification credential in chat or GitHub. Do not use placeholder credentials in Vercel. Do not delete the old Vercel project, old domain records, or backup branch until the replacement is verified. DNS changes can affect email if MX, SPF, DKIM, or DMARC records are altered, so change only the web records required by Vercel.

The current domain was previously serving an older Vercel PromptForge site. If the new code is successfully deployed but the domain still shows the old interface, compare the custom domain response with the new deployment URL, check the Vercel domain assignment, and allow time for DNS/CDN caches to expire before making additional destructive changes.

## References

[1]: https://vercel.com/docs/domains/working-with-domains/add-a-domain "Vercel: Adding & Configuring a Custom Domain"

[2]: https://vercel.com/docs/environment-variables "Vercel: Environment Variables"

[3]: https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository "GitHub: Duplicating a Repository"

[4]: https://truehost.com/support/how-to-manage-dns-zones-in-your-client-area/ "Truehost: How to Manage DNS Zones in Your Client Area"
