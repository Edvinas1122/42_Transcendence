// import Cookies from 'js-cookie';
import React, { useContext } from 'react';
import { TokenContext } from '../context/tokenContext';

const fetchWithToken = async (service: string, token: string, requestOptions = {}): Promise<Response> => {
	// const token: string | undefined = useContext(TokenContext);

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