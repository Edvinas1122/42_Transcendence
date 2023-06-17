import { cookies } from 'next/headers';

async function fetchWithToken<T>(uri: string, cache_interval: number = 1): Promise<T> {
    const fullUrl = "http://nest-app:3000" + uri;
	const cookieStore = cookies();
	const cookie = cookieStore.get('access_token');

	if (!cookie) {
		throw new Error('No cookie found');
	}
	const headers = {
		'Authorization': `Bearer ${cookie.value}`, // set 'Cookie' header to a string
	};

	const response = await fetch(fullUrl, { headers: headers, next: { revalidate: cache_interval } });
	if (!response.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch data')
	  }
	return response.json();
}

export default fetchWithToken;
