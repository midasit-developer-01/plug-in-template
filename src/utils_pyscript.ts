/**
 *
 * ██╗   ██╗████████╗██╗██╗       ██╗     ██╗██████╗ ██╗   ██╗██╗
 * ██║   ██║╚══██╔══╝██║██║      ███║    ██╔╝██╔══██╗╚██╗ ██╔╝╚██╗
 * ██║   ██║   ██║   ██║██║█████╗╚██║    ██║ ██████╔╝ ╚████╔╝  ██║
 * ██║   ██║   ██║   ██║██║╚════╝ ██║    ██║ ██╔═══╝   ╚██╔╝   ██║
 * ╚██████╔╝   ██║   ██║███████╗  ██║    ╚██╗██║        ██║   ██╔╝
 *  ╚═════╝    ╚═╝   ╚═╝╚══════╝  ╚═╝     ╚═╝╚═╝        ╚═╝   ╚═╝
 *
 * @deprecated pyscript 기반 구현 — 현재 사용하지 않습니다(아래 전체 주석 처리).
 *             API 요청은 ./utils_api.ts 의 fetch 기반 구현을 사용하세요.
 *             pyscript 를 다시 켤 경우 ./public/index.html 의 pyscript 태그 주석을 해제하고
 *             아래 코드 및 ./src/global.d.ts 의 pyscript 전역 선언 주석을 해제하면 됩니다.
 * @linkcode ./public/py_main.py
 */

// import { VerifyUtil } from "@midasit-dev/moaui";
//
// export function checkPyScriptReady(callback: any) {
// 	// if pyscript is ready, call callback function
// 	if (pyscript && pyscript.interpreter) {
// 		return callback();
// 	} else {
// 		// if not, wait 100ms and try again
// 		setTimeout(() => checkPyScriptReady(callback), 100);
// 	}
// }
//
// //before execute a python main function, insert this function
// export function setGlobalVariable() {
// 	const set_func = pyscript.interpreter.globals.get('set_g_values');
// 	set_func(JSON.stringify({
// 		g_mapi_key: VerifyUtil.getMapiKey(),
// 		g_base_uri: VerifyUtil.getBaseUri(),
// 		g_base_port: VerifyUtil.getBasePort()
// 	}));
// }
//
// export function getGlobalVariable() {
//  const get_func = pyscript.interpreter.globals.get('get_g_values');
//  const g_values = JSON.parse(get_func());
//  console.log(`@ Global variables in python script
// - MAPI-Key: ${g_values.g_mapi_key}
// - Base-Uri: ${g_values.g_base_uri}
// - Base-Port: ${g_values.g_base_port}`);
// }
//
// // 아래 db* 함수들은 ./utils_api.ts 의 동일 이름 함수로 대체되었습니다.
// export function dbCreate(itemName: string, items: any) {
// 	return checkPyScriptReady(() => {
// 		const py_db_create_func = pyscript.interpreter.globals.get('py_db_create');
// 		const result = py_db_create_func(itemName, JSON.stringify(items));
// 		return JSON.parse(result);
// 	});
// }
//
// export function dbCreateItem(itemName: string, key: string, item: any) {
// 	return checkPyScriptReady(() => {
// 		const py_db_create_item_func = pyscript.interpreter.globals.get('py_db_create_item');
// 		const result = py_db_create_item_func(itemName, key, JSON.stringify(item));
// 		return JSON.parse(result);
// 	});
// }
//
// export function dbRead(itemName: string): any {
// 	return checkPyScriptReady(() => {
// 		const py_db_read_func = pyscript.interpreter.globals.get('py_db_read');
// 		const result = py_db_read_func(itemName);
// 		return JSON.parse(result);
// 	});
// }
//
// export function dbReadItem(itemName: string, key: string): any {
// 	return checkPyScriptReady(() => {
// 		const py_db_read_item_func = pyscript.interpreter.globals.get('py_db_read_item');
// 		const result = py_db_read_item_func(itemName, key);
// 		return JSON.parse(result);
// 	});
// }
//
// export function dbUpdate(itemName: string, items: any) {
// 	return checkPyScriptReady(() => {
// 		const py_db_update_func = pyscript.interpreter.globals.get('py_db_update');
// 		const result = py_db_update_func(itemName, JSON.stringify(items));
// 		return JSON.parse(result);
// 	});
// }
//
// export function dbUpdateItem(itemName: string, key: string, item: any) {
// 	return checkPyScriptReady(() => {
// 		const py_db_update_item_func = pyscript.interpreter.globals.get('py_db_update_item');
// 		const result = py_db_update_item_func(itemName, key, JSON.stringify(item));
// 		return JSON.parse(result);
// 	});
// }
//
// export function dbDelete(itemName: string, item_id: string | number) {
// 	return checkPyScriptReady(() => {
// 		const py_db_delete_func = pyscript.interpreter.globals.get('py_db_delete');
// 		const result = py_db_delete_func(itemName, item_id);
// 		return JSON.parse(result);
// 	});
// }

export {};
