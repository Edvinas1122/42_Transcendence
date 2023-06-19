import '@/public/globals.css'
import '@/public/layout.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import Sidebar from '../components/GeneralUI/Sidebar'
import EventPopUp from '@/components/EventsInfoUI/EventsInfo'


const inter = Inter({ 
	subsets: ['latin'],
})

export const metadata = {
	title: '42 Transcendence',
	description: 'Learning project for 42 students',
}

export default function RootLayout({ children }: { children: React.ReactNode })
{
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<div className="MainWrapper">
						<div className="Sidebar">
							<Sidebar />
						</div>
						<div className="MainDisplay">
							{children}
						</div>
					</div>
				</Providers>
			</body>
		</html>
	)
}
