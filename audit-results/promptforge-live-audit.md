# PromptForge Live-Domain Audit

**Target:** https://www.promptforge.com.ng  
**Audit scope:** Lighthouse performance and accessibility  
**Routes:** `/`, `/library`, `/auth`  
**Date:** 17 September 2026

## Score summary

| Route | Performance | Accessibility | First Contentful Paint | Largest Contentful Paint | Total Blocking Time | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Home `/` | 58 | 94 | 4.9 s | 6.2 s | 190 ms | 0 |
| Library `/library` | 50 | 87 | 4.7 s | 6.4 s | 470 ms | 0 |
| Auth `/auth` | 62 | 93 | 4.7 s | 5.4 s | 160 ms | 0.009 |

## Key findings

The live site is healthy and accessible at the route level, but mobile performance is below a premium production target. The largest performance issue is delayed rendering of the hero and Library content, with LCP above 5 seconds on all audited routes. Lighthouse identified approximately 2.3–2.7 seconds of main-thread work, about 18 KiB of unused CSS, and approximately 211–215 KiB of unused JavaScript in the shared bundle. Google Analytics contributes roughly 176 KiB of transfer and measurable main-thread work on the Library route.

The Home route's LCP is the hero section. Lighthouse estimates approximately 965 ms savings by preloading or prioritizing the mobile hero image. The audit also found no preconnect hints for Supabase, Google Fonts, the asset CDN, or Google Analytics; adding only the required origins should reduce connection setup time.

Accessibility passed strongly overall. The repeated issues were the mobile install prompt using `role="dialog"` on an `<aside>` element, and the viewport meta tag setting `maximum-scale=1`, which prevents user zoom. The latter should be removed to preserve accessibility on mobile devices. The Library route scored lower than Home and Auth primarily because of the shared runtime and mobile install prompt issue.

## Recommended priority order

1. Remove `maximum-scale=1` from the viewport meta tag and correct the mobile install prompt semantics, preferably by using a real dialog container or removing the dialog role from the aside.
2. Make the mobile hero asset discoverable in the initial document and give it high fetch priority; preload only the mobile-critical hero image where appropriate.
3. Add preconnect hints for the Supabase origin, Google Fonts origins, and the asset CDN, while keeping the list limited to origins required during first render.
4. Split or defer route-specific JavaScript and reduce shared CSS so Library and Auth do not ship Builder-only code on first load.
5. Review whether Google Analytics can be loaded after first interaction or with a lower-priority strategy while retaining measurement coverage.

## Validation notes

All audited routes returned successfully from the paid domain. The audit was run against the production site with Lighthouse's performance and accessibility categories. Scores are lab measurements and can vary with network and cache conditions; the recurring findings above appeared consistently enough to prioritize.
