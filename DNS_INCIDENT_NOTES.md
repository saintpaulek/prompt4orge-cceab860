# Paid-Domain DNS Incident Notes

On 2026-08-26, a mobile Chrome screenshot reported `ERR_NAME_NOT_RESOLVED` for `www.promptforge.com.ng`.

At investigation time, independent Cloudflare and Google DNS-over-HTTPS resolvers both returned successful A-record answers for the apex and `www` hostnames. The domain delegation resolves to `ns1.vercel-dns.com` and `ns2.vercel-dns.com`. The linked Vercel project includes both `promptforge.com.ng` and `www.promptforge.com.ng`; its latest production deployment is Ready.

HTTPS verification returned `200` from Vercel for `https://www.promptforge.com.ng/` and a `308` redirect from the apex to the `www` hostname. This establishes that the observed phone error was not present on independent public DNS checks at investigation time. The next diagnostic step is a cached-resolver/device retest rather than modifying an already resolving domain record.
