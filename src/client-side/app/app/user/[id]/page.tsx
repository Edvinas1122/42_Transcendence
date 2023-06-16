import { cookies } from 'next/headers';
import { User } from '@/app/dtos/AppData';

async function getData({ id }: { id: string }) {
    const fullUrl = "http://nest-app:3000" + `/users/profile/${id}`;
	const cookieStore = cookies();
	const cookie = cookieStore.get('access_token');

	const headers = {
		'Authorization': `Bearer ${cookie.value}`, // set 'Cookie' header to a string
	};

	const response = await fetch(fullUrl, { headers: headers, next: { revalidate: 1 } });
	if (!response.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch data')
	  }
	return response.json();
}

const UserPage = async ({ params }: { params: { id: string } }) => {

	const waitingUser = getData(params);
	const user: User = await waitingUser;
	return (
		<div>
			<h1>User Profile {params.id} </h1>
			<h1>
				{user.name}
			</h1>
		</div>
	);
};

export default UserPage;