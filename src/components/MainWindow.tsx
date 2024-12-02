import Contents from "./Layout/Contents/Contents";
import { GuideBox, Grid } from "@midasit-dev/moaui";
import { useEffect } from "react";
import i18n from "../i18n";

function MainWindow() {
  // language switcher
  useEffect(() => {
    if (window.location.pathname === "/") window.location.pathname = "/en"; // initialize
    i18n.changeLanguage(window.location.pathname.split("/")[1]); // change language when pathname changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  return (
    <GuideBox width={"100%"} height={"100%"} padding={2}>
      <Contents />
    </GuideBox>
  );
}

export default MainWindow;
