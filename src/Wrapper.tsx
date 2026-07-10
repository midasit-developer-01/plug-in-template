/**
 * @title 2-wrapper
 * @description MAPI-Key 검증 게이트 (pyscript 미사용)
 * @next ./src/App.tsx
 * ┬┌┐┌   ┌─┐┌─┐┌┬┐┬┬  ┬┌─┐
 * ││││───├─┤│   │ │└┐┌┘├┤ 	🌑🌑🌑🌑🌑
 * ┴┘└┘   ┴ ┴└─┘ ┴ ┴ └┘ └─┘
 */

import React from "react";
import { RecoilRoot } from "recoil";
import App from "./App";
import {
  GuideBox,
  Panel,
  Typography,
  VerifyDialog,
  VerifyUtil,
  IconButton,
  Icon,
  Signature as SignatureMoaui,
} from "@midasit-dev/moaui";
import Signature from "./Signature";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { DEV_AUTH_BYPASS } from "./config";
import { detectLanguage } from "./language";
// [pyscript 재활성화] Python 라이브러리가 필요할 때 아래 주석을 해제하세요.
//   (utils_pyscript.ts / public/index.html / global.d.ts 의 주석도 함께 해제)
// import { setGlobalVariable, getGlobalVariable } from "./utils_pyscript";

// [pyscript 재활성화] ValidWrapper 를 props 를 받도록 바꾸세요:
//   const ValidWrapper = (props: any) => {
//     const { isIntalledPyscript } = props;
//     ...아래 기존 본문 유지...
const ValidWrapper = () => {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  const [checkUri, setCheckUri] = React.useState(false);
  const [checkMapiKey, setCheckMapiKey] = React.useState(false);
  const [checkMapiKeyMsg, setCheckMapiKeyMsg] = React.useState("");
  const { i18n } = useTranslation();

  // MAPI-Key 검증 게이트 (pyscript 미사용, VerifyUtil + fetch 기반)
  // 로컬 개발 시에는 URL에 ?mapiKey=... (필요 시 &redirectTo=...) 를 붙여야 통과합니다.
  React.useEffect(() => {
    // 개발용 인증 우회 (.env.development.local 의 REACT_APP_SKIP_AUTH=true).
    // NODE_ENV=development 일 때만 활성화되며 프로덕션 빌드에는 영향 없음.
    if (DEV_AUTH_BYPASS) {
      console.warn("[DEV] 인증 검증 게이트를 우회합니다 (REACT_APP_SKIP_AUTH=true).");
      setCheckUri(true);
      setCheckMapiKey(true);
      setIsValid(true);
      setIsInitialized(true);
      return;
    }

    const callback = async () => {
      // redirectTo(Base URI) 와 mapi-key 유효성 검사
      let _checkUri = true;
      let _checkMapiKey = true;

      // Base URI (/health) 체크
      try {
        const url = VerifyUtil.getProtocolDomainPort();
        const resUrl = await fetch(`${url}/health`);
        if (resUrl.status !== 200) _checkUri = false;
      } catch (error) {
        _checkUri = false;
      }
      setCheckUri(_checkUri);

      // MAPI-Key 검증
      try {
        const mapiKey = VerifyUtil.getMapiKey();
        const verifyMapiKey = await VerifyUtil.getVerifyInfoAsync(mapiKey);
        if ("error" in verifyMapiKey && "message" in verifyMapiKey.error) {
          _checkMapiKey = false;
          setCheckMapiKeyMsg(verifyMapiKey.error.message);
        }
        if ("keyVerified" in verifyMapiKey) {
          if (!verifyMapiKey["keyVerified"]) {
            _checkMapiKey = false;
            setCheckMapiKeyMsg("keyVerified");
          }
        }
        if ("status" in verifyMapiKey) {
          if (verifyMapiKey["status"] !== "connected") {
            _checkMapiKey = false;
            setCheckMapiKeyMsg(verifyMapiKey["status"]);
          }
        }
      } catch (error) {
        _checkMapiKey = false;
        setCheckMapiKeyMsg("verify request failed");
      }
      setCheckMapiKey(_checkMapiKey);

      // 최종 결과 Set
      setIsValid(_checkUri && _checkMapiKey);
      setIsInitialized(true);
    };

    callback();
  }, []);

  const ValidationComponent = ({
    title = "undefiend",
    checkIf = false,
    strValid = "Valid",
    strInvalid = "Invalid",
  }: any) => {
    return (
      <GuideBox row horSpaceBetween width={350}>
        <Typography variant="body1">{title}: </Typography>
        {checkIf ? (
          <Typography variant="h1" color="#1f78b4">
            {strValid}
          </Typography>
        ) : (
          <Typography variant="h1" color="#D32F2F">
            {strInvalid}
          </Typography>
        )}
      </GuideBox>
    );
  };

  const [bgColor, setBgColor] = React.useState("#eee");
  React.useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/manifest.json`)
      .then((response) => response.json())
      .then((data) => (data.name ? setBgColor(data.background_color) : null))
      .catch((error) => console.error("Error fetching manifest.json:", error));
  }, []);

  React.useEffect(() => {
    if (isInitialized && isValid) {
      Signature.log();
      SignatureMoaui.log();
    }
  }, [isInitialized, isValid]);

  // language switcher
  // URL 경로를 강제로 바꾸지 않고(리로드 방지) detectLanguage() 결과로 한 번만 설정.
  React.useEffect(() => {
    i18n.changeLanguage(detectLanguage());
  }, [i18n]);

  return (
    <>
      {/* 검증 진행 중 로딩 다이얼로그 */}
      {!DEV_AUTH_BYPASS && <VerifyDialog loading={!isInitialized} />}
      
      {isInitialized && isValid && (
        <RecoilRoot>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            action={(key) => (
              <IconButton
                transparent
                transparentColor="white"
                onClick={() => closeSnackbar(key)}
              >
                <Icon iconName="Close" />
              </IconButton>
            )}
          >
            <GuideBox
              tag="AppBackground"
              show
              center
              fill={bgColor}
              width="100%"
            >
              <App />
            </GuideBox>
          </SnackbarProvider>
        </RecoilRoot>
      )}

      {isInitialized && !isValid && (
        <GuideBox width="100%" height="100vh" center>
          <Panel variant="shadow2" padding={3} margin={3}>
            <GuideBox opacity={0.9} spacing={2}>
              <Typography variant="h1">Validation Check</Typography>
              <GuideBox spacing={2}>
                {/* [pyscript 재활성화] pyscript 설치 여부 표시 행 (isIntalledPyscript prop 필요) */}
                {/* <ValidationComponent
                  title="pyscript"
                  checkIf={isIntalledPyscript}
                  strValid="Installed"
                  strInvalid={`Not Installed`}
                /> */}
                <ValidationComponent
                  title="Base URI"
                  checkIf={checkUri}
                  strValid="Valid"
                  strInvalid="Invalid"
                />
                <ValidationComponent
                  title="MAPI-Key"
                  checkIf={checkMapiKey}
                  strValid="Valid"
                  strInvalid={`Invalid (${checkMapiKeyMsg})`}
                />
              </GuideBox>
            </GuideBox>
          </Panel>
        </GuideBox>
      )}
    </>
  );
};

export default ValidWrapper;

/* ────────────────────────────────────────────────────────────────────────────
 * [pyscript 재활성화 가이드]
 *
 * Python 라이브러리(pyscript)가 필요할 때 아래 절차를 따르세요.
 *   1) public/index.html  — pyscript <script>/<py-config>/<py-script> 태그 주석 해제
 *   2) src/utils_pyscript.ts — 전체 주석 해제
 *   3) src/global.d.ts    — `const pyscript: any` 선언 주석 해제
 *   4) 이 파일 상단의 import(setGlobalVariable/getGlobalVariable) 주석 해제
 *   5) ValidWrapper 를 `(props: any)` 로 바꾸고 isIntalledPyscript 를 받도록 수정
 *   6) Validation 패널의 pyscript 표시 행(위 주석) 해제
 *   7) 아래 PyscriptWrapper 주석을 해제하고, 맨 아래 export 를 PyscriptWrapper 로 교체
 *
 * PyscriptWrapper 는 pyscript 인터프리터가 준비될 때까지 대기(VerifyDialog loading)한 뒤,
 * 전역 변수를 세팅하고 mapiKey 쿼리스트링이 있을 때 ValidWrapper 를 렌더링합니다.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * const PyscriptWrapper = () => {
 *   const [installed, setInstalled] = React.useState(false);
 *
 *   // pyscript 준비 대기 → 전역 변수 세팅
 *   React.useEffect(() => {
 *     function checkPyScriptReady(callback: any) {
 *       // pyscript 가 준비되면 콜백 실행
 *       if (pyscript && pyscript.interpreter) {
 *         setGlobalVariable();
 *         getGlobalVariable();
 *         setInstalled(true);
 *       } else {
 *         // 아직이면 100ms 후 재시도
 *         setTimeout(() => checkPyScriptReady(callback), 100);
 *       }
 *     }
 *
 *     checkPyScriptReady(() => {});
 *   }, []);
 *
 *   return (
 *     <>
 *       <VerifyDialog loading={!installed} />
 *       {installed && VerifyUtil.isExistQueryStrings("mapiKey") && (
 *         <ValidWrapper isIntalledPyscript={installed} />
 *       )}
 *     </>
 *   );
 * };
 *
 * // pyscript 사용 시 이 export 로 교체하세요 (위 `export default ValidWrapper;` 대신)
 * // export default PyscriptWrapper;
 */
