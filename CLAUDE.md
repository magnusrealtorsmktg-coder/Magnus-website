# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo contains two independent pieces:

| Path | What it is |
|------|-----------|
| `magnus-sanity/` | Sanity v5 Studio — the CMS editors use |
| `index.html` | The entire frontend website — a single static file |

The website reads content from Sanity at runtime and falls back to hard-coded content if the API is unreachable, so it cannot be broken by a Sanity outage.

## Sanity Studio commands

All commands must be run from inside `magnus-sanity/`:

```bash
cd magnus-sanity
npm run dev       # local studio at http://localhost:3333
npm run build     # production build
npm run deploy    # publish to magnus-realtors.sanity.studio
```

**Credentials** — Project ID `93f80h7a`, dataset `production`. These are already set in `sanity.config.ts` and `sanity.cli.ts`.

## Seeding content

Requires an **Editor** token from sanity.io/manage → API → Tokens. Wipes managed content and re-imports everything (safe to re-run — clears first).

```bash
cd magnus-sanity
export SANITY_PROJECT_ID=93f80h7a
export SANITY_TOKEN=<editor_token>
node seed.mjs
```

Delete the token after use — the website only reads public data.

## Schema architecture

Seven document types live in `magnus-sanity/schemaTypes/`:

- **`property`** — listing cards + detail view. References a `city` document (drives the city filter pill). Has numeric `pmin`/`pmax` fields for the budget filter range; the human-readable `price` string is separate.
- **`city`** — each document creates a filter pill on the site. Also holds that city's Market Insights blurb and snapshot stats.
- **`featuredProject`** — the "Spaces worth a closer look" showcase grid.
- **`teamMember`** — "Meet the Owners" cards.
- **`review`** — scrolling testimonials marquee.
- **`marketInsights`** *(singleton)* — region-level market figures (official indicators + "as of" date). Per-city data lives on `city` documents.
- **`siteSettings`** *(singleton)* — phone, email, and social links. Phone is used for both tap-to-call and WhatsApp.

### Singleton protection

`marketInsights` and `siteSettings` are declared as singletons in `sanity.config.ts`. The config filters them from the "Create new" templates menu and removes the Delete / Duplicate / Unpublish actions on their documents. When editing these schemas, keep that constraint in mind — do **not** rename their document IDs (`'marketInsights'` and `'siteSettings'`) or the pinned Studio items in `structure.ts` will break.

### Adding a city

Create a `city` document → set `name` (slug auto-generates) → set `order`. That city immediately becomes selectable on properties and adds a filter pill to the site. No code changes needed.

### Display ordering

Every schema has an optional `order: number` field. Lower values appear first. Properties also support ordering by creation date as a fallback.

## Studio structure

`magnus-sanity/structure.ts` defines a custom sidebar layout:
- Grouped list items for each content type
- A divider separating the regular documents from the two singleton settings
- Singletons are pinned as direct `.child(S.document()...)` items so editors can never create duplicates

## CORS

The website domain must be added under sanity.io/manage → API → CORS origins (credentials: off). Required origins: `http://localhost:8081` (local dev) and the production domain.
