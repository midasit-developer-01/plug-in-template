import { Button } from "@midasit-dev/moaui";
import { dbRead } from "../utils_api";

const RequestBtn = ({ setexampleAPI }: any) => {
  // TypeScript fetch 기반 호출 (./utils_api.ts)
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

export default RequestBtn;
