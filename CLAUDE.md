# CLAUDE.md — 프로젝트 가이드

이 저장소는 **MIDAS 플러그인(Plug-in Item)** 을 만들기 위한 React 템플릿입니다.
`@midasit-dev/moaui` UI 라이브러리를 기반으로 하며, **pyscript는 비활성화**되어 있고
API 요청은 TypeScript(`fetch`) 기반으로 동작합니다.

> 새 프로젝트(플러그인)를 실제로 만들 때의 **작업 규칙·구조·번역·API 가이드**는
> [`src/CLAUDE.md`](./src/CLAUDE.md) 에 정리되어 있습니다. 코드 작업 전 반드시 함께 읽으세요.

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
│  ├─ locales/            # 다국어 번역 리소스 (지역별)
│  │  ├─ en/translation.json
│  │  ├─ kr/translation.json
│  │  └─ jp/translation.json
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
   ├─ i18n.js             # i18next 초기화
   ├─ global.d.ts         # 전역 타입 (pyscript 선언은 주석 처리됨)
   ├─ Signature.tsx       # 콘솔 시그니처
   └─ components/         # 예시 UI (Layout / Input / MainWindow)
```

> `src/` 내부의 기능별 폴더 구성 규칙(component / Calculates / DataControls …)은
> [`src/CLAUDE.md`](./src/CLAUDE.md) 를 따릅니다.

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

- 리소스: `public/locales/{en,kr,jp}/translation.json`
- 언어는 **URL 경로 첫 segment**로 결정 (`/en`, `/kr`, `/jp`). `/` 진입 시 `/en` 으로 초기화.
- 사용: `const { t } = useTranslation();` → `t("key")`
- **번역 키는 세 지역 파일에 모두 추가**해야 합니다. (상세: `src/CLAUDE.md`)

---

## 6. API 요청 (요약)

| 방식 | 사용 파일 | 비고 |
| --- | --- | --- |
| **권장 (pyscript 미사용)** | `src/utils_api.ts` | `fetch` 기반 `dbCreate/dbRead/dbUpdate/dbDelete …` |
| (구) pyscript 사용 | `src/utils_pyscript.ts` | 전체 주석 처리됨. 다시 켜는 절차는 아래 7항 / `src/CLAUDE.md` 참고 |

상세한 호출 예시는 [`src/CLAUDE.md`](./src/CLAUDE.md) 의 "API 요청 가이드"를 참고하세요.

---

## 7. pyscript 상태

pyscript는 **비활성화**되어 있으며, 관련 코드는 삭제하지 않고 **주석으로 보존**되어 있습니다.

- `public/index.html` — pyscript `<script>`, `<py-config>`, `<py-script>` 태그 주석 처리
- `src/utils_pyscript.ts` — 전체 주석 처리
- `src/global.d.ts` — `const pyscript: any` 선언 주석 처리

**다시 켜려면**: 위 세 곳의 주석을 해제하면 됩니다. (자세한 사용법은 `src/CLAUDE.md`)

---

## 8. 개발 / 빌드 명령

```bash
npm start        # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run css      # Tailwind watch (input.css → output.css)
npx tsc --noEmit # 타입체크
```

> `package.json` 의 `dev`(DevTools 서버) 스크립트는 이 템플릿에서 DevTools 폴더가
> 제거되어 동작하지 않습니다.
