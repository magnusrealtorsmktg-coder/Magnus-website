# Magnus Realtors — Sanity CMS

Your client can edit the whole site from the Studio dashboard. The website
(`index.html`) reads everything live, and falls back to the built-in content if
Sanity is ever unreachable, so it can't break.

## What's editable

| Studio section      | Controls on the site                                          |
|---------------------|---------------------------------------------------------------|
| Properties          | The listings grid + detail view                               |
| Locations           | City filter pills, market tabs, hero dropdown, per-city market |
| Featured Projects   | The "Spaces worth a closer look" showcase                      |
| Team / Owners       | The "Meet the Owners" cards + the intro paragraph              |
| Reviews             | The scrolling testimonials marquee (add/remove freely)         |
| Market Insights     | The "as of" date + region-level official figures               |
| Site Settings       | Phone, email, Instagram/Facebook/LinkedIn/YouTube              |

Properties link to a Location, so adding a city under **Locations** makes a new
filter pill appear *and* makes that city selectable on properties automatically.

## First-time setup (already done if you followed along)

1. `cd magnus-sanity && npm install`
2. Project id `93f80h7a` and dataset `production` are already set in
   `sanity.config.ts`, `sanity.cli.ts`, and `index.html`.
3. Add your website's address under sanity.io/manage → API → CORS origins
   (e.g. `http://localhost:8081`, and your real domain later). Credentials off.

## Import / refresh all content

This wipes the managed content and re-imports every section with images. It's
safe to re-run (it clears first, so no duplicates). Needs an **Editor** token
(sanity.io/manage → API → Tokens → Add → Editor).

From the `magnus-sanity` folder:

```
export SANITY_PROJECT_ID=93f80h7a
export SANITY_TOKEN=your_editor_token
node seed.mjs
```

Delete the token afterwards — the website never uses one (it only reads public
data). Run the Studio with `npm run dev`, deploy it for the client with
`npm run deploy`, and invite them under sanity.io/manage → Members (Editor role).

## Notes for editing

- **Adding a city:** Locations → create → set name (slug auto-fills), order, and
  optionally its market blurb + snapshot stats. Then pick it on any property.
- **Prices:** the `Price label` is the text shown; `Min/Max price` are the plain
  rupee numbers that drive the budget filter (e.g. 7800000).
- **Images:** drag-and-drop full-size; Sanity resizes/optimises automatically.
  Drag the focus point so the important part stays visible when cropped.
- **Reviews:** the avatar initials auto-fill from the name if left blank; the
  Google link is optional.
- **Market Insights & Site Settings** are single documents — just edit the one
  that's there; you can't create duplicates.
