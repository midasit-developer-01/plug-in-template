# Agent.md — Project Guide

This repository is a React template for building **MIDAS Plug-in Items**.
It is based on the `@midasit-dev/moaui` UI library, **pyscript is disabled**, and
API requests run on TypeScript (`fetch`).

> The **work rules, structure, translation, and API guide** for actually building a new
> project (plug-in) are documented in [`src/Agent.md`](./src/Agent.md). Be sure to read it
> before working on code.

---

## 1. Tech Stack

| Area | Technology |
| --- | --- |
| Framework | React 18 + TypeScript (Create React App / `react-scripts`) |
| UI | `@midasit-dev/moaui` (GuideBox, Panel, Typography, Button, DropList, Icon, etc.) |
| State management | `recoil` |
| i18n | `react-i18next` + `i18next-http-backend` (per-region JSON loading) |
| Routing | `react-router-dom` (language paths `/en`, `/kr`, `/jp`) |
| Notifications | `notistack` |
| Styling | Tailwind CSS (`input.css` → `output.css`) |

---

## 2. Directory Structure

```
template/
├─ public/
│  ├─ index.html          # pyscript tags are commented out (disabled). Loads manifest.
│  ├─ manifest.json       # Plug-in title / background color / window size (width, height)
│  ├─ py_*.py             # (old) pyscript Python code — currently unused, kept for reference
│  └─ py_config.json      # (old) pyscript config — unused
│
├─ .env.example          # Example dev env vars → copy to create .env.development.local
│
└─ src/
   ├─ index.tsx           # Entry. BrowserRouter → Wrapper routing
   ├─ Wrapper.tsx         # MAPI-Key auth verification gate (must pass to render App)
   ├─ App.tsx             # App root. Build the screen starting here
   ├─ config.ts           # Dev config (reads REACT_APP_* such as auth bypass)
   ├─ utils_api.ts        # ★ API requests (recommended): fetch-based Midas DB CRUD client
   ├─ utils_pyscript.ts   # (old) pyscript-based API — fully commented out (reference)
   ├─ utils_typscript.ts  # Shared utility functions
   ├─ i18n.js             # i18next init (imports src/locales into the bundle)
   ├─ language.ts         # Language detection/switching (path-independent, ja→jp / ko→kr aliases)
   ├─ locales/            # i18n translation resources (en/kr/jp) — included in the bundle
   ├─ global.d.ts         # Global types (the pyscript declaration is commented out)
   ├─ Signature.tsx       # Console signature
   ├─ UI/                 # Reusable pure widgets (presentational)
   ├─ hooks/              # Custom hooks (logic, state, API)
   ├─ components/         # Feature/domain containers (assemble screen sections)
   ├─ Calculates/         # Pure calculation logic
   ├─ DataControls/       # Data processing/transformation, import/export
   └─ states/             # recoil atoms/selectors, types
```

> The rules for organizing the feature folders inside `src/` (UI / hooks / components /
> Calculates / DataControls …) follow [`src/Agent.md`](./src/Agent.md).

---

## 3. Entry Flow

```
index.tsx
  └─ <BrowserRouter> → <Wrapper />        # Language path (/en, /kr, /jp) routing
       └─ Wrapper.tsx (ValidWrapper)      # ① MAPI-Key auth verification gate
            └─ <App />                     # ② Rendered only after verification passes
                 └─ MainWindow → Contents  # ③ The actual screen
```

- **Wrapper.tsx**: On app entry, performs a `/health` connection + MAPI-Key verification.
  - During verification → `<VerifyDialog loading />`
  - Verification success → render `App`
  - Verification failure → show the "Validation Check" panel (Base URI / MAPI-Key status)
- Screen work starts **below `App.tsx`**.

---

## 4. Authentication (MAPI-Key)

There is no separate login UI. Auth info is passed via the **URL query string**.

- `?mapiKey=...` — MAPI-Key (read by `VerifyUtil.getMapiKey()`)
- `?redirectTo=...` — server origin (defaults to `https://moa-engineers.midasit.com:443`)
- `VerifyUtil.getBaseUrlAsync()` verifies the key and returns the `{origin}/{program}` base URL

When **running inside the product**, the product injects the parameters above.
When **developing locally**, you must attach them yourself to pass the auth gate:

```
http://localhost:3000/en?mapiKey=ISSUED_KEY
# For a different target server:
http://localhost:3000/en?mapiKey=...&redirectTo=https://moa-engineers.midasit.com:443
```

### Dev auth bypass (.env)

If attaching the key to the URL every time is tedious, you can **skip auth in dev mode**.
Copy `.env.example` to create `.env.development.local` (gitignored):

```bash
REACT_APP_SKIP_AUTH=true                # Bypass the verification gate → enter the app directly
REACT_APP_MAPI_KEY=ISSUED_KEY           # (optional) when you also want to test API requests
REACT_APP_BASE_URL=https://moa-engineers.midasit.com:443/civil  # (optional) includes the program path
```

- Works only when `NODE_ENV=development` (npm start) → **no effect on production builds**.
- Bypassing only the gate shows the screen, but API requests work for real only once
  `REACT_APP_MAPI_KEY`/`REACT_APP_BASE_URL` are filled in. (If empty, falls back to URL query-string values.)
- Implementation: `src/config.ts` (reads env) → `Wrapper.tsx` (gate bypass) / `utils_api.ts` (key/URL fallback).
- Restart the dev server after changes.

---

## 5. Internationalization (i18n)

- Resources: `src/locales/{en,kr,jp}/translation.json` — **included in the bundle (imported in `i18n.js`)**.
  They are not fetched from `/locales/*.json` at runtime. (Fine even if the deploy host blocks `/locales/` with 403.)
- Language is decided by `detectLanguage()` in `src/language.ts` — **independent of the URL path position**:
  ① match a supported language in a path segment (`/jp` → jp) → ② `?lang=` → ③ localStorage → ④ default `en`.
  (Includes alias normalization: `ja→jp`, `ko→kr`, `en-US→en`.)
- Switching happens **without a page reload** via `i18n.changeLanguage()` + saving to localStorage (does not force the path to change).
- Usage: `const { t } = useTranslation();` → `t("key")`
- **Translation keys must be added to all three regional files.** (Details: `src/Agent.md`)

---

## 6. API Requests (Summary)

| Method | File | Notes |
| --- | --- | --- |
| **Recommended (no pyscript)** | `src/utils_api.ts` | `fetch`-based `dbCreate/dbRead/dbUpdate/dbDelete …` |
| (old) using pyscript | `src/utils_pyscript.ts` | Fully commented out. To re-enable, see section 7 below / `src/Agent.md` |

For detailed call examples, see the "API Request Guide" in [`src/Agent.md`](./src/Agent.md).
A refined reference of MIDAS API endpoints and JSON conventions is in [`src/midas-api-reference.md`](./src/midas-api-reference.md).

---

## 7. pyscript Status

pyscript is **disabled**; the related code is not deleted but **preserved as comments**.

- `public/index.html` — pyscript `<script>`, `<py-config>`, `<py-script>` tags commented out
- `src/utils_pyscript.ts` — fully commented out
- `src/global.d.ts` — `const pyscript: any` declaration commented out

**To re-enable**: uncomment the three places above. (For detailed usage, see `src/Agent.md`)

---

## 8. Dev / Build Commands

```bash
npm start        # Dev server (http://localhost:3000)
npm run build    # Production build (dev auth bypass forced OFF)
npm run css      # Tailwind watch (input.css → output.css)
npx tsc --noEmit # Type check
```

> **Dev mode OFF at build time**: `npm run build` runs through `scripts/build.js`, which
> **forcibly disables** the auth bypass before building (e.g. `REACT_APP_SKIP_AUTH=false`) — a double safeguard.
> The original `config.ts` also ignores the bypass when `NODE_ENV !== "development"`, so builds are always production-safe.
>
> The `dev` (DevTools server) script in `package.json` does not work in this template because the
> DevTools folder has been removed.

---

## 9. Running / Environment Setup (Claude Code standard procedure)

Running this project requires **Node.js**; Git and Python are optional (version control / old pyscript).
Installation and running are handled by telling **Claude Code "run it"** (no separate batch file — the AI performs the steps below directly).

### MAPI-Key required before running
- The app **requires a MAPI-Key before running** (without it, you are blocked at the verification gate).
- The key is passed via URL query: `http://localhost:3000/?mapiKey=<KEY>` →
  `VerifyUtil.getMapiKey()` in `Wrapper.tsx` reads it to pass the verification gate (not the dev-bypass `.env`).
- The AI saves a received key to the root `.mapikey` (gitignored, kept only on this PC) and reuses it next time.
- Since the route is a `/*` catch-all, the language follows `detectLanguage()` (localStorage / default en).
- Precondition: the target MIDAS NX app is running + a model file is open (verification/requests act on the running program).

### When the AI (Claude Code) handles it — "run it" standard procedure
When the user asks to "run it / set up the environment", **the AI does it directly instead of making the user double-click**:

1. Check installs: `node -v` (required). If needed, `git --version`, `python --version`.
2. Install **only what's missing** (only Node is required):
   ```powershell
   winget install -e --id OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
   winget install -e --id Git.Git --silent --accept-package-agreements --accept-source-agreements      # optional
   winget install -e --id Python.Python.3.12 --silent --accept-package-agreements --accept-source-agreements  # optional (only for old pyscript)
   ```
   - If `winget` is missing (older Windows), guide the user to install the Microsoft Store "App Installer". Installing winget requires UAC (admin) approval.
   - Right after a winget install, PATH is not reflected in the current shell → run `npm` in a **new shell**.
3. Dependencies: run `npm install` if `node_modules` is missing.
4. **Obtain the MAPI-Key (required)**: if the root `.mapikey` exists, use its value; otherwise **ask the user for the key** and save the received value to `.mapikey` (reused next run).
   - Running just `npm start` without a key blocks the app at the verification gate ("Validation Check").
   - Key source: [API Settings] in MIDAS CIVIL/GEN NX.
5. Start the server + open the browser with the key attached:
   - Run `npm start` in the **background** → once localhost:3000 is ready, open `http://localhost:3000/?mapiKey=<KEY>`.

> ⚠️ Claude Code asks for **permission approval** before running commands → the user must click "Allow" (not fully unattended).
> Avoid auto-installing just because a session started (when a missing tool is detected, confirm/propose first; do system-wide installs only after approval).
> Precondition: the target **MIDAS NX app is running + a model file is open** (the condition for passing key verification).
