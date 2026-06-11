/**
 * @description 다국어(언어) 결정 로직 — URL 경로 "위치"에 의존하지 않도록 분리한 모듈.
 *
 * 배포 환경에서 플러그인 URL 경로가 어떻게 구성될지(예: `/jp`, `/base/jp`, 쿼리스트링 등)
 * 확신할 수 없으므로, 아래 우선순위로 **유연하게** 언어를 찾습니다.
 *   1) URL 경로의 segment 중 지원 언어와 일치하는 값  (예: https://host/jp?... → jp)
 *   2) 쿼리스트링 `?lang=`
 *   3) localStorage 에 저장된 값
 *   4) 기본값(en)
 *
 * 또한 `window.location.pathname` 을 직접 바꿔 페이지를 리로드하지 않습니다
 * (리로드는 배포 호스트의 SPA 폴백 부재 시 로드 실패 → 오프라인 페이지로 떨어질 수 있음).
 */

export const SUPPORTED_LANGS = ["en", "kr", "jp"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: SupportedLang = "en";

const LANG_STORAGE_KEY = "lang";

/** 제품/브라우저가 보내는 다른 코드 표기를 템플릿 locales 코드로 매핑 */
const ALIASES: Record<string, SupportedLang> = {
  ja: "jp", // 일본어
  ko: "kr", // 한국어
};

function isSupportedLang(v: string | null | undefined): v is SupportedLang {
  return !!v && (SUPPORTED_LANGS as readonly string[]).includes(v);
}

/**
 * 임의의 문자열을 지원 언어 코드로 정규화. 매칭 실패 시 null.
 * 예) "JP" → "jp", "ja" → "jp", "en-US" → "en", "ko" → "kr"
 */
export function normalizeLang(raw: string | null | undefined): SupportedLang | null {
  if (!raw) return null;
  const base = raw.toLowerCase().split("-")[0];
  const mapped = ALIASES[base] ?? base;
  return isSupportedLang(mapped) ? mapped : null;
}

/** 우선순위에 따라 현재 언어를 결정 (경로 위치에 비의존) */
export function detectLanguage(): SupportedLang {
  // 1) URL 경로의 아무 segment 나 지원 언어와 매칭되는지 검사
  const segments = window.location.pathname.split("/").filter(Boolean);
  for (const seg of segments) {
    const lang = normalizeLang(seg);
    if (lang) return lang;
  }

  // 2) 쿼리스트링 ?lang=
  const fromQuery = normalizeLang(
    new URLSearchParams(window.location.search).get("lang")
  );
  if (fromQuery) return fromQuery;

  // 3) localStorage
  try {
    const saved = normalizeLang(localStorage.getItem(LANG_STORAGE_KEY));
    if (saved) return saved;
  } catch {
    /* localStorage 접근 불가 환경 무시 */
  }

  // 4) 기본값
  return DEFAULT_LANG;
}

/** 선택 언어를 localStorage 에 저장 (새로고침/재진입 시 유지) */
export function persistLanguage(lang: SupportedLang): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    /* 무시 */
  }
}
