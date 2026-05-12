# Quickstart

## Local (Next.js app)
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Replit (fixed)
This repo now runs the **Next.js app only** in Replit (no Python fallback UI):
1. Import repo into Replit (Node.js).
2. Replit auto-runs: `npm install && npm run dev`.
3. App binds to `0.0.0.0:$PORT` automatically.
4. Open the Replit web preview.

If preview shows “couldn’t reach this app”, check Shell output and rerun:
```bash
npm install
npm run dev
```

## Note about old UI
The previous legacy Python UI was removed to prevent serving outdated designs.
