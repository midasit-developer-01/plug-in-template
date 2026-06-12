# src/Gemini.md — 작업 가이드 (코드 작성 규칙)

이 문서는 이 템플릿으로 **실제 플러그인을 만들 때** 지켜야 할 규칙을 정의합니다.
루트 구조/실행 흐름은 [`../Gemini.md`](../Gemini.md) 를 먼저 참고하세요.

---

## 0. 작업 대상 프로젝트 정의 (★ 작업 시작 전 이 섹션부터 채우기)

> 새 프로젝트를 시작하면 아래 내용을 **이 파일에 직접 기록**합니다.
> 이후 모든 코드는 여기에 적힌 정의를 기준으로 작성합니다.

- **프로젝트 목적**: _(예: 말뚝 스프링 강성을 계산해 모델에 입력하는 플러그인)_
- **대상 제품**: _(CIVIL / GEN 등)_
- **주요 기능 목록**:
  1. _(예: 입력값으로부터 스프링 강성 계산)_
  2. _(예: 계산 결과를 DB API로 모델에 입력)_
  3. _(예: 데이터 import/export)_
- **화면 구성(패널/탭)**: _(예: 입력 패널 / 결과 패널 / 실행 버튼)_
- **사용하는 API**: _(예: `db/NODE` 읽기, `db/SPRING` 쓰기)_
- **상태(state) 구조**: _(recoil atom/selector 목록)_

---

## 1. 폴더 구성 규칙 (기능별 분리)

실제 코드는 `src/` 안에 **기능별 폴더**로 구분해서 작성합니다.

| 역할(한글) | 폴더명 | 담는 내용 | 판별 기준 |
| --- | --- | --- | --- |
| 순수 UI 위젯 | **`src/UI/`** | 재사용 가능한 프레젠테이션 컴포넌트 (버튼/입력/드롭다운/다이얼로그/표/패널 래퍼). props로만 동작, 도메인·API 로직 없음 | *다른 플러그인에 그대로 복붙 가능?* |
| 커스텀 훅 | **`src/hooks/`** | 로직·상태·사이드이펙트·API 호출 캡슐화 (`useXxx`). JSX 없음 | *JSX 없이 로직/상태만?* |
| 기능/도메인 컴포넌트 | **`src/components/`** | 화면 섹션(패널·탭·창)을 조립한 **컨테이너**. UI 위젯 + hooks + recoil 상태를 묶음. 이 플러그인 특화 | *특정 기능/화면에 묶임?* |
| 계산 | `src/Calculates/` | 순수 계산 로직 (입력 → 출력, UI 무관) | |
| 데이터 | `src/DataControls/` | 데이터 가공/변환, import/export | |
| 상태 | `src/states/` | recoil atom/selector, 타입 | |

규칙:
- ⚠️ **새 폴더를 임의로 만들지 마세요.** 컴포넌트는 성격에 따라 `src/UI/` 또는 `src/components/`
  중 하나에 넣습니다. (`src/component/` 단수 폴더 금지)
- **UI vs components 구분**:
  - 재사용 가능한 **순수 위젯** = `src/UI/` (도메인 로직·API 호출 없이 props로만 동작)
  - 위젯·훅·상태를 조립한 **화면 단위 컨테이너** = `src/components/` (예: `MainWindow`, `InputPanel`, `ResultPanel`)
- **로직만 있고 JSX가 없으면** = `src/hooks/` 의 `useXxx`. (예: 창 드래그/리사이즈, 도메인 상태 관리)
- **계산 로직**은 `Calculates/` 의 순수 함수로 분리해 컴포넌트/훅에서 호출.
- **데이터 입출력/변환**은 `DataControls/` 에 모음.
- 번역 문자열은 **코드에 하드코딩하지 않고** `src/locales` 에 둠(번들 포함, 아래 3항).

예시 구조:
```
src/
├─ UI/                     # 재사용 순수 위젯 (presentational)
│  ├─ NumberField.tsx
│  ├─ ConfirmDialog.tsx
│  └─ LanguageType.tsx
├─ hooks/                  # 커스텀 훅 (로직·상태·API)
│  ├─ usePileDomain.ts
│  └─ useWindowControl.ts
├─ components/             # 기능/도메인 컨테이너 (화면 섹션 조립)
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

## 2. 컴포넌트 작성 패턴

- UI는 `@midasit-dev/moaui` 컴포넌트를 우선 사용합니다 (`GuideBox`, `Panel`, `Grid`,
  `Typography`, `Button`, `DropList`, `Stack`, `Icon` 등).
- 전역 상태는 `recoil` 사용. 화면 진입점은 `App.tsx`.
- 번역은 `useTranslation()` 의 `t("key")` 로 표시.

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

## 3. 번역 (i18n) 작성 규칙

- 리소스 위치: `src/locales/{en,kr,jp}/translation.json` — **`i18n.js` 가 import 해 번들에 포함**합니다.
  (런타임에 `/locales/*.json` 을 fetch 하지 않음 → 배포 호스트가 `/locales/` 를 막아도 동작)
- **새 텍스트는 키로 등록하고, 세 지역(en/kr/jp) 파일에 모두 추가**합니다.
- 새 언어를 추가하려면: `src/locales/{lng}/translation.json` 생성 → `src/language.ts` 의
  `SUPPORTED_LANGS` 에 코드 추가 → `src/i18n.js` 의 `resources` 에 import 추가.

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

사용:
```tsx
const { t } = useTranslation();
<Typography>{t("result_title")}</Typography>
```

- 언어 결정/전환 로직은 `src/language.ts` 에 모여 있습니다.
  - `detectLanguage()`: 경로 segment → `?lang=` → localStorage → 기본 `en` (경로 위치 비의존, `ja→jp`·`ko→kr` 별칭 지원).
  - 전환은 `i18n.changeLanguage()` + `persistLanguage()` 로 **리로드 없이** 처리 (전환 UI: `src/UI/LanguageType.tsx`).
  - ⚠️ `window.location.pathname` 을 직접 바꾸지 마세요(전체 리로드 → 배포 호스트 SPA 폴백 부재 시 오프라인 페이지로 떨어질 수 있음).
- 키 누락 시 `fallbackLng: "en"` 으로 영어가 표시됩니다.

---

## 4. API 요청 가이드

Midas 서버와의 통신은 **두 가지 방식** 중 하나를 사용합니다.
**기본은 pyscript 미사용(권장)** 입니다.

> 📖 **엔드포인트·JSON 규약 정제본**: [`./midas-api-reference.md`](./midas-api-reference.md)
> (Base URL, MAPI-Key, DB/DOC/VIEW/POST/OPER 분류, `Assign`/`Argument` 규약, 항목/예시).
> API 코드를 작성하기 전 이 문서를 먼저 참고하세요.
> **이 문서에 없거나 불명확한 경우에만** 공식 Online Manual 을 확인하고, 확인한 내용은 이 문서에 반영합니다.

### 4-1. pyscript 미사용 (권장) → `src/utils_api.ts`

`fetch` 기반 TypeScript 클라이언트. 인증(MAPI-Key)·base URL은 `VerifyUtil` 이 처리합니다.
제공 함수: `dbCreate`, `dbCreateItem`, `dbRead`, `dbReadItem`, `dbUpdate`, `dbUpdateItem`, `dbDelete`.
**모두 비동기(`async`)** 이므로 `await` 로 호출합니다.

```ts
import { dbRead, dbUpdate } from "../utils_api";

// 읽기: GET /db/NODE  → { id: value, ... } 형태로 반환
const nodes = await dbRead("NODE");
if (nodes.error) { console.error(nodes.error); return; }

// 쓰기: PUT /db/SPRING (body: { Assign: items })
await dbUpdate("SPRING", {
  1: { /* ... item payload ... */ },
});
```

- 실패 시 반환값은 `{ error: string }` 규약을 따릅니다 → 호출부에서 `result.error` 확인.
- 새 엔드포인트가 필요하면 `utils_api.ts` 의 `requestJson(method, endpoint, body)` 를
  이용해 함수를 추가하세요. (`endpoint` 는 base URL 뒤 경로, 예: `/doc/anal`)

### 4-2. pyscript 사용 → `src/utils_pyscript.ts` (참고)

`utils_pyscript.ts` 는 **현재 전체 주석 처리**되어 있으며, 파이썬 코드
(`public/py_main.py`, `py_base.py`, `py_api_db.py`)를 호출하던 구현입니다.

pyscript로 전환하려면:
1. `public/index.html` 의 pyscript `<script>` / `<py-config>` / `<py-script>` 태그 주석 해제
2. `src/global.d.ts` 의 `const pyscript: any` 선언 주석 해제
3. `src/utils_pyscript.ts` 의 코드 주석 해제
4. 호출부에서 `utils_api` 대신 `utils_pyscript` 의 `dbRead` 등을 사용

> 같은 함수명(`dbRead` 등)을 양쪽이 제공합니다. 단, `utils_api` 는 비동기(`await` 필요),
> `utils_pyscript` 는 동기 호출이라 전환 시 호출부 수정이 필요합니다.

### 4-3. 개발 중 인증 우회 (.env)

로컬 개발 시 매번 `?mapiKey=` 를 붙이기 번거로우면 `.env.development.local` 로 우회할 수 있습니다.

```bash
REACT_APP_SKIP_AUTH=true     # Wrapper 검증 게이트 우회
REACT_APP_MAPI_KEY=...       # (선택) utils_api 가 이 키로 요청
REACT_APP_BASE_URL=https://moa-engineers.midasit.com:443/civil  # (선택) 프로그램 경로 포함
```

- `NODE_ENV=development` 일 때만 적용(`src/config.ts`) → 프로덕션 빌드 영향 없음.
- 키/URL 을 비워두면 URL 쿼리스트링 값으로 폴백합니다.
- 자세한 내용: 루트 [`../Gemini.md`](../Gemini.md) 의 "개발용 인증 우회".

---

## 5. 새 기능 추가 체크리스트

1. [ ] `src/Gemini.md` 0항(작업 대상 프로젝트 정의)에 기능 내용 기록
2. [ ] 화면 → 재사용 위젯은 `src/UI/`, 화면 단위 컨테이너는 `src/components/`, 로직은 `src/hooks/` 에 작성하고 `App.tsx` 에 연결
3. [ ] 계산 로직 → `src/Calculates/` 에 순수 함수로 분리
4. [ ] 데이터 처리 → `src/DataControls/` 에 작성
5. [ ] 표시 문자열 → `src/locales/{en,kr,jp}` 에 키 추가 (3개 모두)
6. [ ] 서버 통신 → `src/utils_api.ts` 사용/확장
7. [ ] `npx tsc --noEmit` 으로 타입체크 통과 확인
