import Cookies from 'js-cookie';

const fetchWithToken = async (service: string, requestOptions = {}): Promise<Response> => {
    const token: string | undefined = Cookies.get('access_token');

    if (!token) {
        throw new Error('Token not found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}${service}`, {
        ...requestOptions, // spread in requestOptions
        headers: {
            ...requestOptions.headers, // spread in existing headers
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
};

export default fetchWithToken;