'use client'

import React, {useContext} from 'react'


export default function GlobalError({
		error,
		reset,
	}: {
		error: Error
		reset: () => void
}) {


	return (
		<html>
		<body>
			<h1>Chat Room Might not exist</h1>
		</body>
		</html>
	)
}