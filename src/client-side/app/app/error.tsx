'use client'

import React, {useContext} from 'react'
import { LoginContext } from '@/components/ContextProviders/authContext'


export default function GlobalError({
		error,
		reset,
	}: {
		error: Error
		reset: () => void
}) {

	const {login} = useContext(LoginContext);

	const loginButton = () => {
		login();
	}

	if (error.message === 'Unauthorized') {
		return (
			<html>
			<body>
				<h2>Not logged in!</h2>
				<button onClick={loginButton}>Login</button>
			</body>
			</html>
		)
	} else {
		return (
			<html>
			<body>
				<h2>Something went wrong!</h2>
				<button onClick={() => reset()}>Try again</button>
			</body>
			</html>
		)
	}
}