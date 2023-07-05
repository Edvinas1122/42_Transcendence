"use client";
import "@/public/layout.css"
import { AuthCodeDTO } from "@/lib/DTO/AuthData";
import { useRouter } from 'next/navigation';
import { ft_fetch } from "@/lib/fetch.util";
import Link from 'next/link'
import React, { useState } from 'react';

const ButtonWithLink = ({ link }: {link: string}) => {
  const router = useRouter();

  return (
    <button onClick={() => router.push(link)}>
    	Open Link
    </button>
  );
}

function ActiveLink({href}: {href: string}) {
	const router = useRouter();
	const [token, setToken] = useState<AuthCodeDTO>({accessToken: undefined, id: ""});

	const fetchCode = async () => {
		let code: AuthCodeDTO;
		try {
			code = await ft_fetch("/auth/DevUser2FA/");
			setToken(code);
		} catch (error) {
			console.log("Error:", error);
		}
		
	}
   
	const handleClick = async () => {
	  	// e.preventDefault()
	  	await fetchCode();
		if (token.accessToken !== undefined) {
	  		router.push(href + token.id);
		} else {
			console.log("gufhdhug");
		}
	}
   
	return (
	  <button onClick={handleClick}>
		Open Link
	  </button>
	)
  }


const AuthPage = () => {

	const intraLink: string = process.env.NEXT_PUBLIC_INTRA_LINL ? process.env.NEXT_PUBLIC_INTRA_LINL : "";
	const devLink: string = "/api/auth/";
	const dev2faLink: string = "/twofa/";


	return (
		<div className="Display">
			<div className ="Component">
			<h1>Log In</h1>
			<h2>Sign In with Intra</h2>
			<ButtonWithLink link={intraLink} />
			<h2>Developer Temp User Login</h2>
			<ButtonWithLink  link={devLink} />
			<h2>Developer 2FA Login</h2>
			<ButtonWithLink link={dev2faLink} />
			</div>
		</div>
	);
  }
  
export default AuthPage;