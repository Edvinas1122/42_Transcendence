'use client'
 
// import { ThemeProvider } from 'acme-theme'
import { AuthProvider } from '@/components/ContextProviders/authContext'
import { AppDataProvider } from '@/components/ContextProviders/appDataProvider'
 
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