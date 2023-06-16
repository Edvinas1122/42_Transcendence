import '@/public/globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './Providers'
import Sidebar from './Sidebar'


const inter = Inter({ 
	subsets: ['latin'],
})

export const metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
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
