import { serverFetch } from "./fetch.util";


export const useServerFetch = async <T = any>(
	uri: string,
	method: "GET" | "POST" | "DELETE" = "GET",
	params?: {},
	body?: any,
): Promise<T> => {
	
	const response =  await serverFetch(uri, method, params, body);
	// if (!response.ok) {
	// 	const responseBody = await response.json();
	// 	if (response.status === 401) { // consider returning without throwing
	// 		throw new Error(JSON.stringify(responseBody));
	// 	}
	// 	throw new Error(JSON.stringify(responseBody));
	// }
	return await response.json();

}