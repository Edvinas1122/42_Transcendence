import Image from 'next/image'
// import MyComponent from '../components/myComponent'
import UserProfile, { AllUsers } from '../components/Profiles'
import AutoAuthGarant from '../components/auth/auth'
import { SocketProvider } from '@/components/socket/socket'
import Notifications from '@/components/notifications/notifications'
import Chat, { CreateChat } from '@/components/chat/Chat'
import Navigation from '@/components/RouteDemo'
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

export default function Home({ Component, pageProps }) {
	return (
		// <h1>Page</h1>
		<div>
			<AutoAuthGarant />
			<UserProfile />
			<AllUsers />
			<SocketProvider>
				<Notifications />
			</SocketProvider>
			<Chat />
			<CreateChat />

			<Navigation />
		</div>
	)
}