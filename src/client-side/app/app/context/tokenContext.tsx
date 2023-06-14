import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Create a new Context
export const TokenContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const TokenProvider = ({ children }) => {
	const [token, setToken] = useState(null);

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
					newToken = Cookies.get('access_token');
				}
				console.log('received token', newToken);
				setToken(newToken);
			} catch (error) {
				console.error('Failed to fetch the token:', error);
			}
		};
		fetchToken();
	}, []);
  
	return (
	  <TokenContext.Provider value={[token, setToken]}>
		{children}
	  </TokenContext.Provider>
	);
  };