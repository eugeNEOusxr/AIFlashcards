# Cognitive Learning System (CLS)

## Try it now

**👉 [Open the live app](https://cognitive-flashcard.vercel.app)**

Share that link with anyone — it runs in the browser on phone or desktop. Pick **Physics**, explore the world map, complete Motion and Forces lessons, and use the review flashcards on the right.

Also available: [studyassistantai-deploy.vercel.app](https://studyassistantai-deploy.vercel.app)

Mobile-first PWA: immersive physics world map, frame-based learning, review flashcards, localStorage persistence.

## 1. Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## 2. Deploy

Pushes to `main` on GitHub auto-build via GitHub Actions (Pages) and can auto-deploy on Vercel when the repo is connected in the Vercel dashboard.

```bash
npm run build
```

## 3. Open on your phone (same Wi‑Fi / LAN)

```bash
npm run dev -- --host 0.0.0.0
```

On your PC, note your LAN IP (e.g. `ipconfig` → IPv4 like `192.168.1.42`). On the phone, open:

`http://<YOUR_PC_IP>:5173`

**HTTPS note:** Some PWA features (e.g. install) are stricter without HTTPS; LAN HTTP is usually fine for dev testing. For production, serve over HTTPS.

## 4. Install as PWA (mobile)

1. Open the app in **Chrome** (Android) or **Safari** (iOS).
2. Use **“Install app”** / **“Add to Home Screen”** from the browser menu.
3. Icons: manifest uses `public/icons/icon.svg`. For best store-style installs, add PNG maskable icons later.

## 5. What works vs stubbed

| Area | Status |
|------|--------|
| Vite + React + TS | Works |
| PWA manifest + service worker + offline precache | Works (`vite-plugin-pwa`) |
| Bottom mode bar (`quick` / `focus` / `graph` / `flashcard` / `book`) | Works — **visual / session label only**; does not mutate graph data |
| Text selection → `selectedItem` | Works |
| Bottom context panel (Explain / Save / Confusing / It clicked) | Works — **placeholder events**; appends reflection entries |
| Reflections list | Works — in-memory + **localStorage** |
| `activeNode` | Stub object only |
| IndexedDB / real graph / AI | **Not implemented** (by design) |
| Routing | **None** — overlays only |

## State & interaction

- **State:** `src/core/state/learningState.ts` — `activeMode`, `selectedItem`, `lastEvent`, `activeModuleId` (last two are session-only, not persisted).
- **Events:** `src/core/events/interactionBus.ts` — pipeline: `InteractionEvent → MeaningEvent → CognitiveGraph`. Dev logs: `[CLS:meaning]`, `[CLS:graph]`.
- **Graph:** `src/core/graph/cognitiveGraph.ts` + `meaningGraphBridge.ts` — concepts, cognitive events, weighted edges; persisted in localStorage key `cls:cognitive-graph:v1`.
- **UI modules:** `src/ui/ModeButton.tsx`, `ContextActionButton.tsx`, `InteractiveModule.tsx` — emit events only; no AI or graph logic.

Persistence key: `cls:learning:mvp:v1` in **localStorage** (temporary; swap for IndexedDB later).

## Build / preview

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

Preview serves the production build (with SW); good for testing install/offline after a successful build.
