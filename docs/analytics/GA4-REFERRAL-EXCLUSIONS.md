# GA4 referral exclusions

Configure in GA4 Admin: Data streams, Web, Configure tag settings, List unwanted referrals.

## Required exclusions

- vercel.app (preview deploys)
- goalcurrent.online and www.goalcurrent.online (legacy domain)
- goalcurrent.live and www.goalcurrent.live (self-referral)
- accounts.google.com (OAuth)
- checkout.stripe.com, pay.google.com (future checkout)

Do not exclude legitimate football media referrers.

Code reference: GA4_REFERRER_EXCLUSION_DOMAINS in src/lib/analytics/config.ts.
Site redirects: next.config.ts (goalcurrent.online to goalcurrent.live, worldcup2026/match to /match).
