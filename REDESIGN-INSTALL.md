# Crew Racewear redesign — theme files

This is the real Shopify Online Store 2.0 code for the redesign we mocked up
(gradient design system, IRL/MXBikes homepage tabs, two distinct product
page templates). It's meant to be added into `Kev-dev-120/crewracewear-theme`.

I can't push this to GitHub myself — this environment's sandbox doesn't have
authorized access to that repo (same 403 we hit trying to clone it earlier),
and there's no way to grant that from in here. Fastest way to get it in:

```
# from a folder where you've already cloned crewracewear-theme locally
cp -r assets/theme-redesign.css assets/theme-redesign.js  path/to/crewracewear-theme/assets/
cp sections/homepage-shop-tabs.liquid sections/main-product-kit.liquid sections/main-product-digital.liquid  path/to/crewracewear-theme/sections/
cp templates/product.kit.json templates/product.digital.json  path/to/crewracewear-theme/templates/

cd path/to/crewracewear-theme
git checkout -b redesign/gradient-shop-tabs
git add assets/theme-redesign.css assets/theme-redesign.js sections/homepage-shop-tabs.liquid sections/main-product-kit.liquid sections/main-product-digital.liquid templates/product.kit.json templates/product.digital.json
git commit -m "Add gradient design system, IRL/MXBikes homepage tabs, kit + digital product templates"
git push -u origin redesign/gradient-shop-tabs
```

Then open a PR (or push straight to main if that's how you're working this
repo) and preview it with `shopify theme dev` per the repo's own README.

## What's in this bundle

```
assets/theme-redesign.css     — design tokens + every component style (gradient system, tabs, cards, PDP layout)
assets/theme-redesign.js      — homepage tab switcher + variant matching JS for the kit PDP
sections/homepage-shop-tabs.liquid   — the whole "two shops in one" homepage
sections/main-product-kit.liquid     — Racewear Kit product page
sections/main-product-digital.liquid — MX Bikes game content product page
templates/product.kit.json           — assigns the kit section as a product template
templates/product.digital.json       — assigns the digital section as a product template
templates/index.suggested.json       — reference only, see note in that file — merge, don't overwrite
```

## 1. Wire up the CSS/JS

In `layout/theme.liquid`, add (after your existing `theme.css`/`theme.js` tags so this can override where needed):

```liquid
{{ 'theme-redesign.css' | asset_url | stylesheet_tag }}
{{ 'theme-redesign.js' | asset_url | script_tag }}
```

Every class in the new files is prefixed `crw-` specifically so it can sit
alongside your existing `theme.css` without collisions. Nothing here
touches your existing header/footer markup — see "What this doesn't do" below.

## 2. Homepage section

In the theme editor, add the **"Shop tabs (IRL / MXBikes)"** section to your
homepage (or swap it in for whatever currently renders your hero — see
`templates/index.suggested.json` for the reference JSON). Add blocks:

- 3× **Racewear kit** blocks → pick your STRIKE/SURGE/RGB kit products, set swatch colors
- 4× **Game content category tile** blocks → Bike Paints/PSDs, Helmets, Gear, Suspension Setups
- 4× **Game content product** blocks → your latest liveries/skins/setups

All text (headings, hero copy, trust strip items, button labels/links) is
editable from the theme editor — nothing is hardcoded.

## 3. Product setup — this is the part that actually matters

### Racewear Kit products

**Shopify caps every product at 3 variant options.** Since jersey, pants,
and gloves each need independent sizing (that was the whole point — "mixed
sizing is expected, not a bug"), that already uses up all 3 slots:

1. Jersey Size
2. Pant Size (waist)
3. Glove Size

That means **colorway (STRIKE / SURGE / RGB) can't be a 4th option** — it has
to be modeled as **separate products**, one per colorway, which is exactly
how the mockup's kit grid already treats them. The color swatches on the kit
PDP link between those sibling products rather than switching a variant.

To make that work, add these metafields (namespace `custom`) to each kit product:

| Metafield | Type | Purpose |
|---|---|---|
| `custom.swatch_color` | Color | This product's own accent dot |
| `custom.colorway_siblings` | List of product references | The other kit colorways (each needs its own `swatch_color` too) |
| `custom.jersey_desc` / `custom.pants_desc` / `custom.gloves_desc` | Single line text | Short descriptors in the "kit includes" list |
| `custom.whats_included` / `custom.sizing_notes` | Multi-line text | Accordion copy (falls back to sensible defaults if left blank) |

Assign the **`product.kit`** template to each kit product (Shopify admin →
product → Theme template dropdown).

### MX Bikes game content products

These are simple digital-download products — one variant is enough. Add
metafields (namespace `custom`):

| Metafield | Type | Purpose |
|---|---|---|
| `custom.game_version` | Single line text | e.g. "MX Bikes v1.13+" |
| `custom.file_formats` | List of single line text | e.g. "PSD source file", "In-game livery file" |
| `custom.whats_included` / `custom.installation_steps` / `custom.license_text` | Multi-line text | Accordion copy |

Assign the **`product.digital`** template. **Important:** this section only
handles the storefront presentation — actual file delivery needs a digital
downloads app (Shopify's own "Digital Downloads" app or similar) wired to
these products, plus marking them as non-shipping.

## 4. Collections referenced by the new pages

The breadcrumbs and homepage "view all" links assume these collection
handles exist — create them if they don't already:

- `/collections/racewear-kits`
- `/collections/game-content`

## What this doesn't do (on purpose)

- **Doesn't touch your existing header/footer markup.** The mockup's gradient
  logo text and nav styling are just CSS classes (`.crw-logo b`, etc.) —
  apply them to your existing header's markup yourself once you see how it
  looks, rather than me guessing at your current header.liquid and risking
  breaking your mega-menu/cart-drawer logic I haven't seen.
- **No reviews app integration.** Review counts/stars are static schema
  settings right now — swap in real values once a reviews app is installed.
- **No responsive `srcset`.** Images use a single `image_url: width:` size;
  worth adding multi-width `srcset` later for performance, kept simple here
  to keep the diff reviewable.

## Testing before you publish

```
shopify theme dev --store your-store.myshopify.com
```

Then check both the homepage tabs (click between IRL/MXBikes) and both
product templates with at least one real product assigned to each, on
desktop and mobile.
