import Image from 'next/image'
// import MyComponent from '../components/myComponent'
import Profile from '../components/myComponent'
import CookieTestButton, {OAuthCallback} from '../components/auth'


export default function Home() {
	return (
		// <h1>Page</h1>
		// <MyComponent />
		<div>
			<Profile />
			<OAuthCallback />
			<CookieTestButton />
			{/* <Image
				src="/images/profile.jpg"
				alt="Picture of the author"
				width={500}
				height={500}
			/> */}
		</div>
	)
}