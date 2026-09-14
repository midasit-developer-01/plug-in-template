/**
 * docs/api 지식 베이스 생성 스크립트.
 *
 * midas-mcp-server 의 번들 카탈로그(data/schemas, data/features, midas-api-reference.md)를
 * 읽어 이 저장소의 docs/api/ 아래에 Claude Code 가 읽기 좋은 형태로 펼친다.
 *
 * 산출물은 "커밋 대상"이다. mcp 저장소가 없는 PC 에서도 docs/api 만으로 플러그인을
 * 작성할 수 있어야 하므로, 이 스크립트는 카탈로그가 갱신됐을 때만 다시 돌린다.
 *
 *   node scripts/sync-api-docs.js
 *   node scripts/sync-api-docs.js --src <midas-mcp-server/data 경로>
 *   MIDAS_MCP_DATA=<경로> node scripts/sync-api-docs.js
 *
 * temp 그룹은 제외한다 (mcp 쪽도 Dockerfile 의 INCLUDE_TEMP=false 로 배포판에서 뺀다).
 */

const fs = require("fs");
const path = require("path");

const DEFAULT_SRC = "C:/Users/LEEGEONWOO/Dev/API/midas-mcp-server/data";
const EXCLUDED_GROUPS = new Set(["temp"]);

/** design/rating 은 코드 기준별로 깊게 중첩되고 양이 많아 별도 인덱스로 뺀다. */
const DESIGN_GROUPS = new Set(["design", "rating"]);

const DESC_MAX = 140;
const SENTENCE_MIN = 0.6;

// ---------------------------------------------------------------- helpers

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--src") out.src = argv[i + 1];
  }
  return out;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

/** schemas/ 아래를 재귀 순회. 바로 아래 파일(_meta.json 등)은 엔드포인트가 아니므로 건너뛴다. */
function walkJson(root) {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".json")) out.push(full);
    }
  };
  walk(root);
  return out
    .map((file) => ({ file, rel: path.relative(root, file).split(path.sep) }))
    .filter((x) => x.rel.length >= 2)
    .sort((a, b) => a.rel.join("/").localeCompare(b.rel.join("/")));
}

/**
 * 엔드포인트 설명. 파일마다 schema[NAME].description 에 넣기도 하고
 * schema.description 에 넣기도 한다 (572개 중 2개는 아예 없음).
 */
function summarize(entry) {
  const schema = entry.schema;
  if (!schema || typeof schema !== "object") return "";
  for (const value of Object.values(schema)) {
    if (value && typeof value === "object" && value.description) return String(value.description);
  }
  return String(schema.description || "");
}

/** 한 줄짜리 요약. 늦게 나오는 문장 경계에서 자르고, 없으면 단어 경계 + 말줄임. */
function shortDesc(summary, cap = DESC_MAX) {
  const text = summary.split(/\s+/).join(" ").trim();
  if (text.length <= cap) return text;

  const window = text.slice(0, cap);
  const stop = window.lastIndexOf(". ");
  if (stop >= cap * SENTENCE_MIN) return window.slice(0, stop + 1);

  const space = window.lastIndexOf(" ");
  return (space > 0 ? window.slice(0, space) : window.slice(0, cap - 1)).replace(/[ ,;:]+$/, "") + "…";
}

/**
 * 바디 규약. 그룹이 아니라 example 의 최상위 키로 판별한다 —
 * 같은 그룹 안에서도 엔드포인트마다 다르다.
 *   Assign   : {"Assign": {"1": {...}}}      (db 형태 CRUD)
 *   Argument : {"Argument": {...}}           (명령형)
 *   NAME     : {"STOR": {...}} 처럼 이름이 곧 키
 */
function conventionOf(entry) {
  const ex = entry.example;
  if (!ex || typeof ex !== "object" || Array.isArray(ex)) return "-";
  if ("Assign" in ex) return "Assign";
  if ("Argument" in ex) return "Argument";
  const keys = Object.keys(ex);
  if (keys.length === 0) return "(none)";
  return keys.length === 1 ? `{${keys[0]}}` : "-";
}

/** 표 셀 안에서 | 와 개행이 표를 깨뜨리지 않게. */
function cell(value) {
  return String(value == null ? "" : value)
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

// ---------------------------------------------------------------- build

function collect(srcDir) {
  const schemaDir = path.join(srcDir, "schemas");
  const featureIndexFile = path.join(srcDir, "features", "_index.json");
  const featureIndex = fs.existsSync(featureIndexFile) ? readJson(featureIndexFile) : {};

  const rows = [];
  const skipped = [];

  for (const { file, rel } of walkJson(schemaDir)) {
    const entry = readJson(file);
    if (!entry || typeof entry !== "object") continue;

    const group = entry._group || rel[0];
    if (EXCLUDED_GROUPS.has(group)) {
      skipped.push(group);
      continue;
    }

    const name = entry._name || path.basename(file, ".json");
    const uri = entry.uri || rel.join("/").replace(/\.json$/, "");
    const feature = featureIndex[uri];

    rows.push({
      group,
      name,
      uri,
      methods: entry.methods || "",
      convention: conventionOf(entry),
      feature: feature ? feature.feature_name : "",
      desc: shortDesc(summarize(entry)),
      relPath: rel.join("/"),
      srcFile: file,
    });
  }

  return { rows, featureIndex, skippedCount: skipped.length };
}

/**
 * json 트리를 그대로 복사한다.
 * `skipGroups` 는 최상위 폴더(=그룹) 기준, `keepRootFiles` 는 루트 바로 아래 파일을
 * 가져올지 여부 — features/_index.json 은 필요하고 schemas/_meta.json 은 필요 없다.
 */
function copyTree(srcDir, outDir, { skipGroups = new Set(), keepRootFiles = false } = {}) {
  let count = 0;
  const walk = (dir, rel) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const nextRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (!rel && skipGroups.has(entry.name)) continue;
        walk(full, nextRel);
      } else if (entry.name.endsWith(".json")) {
        if (!rel && !keepRootFiles) continue;
        fs.mkdirSync(path.join(outDir, path.dirname(nextRel)), { recursive: true });
        fs.copyFileSync(full, path.join(outDir, nextRel));
        count += 1;
      }
    }
  };
  walk(srcDir, "");
  return count;
}

function renderIndex({ title, intro, rows }) {
  const byGroup = new Map();
  for (const row of rows) {
    if (!byGroup.has(row.group)) byGroup.set(row.group, []);
    byGroup.get(row.group).push(row);
  }

  const lines = [`# ${title}`, "", intro, ""];

  for (const group of [...byGroup.keys()].sort()) {
    const groupRows = byGroup.get(group).sort((a, b) => a.uri.localeCompare(b.uri));
    lines.push(`## ${group} (${groupRows.length})`, "");
    lines.push("| uri | methods | body | feature | desc |");
    lines.push("| --- | --- | --- | --- | --- |");
    for (const r of groupRows) {
      lines.push(
        `| \`${cell(r.uri)}\` | ${cell(r.methods)} | ${cell(r.convention)} | ${cell(r.feature)} | ${cell(r.desc)} |`
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------- reference.md 교정

/**
 * 업스트림 reference.md 는 mcp 저장소 기준으로 쓰여 있어 이 저장소에서는 두 군데가 틀린다.
 *   ① "스키마가 필요하면 Zendesk 에서 받아 midas-api-examples.json 에 반영하라" —
 *      이제 전체 스키마가 docs/api/schemas/ 에 로컬로 있으므로 외부 조회가 필요 없다.
 *   ② 상대 경로와 utils_api 매핑표가 옛 구조를 가리킨다.
 *
 * 앵커를 못 찾으면 조용히 넘어가지 않고 실패시킨다. 업스트림이 바뀌었는데 낡은 안내가
 * 그대로 남는 것이 가장 나쁜 결과이기 때문이다.
 */
const REFERENCE_PATCHES = [
  {
    label: "헤더 사용 규칙",
    find: /> \*\*🧭 Usage rules \(important\)\*\*[\s\S]*?\n\n(?=\*\*Sources\*\*)/,
    replace: [
      "> **🧭 조회 규칙 (중요)**",
      "> 1. 엔드포인트를 찾을 때는 [`INDEX.md`](./INDEX.md) (설계는 [`INDEX-design.md`](./INDEX-design.md)) 를 **Grep** 한다.",
      "> 2. 고른 엔드포인트의 **전체 스키마와 동작하는 예시**는 `schemas/<uri>.json` 에 있다.",
      ">    예: `db/NODE` → [`schemas/db/NODE.json`](./schemas/db/NODE.json). 외부 조회는 필요 없다.",
      "> 3. GUI 상의 위치·조작법이 필요하면 `features/<uri>.json` — 있는지는 `INDEX.md` 의 `feature` 열로 알 수 있다.",
      "> 4. 이 문서는 **구조·규약·카탈로그 개관**용이다. 필드 단위 진실은 항상 `schemas/` 쪽이다.",
      "",
      "",
    ].join("\n"),
  },
  {
    label: "머리말 경로",
    find: "> The call site in this template is [`utils_api.ts`](./utils_api.ts), whose prototype is [`../public/py_base.py`](../public/py_base.py).\n> **Real request/response payload examples** are kept separately in [`./midas-api-examples.json`](./midas-api-examples.json).",
    replace:
      "> The call site in this template is [`utils_api.ts`](../../src/utils_api.ts).\n" +
      "> **Real request/response payload examples** live one-file-per-endpoint under [`./schemas/`](./schemas).",
  },
  {
    label: "§9 매핑표",
    find: /- If you need DOC\/OPE\/VIEW\/POST[\s\S]*?`requestJson\("POST", "\/post\/TABLE", \{ Argument: \{\.\.\.\} \}\)`\./,
    replace: [
      "For every non-db group, use `command()`:",
      "",
      "| utils_api function | method · path | body |",
      "| --- | --- | --- |",
      '| `command("doc", "ANAL")` | `POST /doc/ANAL` | `{}` |',
      '| `command("post", "TABLE", arg)` | `POST /post/TABLE` | `{ Argument: arg }` |',
      '| `command("view", "SELECT", undefined, "GET")` | `GET /view/SELECT` | — |',
      '| `command("ope", "STOR", arg)` | `POST /ope/STOR` | `{ Argument: arg }` |',
      '| `command("design", "RC/KDS-41-20-2022/DCRM", arg)` | `POST /design/RC/KDS-41-20-2022/DCRM` | `{ Argument: arg }` |',
      "",
      "`command()`'s 5th parameter (`body`) bypasses the wrapping and is sent verbatim. Every one of the",
      "bundled endpoints uses `Assign` or `Argument`, so it is an escape hatch, not a routine argument.",
      "",
      "The db helpers also accept a full uri, so db-shaped tables outside `/db` are reachable:",
      '`dbRead("design/PSC/AASHTO-LRFD24/MEMB")` → `GET /design/PSC/AASHTO-LRFD24/MEMB`.',
    ].join("\n"),
  },
  {
    label: "POST/TABLE Argument 안내",
    find:
      "> For the exact Argument schema, see the POST/TABLE guide and each table's article → once confirmed, reflect it into `midas-api-examples.json`.",
    replace:
      "> For the exact Argument schema, see [`schemas/post/TABLE.json`](./schemas/post/TABLE.json) — it carries the full JSON Schema and a working example per table type.",
  },
  {
    label: "IEHP 예시 포인터",
    find: "- Example payload: see the `IEHP` key in [`./midas-api-examples.json`](./midas-api-examples.json).",
    replace: "- Example payload: [`schemas/db/IEHP.json`](./schemas/db/IEHP.json).",
  },
  {
    label: "SECT 예시 포인터",
    find:
      '- Example payload: see key `"6003"` under the `SECT` example in [`./midas-api-examples.json`](./midas-api-examples.json).',
    replace: '- Example payload: the `"6003"` key inside [`schemas/db/SECT.json`](./schemas/db/SECT.json).',
  },
  {
    label: "§10 머리 예시 안내",
    find:
      "- The exact field names and required values are ultimately grounded in the relevant **article page**. Once confirmed, reflect into `midas-api-examples.json`.",
    replace:
      "- The exact field names and required values are grounded in `schemas/<uri>.json`, which carries the article's JSON Schema and a working example.",
  },
];

function patchReference(text) {
  // 업스트림은 CRLF. 앵커를 \n 기준으로 쓸 수 있게 먼저 정규화한다.
  let out = text.replace(/\r\n/g, "\n");
  const missing = [];
  for (const patch of REFERENCE_PATCHES) {
    const before = out;
    out = out.replace(patch.find, patch.replace);
    if (out === before) missing.push(patch.label);
  }
  if (missing.length) {
    throw new Error(
      `reference.md 교정 실패 — 업스트림에서 다음 위치를 찾지 못했습니다: ${missing.join(", ")}\n` +
        "scripts/sync-api-docs.js 의 REFERENCE_PATCHES 를 업스트림 문서에 맞게 갱신하세요."
    );
  }
  return out;
}

// ---------------------------------------------------------------- main

function main() {
  const args = parseArgs(process.argv.slice(2));
  const srcDir = args.src || process.env.MIDAS_MCP_DATA || DEFAULT_SRC;
  const outDir = path.resolve(__dirname, "..", "docs", "api");

  if (!fs.existsSync(path.join(srcDir, "schemas"))) {
    console.error(`카탈로그를 찾을 수 없습니다: ${srcDir}/schemas`);
    console.error("--src <midas-mcp-server/data 경로> 또는 MIDAS_MCP_DATA 로 지정하세요.");
    process.exit(1);
  }

  const { rows, featureIndex, skippedCount } = collect(srcDir);

  // 1) 엔드포인트별 스키마 트리
  const schemaOut = path.join(outDir, "schemas");
  fs.rmSync(schemaOut, { recursive: true, force: true });
  const schemaCount = copyTree(path.join(srcDir, "schemas"), schemaOut, { skipGroups: EXCLUDED_GROUPS });

  // 2) GUI 가이드 트리
  const featureOut = path.join(outDir, "features");
  fs.rmSync(featureOut, { recursive: true, force: true });
  const featureFiles = copyTree(path.join(srcDir, "features"), featureOut, {
    skipGroups: EXCLUDED_GROUPS,
    keepRootFiles: true, // _index.json
  });
  const guideCount = featureFiles - 1; // _index.json 은 가이드가 아니다

  // 3) 인덱스 — 핵심 그룹과 design/rating 을 분리한다.
  //    design/rating 은 코드 기준별로 같은 이름이 반복돼 핵심 그룹 검색을 방해한다.
  const coreRows = rows.filter((r) => !DESIGN_GROUPS.has(r.group));
  const designRows = rows.filter((r) => DESIGN_GROUPS.has(r.group));

  writeFile(
    path.join(outDir, "INDEX.md"),
    renderIndex({
      title: "엔드포인트 인덱스 — db / doc / ope / view / post / requestinfo / config",
      intro: [
        "**이 파일은 Read 하지 말고 Grep 하세요.** 한 줄이 엔드포인트 하나입니다.",
        "",
        "설계/내진성능평가 엔드포인트는 [INDEX-design.md](./INDEX-design.md) 에 있습니다.",
        "",
        "- `body` — `schemas/<uri>.json` 의 `example` 최상위 키. `Assign` 은 db 형태 CRUD,",
        "  `Argument` 는 명령형, `{NAME}` 은 엔드포인트 이름이 곧 키인 경우, `(none)` 은 빈 바디.",
        "  단 **GET / DELETE 는 바디를 보내지 않습니다** — 이 열의 값과 무관합니다.",
        "- `feature` — 값이 있으면 `features/<uri>.json` 에 GUI 가이드(메뉴 경로 + 사용법)가 있다는 뜻.",
        "- 전체 스키마와 동작하는 예시는 `schemas/<uri>.json`.",
        "",
        "> 생성물입니다. 직접 고치지 말고 `node scripts/sync-api-docs.js` 로 다시 만드세요.",
      ].join("\n"),
      rows: coreRows,
    }) + "\n"
  );

  writeFile(
    path.join(outDir, "INDEX-design.md"),
    renderIndex({
      title: "엔드포인트 인덱스 — design / rating",
      intro: [
        "**이 파일은 Read 하지 말고 Grep 하세요.** 한 줄이 엔드포인트 하나입니다.",
        "",
        "설계(design)와 내진성능평가(rating) 엔드포인트는 `<그룹>/<코드 분류>/<기준>/<이름>` 으로",
        "중첩되고, 같은 이름이 기준마다 반복됩니다 (예: `MATD` 는 design/RC, design/PSC, design/SRC,",
        "rating/PSC 에 각각 존재). **반드시 전체 uri 로 지정하세요.**",
        "",
        "이 그룹에는 GUI 가이드가 없습니다 (매뉴얼에 해당 문서가 없음).",
        "",
        "> 생성물입니다. 직접 고치지 말고 `node scripts/sync-api-docs.js` 로 다시 만드세요.",
      ].join("\n"),
      rows: designRows,
    }) + "\n"
  );

  // 4) 참조 문서 — 그대로 복사한 뒤 이 저장소 기준으로 교정한다.
  const refSrc = path.join(srcDir, "midas-api-reference.md");
  if (fs.existsSync(refSrc)) {
    writeFile(path.join(outDir, "reference.md"), patchReference(fs.readFileSync(refSrc, "utf8")));
  }

  const groups = [...new Set(rows.map((r) => r.group))].sort();
  const perGroup = groups.map((g) => `${g} ${rows.filter((r) => r.group === g).length}`).join(", ");
  const assign = rows.filter((r) => r.convention === "Assign").length;
  const argument = rows.filter((r) => r.convention === "Argument").length;
  const other = rows.length - assign - argument;

  console.log(`src: ${srcDir}`);
  console.log(`out: ${outDir}`);
  console.log(`엔드포인트 ${rows.length}개 (${perGroup})`);
  console.log(`  temp 그룹 ${skippedCount}개 제외`);
  console.log(`규약: Assign ${assign}, Argument ${argument}${other ? `, 기타 ${other}` : ""}`);
  console.log(`스키마 ${schemaCount}개, GUI 가이드 ${guideCount}개 (_index.json 항목 ${Object.keys(featureIndex).length}개)`);
  console.log(`INDEX.md ${coreRows.length}행, INDEX-design.md ${designRows.length}행`);

  // 손으로 쓴 문서(docs/api/README.md, CLAUDE.md 등)에 이 숫자들이 박혀 있다.
  // 카탈로그가 바뀌면 위 출력과 대조해 직접 갱신할 것.
  console.log("\n※ README.md / CLAUDE.md 에 적힌 개수가 위와 다르면 손으로 갱신하세요.");
}

main();
