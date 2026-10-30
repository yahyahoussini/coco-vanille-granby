# 20e · Infrastructure and accounts: domain, VPS, backups, mail, SES, SMS, payments, cost (2026-10-29)

As of 2026-10-29 (ISO week 2026-W44). Step: research « infra and accounts », under Yahya's mandate of 2026-10-29 (« take all decisions based on what I give and web research, and make the full thing ready »). It is the step research/21 lists as not run.
It refreshes research/17 (2026-10-25) for prices, data locations and accounts only. 17's architecture, operations runbook and code sketches stand, and so does `infra/README.md`.
Machine-readable twin: `data/research-infra.json` (one object per finding: `id`, `value`, `label`, `source`, `seen`, `note`; the ids are the « # » column of §2, plus `cost.floor` for §4).

How this was made, and its limits:
- **23 WebSearch queries** (standard mode, US-located, summarised results) and **37 WebFetch reads**, all on 2026-10-29. Both logs are in §8.
- **Official pages and APIs first:**
  - OVHcloud's Canadian VPS pages and its public order catalogue for the Canadian subsidiary (`ca.api.ovh.com`)
  - AWS pricing pages and the SES endpoint list
  - Twilio's Canadian SMS price page; Stripe's Canadian price page
  - Microsoft Learn, Zoho, GitHub docs
  - the public plan APIs of Vultr and Linode
  - the Bank of Canada's exchange-rate API
- **Registries:** Verisign and CIRA RDAP were queried again with curl at 13:11 UTC, with two controls (google.com, granby.ca), after research/20a's morning check.
- **Refused or unreadable:**
  - cira.ca, legisquebec.gouv.qc.ca, vultr.com/pricing, Business Wire and DatacenterDynamics: HTTP 403
  - three microsoft.com pages: timeouts
  - Google Workspace pricing: euro prices only (the reader is US-located)
  - OVHcloud's public-cloud price page: truncated before Object Storage
  - Facts from those come from search summaries and say so (« via summary »).
- **OVHcloud catalogue:** 100,000 of 6.3 million characters were read. The VPS-2 entry and its datacentre list were in that part.
- **Currency:** every price is as printed. USD is converted to CAD only in the cost floor (§4), at the Bank of Canada daily average of 2026-10-28: **1 USD = 1.4036 CAD**. All prices are **before GST/QST**.
- **Labels:**
  - **verified** = the vendor's or registry's own page, doc or API (read directly, or quoted in a search summary: marked « via summary »), or two independent sources.
  - **unverified** = one third-party source or aggregator, a conflict, or an inference.
  - **(est.)** = my own estimate or arithmetic.
- **Nothing was bought or opened.** No account was created. No file other than this one and its twin was edited.
- **Not done:**
  - Montréal VPS providers other than OVHcloud and AWS (no 4 vCPU / 8 GB price found)
  - SMS providers that keep data in Canada (none surfaced)
  - Sentry's free tier and region; Cloudflare's WHOIS redaction for .com; the cities behind Microsoft's « Canada » geography
  - the text of Loi 25 s. 17 (LégisQuébec answered 403; research/07 P4 stands)

---

## 0. Bottom line

1. **Both domains are still free: register them today.**
   - At 13:11 UTC, Verisign's RDAP answered 404 for cocovanillegranby.com, and CIRA's answered 404 for cocovanillegranby.ca and cocovanille.ca. The controls answered 200.
   - A Québec inc. meets CIRA's Canadian Presence Requirements as a « Canadian corporation »: « a corporation under the laws of Canada or any province or territory » (CIRA, via summary; two registrar guides say the same).
   - WHOIS privacy is automatic only for individuals. For a corporation, the registrant is shown. → Register in the name « Pâtisserie Coco Vanille inc. », with the shop's public phone and a role address, never a personal one.
   - **Registrar: Cloudflare Registrar for both names.**
     - It sells at cost, with no markup (Cloudflare).
     - It lists .ca under « TLDs Recently added ».
     - It is the DNS host research/17 already chose.
   - Prices (aggregators): about US$9.19 a year for .ca and US$10.46 for .com. Verisign raises the .com registry price from US$10.26 to US$10.97 on **2026-11-01**. With the US$0.20 ICANN fee a third party reports, .com costs about US$11.17 from then (est.).
2. **VPS: OVHcloud VPS-2 at Beauharnois, the only Québec option at this price.**
   - What it is: 4 vCores, 8 GB RAM, 75 GB NVMe, 1 Gbit/s, unlimited traffic, a daily backup of the previous 24 h included. OVHcloud's page says « Votre VPS localisé à Beauharnois (Québec) ».
   - OVHcloud's public catalogue for Canada prices it in **CAD, before tax**, with no setup fee:
     - **C$13.70 a month** with no commitment
     - C$13.01 a month on 6 months prepaid
     - **C$11.64 a month on 12 months prepaid**
   - This settles research/17's contested plan names: today **VPS-2 is the 4-core / 8 GB plan**.
   - The plan's datacentre list holds BHS and **no Toronto site**. R28 (a VPS landing in Ontario) shrinks to one check on the order summary.
   - With data in Québec, the next option is AWS Lightsail in Montréal: US$44 (8 GB but 2 vCPU) or US$84 (4 vCPU / 8 GB).
   - Toronto plans cost US$40–48 (Vultr, Linode, DigitalOcean): about 4–5 times OVHcloud's month-to-month price (C$13.70 ≈ US$9.76, est.), and outside Québec.
3. **Backups: two Québec stores at two providers exist and cost under C$1.50 a month (est.).**
   - Copy 1: AWS S3 in ca-central-1, Montréal (about US$0.025/GB-month, third party).
   - Copy 2: OVHcloud Object Storage, Standard class, at BHS (`s3.bhs.io.cloud.ovh.net`, OVHcloud docs). OVHcloud charges no egress.
   - They are the `s3ca` and `ovhbhs` remotes `infra/README.md` already names.
   - The Canadian regions of Backblaze B2 and Wasabi are both in Toronto.
4. **Mail: Microsoft Exchange Online (Plan 1), with the tenant created in Canada.**
   - Price: C$5.40 per user per month, paid yearly (Microsoft's en-ca page, via summary).
   - Set-up: one licence, for the owner. bonjour@ and confidentialite@ become **shared mailboxes, free up to 50 GB** (Microsoft Learn); commandes@ and dmarc@ are aliases.
   - Microsoft's Product Terms keep a Canadian tenant's mailbox content at rest **in Canada**. They don't name the city, so the literal s. 17 reading still asks for a light ÉFVP (07 P4).
   - Google's Business plans have no data-region option: it is an Enterprise feature.
   - Zoho is cheaper (US$1) and has Toronto and Montréal data centres, but whether Zoho Mail runs there is not stated.
5. **Amazon SES in ca-central-1 is confirmed.**
   - The API, SMTP and receiving endpoints all exist there (AWS docs).
   - New accounts start on Essentials, US$0.16 per 1,000, since 2026-07-21; à la carte is US$0.10. At bakery volume, either costs under US$0.20 a month.
   - The default quota is 200 emails per 24 hours: ask for production access in week 0.
6. **Twilio Canada costs:**
   - Usage: US$0.0083 per segment, plus a per-carrier fee (about US$0.0064–0.0087; the page's columns are ambiguous).
   - Number: US$2.15 a month for a toll-free number.
   - **Toll-free verification is free and mandatory.** Unverified numbers have been blocked since 2024-01-31.
   - **Since 2026-02-17 it needs a business registration number**: a Canadian Business Number or a provincial number.
   - Twilio has **no Canadian region** (US1 by default) → ÉFVP + Twilio's data agreement.
   - Start it at least two weeks before online ordering opens (11–24 January 2027, research/21 B5).
7. **Stripe Canada is unchanged:**
   - 2.9 % + CA$0.30 per domestic card; +0.8 % for international cards; +2 % for conversion
   - CA$15 per dispute; processing fees are not returned on refunds
   - no monthly fee
8. **Monthly cost floor (est., before GST/QST and card fees):**
   - **≈ C$21** with the VPS prepaid for 12 months, or C$23 month to month, while SMS is off.
   - **≈ C$28–31** once SMS runs at about 200 segments a month (from January 2027).
   - research/17 said C$25–55. The floor is lower because it uses the mail-only plan instead of Business Basic, and confirmed CAD prices for the VPS.

---

## 1. One option per line

« s. 17 » = Loi 25 s. 17: personal information leaving Québec needs an ÉFVP + a written agreement (07 P4; other provinces count on the literal reading).

| Line | Recommendation | Data location → s. 17 | Cost (as printed) | Simplicity for one operator | Not chosen, and why |
|---|---|---|---|---|---|
| Registrar (.com + .ca) | **Cloudflare Registrar**, both names in one account owned by the bakery (owner's login and 2FA, agency invited as a member). Registrant « Pâtisserie Coco Vanille inc. », CIRA category « Canadian corporation ». Optional: cocovanille.ca (20a ID-3) | The corporation's contact only, no customer data → not engaged | .com ≈ US$10.46/yr until 2026-10-31, ≈ US$11.17 from 2026-11-01 (est.); .ca ≈ US$9.19/yr | Registrar and DNS in one place; at cost; auto-renew | **CanSpace** (Canadian; .ca US$8.54, then US$9.25; aggregator): the fallback if Cloudflare's .ca form can't record the CIRA category or the accented legal name. Namecheap renews .ca at US$11.98, Gandi at US$39.98 |
| DNS | **Cloudflare DNS**, every record DNS-only (grey cloud), as 17 §10.5; DNSSEC after one stable week | No customer data → not engaged | $0 (est.; the free plan was not re-checked) | Comes with the registrar | Another DNS host: moot once Cloudflare is the registrar (domains there must use its nameservers, aggregator) |
| VPS | **OVHcloud VPS-2** (4 vCores / 8 GB / 75 GB NVMe) at **Beauharnois (BHS)**, Ubuntu 24.04 LTS (infra/README), month to month at launch; prepay 12 months once the first month runs clean | Québec → not engaged for the database, uploads and logs | C$13.70/month; C$11.64/month on 12 months prepaid (C$139.68 at once) | One box for production + staging (17 §1.2); provider backup of the last 24 h included | Lightsail ca-central-1 (Montréal): US$44 for 8 GB / 2 vCPU, US$84 for 4 vCPU / 8 GB. Vultr Toronto US$40, Linode Toronto US$48, DigitalOcean US$48: Ontario → ÉFVP, and about 4–5 times the price (est.) |
| Backup copy 1 | **AWS S3 in ca-central-1**: one bucket, versioning on, an IAM key that reaches only that bucket (rclone remote `s3ca`) | Montréal → not engaged | ≈ US$0.025/GB-month (third party) → ≈ US$0.75 for 30 GB (est.) | Same AWS account as SES; pay per use | Lightsail bucket (US$1 for 5 GB, US$3 for 100 GB): fixed price, but a second AWS product to learn |
| Backup copy 2 | **OVHcloud Object Storage, Standard, region BHS**, endpoint `s3.bhs.io.cloud.ovh.net` (remote `ovhbhs`) | Beauharnois → not engaged | ≈ US$0.0081/GB-month (third party); no egress charges (OVHcloud) | Same provider as the VPS, but a separate service (a Public Cloud project) | Backblaze B2 (≈ US$6.95/TB) and Wasabi (US$7.99/TB, 1 TB minimum): both in Toronto |
| Mailbox | **Microsoft Exchange Online (Plan 1)**, tenant country **Canada**: 1 licence (the owner); shared mailboxes bonjour@ and confidentialite@ (the owner as member); aliases commandes@ and dmarc@ | Canada (Product Terms; city not stated) → a light ÉFVP (Canadian law) | C$5.40/user/month, paid yearly (via summary) | Outlook on the phone; shared mailboxes need no licence; MFA | Zoho Mail Lite (US$1; Canadian data centres, Mail's placement unconfirmed). Google Workspace Business Starter (C$9.20 annual / C$11 flexible; no data region on Business plans). Microsoft 365 Business Basic (C$8.10 or C$9.50, in conflict; Teams not needed) |
| Transactional email | **Amazon SES, ca-central-1**, on Essentials (the default), send-only IAM key, custom MAIL FROM `envoi.` Already wired (`EMAIL_PROVIDER=ses`) | Montréal → likely not engaged (07 §2) | US$0.16 per 1,000 → < US$0.20/month (est.) | Already wired; domain verification once | À la carte (US$0.10 per 1,000) saves cents for one more setting. Pro and Enterprise add US$105 or US$500 a month |
| SMS | **Twilio**, one toll-free number with toll-free verification. Already wired (`SMS_PROVIDER=twilio`); texts carry no order contents (10 §6) | United States (US1; no Canadian region) → ÉFVP + Twilio's data agreement | US$2.15/month + US$0.0083/segment + carrier fee | Already wired; verification needs the corporation's registration number | Short code: US$1,000 a month, billed quarterly, plus setup. A Canadian-hosted SMS provider: none surfaced, and it would need a new adapter |
| Payments | **Stripe Canada** (already wired), unless the POS is Square (15 D9) | Outside Québec (processor's; not re-checked) → ÉFVP (07 §2) | 2.9 % + CA$0.30 per domestic card; no monthly fee | Hosted fields; Payment Links included | Square: only with a Square POS (10 §0) |
| Uptime + heartbeats | **Better Stack free** (uptime on `/`, `/svc/health/`, the admin login, certificate expiry) + **Healthchecks.io free** (backup and restore-test heartbeats) | URL checks, no personal data → not engaged | $0 (free tiers; third-party summaries) | Both run outside the VPS (17 §8.2) | Uptime Kuma on a second VPS: one more box to patch |
| CI + image registry | **GitHub Free** (the existing repo) | No personal data, as long as no dump or `.env` is committed | $0 within 2,000 private-repo minutes a month; container registry storage « currently free » | Already wired | — |

---

## 2. Findings

### 2.1 Domains and registrars

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| domain.com.status | cocovanillegranby.com is not registered: Verisign RDAP HTTP 404 at 13:11:01 UTC; control google.com 200 | verified | https://rdap.verisign.com/com/v1/domain/cocovanillegranby.com | 2026-10-29 |
| domain.ca.status | cocovanillegranby.ca is not registered: CIRA RDAP 404 at 13:11:05 UTC; control granby.ca 200 | verified | https://rdap.ca.fury.ca/rdap/domain/cocovanillegranby.ca | 2026-10-29 |
| domain.cocovanille_ca.status | cocovanille.ca is not registered: CIRA RDAP 404 at 13:11:05 UTC | verified | https://rdap.ca.fury.ca/rdap/domain/cocovanille.ca | 2026-10-29 |
| price.com.registry | The .com registry price rises from US$10.26 to US$10.97 a year on 2026-11-01 (Verisign's notice of April 2026; about +6.9 %) | verified (via summary) | https://app.edgar.tools/filing/1014473/0001014473-26-000019/q12026earningsrelease.htm | 2026-10-29 |
| price.com.icann_fee | A US$0.20 ICANN fee per .com year brings the registrar's cost to about US$11.17 | unverified | https://tldes.com/pages/com-price-increase-2026 | 2026-10-29 |
| registrar.cloudflare.ca | .ca is in Cloudflare Registrar's list of registrable TLDs, under « TLDs Recently added » (registry: CIRA). The page shows no prices | verified | https://www.cloudflare.com/tld-policies/ | 2026-10-29 |
| registrar.cloudflare.at_cost | Cloudflare sells registrations and renewals at wholesale, with no markup | verified (via summary) | https://www.cloudflare.com/press-releases/2018/cloudflare-launches-the-first-domain-registrar-you-can-love | 2026-10-29 |
| registrar.cloudflare.prices | Cloudflare: .ca US$9.19 a year (registration, renewal, transfer); .com US$10.46 | unverified | https://costgoat.com/pricing/cloudflare-domains | 2026-10-29 |
| registrar.cloudflare.nameservers | Domains registered at Cloudflare must use Cloudflare's nameservers | unverified | https://domainoffer.net/tld/ca | 2026-10-29 |
| registrar.ca.others | .ca elsewhere (USD, first year / renewal): Porkbun 8.77 / 9.18; CanSpace 8.54 / 9.25; Gandi 8.99 / 39.98; Namecheap 9.58 / 11.98, with WHOIS privacy included | unverified | https://domainoffer.net/tld/ca | 2026-10-29 |
| cira.cpr.corporation | CIRA's Canadian Presence Requirements include « Canadian corporation: a corporation under the laws of Canada or any province or territory of Canada ». A Québec société par actions qualifies | verified (via summary; direct read 403) | https://www.cira.ca/en/?p=45244 | 2026-10-29 |
| cira.registrant_name | A corporation registers under its full legal name (with its jurisdiction) | unverified | https://www.a2hosting.com/kb/getting-started-guide/registering-a-domain1/requirements-for-.ca-domains | 2026-10-29 |
| cira.audit | CIRA can ask for proof of Canadian presence at any time (« Registrant Information Validation »). A domain not proven is deleted about two months after the audit starts | unverified | https://misk.com/kb/ca-presence-requirements | 2026-10-29 |
| cira.whois | WHOIS privacy is automatic for individual registrants only. For a corporation, the registrant information is shown; a non-individual can ask for suppression only by certifying a legitimate privacy need | verified (CIRA policy v2.1 of 2020-03-09, via summary, + a registrar guide) | https://cira.ca/?page_id=3 | 2026-10-29 |

### 2.2 VPS

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| vps.ovh.bhs | OVHcloud's Canadian VPS page: « Votre VPS localisé à Beauharnois (Québec) » | verified | https://www.ovhcloud.com/fr-ca/vps/vps-canada/ | 2026-10-29 |
| vps.ovh.plans | VPS-1: 2 vCores, 4 GB, 40 GB NVMe, 500 Mbit/s, from $6.20. **VPS-2: 4 vCores, 8 GB, 75 GB NVMe, 1 Gbit/s, from $11.64.** VPS-3: 6, 12 GB, 100 GB, from $16.83. VPS-4: 8, 24 GB, 200 GB, from $32.21. All: unlimited traffic, daily backup of the previous 24 h | verified | https://www.ovhcloud.com/en-ca/vps/vps-canada/ | 2026-10-29 |
| vps.ovh.vps2_cad | OVHcloud's catalogue for the Canadian subsidiary, currency **CAD**, tax excluded, plan `vps-2027-model2` « VPS-2 2027 »: **C$13.70/month with no commitment**; C$13.01/month on 6 months prepaid; **C$11.64/month on 12 months prepaid**; installation fee 0 | verified | https://ca.api.ovh.com/1.0/order/catalog/public/vps?ovhSubsidiary=CA | 2026-10-29 |
| vps.ovh.datacentres | Datacentres offered for `vps-2027-model2`: BHS, DE, EU-SOUTH-MIL, EU-WEST-RBX, GRA, SBG, SGP, SYD, UK, WAW, YNM. No Toronto site | verified (100,000 of 6.3 M characters read) | https://ca.api.ovh.com/1.0/order/catalog/public/vps?ovhSubsidiary=CA | 2026-10-29 |
| vps.ovh.options | Premium automatic backup from $1.80/month (restore from the last 7 days); snapshots from $0.50/month; the daily backup is free | verified (the page prints « $ » only; CAD by inference from the catalogue) | https://www.ovhcloud.com/en-ca/vps/ | 2026-10-29 |
| vps.ovh.history | The same « VPS-2 from $11.64 » was read on the en-ca page on 2026-10-25 (17 §7.3). The 4-core / 8 GB « VPS-1 2026 » of September 2025 (6.49 €) is now marked deprecated | unverified (third party) | https://www.vpsbenchmarks.com/hosters/ovhcloud/plans/vps-1 | 2026-10-29 |
| vps.lightsail | Lightsail Linux bundles: General Purpose 8 GB = 2 vCPU, 160 GB, 5 TB, US$44/month; General Purpose 16 GB = 4 vCPU, 320 GB, US$84; Compute Optimized 8 GB = 4 vCPU, 320 GB, US$84. The page doesn't say whether bundle prices differ by Region | verified | https://aws.amazon.com/lightsail/pricing/ | 2026-10-29 |
| vps.vultr | `vc2-4c-8gb`: 4 vCPU, 8 GB, 160 GB, 4 TB, US$40/month, offered in Toronto (`yto`) | verified | https://api.vultr.com/v2/plans?type=vc2&per_page=50 | 2026-10-29 |
| vps.linode | Linode 8GB (`g6-standard-4`): 4 vCPU, 8 GB, 160 GB, 5 TB, US$48/month. Only Jakarta and São Paulo have different prices, so Toronto (`ca-central`) is at list | verified | https://api.linode.com/v4/linode/types | 2026-10-29 |
| vps.digitalocean | Basic 8 GiB: 4 vCPU, 160 GiB, 5,000 GiB, US$48/month; backups +20 % (weekly) or +30 % (daily). Toronto is listed; regional pricing is not stated | verified | https://www.digitalocean.com/pricing/droplets | 2026-10-29 |
| vps.montreal_others | No 4 vCPU / 8 GB price was found for other Montréal providers (Leaseweb, Vexxhost, PlanetHoster, Hostinger). A directory lists unnamed Montréal 4-core / 8 GB plans at US$10.74–20 | unverified | https://hostadvice.com/vps/montreal/ | 2026-10-29 |
| aws.ca_central_1.city | AWS Canada (Central), `ca-central-1`, opened in December 2016, is in **Montréal**. AWS's own 2016 post names no city (it says the grid is 99 % hydropower) | verified (two independent sources: trade press on AWS's 2023 Calgary launch, and the region's published coordinates 45.5088, -73.5878) | https://www.datacenterdynamics.com/en/news/aws-launches-second-cloud-region-in-canada/ | 2026-10-29 |

### 2.3 Backup storage

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| backup.ovh.bhs | OVHcloud Object Storage is offered at Beauharnois: code `bhs`, 1-AZ, classes High Performance, Standard and Infrequent Access; endpoint `https://s3.bhs.io.cloud.ovh.net`. Toronto (`ca-east-tor`) has the same classes. Cold Archive is in Paris only | verified | https://docs.ovhcloud.com/en/guides/storage-and-backup/object-storage/s3-location | 2026-10-29 |
| backup.ovh.egress | « There are no charges for API calls, incoming traffic, or outgoing traffic ». Standard storage is billed by the hour (minimum 1 hour) | verified | https://www.ovhcloud.com/en-ca/public-cloud/object-storage/ | 2026-10-29 |
| backup.ovh.price | OVHcloud's FAQ example for 1-AZ: 0.00000972 EUR per GB-hour (≈ €7.1 per TB-month; region not named; FAQ updated 2026-03-06). A third party gives ≈ US$0.0081 per GB-month | unverified | https://docs.ovhcloud.com/en/guides/storage-and-backup/object-storage/s3-faq | 2026-10-29 |
| backup.s3.ca_central_1 | S3 Standard in ca-central-1 ≈ US$0.025 per GB-month (us-east-1: US$0.023). AWS's Lightsail page charges the same US$0.025/GB for storage overage in Canada (Central) | unverified (third-party calculator) | https://costgoat.com/pricing/amazon-s3 | 2026-10-29 |
| backup.lightsail.ca | Lightsail object storage: US$1/month for 5 GB (25 GB transfer), US$3 for 100 GB (250 GB), US$5 for 250 GB (500 GB). Overage in Canada (Central): US$0.025/GB stored, US$0.09/GB transferred | verified | https://aws.amazon.com/lightsail/pricing/ | 2026-10-29 |
| backup.backblaze.ca | Backblaze B2's Canadian region (Canada East) is in Toronto and opened in January 2025; one price for every region, ≈ US$6.95/TB-month | unverified | https://businesswire.com/news/home/20250107873977/en/5767705/Backblaze-Launches-New-Data-Center-in-Canada-Now-Open-for-Business | 2026-10-29 |
| backup.wasabi.ca | Wasabi `ca-central-1` is Toronto; US$7.99/TB-month pay as you go with a 1 TB minimum (17 §7.4) | unverified | https://wasabi.com/locations | 2026-10-29 |

### 2.4 Mailbox

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| mail.m365.residency | « If Customer provisions its tenant in … Canada … Microsoft will store the following Customer Data at rest only within that Geo: Exchange Online mailbox content (e-mail body, calendar entries, and the content of e-mail attachments) ». No city is named. The admin center shows the actual location (Settings › Org settings › Organization profile › Data location) | verified | https://learn.microsoft.com/en-us/microsoft-365/enterprise/m365-dr-service-exo | 2026-10-29 |
| mail.m365.shared | A shared mailbox stores up to 50 GB without a licence. A person who opens it needs a licensed Exchange Online mailbox. Up to 25 users; its own sign-in stays blocked | verified | https://learn.microsoft.com/en-us/microsoft-365/admin/email/about-shared-mailboxes | 2026-10-29 |
| mail.m365.eop1 | Exchange Online (Plan 1): C$5.40 per user per month, paid yearly. A footnote mentions a discount offer from 2026-07-01 to 2026-09-30 | verified (via summary; the direct read timed out) | https://www.microsoft.com/en-ca/microsoft-365/exchange/compare-microsoft-exchange-online-plans | 2026-10-29 |
| mail.m365.basic | Microsoft 365 Business Basic: C$8.10 per user per month, paid yearly, on the en-ca plan chooser (via summary), against C$9.50 read on 2026-10-25 (17 §9.2). The US list price went from US$6 to US$7 on 2026-07-01 (third parties) | unverified (conflict) | https://www.microsoft.com/en-ca/microsoft-365/business/microsoft-365-plan-chooser | 2026-10-29 |
| mail.google.starter | Business Starter: C$9.20 per user per month on the annual plan, C$11 flexible, on a Google page for Canada (via summary, undated; the same figures as 17 on 2026-10-25). Today's direct reads returned euros: €6.80, with 10 % off for the first 20 users for 12 months from 2026-11-12 | unverified (CAD not readable today) | https://workspace.google.com/intl/fr_ca/pricing.html | 2026-10-29 |
| mail.google.regions | « Enterprise data regions » appears only under Enterprise. Business Starter, Standard and Plus have no data-region feature | verified | https://workspace.google.com/intl/en_ca/pricing | 2026-10-29 |
| mail.zoho.dc | Zoho lists two Canadian data centres, Toronto (primary) and Montréal (secondary). The country chosen at sign-up picks the data centre | verified | https://www.zoho.com/know-your-datacenter.html | 2026-10-29 |
| mail.zoho.lite | Zoho Mail Lite: US$1 per user per month, billed annually. Whether Zoho Mail is hosted in the Canadian data centre is not stated | unverified | https://www.capterra.com/p/174694/Zoho-Mail/pricing/ | 2026-10-29 |

### 2.5 Amazon SES

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| ses.region | ca-central-1 has SES API (`email.ca-central-1.amazonaws.com`), SMTP (`email-smtp.ca-central-1.amazonaws.com`) and receiving endpoints. DKIM records point to `dkim.amazonses.com`. The custom MAIL FROM feedback endpoint is `feedback-smtp.ca-central-1.amazonses.com`. Default quotas per Region: 200 emails per 24 hours, 1 per second (adjustable) | verified | https://docs.aws.amazon.com/general/latest/gr/ses.html | 2026-10-29 |
| ses.price | À la carte US$0.10 per 1,000. Essentials US$0.16 per 1,000 (0–10 M a month), no fixed fee. Pro US$0.22 + US$105 per account per Region per month. Enterprise US$0.23 + US$500. Accounts with no metered SES use since 2025-06-01 start on Essentials from 2026-07-21. Attachments US$0.12/GB. Standard dedicated IP US$24.95/month. New AWS customers get up to US$200 in Free Tier credits | verified | https://aws.amazon.com/ses/pricing/ | 2026-10-29 |
| ses.region_price | The pricing page doesn't say that rates differ by Region; the plans' fixed fees are charged per account per Region | verified | https://aws.amazon.com/ses/pricing/ | 2026-10-29 |

### 2.6 Twilio (Canada)

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| twilio.ca.sms | Per segment: SMS outbound and inbound US$0.0083 on long codes and toll-free; short codes US$0.0315; MMS outbound US$0.022. The page prints « $ » with no currency code (USD: inference from the en-us page) and says « pricing current as of October 2026 » | verified | https://www.twilio.com/en-us/sms/pricing/ca | 2026-10-29 |
| twilio.ca.numbers | Numbers per month: long code US$1.15; toll-free US$2.15 (bring your own: US$0.50); random short code US$1,000, billed quarterly, plus a one-time setup fee | verified | https://www.twilio.com/en-us/sms/pricing/ca | 2026-10-29 |
| twilio.ca.carrier_fees | Carrier fees, applied automatically by the recipient's carrier: Bell & Virgin 0.0087 / 0.0323; Rogers & Fido 0.0084 / 0.017; Telus 0.0073 / 0.0146; Freedom 0.0067 / 0.0089; Videotron 0.0067 / 0.0089; others 0.0064 / 0.0079. The page doesn't make clear which column is SMS; the first value is read as the SMS fee (inference) | unverified (column mapping) | https://www.twilio.com/en-us/sms/pricing/ca | 2026-10-29 |
| twilio.tfv | Unverified toll-free numbers have been blocked from texting the US and Canada since 2024-01-31 (restricted ones since 2023-11-08). Verification is free; review takes about 3–5 business days | verified (via summary) | https://support.twilio.com/hc/en-us/articles/5377174717595 | 2026-10-29 |
| twilio.tfv_brn | A business registration number is required on every new toll-free verification from 2026-02-17, for every business type except sole proprietorships. The Canadian options are CBN (Canadian Business Number) and PROVINCIAL_NUMBER. A third party gives 2026-02-10. Whether an NEQ counts as the provincial number is not stated | verified (via summary; the date conflict is third-party) | https://www.twilio.com/docs/messaging/api/tollfree-verification-resource | 2026-10-29 |
| twilio.regions | Twilio Regions: US1, IE1, AU1. A Twilio support article (about Voice) says a Canadian region is « not currently supported ». Workloads default to US1, and Twilio doesn't guarantee that data stays in the selected Region during the rollout | verified (via summary) | https://www.twilio.com/docs/global-infrastructure | 2026-10-29 |

### 2.7 Stripe (Canada)

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| stripe.ca.cards | 2.9 % + CA$0.30 per successful domestic card (wallets included); +0.8 % for international cards; +2 % for currency conversion; +0.5 % for cards entered by hand | verified | https://stripe.com/en-ca/pricing | 2026-10-29 |
| stripe.ca.disputes | Dispute received: CA$15.00. Dispute countered: CA$15.00, refunded if the dispute is won | verified | https://stripe.com/en-ca/pricing | 2026-10-29 |
| stripe.ca.refunds | No refund fee on most payment methods, but the original processing fees are not returned | verified | https://stripe.com/en-ca/pricing | 2026-10-29 |
| stripe.ca.fixed | No setup or monthly fee; Payment Links and Checkout included. In person (Terminal): 2.7 % + CA$0.05, Interac debit CA$0.15, readers from CA$79 | verified | https://stripe.com/en-ca/pricing | 2026-10-29 |

### 2.8 CI, monitoring, exchange rate

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| github.free | GitHub Free: 2,000 Actions minutes a month for private repositories (unlimited for public ones); 500 MB of Packages storage and 1 GB of transfer. « Container image storage and bandwidth for the Container registry is currently free » | verified | https://docs.github.com/en/billing/concepts/product-billing/github-packages | 2026-10-29 |
| monitor.free | Healthchecks.io's free Hobbyist plan: 20 checks. Better Stack's free plan: 10 monitors and 10 heartbeats, checks every 3 minutes (one source says 30 seconds) | unverified | https://betterstack.com/community/comparisons/better-stack-vs-healthchecks-io/ | 2026-10-29 |
| fx.usdcad | Bank of Canada daily average on 2026-10-28: 1 USD = 1.4036 CAD (1.3993–1.4038 over 2026-10-22 → 28) | verified | https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=5 | 2026-10-29 |

---

## 3. ÉFVP inventory, refreshed (hand-off to 07 §2 and Studio › Confidentialité)

| Vendor | Personal information | Where it sits | ÉFVP + written agreement (s. 17)? |
|---|---|---|---|
| OVHcloud VPS (Postgres, uploads, logs) | Orders, contacts, allergy notes, staff accounts, IP addresses | Beauharnois, Québec | No |
| AWS S3 ca-central-1 + OVHcloud Object Storage BHS | The same, encrypted with `age` | Montréal + Beauharnois | No |
| Amazon SES ca-central-1 | Name, email, order summary | Montréal | Likely no (07 §2) |
| Microsoft Exchange Online | Customer emails to bonjour@ and confidentialite@ | Canada; the city is not stated | Yes, a light one (Canadian law) |
| Twilio | Phone numbers, short texts | United States (US1) | Yes |
| Stripe | Card data, name, email | Outside Québec (not re-checked) | Yes |
| Cloudflare (registrar + DNS) | The corporation's contact details only | A US company | No customer data |
| Better Stack, Healthchecks.io, GitHub | None (URL checks; code without dumps or `.env`) | United States | No |

---

## 4. Monthly cost floor (est.)

Assumptions:
- two domains (.com + .ca) and one mail licence
- up to 30 GB in each backup store, and up to 1,000 emails a month
- SMS off until ordering opens, then 200 segments a month (100 orders × 2, as in 10 §12)
- USD × 1.4036; every figure before GST/QST

| Item | Basis | C$/month |
|---|---|---|
| VPS-2, Beauharnois | C$11.64 (12 months prepaid) / C$13.70 (month to month) | 11.64 / 13.70 |
| Domains | (US$11.17 + US$9.19) × 1.4036 ÷ 12 | 2.38 |
| Option: cocovanille.ca | US$9.19 × 1.4036 ÷ 12 | +1.07 |
| DNS | Cloudflare's free plan (not re-checked) | 0 |
| Mailbox | Exchange Online (Plan 1) × 1 | 5.40 |
| Backups | 30 GB × (US$0.025 + US$0.0081) × 1.4036 | 1.39 |
| SES | 1,000 emails × US$0.16 per 1,000 × 1.4036 | 0.22 |
| Monitoring, GitHub | Free tiers | 0 |
| **Floor without SMS** | | **21.03 / 23.09** |
| Twilio toll-free number | US$2.15 × 1.4036 | 3.02 |
| SMS usage | 200 × (US$0.0083 + US$0.0064 to 0.0087) × 1.4036 | 4.13–4.77 |
| **Floor with SMS** | | **28.18–28.82 / 30.24–30.88** |
| Card fees | 2.9 % + C$0.30 per order: C$1.61 on a C$45 order | per sale |

- **One-time:**
  - the 12-month VPS prepayment, C$139.68
  - year one of .com at US$10.46 (C$14.68) if registered before 2026-11-01
  - year one of .ca at US$9.19 (C$12.90)
- **Left out:**
  - Sentry (not re-checked)
  - OVHcloud's premium backup option (from $1.80, optional)
  - AI APIs and SEO tools (17 §11, plan v1 §15)
  - the operator's time (17 §11: about 30 minutes a week + 1 hour a month)

---

## 5. Week-0 launch checklist

Rules:
- **Every account belongs to the bakery (R26).** The owner signs up with her own login and 2FA (an authenticator app or a passkey); the agency is invited as a member or delegate.
- **No personal phone or email in a public record.**
- **Day 1 is the day the owner says go.** For the domains, that is today, 2026-10-29.
- Steps are in dependency order. `infra/README.md` steps are in brackets. Times are estimates.

| # | Day | Who · time | Step (exact) | Done when |
|---|---|---|---|---|
| 1 | D1 | Owner, 15 min, with the agency on the phone | **Cloudflare:** create the account (the owner's email, 2FA on); invite the agency as a member | The agency sees the account |
| 2 | D1 | Owner + agency, 15 min | **Domains:** register **cocovanillegranby.com** and **cocovanillegranby.ca** (+ cocovanille.ca if approved) at Cloudflare Registrar, 1 year, auto-renew on. Registrant organisation « Pâtisserie Coco Vanille inc. » exactly as at the Registraire; .ca category « Canadian corporation » (Québec, NEQ 1177082220); 3, rue Court, Granby QC J2G 4Y6; phone 450-372-7177; email: the owner's current address for now, bonjour@ from step 7 | RDAP returns 200 for both names. If the .ca form can't record the category or the « â »: register the .ca at CanSpace and point it at Cloudflare's nameservers |
| 3 | D1 | Owner (company card) + agency, 20 min | **VPS:** OVHcloud account on the Canadian site (CAD), in the corporation's name, 2FA on. Order **VPS-2** (4 vCores / 8 GB / 75 GB), datacentre **Beauharnois (BHS)**, Ubuntu 24.04 LTS, month to month | The order summary says Beauharnois; IPv4 and IPv6 are in the password manager |
| 4 | D1 | Agency, 30 min | **DNS** at Cloudflare, every record DNS-only, TTL 300: A/AAAA for `@`, `www`, `admin`, `staging`, `admin-staging` → the VPS; CAA `0 issue "letsencrypt.org"` and `0 iodef "mailto:dmarc@cocovanillegranby.com"` [DNS table] | `dig` returns the VPS address for the five names |
| 5 | D1–D2 | Agency, 1 h | **Harden the VPS**, registry login, the two `.env` files, certificates [steps 1, 3–6] | HTTPS answers on the five names (staging behind its password) |
| 6 | D2 | Owner + agency, 45 min | **Mailboxes:** buy Exchange Online (Plan 1) × 1 with country **Canada**; add the domain (TXT); licence the owner's account; create shared mailboxes **bonjour@** and **confidentialite@** (the owner as member, their sign-in blocked); add aliases commandes@ and dmarc@ to bonjour@. Then the MX, SPF (`v=spf1 include:<value shown> -all`), autodiscover and DKIM records the admin center shows; MFA on every admin | Mail to and from both addresses arrives; Organization profile › Data location shows Canada |
| 7 | D2 | Owner, 5 min | Move the Cloudflare and OVHcloud contact emails to bonjour@; keep the owner's own address as account recovery | — |
| 8 | D2 | Owner (root, MFA) + agency (IAM user), 45 min | **SES:** AWS account in the corporation's name. In **ca-central-1**: domain identity with Easy DKIM (3 CNAMEs to `dkim.amazonses.com`); custom MAIL FROM `envoi.cocovanillegranby.com` (the MX to `feedback-smtp.ca-central-1.amazonses.com` and the SPF TXT the console shows); a configuration set; a request for production access (the default quota is 200 emails per 24 h); a send-only IAM key in the production `.env` | Identity verified, production access granted, a test confirmation lands in an inbox, not in spam |
| 9 | D2 | Agency, 5 min | **DMARC:** `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:dmarc@cocovanillegranby.com` | The first aggregate report arrives |
| 10 | D2–D3 | Agency, 1 h 30 | **Backups:** an S3 bucket in ca-central-1 (versioning on; an IAM key for that bucket only); an OVHcloud Public Cloud project with an Object Storage **Standard** bucket in **BHS** (`s3.bhs.io.cloud.ovh.net`; an S3 user for that bucket only); rclone remotes `s3ca` and `ovhbhs`; the `age` key pair (private key in the password manager + printed in the shop safe); `BACKUP_REMOTES`; timers on; the first backup [steps 7, 12] | Both buckets hold an encrypted dump |
| 11 | D3 | Agency, 30 min | **First restore test** [step 12] | `restore-test.json` says `ok: true`. **No launch before this** |
| 12 | D3 | Agency, 20 min | **Monitoring:** Better Stack (free) on `/`, `/svc/health/`, the admin login page and certificate expiry; Healthchecks.io (free) for the backup and restore-test heartbeats [step 13] | A test alert reaches the agency's phone; the first heartbeat is received |
| 13 | D3 | The bakery's Google account + agency, 15 min | **Search Console:** Domain property `cocovanillegranby.com`, verified by DNS TXT; the bakery's account is owner, the agency is a full user; email alerts on; generative-AI control on « Inclure » (docs/12 §1) | Property verified. The sitemap is submitted the day production serves pages |
| 14 | D3 | Agency, 10 min | **Bing Webmaster Tools:** import from Search Console; sitemap; IndexNow later (docs/12 §2) | Site verified in Bing |
| 15 | Go-live day, not before | Agency, 10 min | **GBP link:** Google Business Profile › Site Web → `https://cocovanillegranby.com/?utm_source=google&utm_medium=organic&utm_campaign=business_profile` (docs/05 row 12). Instagram bio and Facebook « Site Web » → `https://cocovanillegranby.com/` (17 §10.2) | The profile shows the link |
| 16 | D1 + 7 days | Agency, 10 min | **DNSSEC** on in Cloudflare; TTL 3600; the HSTS ramp starts [step 14] | RDAP shows `secureDNS.delegationSigned: true` for both names |
| 17 | By mid-December 2026 | Owner + agency | **Stripe** account in the corporation's name. **Twilio** toll-free number + verification with the corporation's registration number (the CRA Business Number, or the NEQ as the provincial number if Twilio accepts it) | Both ready at least 2 weeks before ordering opens (11–24 January 2027) |
| 18 | Week 1 | Agency → lawyer | **Vendor register** (07 A3): one line each for Microsoft, Twilio and Stripe, with the region and agreement date; the ÉFVP drafts go to the lawyer | Studio › Confidentialité lists them |

---

## 6. What changes in research/17 and elsewhere (hand-off; no file edited here)

| Where | It said | Now |
|---|---|---|
| 17 §0, §7.3, §11 (VPS) | OVHcloud plan names contested; ≈ $11.64 « likely CAD », UNVERIFIED; check the city at checkout | VPS-2 = 4 vCores / 8 GB / 75 GB. OVHcloud's catalogue confirms CAD: C$13.70 a month, C$11.64 on 12 months. BHS is offered; there is no Toronto VPS site |
| 15 D7, R28 | The VPS may land in Ontario | Lower risk: OVHcloud's Canadian VPS datacentre is BHS. Keep the order-summary check |
| 17 §7.4 (backups) | S3 ca-central-1 price, Lightsail buckets in Canada, OVHcloud Object Storage at BHS: all to verify | OVHcloud Object Storage Standard at BHS is confirmed, egress free. Lightsail buckets are priced for Canada (Central). S3 ≈ US$0.025/GB-month (third party). Backblaze and Wasabi Canada = Toronto |
| 17 §7.2, §9.1; 07 §2 (SES) | ca-central-1 = Montréal [[VERIFY]]; SES there [[VERIFY]] | SES endpoints in ca-central-1 confirmed (AWS docs). Montréal by two independent sources |
| 17 §9.1 | The 2026-07-21 plan start and « new accounts on Essentials »: UNVERIFIED | Confirmed on the SES pricing page |
| 17 §9.2; 19 Y9; infra/README prerequisites | Microsoft 365 Business Basic C$9.50, or Workspace C$9.20 | Exchange Online (Plan 1) C$5.40 + free shared mailboxes. Microsoft keeps mailbox content in Canada. Business Basic's CAD price is in conflict (C$8.10 vs C$9.50) |
| 17 §10.1, §10.5 | .ca as a defensive owner decision; registrar unknown; DNS at Cloudflare | Both names unregistered (20a; re-checked at 13:11 UTC). Cloudflare Registrar for both; CIRA category « Canadian corporation »; the corporate registrant is shown in WHOIS |
| 17 §11; 10 §12; 12 §5.3; 19 §4 | Fixed ≈ C$25–55 (17), C$37–75 with SMS (10) | ≈ C$21–23 without SMS; ≈ C$28–31 with 200 segments a month (est.) |
| 10 §6, §12 (SMS) | US$0.0079 per segment, UNVERIFIED (FC); number rental and verification unknown | US$0.0083 + carrier fee; toll-free US$2.15/month; verification free, mandatory, and with a business registration number since 2026-02-17; Twilio has no Canadian region |
| 10 §1.1, §14 #2 (Stripe) | 2.9 % + C$0.30; refund and dispute fees unknown | Confirmed; CA$15 per dispute; processing fees not returned on refunds |

---

## 7. Open items

**Owner** (one line each is enough):
1. Go for the registrations in the name « Pâtisserie Coco Vanille inc. », and yes or no to cocovanille.ca (20a ID-3).
2. A company card for Cloudflare, OVHcloud, Microsoft and AWS, every account in the corporation's name.
3. The corporation's CRA Business Number, for Twilio's toll-free verification. [[FACT NEEDED: Business Number (BN) of Pâtisserie Coco Vanille inc.]]
4. Who receives outage alerts, on which phone (17 §14; infra/README step 13). [[FACT NEEDED: alert recipient and phone]]
5. Any Microsoft 365, Google Workspace, Stripe or Twilio account the shop already holds (10 §15 #2).

**Agency, at checkout:**
- OVHcloud: « Beauharnois » on the order summary; C$13.70 a month; the tax lines. Whether a running VPS can switch from monthly to the 12-month price (not checked).
- Microsoft: the C$5.40 price for Exchange Online (Plan 1); « Canada » under Data location after sign-up.
- Cloudflare: whether the .ca form records the CIRA category and the accented legal name; the .com price after 2026-11-01.
- AWS: SES production access; the S3 price for ca-central-1 on AWS's own page.
- OVHcloud Object Storage: the BHS price in CAD (the price page was unreadable).
- Twilio: which carrier-fee column is SMS; whether the NEQ is accepted as the provincial number; review time.

**Professionals:**
- **Lawyer:** the s. 17 reading for Microsoft's « Canada » geography (possibly Ontario), Twilio (United States) and Stripe (07 P4). Each vendor's data agreement serves as the written agreement.
- **Accountant:** how GST/QST applies to the services billed from outside Québec. Every price here is before tax.

**Not researched** (no result, or out of budget):
- Montréal VPS providers other than OVHcloud and AWS
- SMS providers that keep data in Canada
- Sentry's free tier and region; Cloudflare's WHOIS redaction for .com; the cities behind Microsoft's « Canada » geography
- the text of Loi 25 s. 17 (LégisQuébec answered 403)

---

## 8. Search log

### WebSearch (23 queries, standard mode, US-located, 2026-10-29)

| # | Query (verbatim) | Useful result |
|---|---|---|
| 1 | OVHcloud VPS Canada Beauharnois price 2026 VPS-1 VPS-2 vCores 8 GB | BHS on the fr-ca page; the old 4-core « VPS-1 2026 » deprecated; no Canadian price |
| 2 | CIRA Canadian Presence Requirements corporation incorporated under laws of a province .ca registrant WHOIS privacy | « Canadian corporation » category; audits; privacy unclear |
| 3 | Verisign .com wholesale price increase 2026 registry fee | US$10.26 → US$10.97 on 2026-11-01 |
| 4 | Amazon SES ca-central-1 Canada Central region pricing per 1,000 emails 2026 | Plans of 2026-07-21; no regional rate |
| 5 | Twilio toll-free verification Canada SMS required unverified blocked Canadian long code A2P 2026 | Blocked since 2024-01-31; free; 3–5 business days |
| 6 | .ca domain registration price per year 2026 Cloudflare Registrar Porkbun Namecheap Hover Webnames .ca support | Cloudflare .ca ≈ US$9.19; Porkbun; Namecheap; Cloudflare nameservers required |
| 7 | CIRA WHOIS privacy policy corporation registrant name displayed .ca individual privacy automatic | Privacy for individuals only; corporate registrant shown |
| 8 | Microsoft 365 Business Basic price Canada CAD per user month 2026 Exchange Online Plan 1 CAD after July 2026 increase | C$8.10 on the plan chooser; US$6 → US$7 on 2026-07-01 |
| 9 | Google Workspace Business Starter prix Canada "$ CA" par utilisateur par mois 2026 | C$9.20 / C$11 on a Google page for Canada (undated) |
| 10 | Zoho Mail Canada data center Toronto Montreal Mail Lite price per user CAD 2026 | Mail Lite US$1; no Canadian detail |
| 11 | Zoho Canada data centres zohocloud.ca Toronto Montréal Zoho Mail Canadian data residency | Toronto and Montréal data centres (November 2023) |
| 12 | Backblaze B2 Canada region ca-east Toronto 2026 price per TB OR Wasabi ca-central-1 Toronto Montreal region price | Both Canadian regions are in Toronto |
| 13 | OVHcloud Object Storage S3 Standard Beauharnois BHS price per GB month 2026 egress | ≈ US$0.0081/GB-month (third party); no egress fee |
| 14 | AWS Canada (Central) region ca-central-1 Montreal location S3 Standard storage price per GB Canada Central | S3 ca-central-1 ≈ US$0.025 (third-party calculator) |
| 15 | AWS launches Canada West Calgary region "Canada (Central)" Montreal second infrastructure region Canada | Canada (Central) is in Montréal (trade press) |
| 16 | VPS Montréal datacenter 4 vCPU 8 GB RAM price per month 2026 Leaseweb Montreal OR Vexxhost OR PlanetHoster OR Hostinger | No provider price; an unnamed directory range |
| 17 | DigitalOcean droplet 8 GB 4 vCPU price 2026 Toronto TOR1 Vultr Toronto 8 GB price Akamai Linode Toronto | Pointers only; prices then read from the providers' pages and APIs |
| 18 | Twilio Regions data residency US1 IE1 AU1 Canada region SMS data stored outside US Canadian SMS API provider data residency Canada | US1, IE1, AU1; no Canadian region |
| 19 | "Exchange Online (Plan 1)" price Canada CAD user month 2026 OR "Exchange Online Plan 1" price increase July 2026 | C$5.40 per user per month, yearly (Microsoft en-ca) |
| 20 | Cloudflare Registrar .ca domains supported at-cost wholesale pricing no markup .com renewal price November 2026 | .ca supported at US$9.19; .com US$10.46; no markup |
| 21 | GitHub Free plan private repository Actions minutes per month 2026 GitHub Packages container registry ghcr.io private storage free billing | 2,000 minutes; 500 MB storage; 1 GB transfer |
| 22 | Healthchecks.io free plan number of checks 2026 OR Better Stack uptime free plan monitors heartbeats 2026 | 20 checks; 10 monitors + 10 heartbeats |
| 23 | Twilio toll-free verification business registration number required 2026 Canada CRA business number NEQ fields approval time | Business registration number required from 2026-02-17; CBN or provincial number |

### WebFetch (37 reads, 2026-10-29)

| # | URL (short) | Result |
|---|---|---|
| 1 | ovhcloud.com/en-ca/vps/vps-canada/ | Read: VPS-1 to VPS-4 specs and « from » prices; no currency or city |
| 2 | aws.amazon.com/ses/pricing/ | Read: plans, fees, free-tier credits |
| 3 | ovhcloud.com/fr-ca/vps/vps-canada/ | Read: « Beauharnois (Québec) » |
| 4 | ovhcloud.com/en-ca/vps/ | Read: backup and snapshot options |
| 5 | twilio.com/en-us/sms/pricing/ca | Read: Canadian SMS, numbers, carrier fees |
| 6 | stripe.com/en-ca/pricing | Read: Canadian rates |
| 7 | developers.cloudflare.com/registrar/top-level-domains/ | Read: points to the TLD policies page |
| 8 | cira.ca/en/?p=45244 | HTTP 403 |
| 9 | cloudflare.com/tld-policies/ | Read: .ca « Recently added » |
| 10 | microsoft.com/en-ca … compare Exchange Online plans | Timeout |
| 11 | workspace.google.com/intl/en_ca/pricing | Read: euro prices; data regions Enterprise only |
| 12 | aws.amazon.com/lightsail/pricing/ | Read: bundles, buckets, Canada (Central) overage |
| 13 | workspace.google.com/intl/fr_ca/pricing.html | Read: euro prices |
| 14 | microsoft.com/en-ca … Business Basic | Timeout |
| 15 | microsoft.com/en-ca … plan chooser | Timeout |
| 16 | learn.microsoft.com … o365-data-locations | Read: index of data-residency pages |
| 17 | learn.microsoft.com … m365-dr-service-exo | Read: Canadian commitment for mailbox content |
| 18 | zoho.com/know-your-datacenter.html | Read: Toronto + Montréal |
| 19 | cloudprice.net/aws/region/ca-central-1 | Read: coordinates of ca-central-1 |
| 20 | aws.amazon.com/blogs/aws/now-open-aws-canada-central-region/ | Read: no city; 99 % hydropower |
| 21 | businesswire.com (AWS, 2023-12-19) | HTTP 403 |
| 22 | datacenterdynamics.com (AWS second region) | HTTP 403 |
| 23 | digitalocean.com/pricing/droplets | Read: Basic 8 GiB US$48 |
| 24 | vultr.com/pricing/ | HTTP 403 |
| 25 | api.vultr.com/v2/plans | Read: `vc2-4c-8gb` US$40, Toronto |
| 26 | api.linode.com/v4/linode/types | Read: `g6-standard-4` US$48 |
| 27 | ca.api.ovh.com … catalog/public/vps?ovhSubsidiary=CA | Read (first 100,000 characters): CAD, VPS-2 2027 prices, datacentres |
| 28 | ovhcloud.com/en-ca/public-cloud/prices/ | Truncated before Object Storage |
| 29 | ovhcloud.com/en-ca/public-cloud/object-storage/ | Read: no egress charges; no price |
| 30 | docs.aws.amazon.com/general/latest/gr/ses.html | Read: ca-central-1 endpoints, quotas |
| 31 | bankofcanada.ca/valet … FXUSDCAD | Read: 1.4036 on 2026-10-28 |
| 32 | domainoffer.net/tld/ca | Read: .ca prices by registrar (updated 2026-10-29 12:58) |
| 33 | legisquebec.gouv.qc.ca … P-39.1 | HTTP 403 |
| 34 | docs.ovhcloud.com … s3-location | Read: BHS and Toronto regions, classes, endpoint |
| 35 | docs.ovhcloud.com … s3-faq | Read: EUR worked example; billing by the hour |
| 36 | docs.github.com … github-packages | Read: container registry currently free |
| 37 | learn.microsoft.com … about-shared-mailboxes | Read: 50 GB without licence; 25 users |

### Direct lookups (not searches)

| Lookup | Result |
|---|---|
| RDAP with curl, 13:11:01–13:11:06 UTC: Verisign for cocovanillegranby.com and google.com; CIRA for cocovanillegranby.ca, cocovanille.ca and granby.ca | 404 and 200; 404, 404 and 200 |

---

## Sources

All seen 2026-10-29. « Direct read » = opened with WebFetch or curl. Otherwise, a WebSearch summary.

Registries
- Verisign RDAP, cocovanillegranby.com (404), direct read — https://rdap.verisign.com/com/v1/domain/cocovanillegranby.com — seen 2026-10-29
- CIRA RDAP, cocovanillegranby.ca and cocovanille.ca (404), direct read — https://rdap.ca.fury.ca/rdap/domain/cocovanillegranby.ca — seen 2026-10-29
- Verisign Reports First Quarter 2026 Results (.com price notice) — https://app.edgar.tools/filing/1014473/0001014473-26-000019/q12026earningsrelease.htm — seen 2026-10-29
- .com price increase 2026 (ICANN fee) — https://tldes.com/pages/com-price-increase-2026 — seen 2026-10-29
- CIRA, Canadian Presence Requirements for registrants (direct read refused, HTTP 403) — https://www.cira.ca/en/?p=45244 — seen 2026-10-29
- CIRA Privacy Policy, version 2.1 (2020-03-09) — https://cira.ca/?page_id=3 — seen 2026-10-29
- CanSpace, How do I change WHOIS privacy options — https://www.canspace.ca/clients/knowledgebase/5/How-do-I-change-WHOIS-privacy-options.html — seen 2026-10-29
- PlanetHoster, Canada (.ca) domain specifications — https://kb.planethoster.com/en/?p=5507 — seen 2026-10-29
- A2 Hosting, Requirements for .ca domains — https://www.a2hosting.com/kb/getting-started-guide/registering-a-domain1/requirements-for-.ca-domains — seen 2026-10-29
- Misk, .ca presence requirements — https://misk.com/kb/ca-presence-requirements — seen 2026-10-29

Registrars and DNS
- Cloudflare, TLD policies (.ca « Recently added »), direct read — https://www.cloudflare.com/tld-policies/ — seen 2026-10-29
- Cloudflare Docs, Registrar top-level domains, direct read — https://developers.cloudflare.com/registrar/top-level-domains/ — seen 2026-10-29
- Cloudflare, press release: the first domain registrar you can love (2018, at cost) — https://www.cloudflare.com/press-releases/2018/cloudflare-launches-the-first-domain-registrar-you-can-love — seen 2026-10-29
- CostGoat, Cloudflare domain pricing (updated 2026-10-20) — https://costgoat.com/pricing/cloudflare-domains — seen 2026-10-29
- dn.ca, Cloudflare adds support for .CA — https://dn.ca/topic/8971/ — seen 2026-10-29
- domainoffer.net, .CA prices by registrar (updated 2026-10-29), direct read — https://domainoffer.net/tld/ca — seen 2026-10-29

VPS
- OVHcloud, VPS Canada (fr-CA), direct read — https://www.ovhcloud.com/fr-ca/vps/vps-canada/ — seen 2026-10-29
- OVHcloud, VPS Canada (en-CA), direct read — https://www.ovhcloud.com/en-ca/vps/vps-canada/ — seen 2026-10-29
- OVHcloud, VPS (en-CA, options), direct read — https://www.ovhcloud.com/en-ca/vps/ — seen 2026-10-29
- OVHcloud API, public VPS order catalogue, Canadian subsidiary, direct read — https://ca.api.ovh.com/1.0/order/catalog/public/vps?ovhSubsidiary=CA — seen 2026-10-29
- VPSBenchmarks, OVHcloud VPS-1 (deprecated plan) — https://www.vpsbenchmarks.com/hosters/ovhcloud/plans/vps-1 — seen 2026-10-29
- AWS, Lightsail pricing, direct read — https://aws.amazon.com/lightsail/pricing/ — seen 2026-10-29
- Vultr API, Cloud Compute plans, direct read — https://api.vultr.com/v2/plans?type=vc2&per_page=50 — seen 2026-10-29
- Linode (Akamai) API, Linode types, direct read — https://api.linode.com/v4/linode/types — seen 2026-10-29
- DigitalOcean, Droplet pricing, direct read — https://www.digitalocean.com/pricing/droplets — seen 2026-10-29
- HostAdvice, Montréal VPS hosting providers (Aug 2026) — https://hostadvice.com/vps/montreal/ — seen 2026-10-29

AWS region
- AWS News Blog, Now Open: AWS Canada (Central) Region (2016-12-08), direct read — https://aws.amazon.com/blogs/aws/now-open-aws-canada-central-region/ — seen 2026-10-29
- DatacenterDynamics, AWS launches second cloud region in Canada (direct read refused, HTTP 403) — https://www.datacenterdynamics.com/en/news/aws-launches-second-cloud-region-in-canada/ — seen 2026-10-29
- Business Wire, AWS Launches Second Infrastructure Region in Canada (2023-12-19; direct read refused, HTTP 403) — https://businesswire.com/news/home/20231219899872/en/AWS-Launches-Second-Infrastructure-Region-in-Canada/ — seen 2026-10-29
- cloudprice.net, AWS ca-central-1 (coordinates), direct read — https://cloudprice.net/aws/region/ca-central-1 — seen 2026-10-29

Backup storage
- OVHcloud Docs, Object Storage endpoints and geo-availability, direct read — https://docs.ovhcloud.com/en/guides/storage-and-backup/object-storage/s3-location — seen 2026-10-29
- OVHcloud Docs, Object Storage FAQ (updated 2026-03-06), direct read — https://docs.ovhcloud.com/en/guides/storage-and-backup/object-storage/s3-faq — seen 2026-10-29
- OVHcloud, Object Storage (en-CA), direct read — https://www.ovhcloud.com/en-ca/public-cloud/object-storage/ — seen 2026-10-29
- OVHcloud, Public Cloud prices (en-CA; truncated) — https://www.ovhcloud.com/en-ca/public-cloud/prices/ — seen 2026-10-29
- CloudTweaks, OVHcloud Object Storage (reviewed May 2026) — https://tools.cloudtweaks.com/company/ovhcloud-object-storage — seen 2026-10-29
- CostGoat, Amazon S3 pricing calculator — https://costgoat.com/pricing/amazon-s3 — seen 2026-10-29
- Business Wire, Backblaze launches new data center in Canada (2025) — https://businesswire.com/news/home/20250107873977/en/5767705/Backblaze-Launches-New-Data-Center-in-Canada-Now-Open-for-Business — seen 2026-10-29
- Upstash, Backblaze B2 pricing explained (October 2026) — https://upstash.com/blog/backblaze-b2-pricing-explained-2026 — seen 2026-10-29
- Wasabi, storage regions — https://wasabi.com/locations — seen 2026-10-29

Mail
- Microsoft Learn, Data Residency for Exchange Online (updated 2026-10-08), direct read — https://learn.microsoft.com/en-us/microsoft-365/enterprise/m365-dr-service-exo — seen 2026-10-29
- Microsoft Learn, Microsoft 365 services data locations, direct read — https://learn.microsoft.com/en-us/microsoft-365/enterprise/m365-dr-services-data-location — seen 2026-10-29
- Microsoft Learn, About shared mailboxes (2026-03-13), direct read — https://learn.microsoft.com/en-us/microsoft-365/admin/email/about-shared-mailboxes — seen 2026-10-29
- Microsoft (en-CA), Compare Exchange Online plans (direct read timed out) — https://www.microsoft.com/en-ca/microsoft-365/exchange/compare-microsoft-exchange-online-plans — seen 2026-10-29
- Microsoft (en-CA), Microsoft 365 plan chooser (direct read timed out) — https://www.microsoft.com/en-ca/microsoft-365/business/microsoft-365-plan-chooser — seen 2026-10-29
- bestructured, Microsoft 365 business pricing in 2026 (US increase) — https://bestructured.com/how-much-does-office-365-cost/ — seen 2026-10-29
- Google Workspace, pricing (en-CA locale, euro prices), direct read — https://workspace.google.com/intl/en_ca/pricing — seen 2026-10-29
- Google Workspace, pricing (fr-CA locale, euro prices), direct read — https://workspace.google.com/intl/fr_ca/pricing.html — seen 2026-10-29
- Zoho, Know your datacenter, direct read — https://www.zoho.com/know-your-datacenter.html — seen 2026-10-29
- ChannelBuzz, Zoho launches first two Canadian data centres in Montréal and Toronto (2023-11) — https://channelbuzz.ca/2023/11/zoho-launches-first-two-canadian-data-centres-in-montreal-and-toronto-41941/ — seen 2026-10-29
- Capterra, Zoho Mail pricing 2026 — https://www.capterra.com/p/174694/Zoho-Mail/pricing/ — seen 2026-10-29

Amazon SES
- AWS, Amazon SES pricing, direct read — https://aws.amazon.com/ses/pricing/ — seen 2026-10-29
- AWS, Amazon SES endpoints and quotas, direct read — https://docs.aws.amazon.com/general/latest/gr/ses.html — seen 2026-10-29

Twilio
- Twilio, SMS pricing in Canada, direct read — https://www.twilio.com/en-us/sms/pricing/ca — seen 2026-10-29
- Twilio Support, toll-free message verification (US and Canada) — https://support.twilio.com/hc/en-us/articles/5377174717595 — seen 2026-10-29
- Twilio Support, Best practices for toll-free SMS and MMS in the US and Canada — https://support.twilio.com/hc/en-us/articles/360038172934-Best-Practices-for-Using-Toll-Free-SMS-and-MMS-in-the-US-and-Canada — seen 2026-10-29
- Twilio Docs, Tollfree Verification resource (registration authorities) — https://www.twilio.com/docs/messaging/api/tollfree-verification-resource — seen 2026-10-29
- Twilio blog, New toll-free verification policy for collecting business registration number — https://www.twilio.com/en-us/blog/toll-free-verification-policy — seen 2026-10-29
- Whitespark, Toll-free SMS registration requirements: new rules in 2026 — https://support.whitespark.ca/en/articles/14039903-toll-free-sms-registration-requirements-new-rules-in-2026 — seen 2026-10-29
- Twilio Docs, Global infrastructure (Regions) — https://www.twilio.com/docs/global-infrastructure — seen 2026-10-29
- Twilio Support, Resolving missing Canada CA1 outbound Voice region — https://support.twilio.com/hc/en-us/articles/51810214523803-Resolving-Missing-Canada-CA1-Outbound-Voice-Region-in-the-Twilio-Console — seen 2026-10-29

Stripe
- Stripe, Pricing (Canada), direct read — https://stripe.com/en-ca/pricing — seen 2026-10-29

CI, monitoring, exchange rate
- GitHub Docs, GitHub Packages billing, direct read — https://docs.github.com/en/billing/concepts/product-billing/github-packages — seen 2026-10-29
- GitHub Docs, How use of GitHub Actions is measured — https://docs.github.com/billing/managing-billing-for-your-products/managing-billing-for-github-actions — seen 2026-10-29
- Better Stack, Better Stack vs Healthchecks.io (2026) — https://betterstack.com/community/comparisons/better-stack-vs-healthchecks-io/ — seen 2026-10-29
- Product Compass, Free uptime monitoring tools compared — https://www.productcompass.pm/p/free-uptime-monitoring — seen 2026-10-29
- Bank of Canada, Valet API, FXUSDCAD, direct read — https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=5 — seen 2026-10-29

Read but returned nothing usable (listed for the record): legisquebec.gouv.qc.ca P-39.1 and vultr.com/pricing (HTTP 403); microsoft.com Business Basic page (timeout).

Repo inputs
- research/17-vps-self-hosting-and-domain.md (§0, §7, §9–§11, §14), research/20a-identity-and-history.md (§0.3, §7, ID-3), research/21-decisions-agence-2026-10-29.md (A1, A2, B5), research/07-legal-quebec-compliance.md (P4, §2, A3), research/10-ordering-tech-architecture.md (§1, §6, §12, §15), research/14-owner-questions.md (T1–T3), research/15-decisions-and-risks.md (D7, D9, R26, R28), research/19-build-workflow-and-requirements.md (§3.1), infra/README.md, infra/.env.example, docs/05-gbp-checklist.md (row 12), docs/12-setup-mesure.md (§1, §2)
