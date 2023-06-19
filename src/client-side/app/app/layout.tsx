import '@/public/globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import Sidebar from './Sidebar'


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
				<Sidebar />
					{children}
				</Providers>
			</body>
		</html>
	)
}
