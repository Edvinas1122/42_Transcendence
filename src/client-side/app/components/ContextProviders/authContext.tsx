"use client";

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
export interface AuthContextType {
	token: string | null;
	id: number | null;
}

export const AuthContext = createContext<AuthContextType>({
	token: null,
	id: null,
});

const getTokensId = (token: string): number => {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace('-', '+').replace('_', '/');
	const decodedToken = JSON.parse(window.atob(base64));
	return decodedToken['id'];
};

const getCookie = (name: string): string | null => {
	const cookies = document.cookie.split(';');
	const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
	if (cookie) {
		return cookie.split('=')[1];
	}
	return null;
}


export const AuthProvider = ({ children }: { children?: ReactNode }) => {

	const [token, setToken] = useState<string | null>(null);
	const [id, setId] = useState<number | null>(null);

	useEffect(() => {
		const token = getCookie('access_token');
		if (token) {
			setToken(token);
			setId(getTokensId(token));
		}
	}, [setToken, setId]);


	return (
	  <AuthContext.Provider value={{token, id}}>
		{children}
	  </AuthContext.Provider>
	);
};
