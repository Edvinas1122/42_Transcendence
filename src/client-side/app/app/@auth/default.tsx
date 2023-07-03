"use client";
import "@/public/layout.css"

import { useRouter } from 'next/navigation';

const ButtonWithLink = ({ link }: {link: string}) => {
  const router = useRouter();

  return (
    <button onClick={() => router.push(link)}>
    	Open Link
    </button>
  );
}


const AuthPage = () => {

	const intraLink: string = process.env.NEXT_PUBLIC_INTRA_LINL ? process.env.NEXT_PUBLIC_INTRA_LINL : "";
	const devLink: string = "/api/auth/";

	return (
		<div className="Display">
			<div className ="Component">
			<h1>Log In</h1>
			<h2>Sign In with Intra</h2>
			<ButtonWithLink link={intraLink} />
			<h2>Developer Temp User Login</h2>
			<ButtonWithLink  link={devLink} />
			</div>
		</div>
	);
  }
  
export default AuthPage;