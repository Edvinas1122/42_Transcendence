import Image from 'next/image'
// import MyComponent from '../components/myComponent'
import UserProfile from '../components/Profiles'
import AutoAuthGarant from '../components/auth/auth'


export default function Home() {
	return (
		// <h1>Page</h1>
		<div>
			<AutoAuthGarant />
			<UserProfile />
			{/* <OAuthCallback /> */}
			{/* <Image
				src="/images/profile.jpg"
				alt="Picture of the author"
				width={500}
				height={500}
			/> */}
		</div>
	)
}