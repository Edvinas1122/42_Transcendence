'use client'
 
// import { ThemeProvider } from 'acme-theme'
import { AuthProvider } from '@/app/context/authContext'
import { AppDataProvider } from '@/app/context/appDataProvider'
 
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <ThemeProvider>
      	<AuthProvider>
			<AppDataProvider>
				{children}
			</AppDataProvider>
		</AuthProvider>
    // </ThemeProvider>
  )
}