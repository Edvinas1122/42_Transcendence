'use client'

import React, {useContext} from 'react'

export default function GlobalError({
		error,
		reset,
	}: {
		error: Error
		reset: () => void
}) {


	if (error.message === 'Unauthorized') {
		return (
			<html>
			<body>
				<h2>Not logged in!</h2>
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