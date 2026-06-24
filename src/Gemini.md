# src/Gemini.md — Work Guide (code-writing rules)

This document defines the rules to follow when **actually building a plug-in** with this template.
For the root structure / entry flow, see [`../Gemini.md`](../Gemini.md) first.

---

## 0. Target project definition (★ fill in this section before starting work)

> When you start a new project, **record the following directly in this file**.
> All subsequent code is written against the definitions written here.

- **Project purpose**: _(e.g. a plug-in that calculates pile spring stiffness and inputs it into the model)_
- **Target product**: _(CIVIL / GEN, etc.)_
- **Main feature list**:
  1. _(e.g. calculate spring stiffness from input values)_
  2. _(e.g. input the calculated result into the model via the DB API)_
  3. _(e.g. data import/export)_
- **Screen layout (panels/tabs)**: _(e.g. input panel / result panel / run button)_
- **APIs used**: _(e.g. read `db/NODE`, write `db/SPRING`)_
- **State structure**: _(list of recoil atoms/selectors)_

---

## 1. Folder organization rules (separation by feature)

The actual code is written inside `src/`, separated into **feature folders**.

| Role | Folder | Contents | Decision test |
| --- | --- | --- | --- |
| Pure UI widgets | **`src/UI/`** | Reusable presentational components (button/input/dropdown/dialog/table/panel wrappers). Driven by props only, no domain/API logic | *Can it be copy-pasted as-is into another plug-in?* |
| Custom hooks | **`src/hooks/`** | Encapsulate logic/state/side-effects/API calls (`useXxx`). No JSX | *Logic/state only, no JSX?* |
| Feature/domain components | **`src/components/`** | **Containers** that assemble screen sections (panels/tabs/windows). Combine UI widgets + hooks + recoil state. Specific to this plug-in | *Tied to a specific feature/screen?* |
| Calculation | `src/Calculates/` | Pure calculation logic (input → output, UI-agnostic) | |
| Data | `src/DataControls/` | Data processing/transformation, import/export | |
| State | `src/states/` | recoil atoms/selectors, types | |

Rules:
- ⚠️ **Do not create new folders arbitrarily.** Place a component in either `src/UI/` or `src/components/`
  depending on its nature. (No singular `src/component/` folder.)
- **UI vs components distinction**:
  - Reusable **pure widgets** = `src/UI/` (driven by props only, no domain logic / API calls)
  - **Screen-level containers** assembling widgets/hooks/state = `src/components/` (e.g. `MainWindow`, `InputPanel`, `ResultPanel`)
- **Logic-only, no JSX** = a `useXxx` in `src/hooks/`. (e.g. window drag/resize, domain state management)
- **Calculation logic** is split into pure functions in `Calculates/` and called from components/hooks.
- **Data I/O / transformation** is collected in `DataControls/`.
- Translation strings are **not hardcoded in code** but kept in `src/locales` (bundled, see section 3 below).

Example structure:
```
src/
├─ UI/                     # Reusable pure widgets (presentational)
│  ├─ NumberField.tsx
│  ├─ ConfirmDialog.tsx
│  └─ LanguageType.tsx
├─ hooks/                  # Custom hooks (logic/state/API)
│  ├─ usePileDomain.ts
│  └─ useWindowControl.ts
├─ components/             # Feature/domain containers (assemble screen sections)
│  ├─ MainWindow.tsx
│  ├─ InputPanel.tsx
│  └─ ResultPanel.tsx
├─ Calculates/
│  └─ springStiffness.ts
├─ DataControls/
│  ├─ exportProject.ts
│  └─ importProject.ts
└─ states/
   └─ projectState.ts
```

---

## 2. Component-writing pattern

- Prefer `@midasit-dev/moaui` components for UI (`GuideBox`, `Panel`, `Grid`,
  `Typography`, `Button`, `DropList`, `Stack`, `Icon`, etc.).
- Use `recoil` for global state. The screen entry point is `App.tsx`.
- Display translations via `t("key")` from `useTranslation()`.

```tsx
import { GuideBox, Panel, Typography, Button } from "@midasit-dev/moaui";
import { useTranslation } from "react-i18next";

const ResultPanel = () => {
  const { t } = useTranslation();
  return (
    <Panel variant="shadow2" padding={2}>
      <GuideBox spacing={2}>
        <Typography variant="h1">{t("result_title")}</Typography>
        <Button onClick={() => { /* ... */ }}>{t("calculate")}</Button>
      </GuideBox>
    </Panel>
  );
};

export default ResultPanel;
```

---

## 3. Translation (i18n) rules

- Resource location: `src/locales/{en,kr,jp}/translation.json` — **`i18n.js` imports them into the bundle**.
  (Not fetched from `/locales/*.json` at runtime → works even if the deploy host blocks `/locales/`.)
- **Register new text as a key and add it to all three regional (en/kr/jp) files.**
- To add a new language: create `src/locales/{lng}/translation.json` → add the code to
  `SUPPORTED_LANGS` in `src/language.ts` → add the import to `resources` in `src/i18n.js`.

`src/locales/en/translation.json`
```json
{ "result_title": "Result", "calculate": "Calculate" }
```
`src/locales/kr/translation.json`
```json
{ "result_title": "결과", "calculate": "계산" }
```
`src/locales/jp/translation.json`
```json
{ "result_title": "結果", "calculate": "計算" }
```

Usage:
```tsx
const { t } = useTranslation();
<Typography>{t("result_title")}</Typography>
```

- Language detection/switching logic is centralized in `src/language.ts`.
  - `detectLanguage()`: path segment → `?lang=` → localStorage → default `en` (path-position-independent, supports `ja→jp` / `ko→kr` aliases).
  - Switching is handled via `i18n.changeLanguage()` + `persistLanguage()` **without a reload** (switching UI: `src/UI/LanguageType.tsx`).
  - ⚠️ Do not change `window.location.pathname` directly (a full reload → if the deploy host lacks SPA fallback, you may drop to an offline page).
- On a missing key, English is shown via `fallbackLng: "en"`.

---

## 4. API request guide

Communication with the Midas server uses one of **two methods**.
**The default is no pyscript (recommended).**

> 📖 **Endpoint catalog / refined conventions**: [`./midas-api-reference.md`](./midas-api-reference.md)
> (Base URL, MAPI-Key, the 5 categories DOC/DB/OPE/VIEW/POST, the `Assign`/`Argument` conventions, the **full endpoint catalog** + article numbers).
> 📦 **Real request/response payload examples**: [`./midas-api-examples.json`](./midas-api-examples.json) (keyed by endpoint).
> Consult both documents before writing API code.
> **If you need the exact field schema of an endpoint**, check the manual sub-page via the catalog's `article` number
> (`https://support.midasuser.com/hc/en-us/articles/<id>`), and reflect the confirmed schema/examples back into `midas-api-examples.json`.

### 4-1. No pyscript (recommended) → `src/utils_api.ts`

A `fetch`-based TypeScript client. Auth (MAPI-Key) and base URL are handled by `VerifyUtil`.
Provided functions: `dbCreate`, `dbCreateItem`, `dbRead`, `dbReadItem`, `dbUpdate`, `dbUpdateItem`, `dbDelete`.
**All are asynchronous (`async`)**, so call them with `await`.

```ts
import { dbRead, dbUpdate } from "../utils_api";

// Read: GET /db/NODE  → returns as { id: value, ... }
const nodes = await dbRead("NODE");
if (nodes.error) { console.error(nodes.error); return; }

// Write: PUT /db/SPRING (body: { Assign: items })
await dbUpdate("SPRING", {
  1: { /* ... item payload ... */ },
});
```

- On failure, the return value follows the `{ error: string }` convention → check `result.error` at the call site.
- If you need a new endpoint, add a function using `requestJson(method, endpoint, body)` in `utils_api.ts`.
  (`endpoint` is the path after the base URL, e.g. `/doc/anal`.)

### 4-2. Using pyscript → `src/utils_pyscript.ts` (reference)

`utils_pyscript.ts` is **currently fully commented out**; it was the implementation that called the Python code
(`public/py_main.py`, `py_base.py`, `py_api_db.py`).

To switch to pyscript:
1. Uncomment the pyscript `<script>` / `<py-config>` / `<py-script>` tags in `public/index.html`
2. Uncomment the `const pyscript: any` declaration in `src/global.d.ts`
3. Uncomment the code in `src/utils_pyscript.ts`
4. At call sites, use `dbRead` etc. from `utils_pyscript` instead of `utils_api`

> Both sides provide the same function names (`dbRead`, etc.). However, `utils_api` is asynchronous (needs `await`)
> while `utils_pyscript` is synchronous, so call sites need editing when switching.

### 4-3. Auth bypass during development (.env)

If attaching `?mapiKey=` every time during local development is tedious, you can bypass it via `.env.development.local`.

```bash
REACT_APP_SKIP_AUTH=true     # Bypass the Wrapper verification gate
REACT_APP_MAPI_KEY=...       # (optional) utils_api uses this key for requests
REACT_APP_BASE_URL=https://moa-engineers.midasit.com:443/civil  # (optional) includes the program path
```

- Applied only when `NODE_ENV=development` (`src/config.ts`) → no effect on production builds.
- If the key/URL are left empty, falls back to URL query-string values.
- Details: "Dev auth bypass" in the root [`../Gemini.md`](../Gemini.md).

---

## 5. New-feature checklist

1. [ ] Record the feature in section 0 (target project definition) of `src/Gemini.md`
2. [ ] Screen → write reusable widgets in `src/UI/`, screen-level containers in `src/components/`, logic in `src/hooks/`, and wire them into `App.tsx`
3. [ ] Calculation logic → split into pure functions in `src/Calculates/`
4. [ ] Data processing → write in `src/DataControls/`
5. [ ] Display strings → add keys in `src/locales/{en,kr,jp}` (all three)
6. [ ] Server communication → use/extend `src/utils_api.ts`
7. [ ] Confirm the type check passes with `npx tsc --noEmit`
