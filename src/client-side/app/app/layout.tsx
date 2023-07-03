import '@/public/globals.css'
import '@/public/layout.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import Sidebar from '../components/GeneralUI/Sidebar'
import EventPopUp from '@/components/EventsInfoUI/EventsInfo'
import validateUser from '@/components/Auth/auth.utils'


const inter = Inter({ 
	subsets: ['latin'],
})

export const metadata = {
	title: '42 Transcendence',
	description: 'Learning project for 42 students',
}

export default async function RootLayout(props: {
	children: React.ReactNode,
	auth: React.ReactNode,
	sidebar: React.ReactNode,
})
{
	const loggedIn = await validateUser('/auth/validate');

	console.log("logged in status", loggedIn);
	return (
		<html lang="en">
			<body className={inter.className}>
			<div className="MainWrapper">
				{loggedIn ? props.sidebar : null}
				{loggedIn ? props.children : props.auth}
			</div>
			</body>
		</html>
	)
}
