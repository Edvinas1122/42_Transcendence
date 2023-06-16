import { Metadata } from 'next'
import { cookies } from 'next/headers'
// import https from 'https';
import PersonalProfile from './components/UserProfile/Profiles';
import '@/public/globals.css'
 
export const metadata: Metadata = {
	title: 'My Page Title',
}

export default function Page() {


	return (
		<div>
		<h1>My Page</h1>
		<PersonalProfile />
		</div>
	);
}
