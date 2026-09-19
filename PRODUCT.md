# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React. Confirmed by the shop owner. Data stays in the browser (localStorage). No accounts, no server, no multi-user sync in v1.

## Users

Primary user: the owner of a Pakistani retail computer shop, working alone at the counter. Job: know today whether the shop is making money, what cash is left, what was spent, and what stock is sitting on the shelf, without opening a spreadsheet.

No staff logins in v1. The same machine is the books.

## Product Purpose

A private shop ledger that records sales, expenses, cash balance, and inventory, then shows profit, loss, and stock health in one glance.

Success: the owner can answer four questions in under ten seconds: Did I profit today? What is my cash position? What did I spend? What is about to stock out?

## Positioning

This is the shop's own books, not a generic accounting suite. It speaks computer-retail language (laptops, parts, accessories, cost vs selling price, stock on hand) and runs entirely on the owner's computer. A neighboring product that needs cloud accounts, tax modules, or multi-branch payroll cannot truthfully claim this.

## Operating Context

Used at the counter during and after the trading day. Typical loop: sell an item (deduct stock, add cash), log a shop expense (rent, utilities, courier, tea, parts restock), check remaining cash, glance at low stock. Currency is Pakistani Rupees (Rs / PKR). Catalog is retail only: laptops, components, peripherals, and accessories. No repair tickets in v1.

## Capabilities and Constraints

Confirmed for v1:
- Dashboard of profit, loss, expenses, cash balance, and inventory health
- Record sales (item, qty, selling price, cost)
- Record expenses (category, amount, note)
- Inventory list with quantity, cost, selling price, stock value, low-stock flag
- All figures in PKR
- Data persists locally in the browser
- Export is not required for v1 (owner chose local-only; export can be added later)

Undecided:
- Shop trading name (no name was given; the product uses a working title until the owner supplies one)
- Opening cash / starting capital amount
- Fiscal month vs calendar month as the default reporting window

Out of scope for v1: accounts payable, GST/filer workflows, supplier ledgers, payroll, multi-device sync, repairs.

## Brand Commitments

None. No logo, wordmark, or visual identity was supplied. Working product title: Counter Books. Replace if the owner names the shop.

## Evidence on Hand

No real sales, expense, or inventory files were provided. Demonstration data in the app is synthetic and must be labeled as sample books so it is never mistaken for the owner's figures. The owner starts with an empty ledger they can fill, plus a clearly marked sample dataset they can load or discard.

## Product Principles

1. One glance beats a report: the first screen answers profit, cash, spend, and stock.
2. Counter speed: recording a sale or expense is fewer steps than writing it in a notebook.
3. Private by default: the books never leave this computer unless the owner later asks for export or hosting.
4. Computer-shop language: SKUs, cost, selling price, and stock on hand, not generic accounting jargon.
5. Sample data is labeled; real numbers belong to the owner.

## Accessibility & Inclusion

No product-specific accessibility mandate was set. Default to keyboard-usable forms, readable PKR figures, and `prefers-reduced-motion` for any motion.
