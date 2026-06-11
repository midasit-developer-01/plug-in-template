/**
 * @description 개발 편의용 환경설정.
 *
 * CRA(react-scripts)는 빌드 타임에 `REACT_APP_*` 접두사 환경변수만 `process.env` 로 주입합니다.
 * (.env, .env.development, .env.development.local 등에서 로드)
 *
 * 모든 우회는 `NODE_ENV === "development"` (npm start) 일 때만 동작하므로,
 * 프로덕션 빌드(npm run build)에는 전혀 영향을 주지 않습니다.
 *
 * @see ../.env.example
 */

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * 개발 중 인증(MAPI-Key 검증 게이트) 우회 여부.
 * `.env.development.local` 에 `REACT_APP_SKIP_AUTH=true` 로 설정.
 */
export const DEV_AUTH_BYPASS =
  isDevelopment && process.env.REACT_APP_SKIP_AUTH === "true";

/**
 * 개발용 MAPI-Key. URL 의 `?mapiKey=` 대신 API 요청에 사용됩니다.
 * (DEV_AUTH_BYPASS 가 true 이고 값이 있을 때만 적용)
 */
export const DEV_MAPI_KEY = process.env.REACT_APP_MAPI_KEY ?? "";

/**
 * 개발용 Base URL. **프로그램 경로(civil/gen)까지 포함**해야 합니다.
 * 예: `https://moa-engineers.midasit.com:443/civil`
 * (DEV_AUTH_BYPASS 가 true 이고 값이 있을 때만 적용)
 */
export const DEV_BASE_URL = process.env.REACT_APP_BASE_URL ?? "";
