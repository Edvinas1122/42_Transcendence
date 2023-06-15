import React, { createContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

// Create a new Context
export const AuthorizedFetchContext = createContext();
export const TokenContext = createContext();

const getTokensId = (token: string): number => {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace('-', '+').replace('_', '/');
	const decodedToken = JSON.parse(window.atob(base64));
	return decodedToken['id'];
};

class tokenObject {
	constructor(accessToken: string, id: number) {
		this.accessToken = accessToken;
		this.id = id;
	}
	accessToken: string;
	id: number;
}

// Create a provider for components to consume and subscribe to changes
export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState<tokenObject>();
	const [loading, setLoading] = useState<boolean>(true);


	useEffect(() => {
		fetchToken();
	}, []);
  
	const fetchToken = async () => {
		let newToken: string | undefined = undefined;
		try {
			if (process.env.NEXT_PUBLIC_DEV === 'true')
			{
				console.log("Dev token getting");
				const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/auth/DevToken`, {rejectUnauthorized: false});
				const data = await response.json();
				newToken = data.accessToken;
			} else {
				newToken = Cookies.get('access_token');
			}
			if (newToken === undefined)
				throw new Error('Token not found');
			setToken(new tokenObject(newToken, getTokensId(newToken)));
			setLoading(false);
		} catch (error) {
			console.error('Failed to fetch the token:', error);
		}
	};

	const fetchWithToken = useCallback(async (service: string, requestOptions = {}): Promise<Response> => {
		if (!token) {
			throw new Error('Token not found');
		}

		const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}${service}`, {
			...requestOptions, // spread in requestOptions
			headers: {
				...requestOptions.headers, // spread in existing headers
				'Authorization': `Bearer ${token.accessToken}`
			}
		});
	
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response;
	});


	return (
	  <AuthorizedFetchContext.Provider value={{fetchWithToken, loading, token}}>
		<TokenContext.Provider value={[token, loading]} >
		{children}
		</TokenContext.Provider>
	  </AuthorizedFetchContext.Provider>
	);
};
