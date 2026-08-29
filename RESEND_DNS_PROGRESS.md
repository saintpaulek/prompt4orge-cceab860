# Resend DNS Progress

Date: 2026-08-29

Resend domain setup for `promptforge.com.ng` was initiated under the connected Resend account. The public authoritative nameservers resolve to Vercel (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`), so the authoritative records were added in Vercel DNS. The OLITT DNS zone was also opened and received equivalent records, but public DNS authority is Vercel; no existing website or Google Search Console records were deleted or changed.

Added to Vercel DNS:

- `resend._domainkey` TXT, Resend DKIM public key, TTL 60.
- `send` MX → `feedback-smtp.eu-west-1.amazonses.com`, priority 10, TTL 60.
- `send` TXT → `v=spf1 include:amazonses.com ~all`, TTL 60.

The optional DMARC record was attempted in Vercel, but Vercel reported `DNS record already exists`; it was already present in the OLITT zone as `_dmarc` TXT `v=DMARC1; p=none;`.

Public DNS checks via Google Public DNS subsequently returned the new DKIM TXT and send MX records; SPF/DMARC responses were inconsistent during propagation. Resend now shows the domain status `pending` with all three required records marked `pending` and the notice: DNS records may take a few hours depending on Vercel propagation. Do not add duplicate records or alter nameservers. Retest the Resend domain page after propagation, then configure Supabase SMTP sender as `no-reply@promptforge.com.ng` once Resend shows verified.

Existing Vercel records observed and preserved: `auth` MX, `send.auth` TXT, `send.auth` MX. Existing site/domain records were not removed.

Next action: wait for propagation, refresh Resend until status becomes verified, then test a new signup confirmation email from the paid domain.
