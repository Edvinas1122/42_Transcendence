'use client';

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
		<div>
			<h1>Sign In with Intra</h1>
			<ButtonWithLink link={intraLink} />
			<h1>Developer Temp User Login</h1>
			<ButtonWithLink  link={devLink} />
		</div>
	);
  }
  
export default AuthPage;