'use client'; // Error components must be Client Components
 
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
 
export default function Error({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	useEffect(() => {
		console.error(error)
	}, [error])
	
	// const errorObject = JSON.parse(error.message);

	return (
		<div className="Error Display">
		<h1>{error.message}</h1>
		{/* <h2>{errorObject.error}</h2> */}
		{/* <p>{errorObject.message}</p> */}
		{/* <button onClick={() => reset()}>
			Try again
		</button> */}
		</div>
	)
}