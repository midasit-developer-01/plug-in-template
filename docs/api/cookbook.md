# 자주 쓰는 작업 레시피

플러그인에서 반복적으로 나오는 호출 패턴입니다.
모든 payload 는 `schemas/<uri>.json` 의 `example` 에서 가져온 **실제 모양**입니다.

> 여기 없는 작업은 [`README.md`](./README.md) 의 절차대로 `INDEX.md` 를 grep 해서 찾으세요.
> 이 문서는 출발점이지 목록이 아닙니다.

---

## 0. 공통 — 에러 처리

호출은 예외를 던지지 않습니다. **매번 `error` 를 확인하세요.**

```ts
import { dbRead } from "../utils_api";

const nodes = await dbRead("NODE");
if (nodes.error) {
  // body 에 서버가 보낸 거부 사유가 들어 있습니다 (어떤 필드가 왜 틀렸는지).
  console.error(nodes.error, nodes.body);
  return;
}
```

`error` 가 나오는 대표적 원인은 **NX 앱이 안 떠 있거나 모델 파일이 안 열려 있는 것**입니다.
MAPI-Key 가 맞아도 대상 파일이 없으면 모든 요청이 실패합니다.

---

## 1. 모델 읽기

```ts
// 전체 — { "1": {...}, "2": {...} } 형태 (항목 이름 껍질은 벗겨져 있음)
const nodes = await dbRead("NODE");     // schemas/db/NODE.json
const elems = await dbRead("ELEM");     // schemas/db/ELEM.json

// 단건 — GET /db/NODE/3
const node3 = await dbReadItem("NODE", 3);

// id 목록으로 순회할 때: 키는 문자열입니다
Object.entries(nodes).forEach(([id, node]: [string, any]) => {
  console.log(Number(id), node.X, node.Y, node.Z);
});
```

**단위계를 먼저 확인하세요.** 좌표·힘의 숫자는 현재 단위계 기준으로 나옵니다.

```ts
const unit = await dbRead("UNIT");   // { "1": { FORCE: "KN", DIST: "M", ... } }
```

`db/UNIT` 은 **GET / PUT 만** 됩니다 (POST/DELETE 없음). 바꿀 때는:

```ts
await dbUpdate("UNIT", { 1: { FORCE: "KN", DIST: "M", HEAT: "KJ", TEMPER: "C" } });
```

---

## 2. 모델 쓰기

`Assign` 의 최상위 키는 **번호 키**이고, 그 의미는 데이터마다 다릅니다
(노드는 노드 번호, 단면은 단면 ID, 하중조합은 생성 순번, 단일 데이터는 항상 `"1"`).

```ts
// 노드 생성 — POST /db/NODE
await dbCreate("NODE", {
  1: { X: 0, Y: 0, Z: 0 },
  2: { X: 5, Y: 0, Z: 0 },
  3: { X: 5, Y: 3, Z: 0 },
});

// 요소 생성 — TYPE 에 따라 필요한 필드가 달라집니다. schemas/db/ELEM.json 의 example 에
// BEAM / TRUSS / TENSTR / COMPTR / PLATE / WALL 각각의 모양이 다 들어 있습니다.
await dbCreate("ELEM", {
  1: { TYPE: "BEAM",  MATL: 1, SECT: 1, NODE: [1, 2], ANGLE: 0 },
  2: { TYPE: "TRUSS", MATL: 1, SECT: 1, NODE: [2, 3] },
});

// 단건 수정 — PUT /db/NODE/1
await dbUpdateItem("NODE", 1, { X: 0, Y: 0, Z: 1.5 });

// 삭제 — DELETE /db/NODE/3 (되돌릴 수 없습니다)
await dbDelete("NODE", 3);
```

### 경계조건 예시

```ts
// 절점 구속 — CONSTRAINT 는 6자리 문자열 [Dx,Dy,Dz,Rx,Ry,Rz]
await dbCreate("CONS", {
  1: { ITEMS: [{ ID: 1, GROUP_NAME: "", CONSTRAINT: "1111000" }] },
});

// 점 스프링 — 키가 절점 번호, SDR 은 6성분 강성
await dbCreate("NSPR", {
  2: {
    ITEMS: [{
      ID: 1,
      TYPE: "LINEAR",
      GROUP_NAME: "",
      F_S: [false, false, false, false, false, false],
      SDR: [33000, 34000, 35000, 33000000, 34000000, 35000000],
    }],
  },
});
```

> ⚠️ `db/SPRING` 이라는 엔드포인트는 **없습니다.** 스프링은 용도별로 나뉩니다 —
> `NSPR`(점) · `GSPR`/`GSTP`(일반) · `SSPS`(면). `grep -i spring docs/api/INDEX.md` 로 확인하세요.

---

## 3. 해석 실행

```ts
import { command } from "../utils_api";

// 기본 해석 — POST /doc/ANAL, 바디 {}
const result = await command("doc", "ANAL");

// 종류를 지정할 때
await command("doc", "ANAL", { TYPE: "Pushover" });
```

해석은 오래 걸립니다. 요청 제한 시간은 `utils_api.ts` 의 `REQUEST_TIMEOUT_MS`(60초)이며,
대형 모델에서 타임아웃이 나면 이 값을 늘리세요.

---

## 4. 결과 표 추출

`post/TABLE` 하나로 대부분의 결과표를 뽑습니다. `TABLE_TYPE` 이 어떤 표인지를 정합니다.

```ts
const table = await command("post", "TABLE", {
  TABLE_TYPE: "REACTIONG",
  UNIT: { FORCE: "KN", DIST: "M" },
  STYLES: { FORMAT: "FIXED", PLACE: 3 },
  NODE_ELEMS: { TO: "1to5" },          // 범위 문자열 표기
  LOAD_CASE_NAMES: ["Dead Load", "Live Load"],
  OPT_CS: false,
});
```

- 쓸 수 있는 `TABLE_TYPE` 목록과 각 필드 의미는 [`schemas/post/TABLE.json`](./schemas/post/TABLE.json) 에 있습니다.
- 표 종류별 설명은 [`reference.md` §8-1](./reference.md) 참고.
- 해석을 돌리지 않고 결과표를 요청하면 빈 결과나 에러가 납니다.

---

## 5. 화면 제어

```ts
// 현재 선택 상태 읽기 — GET 이므로 4번째 인자로 메서드를 넘겨야 합니다
const selected = await command("view", "SELECT", undefined, "GET");
```

`INDEX.md` 의 `methods` 열을 확인하세요. `view` 그룹에는 GET 전용이 섞여 있습니다.

---

## 6. 설계 / 내진성능평가

`design` 과 `rating` 은 **코드 기준까지 경로에 들어갑니다.**
같은 이름이 기준마다 존재하므로 (`MATD` 는 RC·PSC·SRC·rating 에 각각 있음) 전체 uri 를 쓰세요.

```ts
// Assign 규약인 것 (INDEX-design.md 의 body 열 확인) — db 헬퍼에 전체 uri 를 넘김
const memb = await dbRead("design/PSC/AASHTO-LRFD24/MEMB");

// Argument 규약인 것 — command 의 name 에 그룹 뒤 경로 전체를 넘김
await command("design", "RC/KDS-41-20-2022/DCRM", { /* … */ });
```

---

## 7. 파일 조작 (되돌릴 수 없음)

```ts
await command("doc", "SAVE");
await command("doc", "OPEN", { /* schemas/doc/OPEN.json 참조 */ });
```

`doc` 그룹의 `NEW` · `OPEN` · `SAVE` · `EXPORT` 는 **사용자의 작업 파일을 덮어씁니다.**
플러그인에서 자동으로 호출하기 전에 사용자에게 확인을 받으세요.

---

## 큰 페이로드 다루기

일부 항목은 응답이 매우 큽니다 (`db/IEHP` 는 실모델에서 362레코드 ≈ 4.2MB).
전체 `dbRead` 대신 `dbReadItem` 으로 필요한 것만 읽거나, `/doc/EXPORT` 로 한 번에 내보내는
경로를 고려하세요. `db/IEHP` 는 읽을 때 **비활성 성분이 쓰레기값**이라는 별도 함정이 있습니다 —
[`reference.md` §10-1](./reference.md) 을 반드시 읽으세요.
