# MIDAS API 레퍼런스 (정제판)

> MIDAS NX 시리즈(CIVIL NX / GEN NX) Open API 를 **Claude 가 한 번에 참조**하기 위한 요약본입니다.
> 전체·항목별 상세 스키마는 공식 매뉴얼을 따르고, 이 문서는 **구조·규약·전체 엔드포인트 카탈로그**를 정리합니다.
> 이 템플릿의 호출부는 [`utils_api.ts`](./utils_api.ts) 이며, 그 원형은 [`../public/py_base.py`](../public/py_base.py) 입니다.
> **실제 요청/응답 payload 예시**는 [`./midas-api-examples.json`](./midas-api-examples.json) 에 별도 정리합니다.

> **🧭 사용 규칙 (중요)**
> 1. 필요한 엔드포인트가 **이 문서 카탈로그에 있으면 그대로 사용** — 외부 링크를 다시 확인하지 않는다.
> 2. **각 엔드포인트의 정확한 필드 스키마**가 필요하면, 아래 카탈로그의 `article` 번호로 **Zendesk 공개 API** 에서 직접 취득:
>    ```
>    GET https://support.midasuser.com/api/v2/help_center/articles/<article_id>.json
>    Header: User-Agent: Mozilla/5.0 ... Chrome/124.0 Safari/537.36
>    ```
>    응답 `article.body`(HTML) 안에 **Input URI / Methods / JSON Schema / Examples / Specifications 표** 가 들어있다.
>    (브라우저 HTML 페이지는 봇차단 403. WebFetch 불가 → PowerShell `Invoke-WebRequest -Headers` / curl 로.)
> 3. 취득한 **필드 스키마/예시는 `midas-api-examples.json` 에 반영**해 다음부터는 다시 찾지 않게 한다.

**출처**
- [MIDAS API Online Manual (인덱스)](https://support.midasuser.com/hc/en-us/articles/33016922742937-MIDAS-API-Online-Manual)
- [Base URL and API-KEY](https://support.midasuser.com/hc/en-us/articles/30508934444569-Base-URL-and-API-KEY)
- [Introduction - MIDAS Python](https://midas-rnd.github.io/midasapi-python/)
- [Designing with Intent: The Vision Behind POST/TABLE](https://support.midasuser.com/hc/en-us/articles/45171987915929-Designing-with-Intent-The-Vision-Behind-POST-TABLE)

> **마커 범례**: `ᴴˢ` = Hyper-S 솔버 전용, `ᴶ` = CIVIL NX JP 버전 전용.

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

요청 = **메서드 + command(엔드포인트) + body(JSON)** 의 조합이며, MIDAS API 는 RESTful API 입니다.

| 엔드포인트 그룹 | body 최상위 키 | 비고 |
| --- | --- | --- |
| **DB** (POST/PUT) | `"Assign"` | `{ "Assign": { "<번호 key>": { ...속성 } } }` |
| **DB** (GET) | (보통 body 없음) | 첫 key 는 엔드포인트(item) 이름 |
| **DOC** | `"Argument"` | `{ "Argument": <값> }` (POST 전용, 빈 body 는 `{}`) |
| GET / DELETE | (보통 body 없음) | |

- **DB 의 "번호 key" 는 데이터마다 의미가 다릅니다.** 예: Section 에서는 단면 ID, Load Combination 에서는 생성 순번.
  UNIT 처럼 단일 데이터는 `"1"` 하나만 존재.
- DB 응답은 보통 **item 이름을 최상위 키**로 감싸서 반환합니다.
  예: `GET /db/NODE` → `{ "NODE": { "1": {...}, "2": {...} } }`
  → 이 템플릿 `utils_api.dbRead()` 는 이 `NODE` 키를 벗겨 `{ "1": {...} }` 형태로 돌려줍니다.
- 실패 시 응답에 `error` 류 메시지가 들어옵니다(이 템플릿은 `{ error }` 규약으로 통일).

---

## 3. 엔드포인트 5종 분류

| 그룹 | 경로 | 메서드 | body | 설명 |
| --- | --- | --- | --- | --- |
| **DOC** | `/doc/...` | POST | `Argument` | 문서/파일 제어 (열기·저장·해석·import/export) |
| **DB** | `/db/{ITEM}` | POST/GET/PUT/DELETE | `Assign` | 파일에 저장되는 모델 데이터 (MCT/MGT 대응). 일부(UNIT, STYP 등)는 GET/PUT 만 |
| **OPE** | `/ope/...` | (기능별) | — | 오퍼레이션. GUI 제어·DB 미저장 전처리 값 (메시, 분할, 단면 계산 등) |
| **VIEW** | `/view/...` | (기능별) | — | 모델 뷰 제어 (선택·캡처·표시·결과 그래픽) |
| **POST** | `/post/...` | POST | `Argument` | 전/후처리 테이블 추출 및 설계 검토 (`/post/TABLE`, 설계 force 등) |

---

## 4. DOC — 문서/파일 제어 `(/doc/...)`

**POST 전용**, body 는 `"Argument"` 키. 빈 body 는 `{}`.

| 엔드포인트 | 역할 | 매뉴얼 article |
| --- | --- | --- |
| `/doc/NEW` | 새 프로젝트 | 35994078198681 |
| `/doc/OPEN` | 프로젝트 열기 | 35994112560793 |
| `/doc/CLOSE` | 프로젝트 닫기 | 35994162529305 |
| `/doc/SAVE` | 저장 | 35994210207513 |
| `/doc/SAVEAS` | 다른 이름으로 저장 | 35994277012377 |
| `/doc/STAGAS` | 현재 시공단계 다른 이름 저장 | 50707525717401 |
| `/doc/IMPORT` | JSON 에서 import | 35994338816793 |
| `/doc/IMPORTMXT` | mct/mgt 에서 import | 35994365225113 |
| `/doc/EXPORT` | JSON 으로 export | 35994422273305 |
| `/doc/EXPORTMXT` | mct/mgt 로 export | 35994462805017 |
| `/doc/ANAL` | 해석 실행 | 35685160815897 |

---

## 5. DB — 모델 데이터 CRUD `(/db/{ITEM})`

기본: `GET /db/{ITEM}`(전체), `GET /db/{ITEM}/{id}`(단일), `POST`(추가), `PUT`(수정), `DELETE /db/{ITEM}/{id}`(삭제).
(예외: `UNIT`, `STYP` 등 신규파일 필수 데이터는 **GET/PUT 만**)

### 5-1. Project
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/PJCF` | 프로젝트 정보 | 35801869341337 |
| `/db/UNIT` | 단위계 (FORCE/DIST/HEAT/TEMPER) — GET/PUT only | 35802155483801 |
| `/db/STYP` | 구조 형식(Structure Type) — GET/PUT only | 35802404495257 |
| `/db/STYP-M1` ᴴˢ | 구조 형식 (Hyper-S) | 56375311138201 |
| `/db/GRUP` | 구조 그룹 | 35802441712921 |
| `/db/BNGR` | 경계조건 그룹 | 35804937452313 |
| `/db/LDGR` | 하중 그룹 | 35804975346841 |
| `/db/TDGR` | 텐던 그룹 | 35805198736793 |

### 5-2. View (DB 저장 색상/평면)
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/NPLN` | Named Plane | 35805287066649 |
| `/db/CO_M` | 재료 색상 | 35805703171353 |
| `/db/CO_S` | 단면 색상 | 35805763514393 |
| `/db/CO_T` | 두께 색상 | 35805833925785 |
| `/db/CO_F` | 바닥하중 색상 | 35805846236441 |

### 5-3. Structure
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/SPAN` | Span 정보 | 35805957502233 |
| `/db/STOR` | Story 데이터 | 49513466793113 |

### 5-4. Node / Element
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/NODE` | 절점 (좌표 X,Y,Z) | 35806845654169 |
| `/db/ELEM` | 요소 (절점 구성·요소 타입) | 35806934300825 |
| `/db/SKEW` | 절점 국부축 (Node Local Axis) | 35807178748569 |
| `/db/MADO` | Define Domain | 35807228332825 |
| `/db/SBDO` | Define Sub-Domain | 35807304820761 |
| `/db/DOEL` | Domain-Element | 35807341514393 |

### 5-5. Properties
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/MATL` | 재료 물성 | 35807411331993 |
| `/db/MATL-M1` ᴴˢ | 재료 물성 (Hyper-S) | 56396523438873 |
| `/db/IMFM` | 파이버 모델 비탄성 재료 | 35807475893401 |
| `/db/IMFM-M1` ᴴˢ | 비탄성 재료 자동생성 링크 (Hyper-S) | 56375076523929 |
| `/db/TDMF` | 시간의존 재료 - 사용자 정의 | 35807665049369 |
| `/db/TDMT` | 시간의존 재료 - 크리프/건조수축 | 35808006330009 |
| `/db/TDME` | 시간의존 재료 - 압축강도 | 35808102389401 |
| `/db/EDMP` | Change Property (요소 종속 재료) | 35808245801881 |
| `/db/TMAT` | 시간의존 재료 링크 | 35808280891033 |
| `/db/EPMT` | 소성 재료 (Plastic Material) | 35808376517913 |
| `/db/EPMT-M1` ᴴˢ | 소성 재료 (Hyper-S) | 56511025581337 |
| `/db/SECT` | 단면 특성 (Common/DB·User/Value/SRC/Combined/PSC/Composite/Tapered ...) | 35808653964185 외 |
| `/db/THIK` | 두께 (Value/Stiffened DB·User·Value) | 35942236652697 외 |
| `/db/TSGR` | 테이퍼드(변단면) 그룹 | 35942955627673 |
| `/db/SECF` | Section Manager - Stiffness | 35943174833177 |
| `/db/RPSC` | Section Manager - Reinforcements | 35943227821465 |
| `/db/STRPSSM` | Section Manager - Stress Points | 35943448721177 |
| `/db/PSSF` | Section Manager - Plate Stiffness Scale Factor | 35943557337753 |
| `/db/VBEM` | Section for Resultant - Virtual Beam | 35943802727065 |
| `/db/VSEC` | Section for Resultant - Virtual Section | 35943859944729 |
| `/db/EWSF` | Effective Width Scale Factor | 35943954272281 |
| `/db/IEHC` | 비탄성 힌지 제어 데이터 | 35944093809689 |
| `/db/IEHG` | 비탄성 힌지 특성 할당 | 35944228031001 |
| `/db/IEHG-BEAM-M1` ᴴˢ | 비탄성 힌지 - Beam | 57656773423385 |
| `/db/IEHG-TRUSS-M1` ᴴˢ | 비탄성 힌지 - Truss | 57656796689177 |
| `/db/IEHG-GL-M1` ᴴˢ | 비탄성 힌지 - General Link | 57656799110937 |
| `/db/IEHG-PSS-M1` ᴴˢ | 비탄성 힌지 - Point Spring Support | 57656826629657 |
| `/db/FIMP` | 비탄성 재료 특성 | 35944335180569 |
| `/db/FIBR` | 단면 Fiber 분할 | 35944476555801 |
| `/db/GRDP` | Group Damping | 35944577940633 |
| `/db/ESSF` | Element Stiffness Scale Factor | 44613910309401 |

### 5-6. Boundary
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/CONS` | 지점 구속 (Constraint Support) | 35944759597337 |
| `/db/NSPR` | 점 스프링 (Point Spring) | 35945908301081 |
| `/db/GSTP` | 일반 스프링 타입 정의 | 35946004118169 |
| `/db/GSPR` | 일반 스프링 지점 할당 | 35946151002393 |
| `/db/SSPS` | 면 스프링 (Surface Spring) | 35946218805785 |
| `/db/ELNK` | 탄성 링크 (Elastic Link) | 35946439146649 |
| `/db/RIGD` | 강체 링크 (Rigid Link) | 35946584247193 |
| `/db/NLLP` | 일반 링크 특성 | 35946764618905 |
| `/db/NLNK` | 일반 링크 (General Link) | 35946942651289 |
| `/db/NLNK-M1` ᴴˢ | 일반 링크 (Hyper-S) | 56511465190937 |
| `/db/CGLP` | 일반 링크 특성 변경 | 35947087784217 |
| `/db/FRLS` | 보 단부 해제 (Beam End Release) | 35947184258585 |
| `/db/OFFS` | 보 단부 오프셋 (Beam End Offset) | 35947465569049 |
| `/db/PRLS` | 판 단부 해제 (Plate End Release) | 35947668757017 |
| `/db/MLFC` | Force-Deformation Function | 35947795463705 |
| `/db/SDVI` | 내진장치 - 점성/오일 댐퍼 | 35947995586713 |
| `/db/SDVE` | 내진장치 - 점탄성 댐퍼 | 35948062417049 |
| `/db/SDST` | 내진장치 - 강재 댐퍼 | 35948150053529 |
| `/db/SDHY` | 내진장치 - Hysteretic Isolator(MSS) | 35948292269977 |
| `/db/SDIS` | 내진장치 - Isolator(MSS) | 35948330042649 |
| `/db/MCON` | Linear Constraints (다점 구속) | 35948507217689 |
| `/db/PZEF` | Panel Zone Effects | 35950231812505 |
| `/db/CLDR` | Constraints Label Direction 정의 | 35952465579417 |
| `/db/DRLS` | Diaphragm Disconnect | 51740138178969 |

### 5-7. Static Loads
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/STLD` | 정적 하중 케이스 | 35952651947801 |
| `/db/BODF` | 자중 (Self-Weight) | 35952708909337 |
| `/db/CNLD` | 절점 하중 (Nodal Load) | 35952812160281 |
| `/db/BMLD` | 보 하중 (Beam Load) | 35952826746521 |
| `/db/SDSP` | 지정 변위 (Specified Displacement) | 35952933108761 |
| `/db/NMAS` | 절점 질량 (Nodal Mass) | 35952994344985 |
| `/db/LTOM` | 하중→질량 변환 (Loads to Masses) | 35953062761881 |
| `/db/NBOF` | 절점 체적력 (Nodal Body Force) | 35953117115545 |
| `/db/PSLT` | 압력 하중 타입 정의 | 35953165879833 |
| `/db/PRES` | 압력 하중 할당 | 35953322434457 |
| `/db/PNLD` | 평면 하중 타입 정의 | 35953492119321 |
| `/db/PNLA` | 평면 하중 할당 | 35953557411993 |
| `/db/FBLD` | 바닥 하중 타입 정의 | 35953604106137 |
| `/db/FBLA` | 바닥 하중 할당 | 35953653792665 |
| `/db/FMLD` | 마감재 하중 (Finishing Material) | 35953690148121 |
| `/db/POSP` | 토질 특성 파라미터 | 49510865840537 |
| `/db/EPST` | 정적 토압 (Static Earth Pressure) | 49511059178521 |
| `/db/EPSE` | 지진 토압 (Seismic Earth Pressure) | 49511153905177 |
| `/db/POSL` | 지진 하중 파라미터 | 49511410691609 |

### 5-8. Temperature Loads
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/ETMP` | 요소 온도 (Element Temperature) | 35954097233561 |
| `/db/GTMP` | 온도 구배 (Temperature Gradient) | 35954163821593 |
| `/db/BTMP` | 보 단면 온도 (Beam Section Temp.) | 35954186047897 |
| `/db/STMP` | 시스템 온도 (System Temperature) | 35954219102233 |
| `/db/NTMP` | 절점 온도 (Nodal Temperature) | 35954302641177 |

### 5-9. Prestress Loads
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/TDNT` | 텐던 특성 (Tendon Property) | 35954451663513 |
| `/db/TDNA` | 텐던 프로파일 (Tendon Profile) | 35954555962137 |
| `/db/TDCS` | 합성단면 텐던 위치 | 35954649371545 |
| `/db/TDPL` | 텐던 프리스트레스 | 35954702397209 |
| `/db/PRST` | 프리스트레스 보 하중 | 35954744402713 |
| `/db/PTNS` | 포스트텐션/긴장력 하중 | 35954793469593 |
| `/db/EXLD` | Pretension 용 External 하중 케이스 | 35954841849753 |

### 5-10. Moving Loads
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/MVCD` | 이동하중 규준 (Moving Load Code) | 35955076795929 |
| `/db/LLAN` | 차선 (Traffic Line Lanes) | 35955170613273 |
| `/db/LLANch` / `LLANid` / `LLANtr` / `LLANop` | 차선 - China/India/Transverse/MovingLoadOpt | 35955208713241 외 |
| `/db/SLAN` | 표면 차선 (Surface Lanes) | 35956862556313 |
| `/db/SLANch` / `SLANop` | 표면 차선 - China/MovingLoadOpt | 35956917206425 외 |
| `/db/MVHL` | 차량 (Vehicles, 규준별: AASHTO/Eurocode/Korea/China/India ...) | 35957125531545 외 |
| `/db/MVHLtr` | 차량 - Transverse | 35958910039321 |
| `/db/MVLD` | 이동하중 케이스 (Moving Load Cases) | 35959068573209 |
| `/db/MVLDch` / `MVLDid` / `MVLDbs` / `MVLDeu` / `MVLDpl` / `MVLDtr` | 이동하중 케이스 - 규준별 | 35960417354649 외 |
| `/db/CRGR` | Concurrent Reaction Group | 35962261902745 |
| `/db/CJFG` | Concurrent Joint Force Group | 35962376351769 |
| `/db/MVHC` | Vehicle Classes | 35962463156761 |
| `/db/SINF` | 영향표면용 판 요소 | 35962659347481 |
| `/db/MLSP` | Lane Support - Negative Moments | 35962967211545 |
| `/db/MLSR` | Lane Support - Reactions | 35963167875225 |
| `/db/DYLA` | Dynamic Load Allowance | 35963288573849 |
| `/db/IMPF` | Additional Impact Factor | 35963359844889 |
| `/db/DYFG` | Railway Dynamic Factor | 35963474883097 |
| `/db/DYNF` | Railway Dynamic Factor by Element | 35963520535577 |

### 5-11. Dynamic Loads
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/SPFC` | 응답스펙트럼 함수 (User/규준별) | 35963686253593 외 |
| `/db/SPLC` | 응답스펙트럼 하중 케이스 | 35963719599641 |
| `/db/THGC` | 시간이력 전역 제어 | 35963819140505 |
| `/db/THGC-M1` ᴴˢ | 시간이력 전역 제어 (Hyper-S) | 56510942223513 |
| `/db/THOO-M1` ᴴˢ | 시간이력 출력 옵션 (Hyper-S) | 56371398681241 |
| `/db/THIS` | 시간이력 하중 케이스 | 35963903917593 |
| `/db/THIS-M1` ᴴˢ | 시간이력 하중 케이스 (Hyper-S) | 56538335819673 |
| `/db/THFC` | 시간이력 함수 | 35964507702937 |
| `/db/THGA` | 지반 가속도 (Ground Acceleration) | 35964590740633 |
| `/db/THNL` | 동적 절점 하중 | 35964586306841 |
| `/db/THSL` | 시간가변 정적 하중 | 35964656837785 |
| `/db/THMS` | 다지점 가진 (Multiple Support Excitation) | 35964708397081 |

### 5-12. Construction Stage Loads
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/STAG` | 시공 단계 정의 | 35987578396697 |
| `/db/CSCS` | 시공단계 합성단면 | 35987625234201 |
| `/db/TMLD` | 시공단계 Time Loads | 35987743311385 |
| `/db/STBK` | 비선형 시공단계 Set-Back 하중 | 35987833076505 |
| `/db/CMCS` | 시공단계 Camber | 35987807611161 |
| `/db/CRPC` | 시공단계 크리프 계수 | 35987878971545 |

### 5-13. Heat of Hydration Loads
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/ETFC` | 외기 온도 함수 | 35988049086489 |
| `/db/CCFC` | 대류계수 함수 | 35988168533785 |
| `/db/HECB` | 요소 대류 경계 | 35988210740761 |
| `/db/HSPT` | 규정 온도 (Prescribed Temperature) | 35988262538521 |
| `/db/HSFC` | 열원 함수 (Heat Source Functions) | 35988291377305 |
| `/db/HAHS` | 열원 할당 | 35988378892441 |
| `/db/HPCE` | 파이프 쿨링 | 35988420776345 |
| `/db/HSTG` | 수화열 시공단계 정의 | 35988442589465 |

### 5-14. Settlement Loads
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/SMPT` | 침하 그룹 (Settlement Group) | 35988516836633 |
| `/db/SMLC` | 침하 하중 케이스 | 35988560566425 |

### 5-15. Miscellaneous Loads
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/PLCB` | Pre-composite Section | 35988644139673 |
| `/db/LDSQ` | Load Sequence for Nonlinear | 35988663234329 |
| `/db/WVLD` | Wave Loads | 35988728179097 |
| `/db/IELC` | Ignore Elements for Load Cases | 35988790960921 |
| `/db/IFGS` | 대변위 - 기하강성 초기력 | 35988857497113 |
| `/db/EFCT` | 소변위 - 초기력 제어 데이터 | 35988927684633 |
| `/db/INMF` | 소변위 - 초기 요소력 | 35988975670937 |

### 5-16. Grid Model Analysis Loads
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/GALD` ᴶ | Grid Analysis Load | 39236719728281 |

### 5-17. Analysis (제어 데이터)
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/ACTL` | Main Control Data | 35409287717657 |
| `/db/ACTL-M1` ᴴˢ | Main Control Data (Hyper-S) | 56397306107545 |
| `/db/PDEL` | P-Delta 해석 제어 | 35989163268249 |
| `/db/BUCK` | 좌굴 해석 제어 | 35989190592537 |
| `/db/EIGV` | 고유치 해석 제어 | 35989224565273 |
| `/db/EIGV-M1` ᴴˢ | 고유치 해석 제어 (Hyper-S) | 56375983487385 |
| `/db/HHCT` | 수화열 해석 제어 | 35989317531417 |
| `/db/HHCT-M1` ᴴˢ | 수화열 해석 제어 (Hyper-S) | 56399833703193 |
| `/db/MVCT` | 이동하중 해석 제어 | 35989483364633 |
| `/db/MVCTch` / `MVCTid` / `MVCTbs` / `MVCTtr` | 이동하중 해석 제어 - 규준별 | 35989644995609 외 |
| `/db/SMCT` | 침하 해석 제어 데이터 | 35990184995481 |
| `/db/NLCT` | 비선형 해석 제어 데이터 | 35990229420441 |
| `/db/NLCT-M1` ᴴˢ | 비선형 해석 제어 (Hyper-S) | 56506850582425 |
| `/db/STCT` | 시공단계 해석 제어 데이터 | 35990281053465 |
| `/db/STCT-M1` ᴴˢ | 시공단계 해석 제어 (Hyper-S) | 57053813627673 |
| `/db/BCCT` | Boundary Change Assignment | 35736960800281 |
| `/db/BCGD-M1` ᴴˢ | Boundary Combination 할당 (Hyper-S) | 56374180830745 |
| `/db/BCGA-M1` ᴴˢ | Boundary Combination 할당 (Hyper-S) | 56375029084697 |

### 5-18. Analysis Results (조합/절단)
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/LCOM-GEN` | 하중 조합 - General | 35990806887065 |
| `/db/LCOM-CONC` | 하중 조합 - Concrete Design | 35990864052249 |
| `/db/LCOM-STEEL` | 하중 조합 - Steel Design | 35990929861913 |
| `/db/LCOM-SRC` | 하중 조합 - SRC Design | 35991038731161 |
| `/db/LCOM-STLCOMP` | 하중 조합 - Composite Steel Girder | 35991080923033 |
| `/db/LCOM-SEISMIC` | 하중 조합 - Seismic Design | 35991142266265 |
| `/db/CUTL` | Cutting Line | 35991257189017 |
| `/db/CLWP` | Plate Cutting Line Diagram | 35991500289561 |

### 5-19. Bridge Specialization Results
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/GSBG` | Bridge Girder Diagrams | 35991591178265 |
| `/db/GCMB` | General Camber Control | 35991765204121 |
| `/db/CAMB` | FCM Camber Control | 35991862460697 |
| `/db/ULFC` | Cable Control - Unknown Load Factor | 35991960319897 |

### 5-20. Time History Analysis Results
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/THRE` | TH Graph - Element Force Smart Graph | 39236753314073 |
| `/db/THRG` | TH Graph - General Link Smart Graph | 35992341376025 |
| `/db/THRI` | TH Graph - Inelastic Hinge Smart Graph | 35992399685017 |
| `/db/THRS` | TH Graph - Seismic Devices Smart Graph | 35992460196121 |

### 5-21. Heat of Hydration Results
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/HHND` | 수화열 결과 그래프 | 35992577650841 |

### 5-22. Pushover
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/POGD` | Pushover 해석 제어 데이터 | 35992664632601 |
| `/db/POGD-M1` ᴴˢ | Pushover 전역 제어 (Hyper-S) | 56511008007705 |
| `/db/IEPI` | Pushover 초기하중 무시 요소 | 35992797619097 |
| `/db/PHGE` | Pushover 힌지 특성 할당 | 35992838417049 |
| `/db/POLC` | Pushover 하중 케이스 | 35993449470489 |
| `/db/POLC-M1` ᴴˢ | Pushover 하중 케이스 (Hyper-S) | 56506753403673 |

### 5-23. Design
| 주소 | 역할 | article |
| --- | --- | --- |
| `/db/DCON` | RC Design Code | 35993633394969 |
| `/db/MATD` | Concrete 재료 수정 | 35993732216985 |
| `/db/RCHK` | Rebar Input - Beam/Column | 35993850335897 |
| `/db/LENG` | Unbraced Length | 49513511154329 |
| `/db/MEMB` | Member Assignment | 49513603328793 |
| `/db/DCTL` | Definition of Frame | 49513652948377 |
| `/db/LTSR` | Limiting Slenderness Ratio | 49513681377689 |
| `/db/ULCT` | Underground Load Combination Type | 49513792356505 |
| `/db/MBTP` | Modify Member Type | 49513816193689 |
| `/db/WMAK` | Modify Wall Mark Design | 49513846785817 |
| `/db/DSTL` | Steel Design Code | 52149417728665 |

---

## 6. OPE — 오퍼레이션 `(/ope/...)`

GUI 제어 / DB 미저장 전처리 값 계산.

| 엔드포인트 | 역할 | article |
| --- | --- | --- |
| `/ope/PROJECTSTATUS` | 프로젝트 상태 | 35994678976281 |
| `/ope/DIVIDEELEM` | 요소 분할 | 35994694310937 |
| `/ope/SECTPROP` | 단면 특성 계산 결과 | 35994769341081 |
| `/ope/USLC` | Using Load Combinations | 35994827741465 |
| `/ope/LINEBMLD` | Line Beam Load | 35994879160857 |
| `/ope/AUTOMESH` | 평면 영역 Auto-Mesh | 35736427971225 |
| `/ope/SSPS` | Surface Spring | 39772183634329 |
| `/ope/EDMP` | Change Property | 39772649347865 |
| `/ope/STOR` | Story Calculation | 49514653408793 |
| `/ope/STORY_PARAM` | Story Check Parameter | 49514705474457 |
| `/ope/STORY_IRR_PARAM` | Story Irregularity Check Parameter | 49514751862425 |
| `/ope/STORPROP` | Story Properties | 49514773501721 |
| `/ope/MEMB` | Member Assignment | 49514964272665 |

---

## 7. VIEW — 모델 뷰 제어 `(/view/...)`

각 기능은 독립 사용 가능. `CAPTURE` 는 `ANGLE`/`ACTIVE`/`DISPLAY`/`RESULTGRAPHIC` 와 함께 사용 가능.

| 엔드포인트 | 역할 | article |
| --- | --- | --- |
| `/view/SELECT` | 선택 (응답 `SELECT` 키) | 35995942911257 |
| `/view/CAPTURE` | 캡처 | 35996023805337 |
| `/view/PRECAPTURE` | 다이얼로그 캡처 | 39236964850329 |
| `/view/ANGLE` | 시점 (Viewpoint) | 35736247981209 |
| `/view/ACTIVE` | Active | 35523395368985 |
| `/view/DISPLAY` | Display | 35996157533977 |
| `/view/RESULTGRAPHIC` | 결과 그래픽 표시 (변형/등고선/응력/모드형상/수화열 등 다수) | 35996812786841 외 |

---

## 8. POST — 테이블/설계 추출 `(/post/...)`

**POST 전용**, body 는 `"Argument"`.
- `/post/TABLE` 로 전/후처리 **테이블**을 추출합니다. (사용법: [Designing with Intent: POST/TABLE](https://support.midasuser.com/hc/en-us/articles/45171987915929))
- 그 외 `/post/{...}` 는 설계 force / 코드 체크 전용 엔드포인트입니다.

### 8-1. `/post/TABLE` 으로 추출하는 테이블 종류
- **Pre-Process**: Element Weight, Nodal Body Force, Mass Summary, Load Summary, Material, Section,
  Restraint Supports, Story Mass/Load Summary, Story Weight.
- **Analysis Result**: Reaction(Local/Global/SurfaceSpring), Displacement(Local/Global), Truss Force/Stress,
  Cable Force/Configuration/Efficiency, Beam Force/Stress(+Equivalent/PSC/7DOF), Plate Force/Stress/Strain(Local/Global/UnitLength),
  Plane Stress·Plane Strain·Axisymmetric·Solid (Force/Stress/Strain), Elastic Link, General Link(Force/Deformation),
  Resultant Force, Vibration/Buckling Mode, Effective Span Length, Nodal Results of RS,
  Tendon (Coordinates/Elongation/Arrangement/Loss/Weight/StressLimit/ApproxLoss),
  Composite Section for C.S., Element/Beam Section Properties at Stage, Lack of Fit Force(Truss/Beam/Plate),
  Equilibrium Element Nodal Force, Initial Element Force, Wall Force/Moment.
- **Analysis Story**: Story Drift/Displacement/Shear(+Coefficient/Ratio)/Mode Shape/Eccentricity,
  Overturning Moment, Axial Force Sum, Stability Coefficient, Torsional Irregularity/Amplification,
  Stiffness·Capacity·Weight Irregularity, Criteria for Regularity in Plan, Ultimate Story Shear.
- **Time History Result**: Disp/Vel/Accel, Beam Force, Truss Force, General Link,
  Inelastic Hinge (Event Time/Summary/Force/Deformation/Element Rotation/Ductility Factor), Fiber Section ᴶ(여러).
- **Heat of Hydration Result**: Stress, Temperature, Displacement, Tensile Stress, Pipe Cooling Nodal Temp.
- **TH Text / Pushover Text**: Node·Element(Truss/Beam/Plate/Wall)·General/Elastic Link 결과 텍스트.

> 위 테이블은 모두 `POST /post/TABLE` + `Argument`(테이블 타입·범위 등) 로 호출합니다.
> 정확한 Argument 스키마는 POST/TABLE 가이드와 각 테이블 article 참고 → 확인 시 `midas-api-examples.json` 에 반영.

### 8-2. 설계 force / 코드 체크 엔드포인트
| 엔드포인트 | 역할 | article |
| --- | --- | --- |
| `/post/PM` | P-M 상관도 | 36021337973017 |
| `/post/STEELCODECHECK` | 강재 코드 체크 | 44662732910233 |
| `/post/BEAMDESIGNFORCES` | Concrete Design - Beam Design Force | 49514295460889 |
| `/post/COLUMNDESIGNFORCES` | Concrete Design - Column Design Forces | 49514320078489 |
| `/post/BRACEDESIGNFORCES` | Concrete Design - Brace Design Forces | 49514395318041 |
| `/post/WALLDESIGNFORCES` | Concrete Design - Wall Design Forces | 49514433321881 |
| `/post/STEELMEMBERDESIGNFORCES` | Steel Design - Member Design Forces | 49514496461593 |
| `/post/SRCBEAMDESIGNFORCES` | SRC Design - Beam Design Forces | 49514560567961 |
| `/post/SRCCOLUMNDESIGNFORCES` | SRC Design - Column Design Forces | 49514609393049 |
| `/post/COLDFORMEDSTEELMEMBERDESIGNFORCES` | Cold Formed Steel - Member Design Forces | 49514621265305 |

---

## 9. 이 템플릿 매핑 (`utils_api.ts`)

| utils_api 함수 | 메서드 · 경로 | body |
| --- | --- | --- |
| `dbRead(item)` | `GET /db/{item}` | — (응답에서 `item` 키 언래핑) |
| `dbReadItem(item, id)` | `GET /db/{item}/{id}` | — |
| `dbCreate(item, items)` | `POST /db/{item}` | `{ Assign: items }` |
| `dbCreateItem(item, id, x)` | `POST /db/{item}/{id}` | `{ Assign: x }` |
| `dbUpdate(item, items)` | `PUT /db/{item}` | `{ Assign: items }` |
| `dbUpdateItem(item, id, x)` | `PUT /db/{item}/{id}` | `{ Assign: x }` |
| `dbDelete(item, id)` | `DELETE /db/{item}/{id}` | — |

- DOC/OPE/VIEW/POST 가 필요하면 `utils_api.ts` 의 `requestJson(method, endpoint, body)` 로 함수를 추가하세요.
  예: `requestJson("POST", "/doc/ANAL", {})`, `requestJson("GET", "/view/SELECT")`,
  `requestJson("POST", "/post/TABLE", { Argument: {...} })`.

---

## 10. 함정 (카탈로그/규약에 없는 것만)

- `ᴴˢ`(Hyper-S 솔버 전용) / `ᴶ`(JP 버전 전용) 마커 엔드포인트는 환경이 맞아야 동작.
- 요청 전제: 대상 **NX 앱 실행 + 파일 열림** (없으면 실패).
- 정확한 필드명·필수값은 해당 **article 페이지**가 최종 근거. 확인하면 `midas-api-examples.json` 에 반영.
