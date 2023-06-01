import Image from 'next/image'
// import MyComponent from '../components/myComponent'
import UserProfile, { AllUsers } from '../components/Profiles'
import AutoAuthGarant from '../components/auth/auth'
import NotificationComponent from '@/components/socket/notifications'

export default function Home() {
	return (
		// <h1>Page</h1>
		<div>
			<AutoAuthGarant />
			<UserProfile />
			<AllUsers/>
			<NotificationComponent />
		</div>
	)
}