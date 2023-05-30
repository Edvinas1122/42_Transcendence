import Cookies from 'js-cookie';

/*
    provides a fetch function with a token
*/
const fetchWithToken = async (service: string): Promise<any> => {
    const token: string | undefined = Cookies.get('access_token');

    if (!token) {
        throw new Error('Token not found');
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}${service}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data;
}

export default fetchWithToken;