# PromptForge Uptime Monitoring

## Active monitor

PromptForge is monitored externally at **https://www.promptforge.com.ng/** using UptimeRobot’s no-dashboard quick-monitor workflow. The monitor was activated by the owner through the activation email sent to **saintpaulek@gmail.com**.

| Setting | Value |
|---|---|
| Monitored URL | `https://www.promptforge.com.ng/` |
| Check type | External HTTPS availability check |
| Check frequency | Every 5 minutes |
| Alert recipient | `saintpaulek@gmail.com` |
| Alert events | Downtime and recovery |
| Ownership | PromptForge owner |

The current health check returned HTTP `200` for the homepage. The public Library endpoint also returned HTTP `200` with JSON, so the catalog is available at the time of verification.

## When an alert arrives

First open `https://www.promptforge.com.ng/` using both mobile data and Wi-Fi. If the browser reports a DNS issue, review **Vercel → PromptForge → Settings → Domains** and confirm that both `promptforge.com.ng` and `www.promptforge.com.ng` show **Valid Configuration**. If the homepage works but Library does not, test `https://www.promptforge.com.ng/library` and the catalog route before changing any DNS records.

> Do not remove domain records while the site is reachable. Verify the alert from a second network first, because temporary local-network problems can mimic an outage.

If the issue persists across networks, retain the downtime email and contact the site maintainer with the time of the alert, the affected URL, and any browser error text. The recovery alert indicates that the monitor can reach the homepage again.
