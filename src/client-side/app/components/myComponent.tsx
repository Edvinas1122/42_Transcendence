"use client"; // This is a client component 👈🏽

import { useState, useEffect } from 'react';

function Profile() {
	const [data, setData] = useState<any[]>([]);
	const [isLoading, setLoading] = useState(false);
		
	useEffect(() => {
		setLoading(true);
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/users/all`,
			{
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					'Autorization': 'Bearer ' + localStorage.getItem('accessToken'),
				}
			})
		.then((res) => {
			console.log('Response object:', res);
			console.log('Response status:', res.status);
			console.log('Response headers:', res.headers);
			//...any other inspection you'd like to do.

			if (!res.ok) { // if HTTP-status is not 200-299
			// get the error message from the server, or a default message
			throw new Error(res.statusText || 'Unknown error occurred');
			}
			return res.json();
		})
		.then((data) => {
			console.log('Response data:', data);
			setData(data);
			setLoading(false);
		})
		.catch((error) => {
			console.error('Error occurred:', error.message);
			setLoading(false);
		});
	}, []);

	if (isLoading) return <p>Loading...</p>;
	if (!data) return <p>No profile data</p>;
 
	return (
		<div>
			{data.map((item) => (
				<h1 key={item.id}>{item.name}</h1>
			))}
		</div>
	);
}

export default Profile;
