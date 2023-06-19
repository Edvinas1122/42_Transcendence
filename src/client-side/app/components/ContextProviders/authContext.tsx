"use client";

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import Router from 'next/router';
import { redirect } from 'next/navigation'


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

export interface LoginContextType {
	login: () => Promise<void>;
	logout: () => void;
	loading: boolean;
}

export const LoginContext = createContext<LoginContextType>({
	login: () => new Promise(() => {}),
	logout: () => {},
	loading: true,
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
	
	const Login = useCallback(async () => {
		Router.push('/about'); 
	}, []);

	const fetchToken = useCallback(async () => {
		try {
			const response = await fetch(`http://localhost:3030/api/auth/`);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (!data || !data.token) {
				throw new Error("Token not received from API");
			}

			return data;

		} catch (error) {
			console.error(error);
			throw error;
		}
	}, []);
	

	useEffect(() => {
		if (token) {
			setLoading(false);
		}
		else {
			fetchToken().then((token) => {
				if (token && token.token) {
					setToken(new tokenObject(token.token.accessToken, getTokensId(token.token.accessToken)));
				}
				setLoading(false);
			}).catch((error) => {
				console.error(error);
				setLoading(false);
			});
		}
	}, [token, Login]);


	const fetchWithToken = useCallback(async (service: string, requestOptions: RequestInit = {}): Promise<Response> => {
		if (!token) {
			// Router.push('/about');
			throw new Error('Unauthorized');
		}

		const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}${service}`, {
			...requestOptions, // spread in requestOptions
			headers: {
				...requestOptions.headers, // spread in existing headers
				'Authorization': `Bearer ${token.accessToken}`
			},
		});
	
		console.log(token.accessToken);
		if (!response.ok) {
			if (response.status === 401) {
				Router.push('/auth'); 
			}
			console.log(response.status);
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
