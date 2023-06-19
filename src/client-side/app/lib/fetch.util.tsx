import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'

async function fetchWithToken<T>(uri: string, revalidate_interval: number | null = null): Promise<T> {
    const fullUrl = "http://nest-app:3000" + uri;
    const cookieStore = cookies();
    const cookie = cookieStore.get('access_token');

    if (!cookie) {
        redirect('/auth');
        // throw new Error('Unauthorized');
    }
    const headers = {
        'Authorization': `Bearer ${cookie.value}`,
    };

    let options: RequestInit = { headers: headers };

    if (revalidate_interval === null) {
        options = { ...options, cache: 'no-store' };
    } else {
		options = { ...options, next: { revalidate: revalidate_interval }  };
	}

    const response = await fetch(fullUrl, options);
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch data')
    }
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
        throw new Error('Failed to fetch data')
    }
    return response.json();
}

export default fetchWithToken;
export { ft_fetch };