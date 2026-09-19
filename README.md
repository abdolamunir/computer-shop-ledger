# Counter Books

Private ledger for a retail computer shop. Profit, cash, spend, and stock in one glance. Figures are in Pakistani Rupees. Data stays in this browser.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## What it does

- Posts sales (deducts stock, adds cash)
- Posts expenses (deducts cash)
- Tracks inventory, cost, selling price, and low stock
- Shows net profit as sales against expenses
- Ships with labeled sample books you can keep or clear

There is no account and no server. Clearing site data clears the books.
