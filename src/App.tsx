/**
 *
 * ██████╗        █████╗ ██████╗ ██████╗
 * ╚════██╗      ██╔══██╗██╔══██╗██╔══██╗
 *  █████╔╝█████╗███████║██████╔╝██████╔╝
 *  ╚═══██╗╚════╝██╔══██║██╔═══╝ ██╔═══╝
 * ██████╔╝      ██║  ██║██║     ██║
 * ╚═════╝       ╚═╝  ╚═╝╚═╝     ╚═╝
 *
 * @description Entry point for the application after Wrapper
 * @next last entry point
 */

import React from "react";
import { GuideBox, Panel, Grid } from "@midasit-dev/moaui";
import MainWindow from "./components/MainWindow";
const opacity = 0.5;
//If you want to test, try using the GuideApp component.
//import GuideApp from './SampleComponents/GuideApp';

/**
 * You can modify the code here and test.
 *
 * @description You can start from the Panel Component below.
 * 							You can add the Component you want.
 *							You can check the version of the library you are currently using by opening the developer tool.
 *
 * For more information about the library, please refer to the link below.
 * @see https://midasit-dev.github.io/moaui
 */
const App = () => {
  return (
    // 스크롤 컨테이너: 내용이 창 높이를 넘으면 세로 스크롤 생성.
    // (flex + 안쪽 margin:auto → 내용이 작으면 가운데 정렬, 커지면 위가 잘리지 않고 끝까지 스크롤)
    <div
      style={{
        height: "100vh",
        width: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ margin: "auto", width: "100%" }}>
        <GuideBox
          center
          fill={"rgba(240, 240, 240, 0.5)"}
          width={"90%"}
          spacing={2}
          padding={2}
        >
          <MainWindow />
        </GuideBox>
      </div>
    </div>
  );
};

export default App;
