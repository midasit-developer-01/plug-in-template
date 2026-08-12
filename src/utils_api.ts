/**
 *
 * ██╗   ██╗████████╗██╗██╗      ███████╗      █████╗ ██████╗ ██╗
 * ██║   ██║╚══██╔══╝██║██║      ██╔════╝     ██╔══██╗██╔══██╗██║
 * ██║   ██║   ██║   ██║██║█████╗███████╗     ███████║██████╔╝██║
 * ██║   ██║   ██║   ██║██║╚════╝╚════██║     ██╔══██║██╔═══╝ ██║
 * ╚██████╔╝   ██║   ██║███████╗███████║      ██║  ██║██║     ██║
 *  ╚═════╝    ╚═╝   ╚═╝╚══════╝╚══════╝      ╚═╝  ╚═╝╚═╝     ╚═╝
 *
 * @description Midas API client (pyscript 대체).
 *              기존 ./public/py_base.py 의 `MidasAPI` 클래스와
 *              ./public/py_main.py 의 `py_db_*` 함수들을 TypeScript fetch 기반으로 이식한 모듈입니다.
 *
 * 엔드포인트는 540개이고 각각 바디 모양이 다릅니다. **기억으로 payload 를 지어내지 마세요.**
 * `docs/api/INDEX.md` 를 grep 해서 고르고, `docs/api/schemas/<uri>.json` 의 `example` 을 그대로 베끼세요.
 *
 * @see ../docs/api/README.md (조회 절차와 규약)
 * @see ./utils_pyscript.ts (구 pyscript 기반 구현, 주석 처리됨)
 */

import { VerifyUtil } from "@midasit-dev/moaui";
import { DEV_AUTH_BYPASS, DEV_MAPI_KEY, DEV_BASE_URL } from "./config";

/**
 * @description MAPI-Key 조회.
 * 개발 우회(DEV_AUTH_BYPASS)가 켜져 있고 env 값이 있으면 그 값을, 아니면 URL ?mapiKey= 를 사용.
 */
const resolveMapiKey = (): string => {
  if (DEV_AUTH_BYPASS && DEV_MAPI_KEY) return DEV_MAPI_KEY;
  return VerifyUtil.getMapiKey();
};

/**
 * @description Base URL 조회 (프로그램 경로 포함, 예: https://...:443/civil).
 * 개발 우회 시 env(REACT_APP_BASE_URL) 값을, 아니면 MAPI-Key 검증 후 반환되는 값을 사용.
 */
const resolveBaseUrl = async (): Promise<string> => {
  if (DEV_AUTH_BYPASS && DEV_BASE_URL) return DEV_BASE_URL;
  return VerifyUtil.getBaseUrlAsync();
};

/**
 * @description 모든 요청에 사용할 공통 헤더 (MAPI-Key 인증)
 * py_base.py 의 MidasAPI.headers 와 동일한 역할
 */
const getHeaders = (): Record<string, string> => ({
  "MAPI-Key": resolveMapiKey(),
  "Content-Type": "application/json",
});

/** @description 요청 제한 시간(ms). NX 쪽 해석/표 추출은 느릴 수 있어 넉넉히 잡습니다. */
const REQUEST_TIMEOUT_MS = 60_000;

/**
 * @description 타임아웃 시그널. 플러그인은 제품 내장 브라우저에서도 도니
 * `AbortSignal.timeout` 이 없는 환경이면 타임아웃만 포기하고 요청은 그대로 보냅니다.
 */
const timeoutSignal = (): AbortSignal | undefined =>
  typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
    ? AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    : undefined;

/**
 * @description 공통 요청 함수.
 * base URL(예: https://moa-engineers.midasit.com:443/civil)은 VerifyUtil 이 MAPI-Key 검증 후 제공합니다.
 * py_base.py 의 requests_json.{get,post,put,delete} 를 대체합니다.
 * @param method HTTP 메서드
 * @param endpoint base URL 뒤에 붙는 경로 (예: `/db/UNIT`)
 * @param body 요청 본문 (선택)
 * @returns 파싱된 JSON. 실패 시 { error } 형태 (py_base.py 의 ERROR_DICT 와 동일한 규약).
 *          서버가 이유를 본문에 담아 보내는 경우가 많아 `body` 필드에 응답 텍스트를 함께 실어 보냅니다.
 */
export async function requestJson(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  body?: any
): Promise<any> {
  try {
    const baseUrl = await resolveBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: getHeaders(),
      signal: timeoutSignal(),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    // 실패 응답의 본문에 실제 원인(어떤 필드가 왜 거부됐는지)이 들어 있으므로 버리지 않습니다.
    const text = await response.text();

    if (!response.ok) {
      return {
        error: `Error: request is failed... (status ${response.status}) ${response.url}`,
        body: text.slice(0, 2000),
      };
    }

    try {
      return JSON.parse(text);
    } catch {
      return {
        error: `Error: response is not JSON... ${response.url}`,
        body: text.slice(0, 2000),
      };
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { error: `Error: request is failed... ${endpoint} (${reason})` };
  }
}

/**
 * @description db 형태 주소를 (group, 그룹 상대 경로, leaf) 로 분해합니다.
 *
 * 이름만 주면 `/db` 아래로 가고, 전체 uri 를 주면 해당 그룹으로 갑니다.
 * db 형태(Assign 규약)의 표는 `/db` 밖에도 있기 때문입니다.
 *   "NODE"                            → ["db",     "NODE",                        "NODE"]
 *   "design/PSC/AASHTO-LRFD24/MEMB"   → ["design", "PSC/AASHTO-LRFD24/MEMB",      "MEMB"]
 *
 * leaf 는 GET 응답이 감싸고 있는 키입니다 (`{ "NODE": { "1": {...} } }`).
 */
function resolveDb(itemName: string): [string, string, string] {
  const slash = itemName.indexOf("/");
  if (slash === -1) return ["db", itemName, itemName];

  const group = itemName.slice(0, slash);
  const sub = itemName.slice(slash + 1);
  return [group, sub, sub.split("/").pop() as string];
}

/* -------------------------------------------------------------------------
 * Assign 규약 — db 형태 CRUD
 *
 * itemName 은 `/db` 아래의 이름("NODE") 또는 전체 uri("design/PSC/AASHTO-LRFD24/MEMB").
 * 어떤 엔드포인트가 이 규약인지는 docs/api/INDEX.md 의 body 열이 `Assign` 인지로 판단합니다.
 * ---------------------------------------------------------------------- */

/**
 * @description DB 항목 전체 생성 (POST /db/{itemName})
 * py_main.py 의 py_db_create 대체
 */
export function dbCreate(itemName: string, items: any): Promise<any> {
  const [group, sub] = resolveDb(itemName);
  return requestJson("POST", `/${group}/${sub}`, { Assign: items });
}

/**
 * @description DB 단일 항목 생성 (POST /db/{itemName}/{key})
 * py_main.py 의 py_db_create_item 대체
 */
export function dbCreateItem(
  itemName: string,
  key: string | number,
  item: any
): Promise<any> {
  const [group, sub] = resolveDb(itemName);
  return requestJson("POST", `/${group}/${sub}/${key}`, { Assign: item });
}

/**
 * @description DB 항목 전체 읽기 (GET /db/{itemName})
 * py_main.py 의 py_db_read 대체. 응답을 itemName 키로 언래핑하여 { id: value } 형태로 반환합니다.
 */
export async function dbRead(itemName: string): Promise<any> {
  const [group, sub, leaf] = resolveDb(itemName);
  const json = await requestJson("GET", `/${group}/${sub}`);
  if (json && json.error) return json;
  return json?.[leaf] ?? {};
}

/**
 * @description DB 단일 항목 읽기 (GET /db/{itemName}/{key})
 * py_main.py 의 py_db_read_item 대체
 */
export async function dbReadItem(
  itemName: string,
  key: string | number
): Promise<any> {
  const [group, sub, leaf] = resolveDb(itemName);
  const json = await requestJson("GET", `/${group}/${sub}/${key}`);
  if (json && json.error) return json;
  return json?.[leaf]?.[key] ?? {};
}

/**
 * @description DB 항목 전체 수정 (PUT /db/{itemName})
 * py_main.py 의 py_db_update 대체
 */
export function dbUpdate(itemName: string, items: any): Promise<any> {
  const [group, sub] = resolveDb(itemName);
  return requestJson("PUT", `/${group}/${sub}`, { Assign: items });
}

/**
 * @description DB 단일 항목 수정 (PUT /db/{itemName}/{key})
 * py_main.py 의 py_db_update_item 대체
 */
export function dbUpdateItem(
  itemName: string,
  key: string | number,
  item: any
): Promise<any> {
  const [group, sub] = resolveDb(itemName);
  return requestJson("PUT", `/${group}/${sub}/${key}`, { Assign: item });
}

/**
 * @description DB 단일 항목 삭제 (DELETE /db/{itemName}/{key})
 * py_main.py 의 py_db_delete 대체
 */
export function dbDelete(
  itemName: string,
  key: string | number
): Promise<any> {
  const [group, sub] = resolveDb(itemName);
  return requestJson("DELETE", `/${group}/${sub}/${key}`);
}

/* -------------------------------------------------------------------------
 * Argument 규약 — 명령형 엔드포인트
 * ---------------------------------------------------------------------- */

/**
 * @description db 형태가 아닌 모든 엔드포인트 호출: `{method} /{group}/{name}`.
 *
 * POST/PUT 은 payload 를 `{ Argument: argument }` 로 감싸고 (argument 가 없으면 `{}`),
 * GET/DELETE 는 바디를 보내지 않습니다.
 *
 * @param group   doc | ope | view | post | design | rating | requestinfo | config
 * @param name    그룹 뒤의 경로. design/rating 은 코드 기준까지 포함합니다
 *                (예: "RC/KDS-41-20-2022/DCRM").
 * @param argument `Argument` 로 감쌀 값
 * @param method  기본 POST. INDEX.md 의 methods 열을 따르세요.
 * @param body    감싸기를 건너뛰고 그대로 보낼 바디 (탈출구). 현재 카탈로그 540개는 전부
 *                `Assign` 아니면 `Argument` 라 평소에는 쓸 일이 없습니다. 어떤 엔드포인트의
 *                `schemas/<uri>.json` 예시가 둘 다 아닌 모양이면 그때 그 모양 그대로 넘기세요.
 *
 * @example
 * await command("doc", "ANAL");                                 // POST /doc/ANAL, body {}
 * await command("post", "TABLE", { TABLE_TYPE: "REACTIONG" });  // { Argument: {...} }
 * await command("view", "SELECT", undefined, "GET");            // GET /view/SELECT
 */
export function command(
  group: string,
  name: string,
  argument?: any,
  method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
  body?: any
): Promise<any> {
  const endpoint = `/${group}/${name}`;
  if (method === "GET" || method === "DELETE") return requestJson(method, endpoint);

  const payload = body !== undefined ? body : argument === undefined ? {} : { Argument: argument };
  return requestJson(method, endpoint, payload);
}
