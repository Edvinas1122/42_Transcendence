"use server";
import { getToken } from './token.util';

export const setToken = async () => {
	return(getToken());
}

export const serverFetch = async <T = any>(
    uri: string, 
    method: "GET" | "POST" | "DELETE" = "GET", 
    params?: any, 
    body?: any,
): Promise<T> => {
    "use server";
    return await fetchWithToken<T>(uri, null, params, method, body);
}

export const serverFetchSerialized = async <T = any>({
	uri,
	revalidate_interval = null,
	headers,
	method,
	body,
}: {
	uri: string;
	revalidate_interval?: number | null;
	headers?: any;
	method?: "GET" | "POST" | "DELETE";
	body?: any;
}): Promise<Response> => {
	"use server";
	const cookie = getToken();
	const options: RequestInit = {
		headers: {...headers,
			'Authorization': `Bearer ${cookie}`,
		},
		method: method,
		body: body,
		cache: 'no-store',
	};
	const fullUrl = "http://nest-app:3000" + uri;
	const response = await fetch(fullUrl, options);
	return await response.json();
}

async function fetchWithToken<T = any>(
	uri: string,
	revalidate_interval: number | null = null,
	params?: {},
	method: "GET" | "POST" | "DELETE" = "GET",
	body?: any,
): Promise<T> {

	const fullUrl = "http://nest-app:3000" + uri;
	let cookie;
	if (process.env.NEXT_PUBLIC_DEV === 'true') {
		cookie = getToken();
	} else {
		cookie = getToken();
	}

	if (!cookie) {
		throw new Error('Unauthorized');
	}
	const headers = {
		'Authorization': `Bearer ${cookie}`,
		...params
	};

	let options: RequestInit = {
		headers: headers,
		method: method,
		body: body,
	};

	if (revalidate_interval === null) {
		options = { ...options, cache: 'no-store' };
	} else {
		options = { ...options, next: { revalidate: revalidate_interval }  };
	}

	console.log("fetching with token", options);

	const response: Response = await fetch(fullUrl, options);

	return response.json();
}

async function ft_fetch<T>(uri: string, revalidate_interval: number | null = null): Promise<T> {
	const fullUrl = "http://nest-app:3000" + uri;


	let options: RequestInit = { };

	if (revalidate_interval === null) {
		options = { ...options, cache: 'no-store' };
	} else {
		options = { ...options, next: { revalidate: revalidate_interval }  };
	}

	const response = await fetch(fullUrl, options);
	if (!response.ok) {
		console.log(response.statusText);
		throw new Error('Failed to fetch data')
	}
	return response.json();
}

export default fetchWithToken;
export { ft_fetch };