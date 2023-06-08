import AutoAuthGarant from "@/components/auth/auth";

// const logIn = () => {
// 	const url = process.env.NEXT_PUBLIC_INTRA_LINL;
// 	window.open(url, '_self');
// }

const Auth = () => {
	const url = process.env.NEXT_PUBLIC_INTRA_LINL;

	return (
		<div>
			<AutoAuthGarant />
			<h1>Welcome to the Auth Page</h1>
			{/* <button onClick= >Log In</button> */}
		</div>
	);
}

export default Auth;