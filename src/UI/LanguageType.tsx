import { Stack, DropList, Typography, GuideBox } from "@midasit-dev/moaui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { normalizeLang, persistLanguage, DEFAULT_LANG } from "../language";

const LanguageType = () => {
  const { i18n } = useTranslation();

  // 언어 코드 → DropList 값(number) 매핑
  const items = new Map<string, number>([
    ["en", 1],
    ["jp", 2],
    ["kr", 3],
  ]);

  // 현재 언어는 URL 경로가 아니라 i18n 상태에서 가져옵니다.
  const nowLang = normalizeLang(i18n.language) ?? DEFAULT_LANG;
  const [value, setValue] = useState(items.get(nowLang) ?? items.get(DEFAULT_LANG));

  function onChangeHandler(event: any) {
    const selected = Number(event.target.value);
    setValue(selected);
    items.forEach((v, key) => {
      if (v === selected) {
        // 페이지 리로드 없이 언어 전환 + 저장
        i18n.changeLanguage(key);
        const normalized = normalizeLang(key);
        if (normalized) persistLanguage(normalized);
      }
    });
  }

  return (
    <GuideBox horRight>
      <Stack direction="row" spacing={5}>
        <GuideBox center>
          <Typography variant="h1" size="large">
            {nowLang} :
          </Typography>
        </GuideBox>
        <GuideBox center>
          <DropList
            width={"10vh"}
            itemList={items}
            defaultValue="en"
            value={value}
            onChange={onChangeHandler}
          />
        </GuideBox>
      </Stack>
    </GuideBox>
  );
};

export default LanguageType;
