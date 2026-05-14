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
## CLI runtime
```bash
python3 main.py
```

Commands inside runtime:
- `state` → print full internal state
- `reflect` → print latest private self-reflection entry
- `exit` → quit

## Web MVP (iPad-friendly)
```bash
python3 webapp.py
```
Then open:
- `http://localhost:8000` (same device)
- or `http://<your-computer-ip>:8000` (from iPad on same Wi-Fi)

Web MVP includes:
- light yellow/pink interface,
- clickable brain-region cards with live activity,
- unified chat panel,
- live body/state panel,
- autonomous reflection updates after each message.

## Replit
1. Create a new **Python Repl**.
2. Upload this project files.
3. Ensure `.replit` is present (already included).
4. Click **Run**.
5. Open the webview; it serves on port `8000` via `python3 webapp.py`.

If Replit asks for a start command, use:
```bash
python3 webapp.py
```

