---
name: Counter Books
description: Shop ledger — purple stage, white frame, spreadsheet grids, and dashboard cards.
colors:
  stage: "#7c6cff"
  frame: "#ffffff"
  sidebar: "#f4f5f8"
  canvas: "#f7f8fb"
  surface: "#ffffff"
  text: "#1a1b27"
  muted: "#8b8d98"
  line: "#eef0f4"
  line-strong: "#e2e5eb"
  accent: "#6d5efc"
  accent-soft: "#f0edff"
  spend: "#b45309"
  spend-soft: "#fff7ed"
  danger: "#e11d48"
  danger-soft: "#fff1f2"
  ok: "#16a34a"
  ok-soft: "#ecfdf3"
  gold: "#ca8a04"
  gold-soft: "#fef9c3"
  pink: "#db2777"
  pink-soft: "#fdf2f8"
  sheet-head: "#f3f4f7"
  sheet-grid: "#d0d4dc"
  sheet-alt: "#fafafc"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "0"
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.88rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0"
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0"
rounded:
  frame: "28px"
  card: "16px"
  control: "12px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  fascia-module:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.headline}"
    rounded: "{rounded.card}"
    padding: "12px 14px"
  fascia-module-spend:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.spend}"
    typography: "{typography.headline}"
    rounded: "{rounded.card}"
    padding: "12px 14px"
  ticker:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.body}"
    rounded: "{rounded.card}"
    height: "40px"
    padding: "0 16px"
  till-key:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    typography: "{typography.title}"
    rounded: "999px"
    padding: "8px 16px"
    height: "40px"
  header-action:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "999px"
    padding: "8px 16px"
    height: "40px"
  modal-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.headline}"
    rounded: "20px"
    padding: "18px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  category-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "999px"
    padding: "8px 14px"
  category-chip-pressed:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "999px"
    padding: "8px 14px"
  bin:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.title}"
    rounded: "{rounded.card}"
    padding: "12px"
  low-badge:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    typography: "{typography.label}"
    rounded: "999px"
    padding: "2px 8px"
  period-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "6px 12px"
  till-tab:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "8px 10px"
  till-tab-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "10px"
    padding: "8px 10px"
  kpi-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.headline}"
    rounded: "{rounded.card}"
    padding: "16px"
  chart-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.title}"
    rounded: "{rounded.card}"
    padding: "16px"
  sheet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.card}"
    padding: "0"
  sheet-head:
    backgroundColor: "#fbfbfd"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "0"
    padding: "12px 14px"
---

# Design System: Counter Books

Soft ledger on a purple stage. White rounded shop frame, open data tables with quiet row lines, dashboard cards.

## Responsive

- Desktop (above 1024): five KPI cards, header with period, Record sale / Add stock under the cards.
- Tablet (701–1024): period full width, three-then-two KPI cards, actions under the cards, stock table scrolls sideways.
- Phone (700 and below): edge-to-edge frame, compact KPI rows, actions under the cards, sale/stock dialogs as a bottom sheet. Inputs stay 16px so iOS does not zoom.
