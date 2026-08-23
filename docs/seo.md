# PromptForge SEO and Google Search

PromptForge now publishes a paid-domain sitemap at `https://www.promptforge.com.ng/sitemap.xml` and a crawl policy at `https://www.promptforge.com.ng/robots.txt`. The sitemap includes only the public Builder, Library, Pricing, About, and Contact routes. Authentication, account, admin, API, and unknown routes are excluded from indexing.

The site uses the `www.promptforge.com.ng` origin as its canonical domain. Public route documents include route-specific titles, descriptions, canonical URLs, Open Graph tags, Twitter card tags, and a `SoftwareApplication` JSON-LD block. Private route documents use `noindex, nofollow` metadata.

## Submit the site to Google

Open [Google Search Console](https://search.google.com/search-console/) and create a **Domain property** for `promptforge.com.ng`. Google will provide a DNS TXT record; add that record at the DNS provider managing the domain, then return to Search Console and verify ownership. A Domain property covers both the apex domain and the `www` hostname.

After verification, select the property and open **Sitemaps**. Submit:

```text
https://www.promptforge.com.ng/sitemap.xml
```

Use **URL inspection** for the homepage and the main public routes, then choose **Request indexing** for pages that are ready for discovery:

```text
https://www.promptforge.com.ng/
https://www.promptforge.com.ng/library
https://www.promptforge.com.ng/pricing
https://www.promptforge.com.ng/about
https://www.promptforge.com.ng/contact
```

Google controls the final crawl and indexing schedule. Search Console submission is a request, not a guarantee of immediate inclusion. Keep public pages useful, internally linked, and updated; avoid submitting authenticated or admin routes.
