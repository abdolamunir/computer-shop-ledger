# Counter Books

Private ledger for a retail computer shop. Figures are in Pakistani Rupees.

Sign in with Google to keep stock, sales, and cash in Firebase. Each Google account has its own books. Without sign-in, data stays in this browser.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:5173

## Firebase

1. Create a Firebase project.
2. Enable **Google** under Authentication → Sign-in method.
3. Create a **Cloud Firestore** database.
4. Deploy rules: `npx firebase-tools deploy --only firestore:rules`
5. Add the web app config to `.env.local` and to Vercel env vars.
6. In Authentication → Settings → Authorized domains, add `localhost` and the Vercel host.

## What it does

- Records sales and incoming stock
- Tracks inventory, unit price, selling price, and low stock
- Shows profit as sales minus cost of goods
- Syncs signed-in users to Firestore
