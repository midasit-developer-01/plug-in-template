// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { detectLanguage, DEFAULT_LANG, SUPPORTED_LANGS } from "./language";

// 번역 리소스를 번들에 포함(import)합니다.
// 런타임에 /locales/*.json 을 fetch 하지 않으므로, 배포 호스트가 해당 경로를
// 막아두어도(403) 영향이 없습니다. 번역은 src/locales 에서 작성/수정합니다.
import en from "./locales/en/translation.json";
import kr from "./locales/kr/translation.json";
import jp from "./locales/jp/translation.json";

i18n
  .use(initReactI18next) // react-i18next 바인딩
  .init({
    // 초기 언어는 URL 경로/쿼리/localStorage 를 종합해 결정 (경로 위치에 비의존)
    lng: detectLanguage(),
    fallbackLng: DEFAULT_LANG, // 기본/대체 언어
    supportedLngs: [...SUPPORTED_LANGS],
    debug: false,
    interpolation: {
      escapeValue: false, // React에서는 이미 안전함
    },
    resources: {
      en: { translation: en },
      kr: { translation: kr },
      jp: { translation: jp },
    },
  });

export default i18n;
