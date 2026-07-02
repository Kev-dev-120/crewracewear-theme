# Crew Racewear — Shopify Theme

A new Shopify theme for [crewracewear.com](https://www.crewracewear.com), redesigned to match
the visual style of [100%](https://www.100percent.com) (ride100percent.com): black/white base,
bold uppercase display type, one high-voltage accent color, full-bleed hero imagery, mega-menu
navigation, and a clean product-grid layout with quick-add.

## What's in here

- `layout/theme.liquid` — base HTML shell
- `sections/` — header, footer, hero, category tiles, featured collection, image-with-text,
  newsletter, and the main product/collection/cart/search/404 sections
- `templates/*.json` — JSON templates wiring sections together (Online Store 2.0)
- `assets/theme.css` — the full design system (colors, type, components)
- `assets/theme.js` — mobile menu + search drawer interactions
- `config/` — theme settings (brand colors, fonts, social links)

## Design system

| Token | Value | Use |
|---|---|---|
| `--color-black` | `#0a0a0a` | Text, header, footer, dark sections |
| `--color-accent` | `#d7ff3d` | Primary CTA, sale/highlight accents |
| `--color-white` | `#ffffff` | Background |
| Heading font | Archivo (900/800/700) | Uppercase, tight tracking — matches 100%'s bold headline style |
| Body font | Inter | Product copy, descriptions |

Swap `--color-accent` in `assets/theme.css` (and `config/settings_data.json`) to change the
signature color without touching layout.

## Content wired up

Placeholder copy uses real Crew Racewear info gathered from the live site:
- Collections: **STRIKE**, **SURGE**, **RGB Collection**, **Tees**
- Contact: crewracewear@gmail.com
- Social: Instagram @thecrewmxb, YouTube @TheCrewRacingmxb, Discord

Replace these with real product/collection data once connected to the store (see below).

## Previewing the theme

This theme isn't connected to a live Shopify store yet — it needs to be pushed to a store to
render real products, pages, and the theme editor. Two ways to preview:

**Option A — Shopify CLI (recommended)**
```powershell
# from this folder
shopify theme dev --store your-store.myshopify.com
```
This starts a local preview server against your store's data (requires a Shopify Partner/dev
store or the live store, and CLI login).

**Option B — Push to a development theme**
```powershell
shopify theme push --store your-store.myshopify.com --unpublished
```
This uploads the theme as a new, unpublished theme you can preview and edit live in the
Shopify theme editor before publishing.

If you don't have the Shopify CLI installed: `npm install -g @shopify/cli @shopify/theme`.

## Next steps

1. Connect to the real crewracewear.com Shopify store and push this theme as a draft.
2. Replace placeholder hero/category images with real product photography.
3. Point `featured-collection` and `category-tiles` blocks at real collection handles
   (STRIKE, SURGE, RGB, Tees).
4. Review in the Shopify theme editor and adjust copy/colors via `config/settings_schema.json`
   settings — no code changes needed for basic tweaks.
5. Run `shopify theme check` to lint before publishing.
