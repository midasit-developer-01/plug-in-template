# MIDAS Plug-in Template

MIDAS Civil / Gen (NX) 플러그인을 만드는 React + TypeScript 작업장입니다.

이 문서는 **코드 구조 설명서**입니다. 어떤 폴더가 무슨 일을 하고, 요청이 어떤 경로로 모델까지
가고, 내가 쓸 코드를 어디에 두어야 하는지를 다룹니다.
설치와 실행 절차는 `CLAUDE.md` 9장, 빌드와 업로드는 `CLAUDE.md` 8장에 있습니다.

기술 스택: React 18, TypeScript 4.9, Create React App 5, recoil, react-i18next,
@midasit-dev/moaui, Tailwind CSS.


## 1. 30초 요약

플러그인은 **자체 서버가 없는 정적 웹 페이지**입니다. NX 가 내장 브라우저로 이 페이지를 띄우고,
페이지는 실행 중인 NX 에 HTTP 요청을 보내 **지금 열려 있는 모델**을 읽고 고칩니다.

    [ 내가 만드는 화면 ]        src/components/
              |
              | 값을 넘김
              v
    [ API 클라이언트   ]        src/utils_api.ts      <- 요청을 보내는 유일한 파일
              |
              | HTTP + MAPI-Key 헤더
              v
    [ 실행 중인 NX     ]        Civil / Gen
              |
              v
    [ 열려 있는 모델   ]        절점, 요소, 하중, 스프링 ...

여기서 나오는 결론 세 가지:

- NX 가 켜져 있고 모델이 열려 있어야 화면이 뜹니다. 개발 중에도 마찬가지입니다.
- API 요청 코드는 `src/utils_api.ts` 를 거칩니다. 다른 곳에서 fetch 를 직접 쓰지 않습니다.
- 엔드포인트는 540개이고 바디 모양이 제각각이라, 기억으로 쓰지 않고 `docs/api/` 에서 찾아 씁니다.


## 2. 폴더 트리

표시 규칙:

    [내 코드]   여기에 내가 만든 파일을 추가합니다
    [배선]      템플릿이 미리 깔아둔 코드. 틀을 바꿀 때만 손댑니다
    [자료]      AI 와 사람이 읽는 참고 자료. 지우면 안 됩니다

전체 구조:

    plug-in-template/
    |
    +-- src/                          애플리케이션 코드
    |   |
    |   +-- index.tsx                 [배선] React 마운트, 라우터, i18n 초기화
    |   +-- Wrapper.tsx               [배선] MAPI-Key 검증 게이트. 통과 전에는 아무것도 안 그림
    |   +-- App.tsx                   [배선] 화면 바깥 틀 (스크롤 영역)
    |   |
    |   +-- components/               [내 코드] 화면 단위 덩어리
    |   |   +-- MainWindow.tsx            창 껍데기
    |   |   +-- Contents.tsx              여기부터 실제 화면. 작업의 출발점
    |   |   \-- RequestBtnPy.tsx          API 호출 예제 버튼
    |   |
    |   +-- UI/                       [내 코드] 재사용 위젯 (입력칸, 다이얼로그 등)
    |   |   \-- LanguageType.tsx          언어 선택 드롭다운
    |   |
    |   +-- hooks/                    [내 코드] 화면을 그리지 않는 로직과 상태
    |   |   \-- useWindowControl.ts       창 드래그 이동 / 리사이즈
    |   |
    |   +-- Calculates/               [내 코드] 순수 계산 함수 (지금 비어 있음)
    |   +-- DataControls/             [내 코드] 가져오기 / 내보내기 (지금 비어 있음)
    |   +-- states/                   [내 코드] recoil 전역 상태 (폴더 자체가 아직 없음)
    |   |
    |   +-- utils_api.ts              [배선] API 클라이언트. 5장에서 설명
    |   +-- utils_pyscript.ts         [배선] 구 Python 방식. 전체 주석 처리. 6장 참고
    |   +-- utils_typscript.ts        [배선] 입력값 검증 함수 모음
    |   +-- config.ts                 [배선] 개발용 환경변수 읽기
    |   +-- language.ts               [배선] 언어 감지와 저장
    |   +-- i18n.js                   [배선] 번역 초기화
    |   +-- locales/en,kr,jp/         [내 코드] 화면 문구 3개 국어
    |   \-- CLAUDE.md                 [자료] 코드 작성 규칙
    |
    +-- docs/api/                     [자료] API 지식 베이스. 5장에서 설명
    |   +-- README.md                     조회 절차
    |   +-- INDEX.md                      엔드포인트 목록 403행
    |   +-- INDEX-design.md               설계 / 내진 엔드포인트 208행
    |   +-- schemas/                      540개. 스키마 + 동작하는 예시
    |   +-- features/                     156개. 제품 메뉴 경로와 필드 의미
    |   +-- cookbook.md                   자주 쓰는 작업 레시피
    |   \-- reference.md                  규약 정리와 함정
    |
    +-- public/                       빌드 시 build/ 로 그대로 복사됨
    |   +-- index.html                    pyscript 태그가 주석 상태로 들어 있음
    |   +-- manifest.json                 플러그인 제목, 창 가로 세로 크기
    |   +-- icon.svg                      스토어 아이콘. SVG 만 인식됨
    |   +-- readme.md                     스토어 설명 페이지
    |   \-- py_base.py, py_api_db.py, py_main.py, py_config.json
    |                                     구 Python 방식 자산. 6장 참고
    |
    +-- scripts/
    |   +-- build.js                      빌드 시 개발용 인증 우회를 강제로 끔
    |   \-- sync-api-docs.js              docs/api 재생성
    |
    \-- CLAUDE.md                     [자료] 루트 가이드. 설치, 빌드, 업로드 절차 포함


## 3. 화면이 뜨기까지

파일 하나가 다음 파일을 부르는 단순한 사슬입니다. 중간에 인증 관문이 하나 있습니다.

    NX 또는 브라우저가 페이지를 연다
              |
              v
    +---------------------+
    | index.tsx           |   React 를 붙이고, 라우터와 번역을 준비
    +---------------------+
              |
              v
    +---------------------+
    | Wrapper.tsx         |   MAPI-Key 가 유효한지 NX 에 물어봄
    +---------------------+
        |            |
        | 실패       | 통과
        v            v
    +----------+   +---------------------+
    | 검증 실패 |   | App.tsx             |   화면 바깥 틀
    | 화면     |   +---------------------+
    +----------+             |
        ^                    v
        |          +---------------------+
        |          | MainWindow.tsx      |   창 껍데기
        |          +---------------------+
        |                    |
        |                    v
        |          +---------------------+
        |          | Contents.tsx        |   ****  내 화면은 여기부터  ****
        |          +---------------------+
        |
     "Validation Check" 라는 패널이 대신 뜹니다.
     고장이 아니라 다음 셋 중 하나라는 뜻입니다.
       - 주소에 ?mapiKey= 가 없거나 키가 만료됨
       - NX 가 꺼져 있거나 모델 파일이 열려 있지 않음
       - redirectTo 주소가 실제 서버와 다름

인증을 통과한 뒤에는 `Wrapper.tsx` 가 recoil 저장소(RecoilRoot)와 알림창(SnackbarProvider)을
함께 깔아둡니다. 그래서 `App.tsx` 아래에서는 별도 설정 없이 전역 상태와 알림을 쓸 수 있습니다.


## 4. 버튼 하나가 모델을 고치기까지

말뚝 스프링을 계산해 모델에 넣는 기능을 예로 든 동작 흐름입니다. 각 단계가 4장에서 설명한
폴더 규칙과 그대로 대응합니다.

    [1] 사용자가 값을 입력하고 Apply 를 누른다
              |
              v
    [2] src/components/InputPanel.tsx          화면 담당
        입력값을 모아서 훅에 넘긴다. 계산도 통신도 여기서 하지 않는다
              |
              v
    [3] src/hooks/usePileSpring.ts             순서 담당
        읽기 -> 계산 -> 쓰기 순서를 정하고 결과를 상태에 담는다
              |
              +----> [4] src/utils_api.ts   dbRead("NODE")
              |               |
              |               |  GET /db/NODE  + MAPI-Key
              |               v
              |          실행 중인 NX  ---->  { "1": {X,Y,Z}, "2": {...} }
              |
              v
    [5] src/Calculates/springStiffness.ts      계산 담당
        절점 좌표 + 입력값 -> 스프링 강성값. React 를 모르는 순수 함수
              |
              v
    [6] src/utils_api.ts   dbCreate("SPRING", { ... })
              |
              |  POST /db/SPRING  + MAPI-Key
              v
         실행 중인 NX  ---->  모델이 실제로 바뀜
              |
              v
    [7] 결과를 상태에 넣으면 화면이 다시 그려진다

이 사슬을 지키면 얻는 것: 계산식만 고칠 때 [5] 만 열면 되고, 화면 배치만 바꿀 때 [2] 만
열면 됩니다. [2] 안에서 계산과 통신까지 하면 나중에 어디를 고쳐야 할지 알 수 없게 됩니다.


## 5. 새 파일을 어디에 만들까

만들려는 코드에 아래 질문을 순서대로 던지면 위치가 정해집니다.

    새로 만들 코드가 화면에 무언가를 그리는가?
    |
    +-- 그린다
    |   |
    |   +-- 이 플러그인과 상관없이 다른 곳에도 그대로 쓸 수 있는 부품인가?
    |       |
    |       +-- 그렇다   ->  src/UI/
    |       |               예) NumberField.tsx, ConfirmDialog.tsx, ResultTable.tsx
    |       |               조건: props 로만 동작. API 호출이나 도메인 지식이 없어야 함
    |       |
    |       \-- 이 화면 전용이다  ->  src/components/
    |                       예) InputPanel.tsx, ResultPanel.tsx
    |                       역할: UI 부품과 훅과 상태를 조립해 화면 한 덩어리를 만듦
    |
    \-- 그리지 않는다
        |
        +-- 숫자를 넣으면 숫자가 나오는 계산인가?          ->  src/Calculates/
        |   예) springStiffness.ts   조건: React import 없음, 부수효과 없음
        |
        +-- 파일 읽기 쓰기, 형식 변환, 내보내기인가?        ->  src/DataControls/
        |   예) exportProject.ts, importCsv.ts
        |
        +-- 상태를 들고 있거나 API 를 부르는가?             ->  src/hooks/
        |   예) usePileSpring.ts     이름은 반드시 useXxx. JSX 를 넣지 않음
        |
        \-- 여러 화면이 함께 보는 값인가?                   ->  src/states/
            예) projectState.ts      recoil atom 과 selector

지금 `Calculates/` 와 `DataControls/` 는 빈 폴더이고, `states/` 는 폴더 자체가 없습니다.
필요해질 때 파일을 만들면 됩니다. 다만 **`src/` 아래에 위 목록에 없는 새 폴더를 만들지 마세요.**
규칙이 흔들리면 AI 도 사람도 파일을 찾지 못하게 됩니다.

한 가지 더: 화면에 보이는 문자열을 코드에 직접 쓰지 않습니다. `t("welcome_title")` 처럼 키로
쓰고, 실제 문구는 `src/locales/en`, `kr`, `jp` 세 파일에 모두 넣습니다. 하나라도 빠지면
그 언어에서 조용히 영어로 나옵니다.


## 6. 모델을 읽고 쓰기 (TypeScript, 기본 방식)

요청을 보내는 파일은 `src/utils_api.ts` 하나입니다. 두 가지 형태가 있습니다.

    db 형태     : 데이터를 만들고 읽고 고치고 지움. 바디를 { Assign: ... } 로 감쌈. 약 402개
    명령 형태   : 해석 실행, 표 추출 같은 동작 지시. 바디를 { Argument: ... } 로 감쌈. 약 138개

어느 쪽인지는 `docs/api/INDEX.md` 의 `body` 열을 보면 나옵니다.

사용 예:

    import { dbRead, dbCreate, command } from "./utils_api";

    // 읽기
    const units = await dbRead("UNIT");
    if (units?.error) {           // 실패해도 예외가 아니라 값으로 돌아옵니다
      console.error(units.error, units.body);
      return;
    }

    // 쓰기 (모양은 docs/api/schemas/db/NODE.json 의 example 에서 그대로 복사)
    await dbCreate("NODE", { "1": { X: 0, Y: 0, Z: 0 } });

    // 명령
    await command("doc", "ANAL");                                 // 해석 실행
    await command("post", "TABLE", { TABLE_TYPE: "REACTIONG" });  // 반력표 추출

함수 목록:

    dbCreate(itemName, items)              POST    전체 생성
    dbCreateItem(itemName, key, item)      POST    한 건 생성
    dbRead(itemName)                       GET     전체 읽기
    dbReadItem(itemName, key)              GET     한 건 읽기
    dbUpdate(itemName, items)              PUT     전체 수정
    dbUpdateItem(itemName, key, item)      PUT     한 건 수정
    dbDelete(itemName, key)                DELETE  한 건 삭제
    command(group, name, argument, method) 기본 POST   db 형태가 아닌 모든 것
    requestJson(method, endpoint, body)    직접 호출용 탈출구

알아둘 점 세 가지:

- `itemName` 은 `"NODE"` 처럼 db 아래 이름을 쓰거나, `"design/PSC/AASHTO-LRFD24/MEMB"` 처럼
  전체 경로를 써도 됩니다.
- **실패는 예외로 던져지지 않습니다.** `{ error, body }` 값으로 돌아오고 서버 설명이 `body` 에
  담깁니다. 확인하지 않으면 쓰기 실패가 조용히 지나갑니다.
- 응답 대기는 60초입니다. 해석과 표 추출이 느릴 수 있기 때문입니다.

### 엔드포인트를 고르는 절차

이름이 네 글자 약어라 비슷한 것이 많고, 잘못 고르면 요청이 거절되거나 엉뚱한 표가 채워집니다.
그래서 매번 찾아서 씁니다.

    [1] docs/api/INDEX.md 를 grep 한다        (파일이 크니 통째로 읽지 말 것)
              |                                grep -i "spring" docs/api/INDEX.md
              v
    [2] desc 열을 읽고 하나를 고른다            첫 번째 결과가 정답이 아닌 경우가 많음
              |
              v
    [3] docs/api/schemas/<고른 uri>.json 을 읽는다
              |                                예) db/NODE  ->  schemas/db/NODE.json
              v
    [4] 그 안의 example 을 모양 그대로 베낀다   필드 이름과 중첩 구조까지 동일하게
              |
              v
    [5] utils_api.ts 의 함수로 호출한다

"이 기능이 제품 메뉴 어디에 있나요" 같은 질문은 코드가 아니라 `docs/api/features/<uri>.json` 의
`menu_path` 와 `usage` 로 답하면 됩니다.

카탈로그가 바뀌었을 때만 재생성합니다.

    node scripts/sync-api-docs.js


## 7. Python(pyscript)으로 통신하기

기본은 위의 TypeScript 방식입니다. numpy 같은 **파이썬 라이브러리가 꼭 필요할 때만** 이 방식을
켜세요. 브라우저에서 파이썬을 통째로 내려받아 실행하므로 첫 로딩이 눈에 띄게 느려집니다.

관련 파일과 역할:

    public/index.html        pyscript 로더와 설정 태그. 지금은 주석 처리됨
    public/py_config.json    쓸 파이썬 패키지(numpy)와 함께 올릴 .py 파일 목록
    public/py_base.py        MidasAPI 클래스와 HTTP 함수. TypeScript 의 utils_api.ts 에 해당
    public/py_api_db.py      py_db_read / py_db_create 등 db 형태 호출 함수
    public/py_main.py        내가 파이썬 코드를 쓰는 곳. main() 부터 시작
    src/utils_pyscript.ts    JS 에서 파이썬을 부르는 다리. 전체 주석 처리됨
    src/global.d.ts          pyscript 전역 선언. 주석 처리됨

켜는 순서 (7단계, 모두 주석 해제 작업입니다):

    [1] public/index.html
        pyscript.js 스크립트 태그, py-config 태그, py-script 태그 세 줄의 주석을 해제

    [2] src/utils_pyscript.ts
        파일 전체 주석 해제

    [3] src/global.d.ts
        const pyscript: any; 선언 주석 해제

    [4] src/Wrapper.tsx 상단
        import { setGlobalVariable, getGlobalVariable } from "./utils_pyscript"; 주석 해제

    [5] src/Wrapper.tsx
        ValidWrapper 를 (props: any) 로 바꾸고 isIntalledPyscript 를 받도록 수정

    [6] src/Wrapper.tsx
        검증 패널의 pyscript 표시 행 주석 해제

    [7] src/Wrapper.tsx 맨 아래
        PyscriptWrapper 블록 주석을 해제하고
        export default ValidWrapper;  ->  export default PyscriptWrapper;  로 교체

이렇게 하면 실행 흐름이 한 겹 늘어납니다.

    index.tsx
        |
        v
    PyscriptWrapper       파이썬 인터프리터가 준비될 때까지 대기 (로딩 화면 표시)
        |                 준비되면 MAPI-Key 와 서버 주소를 파이썬 쪽 전역변수로 넘김
        v
    ValidWrapper          기존 MAPI-Key 검증 게이트
        |
        v
    App.tsx ...

파이썬 쪽에서 호출하는 모습:

    # public/py_main.py
    from py_base import MidasAPI, Product
    from py_api_db import py_db_read, py_db_create

    def main():
        nodes = py_db_read("NODE")
        py_db_create("SPRING", { "1": { "SPR_TYPE": "LINEAR" } })

JS 쪽에서 파이썬 함수를 부를 때는 `pyscript.interpreter.globals.get("함수이름")` 으로 꺼내
호출합니다. 자세한 형태는 `src/utils_pyscript.ts` 의 주석과 `src/Wrapper.tsx` 맨 아래
가이드 주석에 있습니다.


## 8. 화면 문구 (i18n)

번역 파일은 실행 중에 내려받지 않고 빌드할 때 번들에 포함됩니다. 배포 서버가 `/locales/` 경로를
막아도 영향이 없습니다.

언어를 정하는 순서 (위에서부터 먼저 맞는 것으로 결정):

    1  주소 경로에 언어가 있으면          /jp/...        ->  일본어
    2  쿼리스트링                        ?lang=kr       ->  한국어
    3  localStorage 에 저장된 값          사용자가 이전에 고른 언어
    4  브라우저 / OS 언어 설정
    5  타임존 추정                        Asia/Tokyo     ->  일본어
    6  아무것도 없으면                                   ->  영어

`ja` 는 `jp` 로, `ko` 는 `kr` 로, `en-US` 는 `en` 으로 자동 정리됩니다.
언어를 바꿔도 페이지를 다시 불러오지 않고 주소도 바뀌지 않습니다.

문구를 추가할 때는 `src/locales/en/translation.json`, `kr/`, `jp/` **세 파일 모두**에
같은 키를 넣습니다.


## 9. 개발용 설정과 명령

정상적으로는 주소에 키를 붙여 실행합니다.

    http://localhost:3000/?mapiKey=발급받은키

매번 붙이기 번거로우면 `.env.example` 을 복사해 `.env.development.local` 을 만듭니다.

    REACT_APP_SKIP_AUTH=true                                        # 검증 게이트 건너뛰기
    REACT_APP_MAPI_KEY=발급받은키                                    # API 요청에 실제로 필요
    REACT_APP_BASE_URL=https://moa-engineers.midasit.com:443/civil  # civil / gen 경로까지

주의: `SKIP_AUTH` 만 켜면 화면은 뜨지만 모든 API 요청이 실패합니다. 세 줄을 다 채우세요.
이 설정은 `npm start` 에서만 동작합니다. `npm run build` 는 `scripts/build.js` 가 강제로 끄므로
배포본에는 절대 섞이지 않습니다. 값을 바꾸면 개발 서버를 다시 시작해야 합니다.

명령:

    npm start          개발 서버 (http://localhost:3000)
    npm run build      배포용 빌드 -> build/ 폴더
    npm run css        Tailwind 감시 (src/input.css -> src/output.css)
    npx tsc --noEmit   타입 검사

`npm run dev` 는 동작하지 않습니다. DevTools 폴더가 제거되었습니다.


## 10. 자주 걸리는 함정

- **API 실패가 예외로 뜨지 않습니다.** `{ error, body }` 를 확인하지 않으면 쓰기가 실패해도
  화면상 아무 일도 없어 보입니다.
- **해석 전에 저장하지 않으면 멈춘 것처럼 보입니다.** 저장 안 된 변경이 있으면 NX 가 저장
  대화상자를 띄우고, 그 상자가 API 를 붙잡습니다. 해석이 느린 것과 구분되지 않습니다.
- **모델 변경은 되돌리기로 전부 복구되지 않습니다.** 사본에서 개발하세요.
- **pyscript 는 삭제된 것이 아니라 꺼져 있습니다.** 7장의 파일들을 함께 켜거나 함께 꺼야 합니다.
- **Validation Check 화면은 고장이 아닙니다.** 3장의 세 가지 원인 중 하나입니다.
- **스토어 아이콘과 설명 페이지는 이름으로만 인식됩니다.** `icon.svg` 는 SVG 만, `readme.md` 는
  압축 파일 최상단에 있어야 합니다. 코드가 참조하지 않으므로 잘못돼도 경고가 없습니다.


## 11. 다음에 읽을 문서

    CLAUDE.md                 루트 가이드. 설치, 실행, 빌드, 업로드 절차까지 포함
    src/CLAUDE.md             코드 작성 규칙, 폴더 규칙, 번역 규칙, 프로젝트 정의 양식
    docs/api/README.md        API 호출의 출발점. 조회 절차와 규약
    docs/api/cookbook.md      자주 쓰는 작업 레시피
    docs/api/reference.md     구조와 인증 개요, 함정 모음
