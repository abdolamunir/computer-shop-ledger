---
name: Counter Books
description: Night shop fascia for a counter ledger — four lit totals, opposing sales and spend, till keys, packing tags on live stock.
colors:
  night: "#0e1418"
  shutter: "#0c1216"
  ice: "#d7e6ea"
  cyan: "#1aa3c4"
  cyan-deep: "#0e6f86"
  amber: "#c45c2a"
  amber-deep: "#7a3514"
  amber-lit: "#f0a06a"
  alert: "#e24b4b"
  steel: "#8a9098"
  steel-dark: "#2a3238"
  plate: "#c5ccd1"
  plate-ink: "#1a1e22"
  member: "#10171c"
  well: "#1c2328"
  ticker-well: "#05090c"
  tag-ink: "#1a1208"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "1.85rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "0.12em"
  headline:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(1.8rem, 3.4vw, 2.7rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0.02em"
  title:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.18em"
  body:
    fontFamily: "Barlow, Avenir Next Condensed, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.01em"
  label:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.12em"
rounded:
  fascia: "2px"
spacing:
  seam: "4px"
  xs: "6px"
  sm: "8px"
  md: "16px"
  lg: "18px"
components:
  namebar:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.plate-ink}"
    typography: "{typography.display}"
    rounded: "{rounded.fascia}"
    padding: "0 18px"
    height: "64px"
  fascia-module:
    backgroundColor: "{colors.cyan-deep}"
    textColor: "{colors.ice}"
    typography: "{typography.headline}"
    rounded: "{rounded.fascia}"
    padding: "16px 16px 12px"
    height: "126px"
  fascia-module-spend:
    backgroundColor: "{colors.amber-deep}"
    textColor: "{colors.ice}"
    typography: "{typography.headline}"
    rounded: "{rounded.fascia}"
    padding: "16px 16px 12px"
    height: "126px"
  ticker:
    backgroundColor: "{colors.ticker-well}"
    textColor: "{colors.cyan}"
    typography: "{typography.title}"
    rounded: "{rounded.fascia}"
    height: "36px"
    padding: "0 32px"
  till-key:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ice}"
    typography: "{typography.display}"
    rounded: "{rounded.fascia}"
    padding: "0"
    height: "88px"
  field:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ice}"
    typography: "{typography.body}"
    rounded: "{rounded.fascia}"
    padding: "8px 10px"
  category-chip:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ice}"
    typography: "{typography.label}"
    rounded: "{rounded.fascia}"
    padding: "6px 8px"
  category-chip-pressed:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.tag-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.fascia}"
    padding: "6px 8px"
  bin:
    backgroundColor: "{colors.member}"
    textColor: "{colors.ice}"
    typography: "{typography.title}"
    rounded: "{rounded.fascia}"
    padding: "10px 12px"
    height: "72px"
  packing-tag:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.tag-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.fascia}"
    padding: "14px 10px 8px"
    width: "92px"
  period-active:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.night}"
    typography: "{typography.label}"
    rounded: "{rounded.fascia}"
    padding: "7px 12px"
---

# Design System: Counter Books

## Overview

**Creative North Star: "Night Fascia"**

The books are a night shop fascia, not a SaaS card grid. After the shutter comes down, four acrylic modules stay lit: profit, cash, spend, and stock. Sales and expenses remain visible as opposing members. The owner reads the day from the fascia, posts the next till event on two raster keys, and notices low stock by a packing tag.

Materials are commercial channel-letter hardware, not dashboard chrome. The board is night shutter paint with a vertical slat grain. Figures sit on an LED module pitch. The name is extruded condensed caps on an aluminum bar. Spend runs tungsten. Alerts are a shop-red seam and a packing tag, not a toast stack.

Confirmed visual rejections: card chrome, 12px rounded KPI tiles, offset drop-shadow elevation, bloomed neon dashboards, generic accounting iconography, and system UI display faces.

**Key Characteristics:**
- Four equal backlit fascia modules across the top of the board
- 4px aluminum seams; plates abut, they do not float
- Shop cyan for sales/profit/cash; tungsten spill for spend
- Full-width aluminum name bar with extruded condensed mark
- Packing tags only on live low stock
- Till keys as raster plates (`object-fit: contain`), not chrome buttons

## Colors

Night shutter paint, ice acrylic figures, shop cyan LEDs, tungsten spend, and alert red. Cyan and amber never share a module.

### Primary
- **Shop Cyan**: the LED pitch, ticker copy, Sales legend, selected bin outline, pressed period, caret, and selection. It is the live-shop light.

### Secondary
- **Tungsten Spill**: spend module, Expenses legend, pressed expense category. It is the opposing member to cyan — heat against ice.

### Tertiary
- **Alert Red**: low-bin seam only. It is not a fill, not a button, not a banner.

### Neutral
- **Night Shutter**: board field and body ground.
- **Shutter Pit**: named night-adjacent paint on `:root`; the board grain uses nearby slat hexes rather than this token via `var()`.
- **Ice Acrylic**: body copy and glance figures.
- **Cyan Deep / Amber Deep**: LED well and spend well under the rasters; pressed-category border.
- **Amber Lit**: spend and expenses legends on dark plates.
- **Steel / Steel Dark**: named aluminum family on `:root`.
- **Plate / Plate Ink**: name-bar metal and ink on the aluminum.
- **Member / Well / Ticker Well**: column, till, and bin paint; form wells; ticker trench.
- **Tag Ink**: copy sitting on the packing-tag raster.

### Named Rules
**The Cyan–Tungsten Rule.** Cyan lights sales, profit, cash, and the ticker. Amber lights spend and expenses. Never paint both accents on the same plate.

**The Alert Seam Rule.** Alert red is a 1px bin border (and the packing tag), never a filled status chip or toast.

## Typography

**Display Font:** Barlow Condensed (with sans-serif)
**Body Font:** Barlow (with Avenir Next Condensed, sans-serif)

**Character:** Extruded condensed caps for the shop name, zone legends, ticker, and till labels. Body stays one size in Barlow. Only the four glance figures step up.

### Hierarchy
- **Display** (800, 1.85rem, 1.1, tracking 0.12em, uppercase): the aluminum mark `COUNTER BOOKS`.
- **Headline** (800, clamp 1.8–2.7rem, 1.05, tabular-nums): the four fascia figures (`Rs` amounts and stock pcs).
- **Title** (700, 0.95rem, tracking 0.18em, uppercase): column legends (SALES, EXPENSES, TILL) and bin names.
- **Body** (400, 0.92rem, tracking 0.01em): row who-lines, hints, empty states. One size; do not introduce a second body step.
- **Label** (700, 0.72rem, tracking 0.12em, uppercase): field labels, period keys, sample strip, category chips. Module legends use the same family at 0.82rem with tracking 0.22em.

### Named Rules
**The One Body Size Rule.** Body data shares one size. Only the four glance figures step up.

**The Channel Caps Rule.** The mark, legends, ticker, till labels, and chips are Barlow Condensed uppercase. Do not add a third family. Do not use a system display face.

## Layout

The board is a full-viewport grid: `minmax(0, 1fr) 300px` columns, auto rows, `4px` seam as both gap and padding. Vertical order is name bar (full width), four fascia modules (full width, `repeat(4, minmax(0, 1fr))`), cyan ticker (full width), then sales-versus-expenses members on the left and a 300px till on the right, then inventory bins full width (`repeat(auto-fill, minmax(160px, 1fr))`).

Members are a two-column pair (Sales | Expenses) with a net line under both: “Sales pulling against expenses.” The till is a stacked key well, not a modal. Bins are a row of plates under the till.

Below 900px the board stacks to one column, fascia becomes 2×2, members stack, the name bar wraps, and the till drops into flow.

## Elevation & Depth

This system does not use card drop shadows. Depth is LED plates as rasters (module cyan, module amber, namebar aluminum, till keys, packing tags), an inset aluminum highlight on the name bar (`inset 0 1px 0 rgb(255 255 255 / 0.35)`), and extruded letter stacking on the mark. Modules sit in a 1px dark seam (`#1c2a30`). Selected bins take a 2px cyan outline, not a lift.

Posting settles a module with a 420ms brightness ease. Flash (720ms brightness pulse) is reserved for loss or newly low stock. The ticker marches 28s linear and pauses on hover. `prefers-reduced-motion` kills those animations. `prefers-reduced-transparency` drops module rasters to a solid well (`#102028`).

### Shadow Vocabulary
- **Focus ring** (`box-shadow: 0 0 0 2px night, 0 0 0 4px cyan`): keyboard focus only.
- **Aluminum inset** (`inset 0 1px 0 rgb(255 255 255 / 0.35)`): name bar highlight.
- **Mark extrusion** (`0 1px 0 #8b9399, 0 2px 0 #5c6369, 0 3px 0 #2a3034, 0 4px 1px #111`): channel-letter stack on the mark only.

### Named Rules
**The Raster Plate Rule.** LED modules, the name bar, till keys, and packing tags are plates. Elevation is inset highlight and LED pitch, not offset box-shadow.

**The Alert Flash Rule.** Brightness flash is reserved for loss or newly low stock. Ordinary postings settle the figures without alarm.

## Shapes

Almost square plates: `2px` radius on every module, column, till, bin, field, chip, and key. Corners are acrylic cut, not app roundedness. Seams are `4px` of shutter between plates. Till keys are raster rectangles `object-fit: contain` at 88px tall. Packing tags are 92px-wide overlays, top-right on the STOCK module and on low bins. Bins are 72px-min plates. No pills, no 12px cards, no circular FABs.

### Named Rules
**The Aluminum Seam Rule.** Adjacent plates meet at 4px. No 16px card gutters, no floating tiles.

## Components

### Buttons
- **Shape:** acrylic cut (`2px`).
- **Till keys:** raster plates (`key-sale`, `key-expense`), transparent chrome, image `object-fit: contain`, height 88px. Press translates `1px` down. Visible label lives in the raster; accessible name is visually hidden.
- **Till utility keys** (Set, Add or restock): well fill, ice caps, 1px steel border (`#6d757c`), padding `10px 8px` (primary utility `14px 8px`).
- **Period:** dark well; pressed is cyan fill with night ink.
- **Hover / Focus:** cyan double-ring (`--focus`). No glow bloom.

### Chips
- **Expense categories:** well fill, ice condensed caps, 1px well border, padding `6px 8px`. Pressed is tungsten fill, tag-ink copy, amber-deep border.
- **Sample strip:** ice wash on the aluminum bar (`rgb(215 230 234 / 0.72)`), plate-ink caps.

### Cards / Containers
- **Fascia modules:** 126px min, 16px padding, LED raster cover, 1px night seam. Spend swaps to the amber raster and amber-lit legend.
- **Member columns / till / bins:** member fill `#10171c`, 1px `#243038` (bins `#2a3338`), `2px` radius. Columns pad `14px 16px 10px`. No drop shadow.
- **Name bar:** aluminum raster, inset highlight, 64px min, 18px inline pad.

### Inputs / Fields
- **Style:** well fill, ice copy, 1px `#2c383e`, `2px` radius, padding `8px 10px`, cyan caret.
- **Labels:** condensed 0.72rem uppercase, hint ice (`#c5dbe0`).
- **Focus:** cyan double-ring.
- **Error:** `#ff9b9b` at 0.82rem under the till, not a banner.

### Navigation
The name bar is the only nav: extruded mark, sample strip, Today/All period pair. No sidebar, no tabs for Sales versus Expenses.

### Fascia modules
Four equal glance plates: PROFIT, CASH, SPEND, STOCK. Legends are condensed caps on the raster, not a separate kicker component for other surfaces. Figures are ice condensed 800 with a short dark extrusion. STOCK may carry one packing tag naming the first low SKU.

### Cyan ticker
Full-width trench, cyan condensed caps, 0.92rem, tracking 0.12em, 28s loop, edge-masked. It is the posting tape, not a marketing marquee.

### Packing tag
Raster overlay, 92px, copy centered in tag-ink condensed 800 at 0.58rem. Only on the STOCK module when any SKU is low, and on each low bin. Healthy stock has no tag.

### Inventory bins
Auto-fill plates, name in condensed 800, qty line in tabular condensed. Selected: 2px cyan outline. Low: alert-red border plus packing tag.

## Do's and Don'ts

### Do:
- **Do** keep four equal fascia modules on the first viewport, full width, 4px seams.
- **Do** keep Sales and Expenses as opposing columns with the net line under both.
- **Do** put RECORD SALE and RECORD EXPENSE on raster till keys, 88px, `object-fit: contain`.
- **Do** overlay packing tags only on live low SKUs (STOCK module + low bins).
- **Do** set glance figures in Barlow Condensed 800 with tabular nums and `Rs` PKR.
- **Do** use `2px` radius and `4px` seams on every plate.
- **Do** honor `prefers-reduced-motion` (no ticker/settle/flash) and `prefers-reduced-transparency` (solid module well).

### Don't:
- **Don't** recast the board as a SaaS card grid, 12px rounded KPI tiles, or gapped dashboard.
- **Don't** add offset drop shadows; plates are rasters and inset aluminum, not lifted cards.
- **Don't** hide expenses behind a tab or replace the pair with a single profit card.
- **Don't** use packing tags, or any badge, on healthy stock.
- **Don't** bloom neon glow on the LED pitch; the modules read as cheap commercial channel letters.
- **Don't** introduce Inter, system UI display faces, or a third type family.
- **Don't** turn module legends into a reusable eyebrow/kicker pattern on every surface.
