"use client";
import "@/public/layout.css";
import { AuthCodeDTO } from "@/lib/DTO/AuthData";
import { useRouter, useSearchParams } from 'next/navigation';
import { ft_fetch } from "@/lib/fetch.util";
import React, { useState, useEffect } from 'react';
import { SpinnerLoader2 } from "@/components/GeneralUI/Loader";
import { CodeFormComponent } from "@/components/QRAuth/codeSubmit";
import Image from 'next/image';
import SetPreferences from "@/components/PreferencesUI/UserPreferences";
import "./Auth.css";


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

const ErrorComponent = (
	{ reason }: { reason?: string }
) => (
	<div>
		<h2>{reason? reason : "Error: Authorization failed"}</h2>
	</div>
);

const Loading = ({
	reason
}:{
	reason?: string
}
) => (
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
		<h2>{reason? reason : "Authorizing" + "..."}</h2>
		<SpinnerLoader2 />
	</div>
	</div>
);

const Buttons = ({ intraLink, devLink  }:
	{ intraLink: string, devLink: string }
) => (
	<div className="Buttons">
	<h2>Sign In with Intra</h2>
	<ButtonWithLink link={intraLink} text="Sign In" />
	{process.env.NEXT_PUBLIC_DEV === 'true' && (
		<>
		<h2>Developer Temp User Login</h2>
		<ButtonWithLink link={devLink} text="Dev Insta" />
		</>
	)}
	</div>
);

const UserProfile = ({ user }: { user: AuthorizedIntraUser }) => (
	<div className="UserProfile">
	  <h2>Welcome, {user.name}</h2>
	  <div className="ImageDisplay">
		<div className="ImageFrame">
		<Image 
			src={user.image}
			alt={`${user.user} avatar`}
			width={300}
			height={300}
			placeholder={"blur"}
			blurDataURL={user.micro_image}
		/>
		</div>
	  </div>
	</div>
  );


interface AuthorizedIntraUser {
	sucess: boolean;
	user: string;
	name: string;
	image: string;
	micro_image: string;
	secret: string;
	error?: string;
}

interface RetrieveCall {
	retrieve: string;
	id: number;
}

const AuthPage: React.FC = () => {

	const [loading, setLoading] = useState<boolean | string>(false);
	const [authorised, setAuthorised] = useState<AuthorizedIntraUser | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [timer, setTimer] = useState<number>(0);
	const [codeDisplay, setCodeDisplay] = useState<RetrieveCall>(
		{
			retrieve: "",
			id: 0,
		}
	);
	const intraLink: string = process.env.NEXT_PUBLIC_INTRA_LINK? process.env.NEXT_PUBLIC_INTRA_LINK : "";
	const devLink: string = "/api/dev/";

	const searchParams = useSearchParams();
	const router = useRouter();
	const search = searchParams.get('code');

	const authorizedRedirect = () => {
		setTimer(0);
		setError(null);
		// setLoading("redirecting");
		window.location.href = "/user";
	}

	useEffect(() => {
		let countdown: NodeJS.Timeout;

		if (codeDisplay.retrieve !== "") {
		setTimer(120);
		countdown = setInterval(() => {
			setTimer(prev => prev > 0 ? prev - 1 : 0);
		}, 1000);
		}

		return () => {
		if (countdown) {
			clearInterval(countdown);
		}
		};
	}, [codeDisplay.retrieve]);

	useEffect(() => {
		if (timer === 0 && codeDisplay.retrieve !== "") {
		setCodeDisplay({
			retrieve: "",
			id: 0,
		});
		setAuthorised(null);  
		}
	}, [timer]);

	useEffect(() => {
		if (search) {
			setLoading(true);
			const auth = async () => {
				try {
					const response = await fetch(`/api/auth/?code=${search}`, {
						method: "GET"
					});
					const data = await response.json();
					console.log("data", data);
					if (data.sucess) {
						setAuthorised(data);
						console.log("2FA", data);
						if (data?.two_fa === true) {
							setCodeDisplay({
								retrieve: data.retrieve,
								id: data.id
							});
						} else {
							setTimeout(() => {
								authorizedRedirect();
							}, 1000);
						}
					} else {
						setError("Error: " + data.message);
						router.replace("/");
						setTimeout(() => {
							setError(null);
						}, 2000);
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
						<Loading 
							reason={typeof loading === "string" ? loading : undefined}
						/>
					) : (
						authorised ? (
							<>
								<UserProfile user={authorised} />
								<div className="Buttons">
								{codeDisplay.retrieve !== "" && (
									<>
									<p>You have {timer} seconds to authorize.</p>
									<CodeFormComponent
										retrieve={codeDisplay.retrieve}
										id={codeDisplay.id}
										authorizedRedirect={authorizedRedirect}
										/> 
									</>
								)}
								</div>
							</>
						) : ( error ? (
							<ErrorComponent
								reason={error}
							/>
						): (
							<Buttons intraLink={intraLink} devLink={devLink} />
						))
					)) : (
						<ErrorComponent />
				)}
			</div>
		</div>
	);
}
  
export default AuthPage;