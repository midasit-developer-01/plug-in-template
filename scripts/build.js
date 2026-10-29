/**
 * 프로덕션 빌드 래퍼 — 개발자(인증 우회) 모드를 강제로 끈 뒤 CRA 빌드를 실행한다.
 *
 * 배경: src/config.ts 는 이미 NODE_ENV !== "development" 이면 인증 우회를 무시하므로
 *       `react-scripts build` 만으로도 안전하다. 이 래퍼는 **이중 안전장치**로,
 *       어떤 .env(.env, .env.local 등) 설정이 있더라도 빌드 산출물에
 *       개발용 우회/키가 절대 들어가지 않도록 빌드 전에 값 자체를 비활성화한다.
 *
 * (dotenv 는 이미 process.env 에 있는 값을 덮어쓰지 않으므로, 여기서 먼저 세팅하면 우선한다.)
 */
process.env.NODE_ENV = "production";
process.env.REACT_APP_SKIP_AUTH = "false"; // 인증 검증 게이트 우회 OFF
process.env.REACT_APP_MAPI_KEY = "";        // 개발용 키가 번들에 박히지 않도록
process.env.REACT_APP_BASE_URL = "";        // 개발용 Base URL 무력화

// 표준 CRA 빌드 실행 (그 외 동작은 react-scripts build 와 동일)
require("react-scripts/scripts/build");
