# MIDAS NX Open API — 조회 지식 베이스

MIDAS CIVIL NX / GEN NX 의 실행 중인 모델을 REST API 로 읽고 고치기 위한 자료입니다.
**엔드포인트 540개, 각각 바디 모양이 다릅니다.**

> ## 핵심 규칙
> **API 호출 코드를 기억에 의존해 쓰지 마세요.**
> 엔드포인트는 이름으로 고르고, 바디 모양은 엔드포인트마다 다릅니다.
> 반드시 `schemas/<uri>.json` 의 `example` 을 열어 그 모양 그대로 베끼세요.
> 그 예시가 계약이며, 추론한 필드명은 계약이 아닙니다.

---

## 무엇부터 정할 것인가

작업을 시작하기 전에 **결과물이 설명인지 코드인지** 먼저 판단하세요.

- **설명을 원하는 경우** — 이 기능이 무엇인지, 어디에 쓰는지, 제품 어디에 있는지.
  → `features/<uri>.json` 의 `menu_path`(대화상자 위치)와 `usage`(각 필드의 의미)로 답하세요.
  사용자가 직접 제품을 조작하는 상황이므로, **플러그인 코드를 쓰는 것은 묻지 않은 답**입니다.
- **동작하는 플러그인을 원하는 경우** — 아래 절차를 따르세요.

---

## 절차

```
1. INDEX.md 를 Grep          →  후보 엔드포인트 찾기 (uri + methods + body + desc)
2. desc 를 읽고 고르기        →  이름은 4글자 약어라 desc 없이는 구분되지 않음
3. schemas/<uri>.json 을 Read →  전체 스키마 + 동작하는 example
4. example 모양대로 코드 작성  →  src/utils_api.ts 의 dbXxx / command
```

### 1) 찾기 — `INDEX.md` 를 Grep

한 줄이 엔드포인트 하나입니다. **Read 하지 말고 Grep 하세요** (71KB).

```bash
grep -i "spring" docs/api/INDEX.md
grep -i "reaction\|table"  docs/api/INDEX.md
grep -i "KDS-41-20-2022"   docs/api/INDEX-design.md
```

| 파일 | 대상 | 행 수 |
| --- | --- | --- |
| [`INDEX.md`](./INDEX.md) | db · doc · ope · view · post · requestinfo · config | 354 |
| [`INDEX-design.md`](./INDEX-design.md) | design · rating (코드 기준별 중첩) | 186 |

첫 번째 결과가 정답이 아닐 때가 많습니다. `desc` 열을 읽고 고르세요.

### 2) 확인 — `schemas/<uri>.json` 을 Read

경로가 곧 uri 입니다. `db/NODE` → [`schemas/db/NODE.json`](./schemas/db/NODE.json).

```json
{
  "uri": "db/NODE",
  "methods": "POST, GET, PUT, DELETE",
  "schema":  { "NODE": { "properties": { "X": …, "Y": …, "Z": … } } },
  "example": { "Assign": { "1": { "X": 0.0, "Y": 0.0, "Z": 0.0 } } },
  "manual_url": "https://support.midasuser.com/hc/en-us/articles/…"
}
```

`example` 이 계약입니다. 필드명·중첩·타입을 그대로 따르세요.

### 3) 필요하면 — `features/<uri>.json` 로 의미 파악

540개 중 **155개**에 GUI 가이드가 있습니다 (`INDEX.md` 의 `feature` 열에 값이 있는 행).
`function`(무엇을 하는 기능인지), `menu_path`(제품 메뉴 경로), `usage`(각 입력 항목 설명)이 들어 있어
**필드가 공학적으로 무엇을 뜻하는지** 알아야 할 때 스키마보다 낫습니다.

> ⚠️ `menu_path` 의 메뉴 이름은 **영문 UI 기준**입니다. 사용자가 다른 언어 제품을 쓰면
> 영문 라벨을 그대로 인용하고 그 사실을 밝히세요. 번역을 지어내지 마세요.
>
> design · rating 그룹에는 가이드가 없습니다 (매뉴얼에 해당 문서가 없음).

---

## 바디 규약

`INDEX.md` 의 `body` 열이 어느 쪽인지 알려줍니다. 540개 전부 둘 중 하나입니다.

| 규약 | 개수 | 모양 | 호출 |
| --- | --- | --- | --- |
| `Assign` | 402 | `{ "Assign": { "<번호 키>": { …필드 } } }` | `dbCreate` / `dbRead` / `dbUpdate` / `dbDelete` |
| `Argument` | 138 | `{ "Argument": { …필드 } }` | `command(group, name, argument)` |

- **`Assign` 은 `/db` 전용이 아닙니다.** design/rating 의 132개도 같은 모양입니다.
  db 헬퍼에 전체 uri 를 넘기면 그대로 갑니다: `dbRead("design/PSC/AASHTO-LRFD24/MEMB")`.
- **번호 키의 의미는 데이터마다 다릅니다.** 단면은 단면 ID, 하중조합은 생성 순번입니다.
  `UNIT` 같은 단일 데이터는 키가 항상 `"1"` 입니다.
- **GET / DELETE 는 바디를 보내지 않습니다.** `body` 열의 값과 무관합니다.
- **GET 응답은 항목 이름으로 한 번 감싸여 옵니다** (`{ "NODE": { "1": {…} } }`).
  `dbRead()` 가 이 껍질을 벗겨 `{ "1": {…} }` 로 돌려줍니다.

---

## 코드에서 호출하기

호출부는 [`src/utils_api.ts`](../../src/utils_api.ts) 하나입니다. 전부 `async` 이므로 `await` 하세요.

```ts
import { dbRead, dbUpdate, command } from "../utils_api";

// Assign 규약 — GET /db/NODE  →  { "1": {...}, "2": {...} }
const nodes = await dbRead("NODE");
if (nodes.error) { console.error(nodes.error, nodes.body); return; }

// Assign 규약 — PUT /db/SPRING
await dbUpdate("SPRING", { 1: { /* schemas/db/SPRING.json 의 example 대로 */ } });

// Argument 규약 — POST /post/TABLE
const table = await command("post", "TABLE", { TABLE_TYPE: "REACTIONG" });
```

실패는 예외를 던지지 않고 `{ error, body? }` 로 돌아옵니다. **호출부에서 `result.error` 를 확인하세요.**
`body` 에는 서버 응답 본문이 담기며, 어떤 필드가 왜 거부됐는지가 대개 여기 있습니다.

자주 쓰는 작업의 완성된 예시는 [`cookbook.md`](./cookbook.md) 에 있습니다.

---

## 함정

이미 대가를 치르고 알아낸 것들입니다. 코드를 쓰기 전에 읽으세요.

- [`reference.md` §10](./reference.md) — `db/IEHP` 의 비활성 성분 쓰레기값,
  `db/SECT` `SECTTYPE:"VALUE"` 의 `BUILT_FLAG`/`STIFF` 누락 시 `断面寸法` 에러 등.
- 요청 전제: **대상 NX 앱이 실행 중이고 모델 파일이 열려 있어야** 합니다. 아니면 전부 실패합니다.
- `ᴴˢ` 표시는 Hyper-S 솔버 전용, `ᴶ` 는 CIVIL NX JP 버전 전용입니다.
- `dbDelete` 와 `doc` 그룹(NEW/OPEN/SAVE/EXPORT)은 **사용자 데이터를 덮어씁니다.** 읽기와 달리 되돌릴 수 없습니다.

---

## 이 폴더의 구성

| 경로 | 내용 |
| --- | --- |
| `INDEX.md` · `INDEX-design.md` | 엔드포인트 목록 (Grep 대상) |
| `schemas/<uri>.json` | 540개 · JSON Schema + 동작하는 example + 매뉴얼 링크 |
| `features/<uri>.json` | 155개 · 기능 설명 + 제품 메뉴 경로 + 입력 항목 사용법 |
| `reference.md` | 구조·인증·규약 개관과 그룹별 카탈로그, 그리고 §10 함정 |

`INDEX*.md`, `schemas/`, `features/`, `reference.md` 는 **생성물**입니다.
직접 고치지 말고 [`scripts/sync-api-docs.js`](../../scripts/sync-api-docs.js) 로 다시 만드세요.

```bash
node scripts/sync-api-docs.js
```
