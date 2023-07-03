'use client'
 
// import { ThemeProvider } from 'acme-theme'
import { EventSourceProvider } from './ContextProviders/eventContext'
import { AuthProvider } from './ContextProviders/authContext'
 
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <ThemeProvider>
      	<AuthProvider>
			<EventSourceProvider>
				{children}
			</EventSourceProvider>
		</AuthProvider>
    // </ThemeProvider>
  )
}