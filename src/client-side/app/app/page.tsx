import Image from 'next/image'
// import MyComponent from '../components/myComponent'
import UserProfile, { AllUsers } from '../components/Profiles'
import AutoAuthGarant from '../components/auth/auth'
import { SocketProvider } from '@/components/socket/socket'
import Notifications from '@/components/notifications/notifications'
import FriendsMenu from '@/components/friends/FriendsMenu'

export default function Home() {
	return (
		// <h1>Page</h1>
		<div>
			<AutoAuthGarant />
			{/* <UserProfile /> */}
			<FriendsMenu />
			{/* <AllUsers /> */}
			<SocketProvider>
				<Notifications />
			</SocketProvider>
		</div>
	)
}