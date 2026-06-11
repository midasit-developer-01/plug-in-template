# MIDAS API 레퍼런스 (정제판)

> MIDAS NX 시리즈(CIVIL NX / GEN NX) Open API 를 **Claude 가 한 번에 참조**하기 위한 요약본입니다.
> 전체·항목별 상세 스키마는 공식 매뉴얼을 따르고, 이 문서는 **구조·규약·자주 쓰는 엔드포인트**를 정리합니다.
> 이 템플릿의 호출부는 [`utils_api.ts`](./utils_api.ts) 이며, 그 원형은 [`../public/py_base.py`](../public/py_base.py) 입니다.

> **🧭 사용 규칙 (중요)**
> 1. 필요한 엔드포인트/키가 **이 문서에 있으면 그대로 사용** — 외부 링크를 다시 확인하지 않는다.
> 2. **이 문서에 없거나**, 표에 `*` 가 붙어 필드/의미가 불명확한 경우에**만** 아래 "출처"의
>    [공식 Online Manual](https://support.midasuser.com/hc/en-us/articles/33016922742937-MIDAS-API-Online-Manual) 에서 확인한다.
> 3. 매뉴얼에서 확인한 내용은 이 문서의 해당 항목에 **반영(추가)** 해 다음부터는 다시 찾지 않게 한다.

**출처**
- [MIDAS API Online Manual](https://support.midasuser.com/hc/en-us/articles/33016922742937-MIDAS-API-Online-Manual)
- [Base URL and API-KEY](https://support.midasuser.com/hc/en-us/articles/30508934444569-Base-URL-and-API-KEY)
- [Introduction - MIDAS Python](https://midas-rnd.github.io/midasapi-python/)
- [API Basic Tutorial - MIDAS Academy](https://academy-en.midasuser.com/midas-api-api-basic-tutorial)
- [Let's start MIDAS Open API with Postman](https://support.midasuser.com/hc/en-us/articles/30511293352473-Let-s-start-MIDAS-Open-API-with-Postman)

---

## 1. 기본 구조

### Base URL
```
https://{server}:443/{program}
```
- `{program}`: `civil` (Civil NX) 또는 `gen` (Gen NX)
- `{server}` (지역별):
  | 지역 | 서버 |
  | --- | --- |
  | Global/KR | `moa-engineers.midasit.com` (이 템플릿 기본값) |
  | Korea | `moa-engineers-kr.midasit.com` |
  | India | `moa-engineers-in.midasit.com` |
  | Europe | `moa-engineers-gb.midasit.com` |
  | USA | `moa-engineers-us.midasit.com` |
  | China | `moa-engineers.midasit.cn` |
- 예: `https://moa-engineers.midasit.com:443/civil`

### 인증 (MAPI-Key)
- 모든 요청 **헤더**에 제품 키를 넣습니다.
  ```
  MAPI-Key: {발급받은_키}
  Content-Type: application/json
  ```
- 키는 MIDAS CIVIL/GEN NX 앱의 **API Settings** 에서 발급하며, 앱에 설정된 키와 일치해야 합니다.
- 전제: 대상 MIDAS NX 앱이 실행 중이고 모델 파일이 열려 있어야 합니다(요청은 "열린 파일"에 작동).

---

## 2. 공통 요청/응답 규약

요청 = **메서드 + command(엔드포인트) + body(JSON)** 의 조합입니다.

| 엔드포인트 그룹 | body 최상위 키 | 비고 |
| --- | --- | --- |
| **DB** | `"Assign"` | `{ "Assign": { "<id>": { ...속성 } } }` — id는 **문자열 키** |
| **DOC** | `"Argument"` | `{ "Argument": <값> }` (POST 전용) |
| GET / DELETE | (보통 body 없음) | |

- DB 응답은 보통 **item 이름을 최상위 키**로 감싸서 반환됩니다.
  예: `GET /db/NODE` → `{ "NODE": { "1": {...}, "2": {...} } }`
  → 이 템플릿 `utils_api.dbRead()` 는 이 `NODE` 키를 벗겨 `{ "1": {...} }` 형태로 돌려줍니다.
- 실패 시 응답에 `error` 류 메시지가 들어옵니다(이 템플릿은 `{ error }` 규약으로 통일).

---

## 3. 엔드포인트 5종 분류

MIDAS API 는 크게 5개 엔드포인트 그룹으로 나뉩니다.

### 3-1. DB — 모델 데이터 CRUD `(/db/{ITEM})`
파일에 저장되는 모델 데이터(MCT/MGT 항목에 대응). 일반적으로 **POST/GET/PUT/DELETE** 지원.

| 메서드 | 경로 | 의미 |
| --- | --- | --- |
| `GET` | `/db/{ITEM}` | 항목 전체 조회 |
| `GET` | `/db/{ITEM}/{id}` | 단일 항목 조회 |
| `POST` | `/db/{ITEM}` | 추가(생성) |
| `PUT` | `/db/{ITEM}` | 수정/덮어쓰기 |
| `DELETE` | `/db/{ITEM}/{id}` | 삭제 |

> ⚠️ **UNIT, STYP**(구조형식) 등 신규 파일 필수 데이터는 **GET / PUT 만** 지원(생성·삭제 불가).

### 3-2. DOC — 문서/파일 제어 `(/doc/...)`
**POST 전용**, body 는 `"Argument"` 키로 시작.

| 경로 | 의미 (body) |
| --- | --- |
| `POST /doc/open` | 파일 열기 `{ "Argument": "C:/path/model.mcb" }` |
| `POST /doc/anal` | 해석 실행 `{ }` |
| `POST /doc/new`, `/doc/save` 등 | 신규/저장 (매뉴얼 참고) |

### 3-3. VIEW — 화면/선택 상태 `(/view/...)`
| 경로 | 의미 |
| --- | --- |
| `GET /view/select` | 현재 선택된 요소/노드 → 응답 `SELECT` 키 |

### 3-4. POST(결과/후처리) `(/post/...)`
해석 결과 조회·설계 검토 등.

| 경로 | 의미 |
| --- | --- |
| `POST /post/steelcodecheck` | 강재 코드 체크(Gen 전용 예시) |
| `POST /post/TABLE` | 결과 표 조회 |

### 3-5. OPER(오퍼레이션) `(/oper/...)`
단위 변환·기타 조작 등 보조 기능. 구체 경로는 공식 매뉴얼 참고.

---

## 4. DB 엔드포인트 카탈로그 `(/db/{KEY})`

모든 항목은 기본적으로 `GET /db/{KEY}`(전체), `GET /db/{KEY}/{id}`(단일),
`POST`(추가), `PUT`(수정), `DELETE /db/{KEY}/{id}`(삭제) 를 따릅니다.
(예외: `UNIT`, `STYP` 등은 GET/PUT 만)

> 표기: `*` = 정확한 의미/필드는 [공식 매뉴얼](https://support.midasuser.com/hc/en-us/articles/33016922742937-MIDAS-API-Online-Manual)
> 의 해당 DB 항목에서 최종 확인 권장(이름 기반 추정).

### 4-1. 노드 · 요소 · 기본
| 주소 | 역할 |
| --- | --- |
| `/db/NODE` | 절점(좌표 X,Y,Z) |
| `/db/ELEM` | 요소(부재) — 절점 구성·요소 타입 |
| `/db/UNIT` | 단위계 (FORCE/DIST/HEAT/TEMPER) — **GET/PUT only** |
| `/db/STYP` | 구조 형식(Structure Type) — **GET/PUT only** |

### 4-2. 재료 · 단면 · 두께
| 주소 | 역할 |
| --- | --- |
| `/db/MATL` | 재료 물성 |
| `/db/SECT` | 단면 특성 |
| `/db/THIK` | 판/평면요소 두께 |
| `/db/TDMT` | 시간의존 재료(크리프/건조수축)* |
| `/db/TDME` | 시간의존 재료(압축강도 발현)* |
| `/db/TMAT` | 시간의존 재료 ↔ 일반재료 연결* |
| `/db/EDMP` | 요소별 종속 재료/특성* |

### 4-3. 그룹
| 주소 | 역할 |
| --- | --- |
| `/db/GRUP` | 구조 그룹(Structure Group) |
| `/db/BNGR` | 경계조건 그룹(Boundary Group) |
| `/db/LDGR` | 하중 그룹(Load Group) |
| `/db/TDGR` | 텐던 그룹(Tendon Group) |
| `/db/TSGR` | 테이퍼드(변단면) 그룹* |

### 4-4. 경계조건
| 주소 | 역할 |
| --- | --- |
| `/db/CONS` | 지점 구속(Supports) |
| `/db/NSPR` | 점 스프링 지점(Point Spring) |
| `/db/GSPR` | 일반 스프링 지점(General Spring)* |
| `/db/GSTP` | 일반 스프링 타입/특성* |
| `/db/ELNK` | 탄성 링크(Elastic Link) |
| `/db/RIGD` | 강체 링크(Rigid Link) |
| `/db/FRLS` | 보 단부 해제(Beam End Release) |
| `/db/OFFS` | 보 단부 오프셋(Beam End Offset) |
| `/db/SKEW` | 스큐(국부축 회전) |
| `/db/NMAS` | 절점 질량(Nodal Mass) |
| `/db/LTOM` | 하중→질량 변환(Loads to Masses)* |
| `/db/MCON` | 다점 구속/강막 등 제약* |
| `/db/EWSF` | 벽 강성/전단 관련* |

### 4-5. 하중 (정적 · 온도 · 프리스트레스)
| 주소 | 역할 |
| --- | --- |
| `/db/STLD` | 정적 하중 케이스(정의) |
| `/db/BODF` | 자중(Self Weight) |
| `/db/NBOF` | 자중/체적력 관련* |
| `/db/CNLD` | 절점 하중(Nodal Load) |
| `/db/BMLD` | 요소 보 하중(Element Beam Load) |
| `/db/PRES` | 압력 하중(Pressure) |
| `/db/SDSP` | 지정 변위(Specified Displacement) |
| `/db/PRST` | 프리스트레스 하중* |
| `/db/PTNS` | 긴장력/포스트텐션(Pretension)* |
| `/db/STMP` | 시스템 온도(System Temperature)* |
| `/db/NTMP` | 절점 온도(Nodal Temperature)* |
| `/db/ETMP` | 요소 온도(Element Temperature)* |
| `/db/BTMP` | 보 단면 온도(Beam Section Temp.)* |
| `/db/GTMP` | 온도 구배(Temperature Gradient)* |
| `/db/FBLD`,`/db/FBLA` | 바닥/면 하중* |
| `/db/PNLD`,`/db/PNLA` | 평면/압력 하중* |
| `/db/TMLD` | 온도/시간 관련 하중* |

### 4-6. 이동하중 (Moving Load)
| 주소 | 역할 |
| --- | --- |
| `/db/MVCD` | 이동하중 규준(Moving Load Code)* |
| `/db/MVLD` | 이동하중 케이스* |
| `/db/LLAN`,`/db/LLANOP` | 차선(Traffic Lane)/옵션* |
| `/db/SLAN` | 표면 차선(Surface Lane)* |
| `/db/MVHL`,`/db/MVHC` | 차량(Vehicle)/클래스* |
| `/db/MLFC` | 이동하중 계수/조합* |
| `/db/SINF`,`/db/MLSP` | 이동하중 부가 설정* |

### 4-7. 동적 · 시공단계 · 해석제어
| 주소 | 역할 |
| --- | --- |
| `/db/DYLA` | 동적 하중* |
| `/db/EIGV` | 고유치 해석 제어(Eigenvalue) |
| `/db/ACTL` | 해석 제어(Analysis Control) |
| `/db/BUCK` | 좌굴 해석 제어(Buckling) |
| `/db/PDEL` | P-Delta 해석 제어 |
| `/db/STAG` | 시공 단계(Construction Stage) |
| `/db/CSCS`,`/db/STCT` | 시공단계 부가 설정* |
| `/db/IFGS`,`/db/EFCT` | 시공단계/효과 관련* |
| `/db/SMPT`,`/db/SMLC`,`/db/SMCT` | 시공단계 모멘트/하중 관련* |

### 4-8. 하중 조합
| 주소 | 역할 |
| --- | --- |
| `/db/LCOM-GEN` | 하중 조합(General)* |

> **전체 키 원문(검색 출처)**: NODE, ELEM, GRUP, BNGR, LDGR, MATL, TDMT, TDME, TMAT, EDMP,
> SECT, TSGR, THIK, TDGR, TDNT, TDNA, STLD, MLFC, SKEW, CONS, MCON, NSPR, GSTP, GSPR, ELNK,
> FRLS, OFFS, RIGD, EWSF, NMAS, LTOM, BODF, NBOF, CNLD, SDSP, BMLD, PRST, PTNS, PRES, STMP,
> NTMP, ETMP, BTMP, GTMP, TDPL, FBLD, FBLA, PNLD, PNLA, TMLD, STAG, IFGS, EFCT, SPFC, SPLC,
> MVCD, LLAN, LLANOP, SLAN, SINF, MLSP, MVHL, MVHC, MVLD, DYLA, SMPT, SMLC, AETL, CSCS, STCT,
> LCOM-GEN, ACTL, PDEL, BUCK, EIGV, MVCT, SMCT, PSLT, SPAN.
> 위 표에 없는 키도 같은 `/db/{KEY}` 규칙을 따릅니다. **각 키의 필드 스키마는 매뉴얼에서 확정**하세요.

---

## 5. 구체 예시 (검증된 형태)

### 절점 추가/수정 — `PUT /db/NODE`
```json
{ "Assign": { "999": { "X": 0, "Y": 10.0, "Z": 0 } } }
```

### 단위계 수정 — `PUT /db/UNIT`
```json
{ "Assign": { "1": { "FORCE": "KN", "DIST": "M", "HEAT": "KCAL", "TEMPER": "F" } } }
```

### 절점 전체 조회 — `GET /db/NODE` (응답)
```json
{ "NODE": { "1": { "X": 0, "Y": 0, "Z": 0 }, "2": { "X": 1, "Y": 0, "Z": 0 } } }
```

### 파일 열기 / 해석 — `POST /doc/open`, `POST /doc/anal`
```json
// /doc/open
{ "Argument": "C:/Users/.../model.mcb" }
// /doc/anal
{ }
```

---

## 6. 이 템플릿 매핑 (`utils_api.ts`)

| utils_api 함수 | 메서드 · 경로 | body |
| --- | --- | --- |
| `dbRead(item)` | `GET /db/{item}` | — (응답에서 `item` 키 언래핑) |
| `dbReadItem(item, id)` | `GET /db/{item}/{id}` | — |
| `dbCreate(item, items)` | `POST /db/{item}` | `{ Assign: items }` |
| `dbCreateItem(item, id, x)` | `POST /db/{item}/{id}` | `{ Assign: x }` |
| `dbUpdate(item, items)` | `PUT /db/{item}` | `{ Assign: items }` |
| `dbUpdateItem(item, id, x)` | `PUT /db/{item}/{id}` | `{ Assign: x }` |
| `dbDelete(item, id)` | `DELETE /db/{item}/{id}` | — |

- DOC/VIEW/POST/OPER 가 필요하면 `utils_api.ts` 의 `requestJson(method, endpoint, body)` 로 함수를 추가하세요.
  예: `requestJson("POST", "/doc/anal", {})`, `requestJson("GET", "/view/select")`.

---

## 7. 작성 시 주의사항 (Claude 체크리스트)

1. **DB body 는 항상 `Assign` 으로 감싼다**, DOC body 는 `Argument` 로 시작한다.
2. **id 는 문자열 키**(`"1"`, `"999"`) 로 넣는다.
3. **UNIT / STYP 등은 POST/DELETE 불가** — GET/PUT 만 사용.
4. 요청 전 대상 **NX 앱 실행 + 파일 열림** 상태가 전제(없으면 실패).
5. `program`(civil/gen)·지역 서버는 **Base URL** 로 결정 — 이 템플릿은 `VerifyUtil`/`REACT_APP_BASE_URL` 이 처리.
6. 항목별 정확한 필드명·필수값은 **공식 Online Manual 의 해당 DB 항목**을 최종 근거로 삼는다(이 문서는 요약).
