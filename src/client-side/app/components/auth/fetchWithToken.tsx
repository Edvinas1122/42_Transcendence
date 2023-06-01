import Cookies from 'js-cookie';

/*
    provides a fetch function with a token
*/
// const fetchWithToken = async (service: string, requestOptions = {}): Promise<any> => {
//     const token: string | undefined = Cookies.get('access_token');

//     if (!token) {
//         throw new Error('Token not found');
//     }

//     const finalOptions = {
//         ...requestOptions,
//         headers: {
//             ...requestOptions.headers,
//             'Authorization': `Bearer ${token}`,
//         },
//     };

//     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}${service}`, finalOptions);

//     const data = await response.json();
//     return data;
// }

const fetchWithToken = async (service: string, requestOptions = {}): Promise<any> => {
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

    const data = await response.json();
    return data;
};

export default fetchWithToken;