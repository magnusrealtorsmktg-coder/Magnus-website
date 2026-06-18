# PROJECT CONTEXT & OPERATIONS RUNBOOK

> **Read this first.** This file is the single source of truth for how the Magnus Realtors website
> is built, deployed, and operated. It is written so that a future Claude Code agent (or any
> developer) who only has this GitHub repository can fully understand and run the project.
> `CLAUDE.md` covers the schema/architecture basics; **this file covers everything operational.**

---

## 1. What this project is

A marketing website for **Magnus Realtors** (a real-estate agency in Virar West, Maharashtra, India).

- The **entire frontend is a single static file: `index.html`** (~900 KB — it embeds base64 images and inline CSS/JS).
- It reads live content from a **Sanity CMS** at runtime, and **falls back to hard-coded content** if Sanity is unreachable — so the site can't be broken by a CMS outage.
- A small **Netlify serverless function** lets website visitors submit reviews (saved as Sanity drafts).
- A **Netlify edge function** serves a lightweight page to social-share crawlers (see §10).

## 2. Key URLs, accounts & IDs

| Thing | Value |
|---|---|
| **Live website** | https://magnusrealtor.in  (also `www.` → redirects to apex) |
| Netlify subdomain | https://magnus-realtors.netlify.app |
| **GitHub repo** | https://github.com/magnusrealtorsmktg-coder/Magnus-website  — **PUBLIC** (see §10) |
| **Sanity Studio (CMS admin)** | https://magnus-realtors.sanity.studio |
| Sanity project ID / dataset | `93f80h7a` / `production` |
| Sanity Studio appId | `xduecf1iyy09d4jhqo1pas7i` |
| Google Analytics (GA4) ID | `G-03RCR97JDM` |
| Domain registrar | **Hostinger** (domain `magnusrealtor.in`) |

**Account ownership:** Netlify, Sanity, Google Analytics, the GitHub org `magnusrealtorsmktg-coder`, and the Hostinger domain are all under the **client's** account (`magnusrealtorsmktg@gmail.com`). The developer's personal GitHub account (`adarshdev200`) is a **collaborator** on the repo. The client also uses **email** on `magnusrealtor.in` via Hostinger — never touch the email DNS records.

## 3. Repository layout

| Path | What it is |
|---|---|
| `index.html` | The whole website (one static file). Reads Sanity at runtime; has hard-coded fallbacks. |
| `privacy.html`, `terms.html`, `disclaimer.html`, `legal.css` | Legal pages + their shared styling. |
| `og-image.png` / `og-image.jpg` | Social share preview image (1200×630, the brand logo on cream). |
| `netlify.toml` | Build/deploy config. Assembles `dist/` and publishes it. |
| `netlify/functions/submit-review.js` | Serverless function — writes visitor reviews to Sanity as drafts. |
| `netlify/edge-functions/og.js` | Edge function — serves a tiny OG-only page to share crawlers (WhatsApp etc.). |
| `magnus-sanity/` | The **Sanity v5 Studio** (the CMS the client edits in). |
| `magnus-sanity/schemaTypes/*` | Content schemas (see §5). |
| `magnus-sanity/seed*.mjs` | One-off seed scripts. |
| `CLAUDE.md` | Short architecture notes auto-loaded by Claude Code. |
| `PROJECT-CONTEXT.md` | **This file.** |

**Not committed (gitignored):** `.env`, `node_modules/`, `dist/`, `.netlify/`, `.claude/settings.local.json`. See §7 for how to recreate `.env`.

## 4. How it's deployed  (GitHub → Netlify, automatic)

**Continuous deployment is set up.** Every push to the `main` branch automatically builds and publishes to Netlify (`magnus-realtors.netlify.app` → `magnusrealtor.in`) in ~30 seconds. **You do not run a deploy command for normal changes — just `git push`.**

Build settings (from `netlify.toml`):
- **Build command:** `rm -rf dist && mkdir -p dist && cp index.html privacy.html terms.html disclaimer.html legal.css og-image.png og-image.jpg dist/`
- **Publish dir:** `dist`  ·  **Functions:** `netlify/functions`  ·  **Edge functions:** auto from `netlify/edge-functions`
- The build deliberately copies **only** the public files into `dist/`, keeping `.env`, `magnus-sanity/`, and `node_modules` **out** of the deploy.

**Netlify env var (set in the dashboard, not in the repo):** `SANITY_REVIEW_TOKEN` — used by the review function.

Manual deploy (only if CD is ever broken, and you're authenticated to the client's Netlify):
```bash
rm -rf dist && mkdir -p dist && cp index.html privacy.html terms.html disclaimer.html legal.css og-image.png og-image.jpg dist/
netlify deploy --prod --dir=dist
```

## 5. The content system  (Sanity)

Content/images shown on the site are edited by the client in the hosted Studio (**magnus-realtors.sanity.studio**). The site fetches it all in one GROQ query in `index.html` (search for `loadCMS`).

**Schema document types** (`magnus-sanity/schemaTypes/`):
`property`, `city`, `featuredProject`, `service`, `teamMember`, `review`, `happyCustomer`, `marketInsights` *(singleton)*, `siteSettings` *(singleton)*.

**Editing/deploying the Studio** (after changing any schema):
```bash
cd magnus-sanity
npm install            # deps not in repo
npx sanity login       # one-time, opens browser
npm run deploy         # publishes to magnus-realtors.sanity.studio
```

**CORS:** the live domains must be in Sanity's allowed origins (sanity.io/manage → API → CORS), credentials OFF. Already added: `https://magnusrealtor.in`, `https://www.magnusrealtor.in`, `https://magnus-realtors.netlify.app`, `http://localhost:8081`. Add any new domain or the browser fetch will fail (site then shows fallback content). CLI: `cd magnus-sanity && npx sanity cors add https://NEWDOMAIN --no-credentials`.

**Seeding:** `seed.mjs` re-imports demo content (needs an Editor token + the env vars in its header). `seed-services.mjs` seeds the Services cards — run via `npx sanity exec seed-services.mjs --with-user-token`.

**Hardcoded vs Sanity-managed:** Properties, Services, Reviews, Happy Customers, Featured Projects, Team/Owners, Locations, Market Insights, and Site Settings (contact/socials + hero/about/why images) are **Sanity-managed**. Section headings/body copy that are *not* in the schema are hard-coded in `index.html` and require a code edit + push.

## 6. Custom domain & DNS  (Hostinger — "external DNS")

The domain stays on **Hostinger nameservers**; only two records point the website to Netlify:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `75.2.60.5` (Netlify) |
| `CNAME` | `www` | `magnus-realtors.netlify.app` |

**Do NOT touch the email records** (`MX`, `TXT`/SPF, the `*_domainkey` DKIM CNAMEs, `autodiscover`, `autoconfig`) — they run the client's email on Hostinger. The **domain must be renewed by the client** or both website and email go down. Netlify auto-issues + renews the HTTPS (Let's Encrypt) certificate, and forces HTTP→HTTPS automatically.

## 7. Secrets & things NOT in the repo  (how to recreate)

- **`.env`** (gitignored, local only) contains: `SANITY_REVIEW_TOKEN=sk...`. This is a Sanity token (ideally scoped create-only on the `review` type) used by the review function. It is also set as a **Netlify environment variable** of the same name.
  - **To recreate `.env`:** copy the value from **Netlify → Site config → Environment variables → `SANITY_REVIEW_TOKEN`**, OR create a fresh token at **sanity.io/manage → project → API → Tokens** and set it both in `.env` (local) and in Netlify's env vars.
  - `.env` is only needed to run the site locally with `netlify dev`. It is **not** needed to edit + push + deploy.
- **`node_modules/`** — recreate with `npm install` inside `magnus-sanity/` (the root has no package.json; the website is plain HTML).
- **`dist/`** — build output; recreated by the build command.

## 8. How to make changes  (the everyday workflow)

**Design / layout / text / new features (code):**
```bash
git clone https://github.com/magnusrealtorsmktg-coder/Magnus-website.git
cd Magnus-website
# edit index.html (or other files)
git add -A && git commit -m "describe change" && git push
# Netlify auto-deploys in ~30s
```
*(First push asks for GitHub login — use an account with write access; GitHub needs a Personal Access Token, not a password.)*

**Schema change:** edit `magnus-sanity/schemaTypes/*`, then `cd magnus-sanity && npm run deploy` to update the Studio. If a new field should appear on the site, also wire it into the GROQ query + render code in `index.html` and push.

**Content / images:** the client does this in the Studio — no code, no deploy.

## 9. Analytics & social sharing

- **Google Analytics 4** (`G-03RCR97JDM`) tag is in the `<head>` of `index.html` and the legal pages. View stats at analytics.google.com (under the client's account).
- **Social share preview (Open Graph):** tags are at the top of `index.html`'s `<head>`; image is `og-image.jpg`. Because `index.html` is huge, the **edge function** (`netlify/edge-functions/og.js`) serves a tiny OG-only page to share crawlers (WhatsApp/Facebook/etc.) so previews work — real users + search engines still get the full site. If you change the title/description/image, update **both** `index.html` and `og.js`. After changes, refresh caches via the Facebook Sharing Debugger.

## 10. Important gotchas & decisions  (why things are the way they are)

- **The repo is PUBLIC on purpose.** Netlify's free plan blocks production builds from "unrecognized Git contributors" on **private** repos. Making the repo public removed that block. There are **no secrets in the repo** (the token lives only in `.env`/Netlify), so public is safe. *Don't make it private again unless you also fix the contributor/billing situation.*
- **`index.html` is ~900 KB** (embedded base64 images + inline CSS). This is why the OG **edge function** exists — WhatsApp couldn't fetch/parse the big page for link previews.
- **The site never hard-breaks:** every Sanity-driven section has hard-coded fallback content in `index.html`. If Sanity/CORS is down, the built-in content shows.
- **Don't commit the deliverable PDFs** (quotation/contract) to this public repo — they contain fee amounts and personal contact info. See §12.
- Costs: Netlify, Sanity, Web3Forms, GA all run on **free tiers** for this traffic level. Only recurring cost is the **domain renewal** (client's Hostinger).

## 11. "I only have the GitHub repo" — recovery checklist

If the local folder is lost and only GitHub remains:
1. `git clone https://github.com/magnusrealtorsmktg-coder/Magnus-website.git && cd Magnus-website`
2. The website is just `index.html` — open it, or run `netlify dev` for the function/edge-function locally.
3. To deploy: it **auto-deploys on `git push`** (if Netlify is still connected to the repo). If not, reconnect in Netlify (Add new site → Import from GitHub → this repo) using the build settings in §4, and set the `SANITY_REVIEW_TOKEN` env var.
4. Recreate `.env` only if running locally — see §7.
5. Studio: `cd magnus-sanity && npm install && npx sanity login && npm run deploy`.
6. Confirm CORS (§5) and DNS (§6) are intact. Everything else is in this repo.

## 12. Business documents

A client **content guide**, a **quotation**, and a **service/maintenance agreement** were produced as PDFs (generated with Python/fpdf2 from the brand logo). These were intentionally **not committed** (the quotation/contract contain fee amounts + personal contact info, and the repo is public). They live with the developer; back them up separately (email/drive). They can be regenerated with simple fpdf2 scripts if needed.
