# Agent.md — 프로젝트 가이드

이 저장소는 **MIDAS 플러그인(Plug-in Item)** 을 만들기 위한 React 템플릿입니다.
`@midasit-dev/moaui` UI 라이브러리를 기반으로 하며, **pyscript는 비활성화**되어 있고
API 요청은 TypeScript(`fetch`) 기반으로 동작합니다.

> 새 프로젝트(플러그인)를 실제로 만들 때의 **작업 규칙·구조·번역·API 가이드**는
> [`src/Agent.md`](./src/Agent.md) 에 정리되어 있습니다. 코드 작업 전 반드시 함께 읽으세요.

---

## 1. 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| 프레임워크 | React 18 + TypeScript (Create React App / `react-scripts`) |
| UI | `@midasit-dev/moaui` (GuideBox, Panel, Typography, Button, DropList, Icon 등) |
| 상태관리 | `recoil` |
| 다국어 | `react-i18next` + `i18next-http-backend` (지역별 JSON 로드) |
| 라우팅 | `react-router-dom` (언어 경로 `/en`, `/kr`, `/jp`) |
| 알림 | `notistack` |
| 스타일 | Tailwind CSS (`input.css` → `output.css`) |

---

## 2. 디렉터리 구조

```
template/
├─ public/
│  ├─ index.html          # pyscript 태그는 주석 처리됨(비활성). manifest 로드.
│  ├─ manifest.json       # 플러그인 제목/배경색/창 크기(width,height) 설정
│  ├─ py_*.py             # (구) pyscript용 파이썬 코드 — 현재 미사용, 참고용 보존
│  └─ py_config.json      # (구) pyscript 설정 — 미사용
│
├─ .env.example          # 개발용 환경변수 예시 → 복사해서 .env.development.local 작성
│
└─ src/
   ├─ index.tsx           # 엔트리. BrowserRouter → Wrapper 라우팅
   ├─ Wrapper.tsx         # MAPI-Key 인증 검증 게이트 (통과해야 App 렌더)
   ├─ App.tsx             # 앱 루트. 여기부터 화면을 구성
   ├─ config.ts           # 개발용 환경설정 (인증 우회 등 REACT_APP_* 판독)
   ├─ utils_api.ts        # ★ API 요청(권장): fetch 기반 Midas DB CRUD 클라이언트
   ├─ utils_pyscript.ts   # (구) pyscript 기반 API — 전체 주석 처리(참고용)
   ├─ utils_typscript.ts  # 공용 유틸 함수
   ├─ i18n.js             # i18next 초기화 (src/locales 를 번들에 import)
   ├─ language.ts         # 언어 감지/전환 (경로 비의존, ja→jp·ko→kr 별칭)
   ├─ locales/            # 다국어 번역 리소스 (en/kr/jp) — 번들에 포함
   ├─ global.d.ts         # 전역 타입 (pyscript 선언은 주석 처리됨)
   ├─ Signature.tsx       # 콘솔 시그니처
   ├─ UI/                 # 재사용 순수 위젯 (presentational)
   ├─ hooks/              # 커스텀 훅 (로직·상태·API)
   ├─ components/         # 기능/도메인 컨테이너 (화면 섹션 조립)
   ├─ Calculates/         # 순수 계산 로직
   ├─ DataControls/       # 데이터 가공/변환, import/export
   └─ states/             # recoil atom/selector, 타입
```

> `src/` 내부의 기능별 폴더 구성 규칙(UI / hooks / components / Calculates / DataControls …)은
> [`src/Agent.md`](./src/Agent.md) 를 따릅니다.

---

## 3. 실행 흐름 (Entry Flow)

```
index.tsx
  └─ <BrowserRouter> → <Wrapper />        # 언어 경로(/en, /kr, /jp) 라우팅
       └─ Wrapper.tsx (ValidWrapper)      # ① MAPI-Key 인증 검증 게이트
            └─ <App />                     # ② 검증 통과 시에만 렌더
                 └─ MainWindow → Contents  # ③ 실제 화면
```

- **Wrapper.tsx**: 앱 진입 시 `/health` 연결 + MAPI-Key 검증을 수행.
  - 검증 중 → `<VerifyDialog loading />`
  - 검증 성공 → `App` 렌더
  - 검증 실패 → "Validation Check" 패널(Base URI / MAPI-Key 상태) 표시
- 화면 작업은 **`App.tsx` 아래**에서 시작합니다.

---

## 4. 인증 (MAPI-Key)

별도 로그인 UI는 없습니다. 인증 정보는 **URL 쿼리스트링**으로 전달됩니다.

- `?mapiKey=...` — MAPI-Key (`VerifyUtil.getMapiKey()` 가 읽음)
- `?redirectTo=...` — 서버 origin (없으면 `https://moa-engineers.midasit.com:443`)
- `VerifyUtil.getBaseUrlAsync()` 가 키를 검증하고 `{origin}/{program}` base URL을 반환

**제품 안에서 실행** 시 제품이 위 파라미터를 주입합니다.
**로컬 개발** 시에는 직접 붙여야 인증 게이트를 통과합니다:

```
http://localhost:3000/en?mapiKey=발급받은_KEY
# 다른 서버 대상이면:
http://localhost:3000/en?mapiKey=...&redirectTo=https://moa-engineers.midasit.com:443
```

### 개발용 인증 우회 (.env)

매번 URL에 키를 붙이기 번거로우면 **개발 모드에서 인증을 건너뛸 수** 있습니다.
`.env.example` 을 복사해 `.env.development.local`(gitignore됨) 을 만들고:

```bash
REACT_APP_SKIP_AUTH=true                # 검증 게이트 우회 → 앱 바로 진입
REACT_APP_MAPI_KEY=발급받은_KEY          # (선택) API 요청까지 테스트할 때
REACT_APP_BASE_URL=https://moa-engineers.midasit.com:443/civil  # (선택) 프로그램 경로 포함
```

- `NODE_ENV=development`(npm start) 일 때만 동작 → **프로덕션 빌드에는 영향 없음**.
- 게이트만 건너뛰면 화면은 뜨지만, API 요청은 `REACT_APP_MAPI_KEY`/`REACT_APP_BASE_URL`
  을 채워야 실제로 동작합니다. (안 채우면 URL 쿼리스트링 값으로 폴백)
- 구현: `src/config.ts`(env 판독) → `Wrapper.tsx`(게이트 우회) / `utils_api.ts`(키·URL 폴백).
- 변경 후 개발 서버 재시작 필요.

---

## 5. 다국어 (i18n)

- 리소스: `src/locales/{en,kr,jp}/translation.json` — **번들에 포함(`i18n.js` 에서 import)**.
  런타임에 `/locales/*.json` 을 fetch 하지 않습니다. (배포 호스트가 `/locales/` 를 403으로 막아도 무관)
- 언어 결정은 `src/language.ts` 의 `detectLanguage()` — **URL 경로 위치에 비의존**:
  ① 경로 segment 중 지원 언어 매칭(`/jp` → jp) → ② `?lang=` → ③ localStorage → ④ 기본 `en`.
  (`ja→jp`, `ko→kr`, `en-US→en` 별칭 정규화 포함)
- 전환은 **페이지 리로드 없이** `i18n.changeLanguage()` + localStorage 저장 (경로를 강제로 바꾸지 않음).
- 사용: `const { t } = useTranslation();` → `t("key")`
- **번역 키는 세 지역 파일에 모두 추가**해야 합니다. (상세: `src/Agent.md`)

---

## 6. API 요청 (요약)

| 방식 | 사용 파일 | 비고 |
| --- | --- | --- |
| **권장 (pyscript 미사용)** | `src/utils_api.ts` | `fetch` 기반 `dbCreate/dbRead/dbUpdate/dbDelete …` |
| (구) pyscript 사용 | `src/utils_pyscript.ts` | 전체 주석 처리됨. 다시 켜는 절차는 아래 7항 / `src/Agent.md` 참고 |

상세한 호출 예시는 [`src/Agent.md`](./src/Agent.md) 의 "API 요청 가이드"를 참고하세요.
MIDAS API 엔드포인트·JSON 규약 정제본은 [`src/midas-api-reference.md`](./src/midas-api-reference.md) 에 있습니다.

---

## 7. pyscript 상태

pyscript는 **비활성화**되어 있으며, 관련 코드는 삭제하지 않고 **주석으로 보존**되어 있습니다.

- `public/index.html` — pyscript `<script>`, `<py-config>`, `<py-script>` 태그 주석 처리
- `src/utils_pyscript.ts` — 전체 주석 처리
- `src/global.d.ts` — `const pyscript: any` 선언 주석 처리

**다시 켜려면**: 위 세 곳의 주석을 해제하면 됩니다. (자세한 사용법은 `src/Agent.md`)

---

## 8. 개발 / 빌드 명령

```bash
npm start        # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드 (개발자 인증우회 강제 OFF)
npm run css      # Tailwind watch (input.css → output.css)
npx tsc --noEmit # 타입체크
```

> **빌드 시 개발자 모드 OFF**: `npm run build` 는 `scripts/build.js` 를 거쳐 실행되며,
> 빌드 전에 `REACT_APP_SKIP_AUTH=false` 등으로 인증 우회를 **강제로 끕니다**(이중 안전장치).
> 원래 `config.ts` 도 `NODE_ENV !== "development"` 이면 우회를 무시하므로 빌드는 항상 프로덕션 안전.
>
> `package.json` 의 `dev`(DevTools 서버) 스크립트는 이 템플릿에서 DevTools 폴더가
> 제거되어 동작하지 않습니다.

---

## 9. 실행 / 환경 설치 (Claude Code 표준 절차)

이 프로젝트 실행에는 **Node.js** 가 필수이며, Git·Python 은 선택(버전관리·구 pyscript용)입니다.
설치·실행은 **Claude Code 에 "실행해줘"** 로 처리합니다(별도 배치파일 없음 — 아래 절차를 AI 가 직접 수행).

### 실행 전 MAPI-Key 요구
- 앱은 **실행 전에 MAPI-Key 가 반드시 필요**합니다(없으면 검증 게이트에서 막힘).
- 키는 URL 쿼리로 전달: `http://localhost:3000/?mapiKey=<KEY>` →
  `Wrapper.tsx` 의 `VerifyUtil.getMapiKey()` 가 읽어 검증 게이트를 통과(개발 우회 `.env` 아님).
- AI 가 받은 키는 루트 `.mapikey`(gitignore, 이 PC 에만 보관)에 저장해 다음 실행 때 재사용.
- 라우트가 `/*` 캐치올이라 언어는 `detectLanguage()`(localStorage/기본 en)를 따름.
- 전제: 대상 MIDAS NX 앱 실행 + 모델 파일 열림(검증/요청이 켜진 프로그램 대상으로 동작).

### AI(Claude Code)가 처리할 때 — "실행해줘" 표준 절차
사용자가 "실행해줘 / 환경 세팅" 을 요청하면 **더블클릭을 시키지 말고 AI가 직접** 처리:

1. 설치 확인: `node -v` (필수). 필요 시 `git --version`, `python --version`.
2. **없는 것만** 설치 (Node 만 필수):
   ```powershell
   winget install -e --id OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
   winget install -e --id Git.Git --silent --accept-package-agreements --accept-source-agreements      # 선택
   winget install -e --id Python.Python.3.12 --silent --accept-package-agreements --accept-source-agreements  # 선택(구 pyscript 쓸 때만)
   ```
   - `winget` 없으면(구형 Windows) Microsoft Store "앱 설치 관리자" 설치 안내. winget 설치는 UAC(관리자) 승인 필요.
   - winget 설치 직후 PATH 가 현재 셸에 반영 안 됨 → **새 셸**에서 `npm` 실행.
3. 의존성: `node_modules` 없으면 `npm install`.
4. **MAPI-Key 확보 (필수)**: 루트 `.mapikey` 가 있으면 그 값 사용, 없으면 **사용자에게 키를 물어보고** 받은 값을 `.mapikey` 에 저장(다음 실행 재사용).
   - 키 없이 `npm start` 만 띄우면 앱이 검증 게이트("Validation Check")에서 막힘.
   - 키 출처: MIDAS CIVIL/GEN NX 의 [API Settings].
5. 서버 실행 + 키 붙여 브라우저 오픈:
   - `npm start` 를 **백그라운드**로 실행 → localhost:3000 준비되면 `http://localhost:3000/?mapiKey=<KEY>` 를 연다.

> ⚠️ Claude Code 는 명령 실행 전 **권한 승인**을 요청 → 사용자가 "허용" 클릭 필요(완전 무인 아님).
> 세션 시작만으로 묻지 않고 자동 설치하는 것은 지양(도구 부재 감지 시 먼저 확인/제안, 시스템 전역 설치는 승인 후).
> 전제: 대상 **MIDAS NX 앱 실행 + 모델 파일 열림** (키 검증 통과 조건).
