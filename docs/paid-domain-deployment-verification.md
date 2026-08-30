# Paid-domain deployment verification — 2026-08-30

The linked Vercel project is `promptforge` (`prj_78KbiXJgW6mecaUaq7VQ4Y94tXJ9`) under the `pbatmedic` team. A direct deployment attempt initially failed because the payload exceeded Vercel's 300-file limit; the payload was reduced to runtime source and public assets. A second build initially failed because `client/index.html` was omitted. The corrected deployment added that entry file and completed successfully.

Production deployment: `dpl_9k8Ga1tbBwGVyS4iRjFaK83gxdV8`, state READY, target production, with aliases for `www.promptforge.com.ng`, `promptforge.com.ng`, and the project Vercel aliases.

The paid-domain Library endpoint now returns `application/json` with HTTP 200, `total: 3939`, and three requested catalog items from `/api/trpc/catalog.list`. This confirms that the Vercel API function entrypoint is serving the catalog instead of the SPA HTML shell.

The live Library selector contains `Ecommerce & Product` once in the rendered category list. Final responsive browser verification remains to be completed.


Final browser verification after deployment:

- `https://www.promptforge.com.ng/library` returns the current Library UI and shows `PROMPT LIBRARY / 3,939`.
- The page loads 60 catalog cards and exposes the expanded categories, including `Nigeria Business Growth & WhatsApp`, `Healthcare / Wellness`, and the other requested categories.
- The category selector contains `Ecommerce & Product` once.
- The prior catalog-unavailable state is gone; the page shows locked/free cards and the Load more control.
- The successful deployment is aliased to both the apex and `www` paid-domain hostnames.
