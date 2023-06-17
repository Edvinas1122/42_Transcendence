"use client";

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
// import Cookies from 'js-cookie';

class tokenObject {
	constructor(accessToken: string, id: number) {
		this.accessToken = accessToken;
		this.id = id;
	}
	accessToken: string;
	id: number;
}

export interface AuthorizedFetchContextType {
	fetchWithToken: (service: string, requestOptions?: any) => Promise<Response>;
	loading: boolean;
	token: tokenObject | null;
}


export const AuthorizedFetchContext = createContext<AuthorizedFetchContextType>({
	fetchWithToken: () => new Promise(() => {}),
	loading: true,
	token: null,
});

const getTokensId = (token: string): number => {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace('-', '+').replace('_', '/');
	const decodedToken = JSON.parse(window.atob(base64));
	return decodedToken['id'];
};

// Create a provider for components to consume and subscribe to changes
export const AuthProvider = ({ children }: { children?: ReactNode }) => {
	const [token, setToken] = useState<tokenObject | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	
	useEffect(() => {
		const fetchToken = async () => {
			let newToken: string | undefined = undefined;
			try {
				if (process.env.NEXT_PUBLIC_DEV === 'true') {
					console.log("Dev token getting");
					const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/auth/DevToken`);
					const data = await response.json();
					newToken = data.accessToken;
				} else {
					// newToken = Cookies.get('access_token');// resolve later
					newToken = "fewfewf";
				}
				if (newToken === undefined)
					throw new Error('Token not found');
				setToken(new tokenObject(newToken, getTokensId(newToken)));
				setLoading(false);
			} catch (error) {
				console.error('Failed to fetch the token:', error);
			}
		};
		if (token === null)
			fetchToken();
	}, [token]);
  

	const fetchWithToken = useCallback(async (service: string, requestOptions: RequestInit = {}): Promise<Response> => {
		if (!token) {
			throw new Error('No token found');
		}

		// const agent = new https.Agent({
		// 	rejectUnauthorized: false
		// });
		const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}${service}`, {
			...requestOptions, // spread in requestOptions
			headers: {
				...requestOptions.headers, // spread in existing headers
				'Authorization': `Bearer ${token.accessToken}`
			},
			// body: null,
			// agent: agent
		});
	
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response;
	}, [token]);


	return (
	  <AuthorizedFetchContext.Provider value={{fetchWithToken, loading, token}}>
		{children}
	  </AuthorizedFetchContext.Provider>
	);
};
