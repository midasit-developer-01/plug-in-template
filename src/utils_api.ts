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

/**
 * @description 공통 요청 함수.
 * base URL(예: https://moa-engineers.midasit.com:443/civil)은 VerifyUtil 이 MAPI-Key 검증 후 제공합니다.
 * py_base.py 의 requests_json.{get,post,put,delete} 를 대체합니다.
 * @param method HTTP 메서드
 * @param endpoint base URL 뒤에 붙는 경로 (예: `/db/UNIT`)
 * @param body 요청 본문 (선택)
 * @returns 파싱된 JSON. 실패 시 { error } 형태 (py_base.py 의 ERROR_DICT 와 동일한 규약)
 */
async function requestJson(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  body?: any
): Promise<any> {
  try {
    const baseUrl = await resolveBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: getHeaders(),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      return {
        error: `Error: request is failed... (status ${response.status}) ${response.url}`,
      };
    }
    return await response.json();
  } catch (error) {
    return { error: `Error: request is failed... ${endpoint}` };
  }
}

/**
 * @description DB 항목 전체 생성 (POST /db/{itemName})
 * py_main.py 의 py_db_create 대체
 */
export function dbCreate(itemName: string, items: any): Promise<any> {
  return requestJson("POST", `/db/${itemName}`, { Assign: items });
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
  return requestJson("POST", `/db/${itemName}/${key}`, { Assign: item });
}

/**
 * @description DB 항목 전체 읽기 (GET /db/{itemName})
 * py_main.py 의 py_db_read 대체. 응답을 itemName 키로 언래핑하여 { id: value } 형태로 반환합니다.
 */
export async function dbRead(itemName: string): Promise<any> {
  const json = await requestJson("GET", `/db/${itemName}`);
  if (json && json.error) return json;
  return json?.[itemName] ?? {};
}

/**
 * @description DB 단일 항목 읽기 (GET /db/{itemName}/{key})
 * py_main.py 의 py_db_read_item 대체
 */
export async function dbReadItem(
  itemName: string,
  key: string | number
): Promise<any> {
  const json = await requestJson("GET", `/db/${itemName}/${key}`);
  if (json && json.error) return json;
  return json?.[itemName]?.[key] ?? {};
}

/**
 * @description DB 항목 전체 수정 (PUT /db/{itemName})
 * py_main.py 의 py_db_update 대체
 */
export function dbUpdate(itemName: string, items: any): Promise<any> {
  return requestJson("PUT", `/db/${itemName}`, { Assign: items });
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
  return requestJson("PUT", `/db/${itemName}/${key}`, { Assign: item });
}

/**
 * @description DB 단일 항목 삭제 (DELETE /db/{itemName}/{key})
 * py_main.py 의 py_db_delete 대체
 */
export function dbDelete(
  itemName: string,
  key: string | number
): Promise<any> {
  return requestJson("DELETE", `/db/${itemName}/${key}`);
}
