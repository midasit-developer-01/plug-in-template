# MIDAS NX Open API — Lookup Knowledge Base

Material for reading and modifying a running MIDAS CIVIL NX / GEN NX model through its REST API.
**551 endpoints, each with its own body shape.**

> ## Core rule
> **Do not write API calls from memory.**
> You pick an endpoint by name, and the body shape differs from endpoint to endpoint.
> Always open the `example` in `schemas/<uri>.json` and copy that shape exactly.
> That example is the contract; field names you inferred are not.

---

## Decide this first

Before starting, decide whether the deliverable is **an explanation or code**.

- **The user wants an explanation** — what this feature is, what it is for, where it lives in the product.
  → Answer from `menu_path` (dialog location) and `usage` (meaning of each field) in `features/<uri>.json`.
  The user is operating the product themselves, so **writing plug-in code is answering a question nobody asked**.
- **The user wants a working plug-in** — follow the procedure below.

---

## Procedure

```
1. Grep INDEX.md               →  find candidate endpoints (uri + methods + body + desc)
2. Read desc and pick one      →  names are 4-letter abbreviations; indistinguishable without desc
3. Read schemas/<uri>.json     →  full schema + a working example
4. Write code in that shape    →  dbXxx / command in src/utils_api.ts
```

### 1) Find — Grep `INDEX.md`

One line is one endpoint. **Grep it, don't Read it** (70KB).

```bash
grep -i "spring" docs/api/INDEX.md
grep -i "reaction\|table"  docs/api/INDEX.md
grep -i "KDS-41-20-2022"   docs/api/INDEX-design.md
```

| File | Covers | Rows |
| --- | --- | --- |
| [`INDEX.md`](./INDEX.md) | db · doc · ope · view · post · requestinfo · config | 349 |
| [`INDEX-design.md`](./INDEX-design.md) | design · rating (nested by code standard) | 202 |

The first hit is often not the right one. Read the `desc` column before choosing.

### 2) Confirm — Read `schemas/<uri>.json`

The path is the uri. `db/NODE` → [`schemas/db/NODE.json`](./schemas/db/NODE.json).

```json
{
  "uri": "db/NODE",
  "methods": "POST, GET, PUT, DELETE",
  "schema":  { "NODE": { "properties": { "X": …, "Y": …, "Z": … } } },
  "example": { "Assign": { "1": { "X": 0.0, "Y": 0.0, "Z": 0.0 } } },
  "manual_url": "https://support.midasuser.com/hc/en-us/articles/…"
}
```

The `example` is the contract. Follow its field names, nesting and types exactly.

### 3) If needed — understand the meaning via `features/<uri>.json`

**150** of the 551 endpoints have a GUI guide (rows with a value in the `feature` column of `INDEX.md`).
Each one holds `function` (what the feature does), `menu_path` (menu path in the product) and `usage`
(description of each input). When you need to know **what a field means in engineering terms**,
it is better than the schema.

> ⚠️ Menu names in `menu_path` follow the **English UI**. If the user runs the product in another
> language, quote the English label as-is and say so. Do not invent a translation.
>
> The design · rating groups have no guides (the manual has no matching articles).

---

## Body conventions

The `body` column of `INDEX.md` tells you which one applies. Every one of the 551 uses one of the two.

| Convention | Count | Shape | Call |
| --- | --- | --- | --- |
| `Assign` | 405 | `{ "Assign": { "<numeric key>": { …fields } } }` | `dbCreate` / `dbRead` / `dbUpdate` / `dbDelete` |
| `Argument` | 146 | `{ "Argument": { …fields } }` | `command(group, name, argument)` |

- **`Assign` is not exclusive to `/db`.** 146 endpoints in design/rating use the same shape.
  Pass the full uri to a db helper and it goes through as-is: `dbRead("design/PSC/AASHTO-LRFD24/MEMB")`.
- **What the numeric key means depends on the data.** For sections it is the section ID; for load
  combinations it is the creation order. Single-record data such as `UNIT` always uses key `"1"`.
- **GET / DELETE send no body**, regardless of the `body` column.
- **GET responses come wrapped once in the item name** (`{ "NODE": { "1": {…} } }`).
  `dbRead()` strips that wrapper and returns `{ "1": {…} }`.

---

## Calling from code

The only call site is [`src/utils_api.ts`](../../src/utils_api.ts). Everything is `async`, so `await` it.

```ts
import { dbRead, dbUpdate, command } from "../utils_api";

// Assign convention — GET /db/NODE  →  { "1": {...}, "2": {...} }
const nodes = await dbRead("NODE");
if (nodes.error) { console.error(nodes.error, nodes.body); return; }

// Assign convention — PUT /db/SPRING
await dbUpdate("SPRING", { 1: { /* as in the example of schemas/db/SPRING.json */ } });

// Argument convention — POST /post/TABLE
const table = await command("post", "TABLE", { TABLE_TYPE: "REACTIONG" });
```

Failures do not throw; they come back as `{ error, body? }`. **Check `result.error` at the call site.**
`body` holds the server's response body, which usually says which field was rejected and why.

Complete examples for common tasks are in [`cookbook.md`](./cookbook.md).

---

## Gotchas

Lessons already paid for. Read these before writing code.

- [`reference.md` §10](./reference.md) — garbage values in inactive components of `db/IEHP`,
  the `断面寸法` error when `BUILT_FLAG`/`STIFF` are missing from `db/SECT` with `SECTTYPE:"VALUE"`, and more.
- Precondition for any request: **the target NX app must be running with a model file open.** Otherwise everything fails.
- `ᴴˢ` marks Hyper-S solver only; `ᴶ` marks CIVIL NX JP edition only.
- `dbDelete` and the `doc` group (NEW/OPEN/SAVE/EXPORT) **overwrite user data.** Unlike reads, they cannot be undone.

---

## What's in this folder

| Path | Contents |
| --- | --- |
| `INDEX.md` · `INDEX-design.md` | Endpoint lists (Grep targets) |
| `schemas/<uri>.json` | 551 · JSON Schema + working example + manual link |
| `features/<uri>.json` | 150 · feature description + product menu path + per-input usage |
| `reference.md` | Structure / auth / convention overview, per-group catalog, and §10 gotchas |

`INDEX*.md`, `schemas/`, `features/` and `reference.md` are **generated**.
Don't edit them by hand — regenerate with [`scripts/sync-api-docs.js`](../../scripts/sync-api-docs.js).

```bash
node scripts/sync-api-docs.js
```
