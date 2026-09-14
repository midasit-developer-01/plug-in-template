# MIDAS Plug-in Template

A React + TypeScript workspace for building MIDAS Civil / Gen (NX) plug-ins.

This document is a **code structure guide**. It covers what each folder does, the path a request
takes to reach the model, and where the code you write should go.
Installation and running are in `CLAUDE.md` §9; build and upload are in `CLAUDE.md` §8.

Tech stack: React 18, TypeScript 4.9, Create React App 5, recoil, react-i18next,
@midasit-dev/moaui, Tailwind CSS.


## 1. 30-second summary

A plug-in is a **static web page with no server of its own**. NX opens this page in its built-in
browser, and the page sends HTTP requests to the running NX to read and modify **the model that is
currently open**.

    [ Screens I build  ]        src/components/
              |
              | passes values
              v
    [ API client       ]        src/utils_api.ts      <- the only file that sends requests
              |
              | HTTP + MAPI-Key header
              v
    [ Running NX       ]        Civil / Gen
              |
              v
    [ Open model       ]        nodes, elements, loads, springs ...

Three consequences:

- NX must be running with a model open for the screen to appear. This applies during development too.
- API requests go through `src/utils_api.ts`. Don't call fetch directly anywhere else.
- There are 551 endpoints, each with a different body shape, so look them up in `docs/api/`
  instead of writing them from memory.


## 2. Folder tree

Legend:

    [my code]   Add the files you create here
    [wiring]    Code the template lays down in advance. Touch it only to change the framework
    [docs]      Reference material read by AI and people. Do not delete

Full structure:

    plug-in-template/
    |
    +-- src/                          Application code
    |   |
    |   +-- index.tsx                 [wiring] React mount, router, i18n init
    |   +-- Wrapper.tsx               [wiring] MAPI-Key verification gate. Renders nothing until it passes
    |   +-- App.tsx                   [wiring] Outer frame of the screen (scroll area)
    |   |
    |   +-- components/               [my code] Screen-level blocks
    |   |   +-- MainWindow.tsx            Window shell
    |   |   +-- Contents.tsx              The actual screen starts here. Your starting point
    |   |   \-- RequestBtnPy.tsx          Example button that calls the API
    |   |
    |   +-- UI/                       [my code] Reusable widgets (input fields, dialogs, etc.)
    |   |   \-- LanguageType.tsx          Language dropdown
    |   |
    |   +-- hooks/                    [my code] Logic and state that draw nothing
    |   |   \-- useWindowControl.ts       Window drag / resize
    |   |
    |   +-- Calculates/               [my code] Pure calculation functions (currently empty)
    |   +-- DataControls/             [my code] Import / export (currently empty)
    |   +-- states/                   [my code] recoil global state (folder doesn't exist yet)
    |   |
    |   +-- utils_api.ts              [wiring] API client. Explained in §6
    |   +-- utils_pyscript.ts         [wiring] Old Python approach. Fully commented out. See §7
    |   +-- utils_typscript.ts        [wiring] Input validation helpers
    |   +-- config.ts                 [wiring] Reads dev environment variables
    |   +-- language.ts               [wiring] Language detection and persistence
    |   +-- i18n.js                   [wiring] Translation init
    |   +-- locales/en,kr,jp/         [my code] Screen text in 3 languages
    |   \-- CLAUDE.md                 [docs] Coding rules
    |
    +-- docs/api/                     [docs] API knowledge base. Explained in §6
    |   +-- README.md                     Lookup procedure
    |   +-- INDEX.md                      Endpoint list, 349 rows
    |   +-- INDEX-design.md               Design / rating endpoints, 202 rows
    |   +-- schemas/                      551 files. Schema + working example
    |   +-- features/                     150 files. Product menu path and field meanings
    |   +-- cookbook.md                   Recipes for common tasks
    |   \-- reference.md                  Convention summary and gotchas
    |
    +-- public/                       Copied as-is to build/ at build time
    |   +-- index.html                    Contains the pyscript tags, commented out
    |   +-- manifest.json                 Plug-in title, window width and height
    |   +-- icon.svg                      Store icon. Only SVG is recognized
    |   +-- readme.md                     Store description page
    |   \-- py_base.py, py_api_db.py, py_main.py, py_config.json
    |                                     Old Python approach assets. See §7
    |
    +-- scripts/
    |   +-- build.js                      Forces the dev auth bypass off at build time
    |   \-- sync-api-docs.js              Regenerates docs/api
    |
    \-- CLAUDE.md                     [docs] Root guide. Includes install, build and upload steps


## 3. How the screen comes up

A simple chain where each file calls the next. There is one auth gate in the middle.

    NX or a browser opens the page
              |
              v
    +---------------------+
    | index.tsx           |   Attaches React, prepares router and translations
    +---------------------+
              |
              v
    +---------------------+
    | Wrapper.tsx         |   Asks NX whether the MAPI-Key is valid
    +---------------------+
        |            |
        | fail       | pass
        v            v
    +----------+   +---------------------+
    | Failed   |   | App.tsx             |   Outer frame of the screen
    | screen   |   +---------------------+
    +----------+             |
        ^                    v
        |          +---------------------+
        |          | MainWindow.tsx      |   Window shell
        |          +---------------------+
        |                    |
        |                    v
        |          +---------------------+
        |          | Contents.tsx        |   ****  My screen starts here  ****
        |          +---------------------+
        |
     A panel titled "Validation Check" appears instead.
     It is not broken; it means one of these three:
       - ?mapiKey= is missing from the URL, or the key has expired
       - NX is not running, or no model file is open
       - The redirectTo address differs from the actual server

After auth passes, `Wrapper.tsx` also sets up the recoil store (RecoilRoot) and the notification
provider (SnackbarProvider). So below `App.tsx` you can use global state and notifications with no
extra setup.


## 4. From one button to a modified model

The flow of a feature that calculates pile springs and puts them into the model. Each step maps
directly to the folder rules explained in §5.

    [1] The user enters values and presses Apply
              |
              v
    [2] src/components/InputPanel.tsx          Screen
        Gathers the inputs and hands them to the hook. No calculation or requests here
              |
              v
    [3] src/hooks/usePileSpring.ts             Sequencing
        Decides the read -> calculate -> write order and stores the result in state
              |
              +----> [4] src/utils_api.ts   dbRead("NODE")
              |               |
              |               |  GET /db/NODE  + MAPI-Key
              |               v
              |          Running NX  ---->  { "1": {X,Y,Z}, "2": {...} }
              |
              v
    [5] src/Calculates/springStiffness.ts      Calculation
        Node coordinates + inputs -> spring stiffness. A pure function that knows nothing about React
              |
              v
    [6] src/utils_api.ts   dbCreate("SPRING", { ... })
              |
              |  POST /db/SPRING  + MAPI-Key
              v
         Running NX  ---->  The model actually changes
              |
              v
    [7] Putting the result into state re-renders the screen

What you gain by keeping this chain: to change only the formula, open only [5]; to change only the
layout, open only [2]. If [2] also does the calculation and the requests, you won't know where to
make changes later.


## 5. Where should a new file go?

Ask these questions about the code you're about to write, in order, and the location follows.

    Does the new code draw something on screen?
    |
    +-- Yes
    |   |
    |   +-- Is it a part that could be reused as-is outside this plug-in?
    |       |
    |       +-- Yes  ->  src/UI/
    |       |               e.g. NumberField.tsx, ConfirmDialog.tsx, ResultTable.tsx
    |       |               Condition: works through props only. No API calls, no domain knowledge
    |       |
    |       \-- Specific to this screen  ->  src/components/
    |                       e.g. InputPanel.tsx, ResultPanel.tsx
    |                       Role: assembles UI parts, hooks and state into one screen block
    |
    \-- No
        |
        +-- A calculation where numbers go in and numbers come out?   ->  src/Calculates/
        |   e.g. springStiffness.ts   Condition: no React import, no side effects
        |
        +-- File read/write, format conversion, export?                ->  src/DataControls/
        |   e.g. exportProject.ts, importCsv.ts
        |
        +-- Holds state or calls the API?                              ->  src/hooks/
        |   e.g. usePileSpring.ts     Name must be useXxx. No JSX
        |
        \-- A value shared by several screens?                         ->  src/states/
            e.g. projectState.ts      recoil atoms and selectors

Right now `Calculates/` and `DataControls/` are empty and `states/` doesn't exist. Create files when
you need them. But **do not create any new folder under `src/` that isn't in the list above.**
Once the rules drift, neither AI nor people can find files.

One more thing: don't hard-code strings shown on screen. Use a key like `t("welcome_title")`, and put
the actual text in all three files: `src/locales/en`, `kr`, `jp`. If one is missing, that language
silently falls back to English.


## 6. Reading and writing the model (TypeScript, default approach)

The only file that sends requests is `src/utils_api.ts`. There are two forms.

    db form       : create, read, update, delete data. Body wrapped in { Assign: ... }. About 405
    command form  : instructions such as running analysis or extracting tables.
                    Body wrapped in { Argument: ... }. About 146

Which form an endpoint uses is shown in the `body` column of `docs/api/INDEX.md`.

Usage:

    import { dbRead, dbCreate, command } from "./utils_api";

    // Read
    const units = await dbRead("UNIT");
    if (units?.error) {           // Failures come back as values, not exceptions
      console.error(units.error, units.body);
      return;
    }

    // Write (copy the shape verbatim from the example in docs/api/schemas/db/NODE.json)
    await dbCreate("NODE", { "1": { X: 0, Y: 0, Z: 0 } });

    // Commands
    await command("doc", "ANAL");                                 // Run analysis
    await command("post", "TABLE", { TABLE_TYPE: "REACTIONG" });  // Extract reaction table

Functions:

    dbCreate(itemName, items)              POST    Create all
    dbCreateItem(itemName, key, item)      POST    Create one
    dbRead(itemName)                       GET     Read all
    dbReadItem(itemName, key)              GET     Read one
    dbUpdate(itemName, items)              PUT     Update all
    dbUpdateItem(itemName, key, item)      PUT     Update one
    dbDelete(itemName, key)                DELETE  Delete one
    command(group, name, argument, method) POST by default   Everything that isn't db form
    requestJson(method, endpoint, body)    Escape hatch for direct calls

Three things to know:

- `itemName` can be a name under db such as `"NODE"`, or a full path such as
  `"design/PSC/AASHTO-LRFD24/MEMB"`.
- **Failures are not thrown as exceptions.** They come back as a `{ error, body }` value with the
  server's explanation in `body`. If you don't check it, a failed write passes silently.
- The response timeout is 60 seconds, because analysis and table extraction can be slow.

### Procedure for choosing an endpoint

Names are four-letter abbreviations, many look alike, and picking the wrong one gets the request
rejected or fills the wrong table. So look it up every time.

    [1] grep docs/api/INDEX.md                 (the file is large; don't read it whole)
              |                                grep -i "spring" docs/api/INDEX.md
              v
    [2] Read the desc column and pick one      The first hit is often not the right one
              |
              v
    [3] Read docs/api/schemas/<chosen uri>.json
              |                                e.g. db/NODE  ->  schemas/db/NODE.json
              v
    [4] Copy its example exactly               Same field names and nesting
              |
              v
    [5] Call it with a utils_api.ts function

Questions like "where is this feature in the product menu?" are answered not with code but with
`menu_path` and `usage` in `docs/api/features/<uri>.json`.

Regenerate only when the catalog changes.

    node scripts/sync-api-docs.js


## 7. Communicating with Python (pyscript)

The default is the TypeScript approach above. Turn this on **only when you really need a Python
library** such as numpy. The browser downloads and runs an entire Python runtime, so the first load
becomes noticeably slower.

Related files and roles:

    public/index.html        pyscript loader and config tags. Currently commented out
    public/py_config.json    Python packages to use (numpy) and the .py files to load with them
    public/py_base.py        MidasAPI class and HTTP functions. The counterpart of utils_api.ts
    public/py_api_db.py      db-form call functions such as py_db_read / py_db_create
    public/py_main.py        Where you write Python code. Starts at main()
    src/utils_pyscript.ts    Bridge for calling Python from JS. Fully commented out
    src/global.d.ts          pyscript global declaration. Commented out

Steps to turn it on (7 steps, all of them uncommenting):

    [1] public/index.html
        Uncomment the three lines: the pyscript.js script tag, the py-config tag, the py-script tag

    [2] src/utils_pyscript.ts
        Uncomment the whole file

    [3] src/global.d.ts
        Uncomment the declaration  const pyscript: any;

    [4] Top of src/Wrapper.tsx
        Uncomment  import { setGlobalVariable, getGlobalVariable } from "./utils_pyscript";

    [5] src/Wrapper.tsx
        Change ValidWrapper to (props: any) and make it receive isIntalledPyscript

    [6] src/Wrapper.tsx
        Uncomment the pyscript status row in the validation panel

    [7] Bottom of src/Wrapper.tsx
        Uncomment the PyscriptWrapper block and replace
        export default ValidWrapper;  ->  export default PyscriptWrapper;

This adds one more layer to the execution flow.

    index.tsx
        |
        v
    PyscriptWrapper       Waits until the Python interpreter is ready (shows a loading screen)
        |                 Once ready, hands the MAPI-Key and server address to Python globals
        v
    ValidWrapper          The existing MAPI-Key verification gate
        |
        v
    App.tsx ...

What calls look like on the Python side:

    # public/py_main.py
    from py_base import MidasAPI, Product
    from py_api_db import py_db_read, py_db_create

    def main():
        nodes = py_db_read("NODE")
        py_db_create("SPRING", { "1": { "SPR_TYPE": "LINEAR" } })

To call a Python function from JS, fetch it with `pyscript.interpreter.globals.get("functionName")`
and call it. The detailed form is in the comments of `src/utils_pyscript.ts` and the guide comment at
the bottom of `src/Wrapper.tsx`.


## 8. Screen text (i18n)

Translation files are not downloaded at runtime; they are included in the bundle at build time.
Even if the deploy server blocks the `/locales/` path, nothing is affected.

Order used to decide the language (the first match from the top wins):

    1  A language in the URL path              /jp/...        ->  Japanese
    2  Query string                            ?lang=kr       ->  Korean
    3  Value saved in localStorage             The language the user chose before
    4  Browser / OS language setting
    5  Time zone guess                         Asia/Tokyo     ->  Japanese
    6  None of the above                                      ->  English

`ja` is normalized to `jp`, `ko` to `kr`, and `en-US` to `en`.
Switching languages does not reload the page and does not change the URL.

When adding text, put the same key in **all three files**: `src/locales/en/translation.json`,
`kr/` and `jp/`.


## 9. Dev settings and commands

Normally you run it with the key attached to the URL.

    http://localhost:3000/?mapiKey=YOUR_ISSUED_KEY

If attaching it every time is tedious, copy `.env.example` to create `.env.development.local`.

    REACT_APP_SKIP_AUTH=true                                        # Skip the verification gate
    REACT_APP_MAPI_KEY=YOUR_ISSUED_KEY                              # Actually needed for API requests
    REACT_APP_BASE_URL=https://moa-engineers.midasit.com:443/civil  # Include the civil / gen path

Note: turning on only `SKIP_AUTH` shows the screen, but every API request fails. Fill in all three lines.
These settings work only under `npm start`. For `npm run build`, `scripts/build.js` forces them off,
so they never leak into a release build. Restart the dev server after changing values.

Commands:

    npm start          Dev server (http://localhost:3000)
    npm run build      Release build -> build/ folder
    npm run css        Tailwind watch (src/input.css -> src/output.css)
    npx tsc --noEmit   Type check

`npm run dev` does not work. The DevTools folder has been removed.


## 10. Common pitfalls

- **API failures don't surface as exceptions.** If you don't check `{ error, body }`, a failed write
  looks like nothing happened on screen.
- **Running analysis without saving looks like a freeze.** If there are unsaved changes, NX opens a
  save dialog, and that dialog holds the API. It is indistinguishable from a slow analysis.
- **Undo does not fully restore model changes.** Develop on a copy.
- **pyscript is turned off, not deleted.** The files in §7 must be turned on or off together.
- **The Validation Check screen is not a malfunction.** It is one of the three causes in §3.
- **The store icon and description page are recognized by name only.** `icon.svg` must be SVG, and
  `readme.md` must be at the top level of the zip. No code references them, so nothing warns you
  when they are wrong.


## 11. What to read next

    CLAUDE.md                 Root guide. Includes install, run, build and upload steps
    src/CLAUDE.md             Coding rules, folder rules, translation rules, project definition template
    docs/api/README.md        Starting point for API calls. Lookup procedure and conventions
    docs/api/cookbook.md      Recipes for common tasks
    docs/api/reference.md     Structure and auth overview, collection of gotchas
