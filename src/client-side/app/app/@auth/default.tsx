"use client";
import "@/public/layout.css"
import { AuthCodeDTO } from "@/lib/DTO/AuthData";
import { useRouter, useSearchParams } from 'next/navigation';
import { ft_fetch } from "@/lib/fetch.util";
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import {SpinnerLoader2} from "@/components/GeneralUI/Loader";
import "./Auth.css"

const ButtonWithLink = ({
	link,
	text,
}: {
	link: string,
	text?: string,
}) => {
	const router = useRouter();

	return (
		<button onClick={() => router.push(link)}>
			{text ? text : "Open Link"}
		</button>
	);
}

const FetchButton = ({
	link,
	text,
}: {
	link: string,
	text?: string,
}) => {
	const router = useRouter();

	return (
		<button onClick={() => router.push(link)}>
			{text ? text : "Open Link"}
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

const ErrorComponent = () => (
	<div>
		<h2>Error: Authorization failed</h2>
	</div>
);

const Loading = () => (
	<div className="Loading">
	<div
		className="Buttons"
		style={{
		height: '10em',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		}}
	>
		<h2>Authorizing ...</h2>
		<SpinnerLoader2 />
	</div>
	</div>
);

const Buttons = ({ intraLink, devLink, dev2faLink }:
	{ intraLink: string, devLink: string, dev2faLink: string }
) => (
	<div className="Buttons">
	<h2>Sign In with Intra</h2>
	<ButtonWithLink link={intraLink} text="Sign In" />
	{process.env.NEXT_PUBLIC_DEV === 'true' && (
		<>
		<h2>Developer Temp User Login</h2>
		<ButtonWithLink link={devLink} text="Dev Insta" />
		<h2>Developer 2FA Login</h2>
		<ButtonWithLink link={dev2faLink} text="Test 2FA" />
		</>
	)}
	</div>
);

const UserProfile = ({ user }: { user: AuthorizedIntraUser }) => (
	<div className="UserProfile">
	  <h2>Welcome, {user.name}</h2>
	  <div className="ImageDisplay">
		<div className="ImageFrame">
		<img src={user.image} alt={`${user.user} avatar`} loading="lazy" />
		</div>
	  </div>
	</div>
  );


interface AuthorizedIntraUser {
	sucess: boolean;
	user: string;
	name: string;
	image: string;
	secret: string;
	error?: string;
}


const AuthPage = () => {

	const [loading, setLoading] = useState<boolean>(false);
	const [authorised, setAuthorised] = useState<AuthorizedIntraUser | null>(null);
	const intraLink: string = process.env.NEXT_PUBLIC_INTRA_LINL ? process.env.NEXT_PUBLIC_INTRA_LINL : "";
	const devLink: string = "/api/auth/";
	const dev2faLink: string = "/twofa/";
	const searchParams = useSearchParams();
	const router = useRouter();
	const search = searchParams.get('code');

	useEffect(() => {
		if (search) {
			setLoading(true);
			const auth = async () => {
				try {
					const response = await fetch(`/api/auth/?code=${search}`, {
						method: "GET"
					});
					const data = await response.json();
					if (data.sucess) {
						setAuthorised(data);
						if (data.HAS_2_FA) {
							// const second_request = await fetch(`/api/auth/`, {
							// 	method: "POST",
							// 	body: JSON.stringify(data.retrieve)
							// });
						} else {
							router.push("/user");
						}
					}
				} catch (error) {
					console.log("Error:", error);
				}
				setLoading(false);
			}
			auth();
		}
	}, [search]);

	return (
		<div className="AuthPage Display">
		  <div className="Component">
			<h1>Ping Gop</h1>
			<p>
			  <em>by Deep thought architects...</em>
			</p>
			{search !== "" ? (
			  loading ? (
				<Loading />
			  ) : authorised ? (
				<UserProfile user={authorised} />
			  ) : (
				  <Buttons intraLink={intraLink} devLink={devLink} dev2faLink={dev2faLink} />
				  )
			) : (
				<ErrorComponent />
			)}
		  </div>
		</div>
	  );
	
}
  
export default AuthPage;