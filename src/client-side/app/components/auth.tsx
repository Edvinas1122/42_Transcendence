"use client"; // This is a client component 👈🏽

import React from 'react';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const getTokenAndSetCookie = async (tokenAccessInquiryId: string): Promise<void> => {
    const response = await fetch(`http://localhost:3000/auth/token?tmp_id=${tokenAccessInquiryId}`);
    const data: {token: string} = await response.json();
    const token = data.token;

    // Set the cookie that expires in 7 days
	console.log('Setting cookie...' + token);
    // Cookies.set('access_token', token, { expires: 1 });
}

const OAuthCallback: React.FC = () => {
	useEffect(() => {
	  const url = new URL(window.location.href);
	  const tokenAccessInquiryId = url.searchParams.get('retrieveToken');
	
	  if (tokenAccessInquiryId) {
		getTokenAndSetCookie(tokenAccessInquiryId);
	  }
	}, []);
};

const CookieTestButton: React.FC = () => {
	const checkCookie = () => {
	  const cookies = document.cookie; // Get all cookies as a string
	  const cookieExists = cookies.includes('access_token'); // Check if 'myCookie' is present in the string
  
	  if (cookieExists) {
		console.log('Cookie exists!');
	  } else {
		console.log('Cookie does not exist.');
		const url = process.env.NEXT_PUBLIC_INTRA_LINL;
		window.open(url, '_self');
	  }
	};
  
	return (
	  <div>
		<button onClick={checkCookie}>Check Cookie</button>
	  </div>
	);
  };
  
export default CookieTestButton;
export {OAuthCallback};
