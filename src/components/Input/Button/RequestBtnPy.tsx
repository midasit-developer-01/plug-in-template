import { Button } from "@midasit-dev/moaui";
// (구) pyscript 기반 구현 — 주석 처리
// import { dbRead } from "../../../utils_pyscript";
import { dbRead } from "../../../utils_api";

const RequestBtnPy = ({ setexampleAPI }: any) => {
  // (구) pyscript 기반 호출 — 주석 처리
  // const onClick = () => {
  //   if (pyscript && pyscript.interpreter) {
  //     const result = dbRead("UNIT");
  //     const aResultKey = Object.keys(result);
  //     let data: Array<object> = [];
  //     aResultKey.forEach((key) => data.push(result[key]));
  //     setexampleAPI([data]);
  //   }
  // };

  // (신) TypeScript fetch 기반 호출 (./utils_api.ts)
  const onClick = async () => {
    const result = await dbRead("UNIT");
    if (result && result.error) {
      console.error(result.error);
      return;
    }
    const data: Array<object> = Object.values(result);
    setexampleAPI([data]);
  };

  return (
    <div>
      <Button onClick={onClick}>RequestBtn</Button>
      <br />
    </div>
  );
};

export default RequestBtnPy;
