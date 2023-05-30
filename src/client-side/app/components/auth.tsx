"use client"; // This is a client component 👈🏽

import React from 'react';
import { useEffect } from 'react';

const OAuthCallback: React.FC = () => {
	useEffect(() => {
	  const url = new URL(window.location.href);
	  const tokenAccessInquiryId = url.searchParams.get('retrieveToken');
	
	  if (tokenAccessInquiryId) {
		fetch(`http://localhost:3000/auth/token?tmp_id=${tokenAccessInquiryId}`, {
		  method: 'GET',
		  headers: {
			'Content-Type': 'application/json',
		  },
		})
		.then(res => res.json())
		.then(data => {
			// Handle your token here...

			// Save the token to local storage
			localStorage.setItem('accessToken', data.token);
			console.log(data.token);
		})
		.catch(err => console.error(err)); // Always add error handling
	  }
	}, []);
};

const CookieTestButton: React.FC = () => {
	const checkCookie = () => {
	  const cookies = document.cookie; // Get all cookies as a string
	  const cookieExists = cookies.includes('myCookie'); // Check if 'myCookie' is present in the string
  
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
