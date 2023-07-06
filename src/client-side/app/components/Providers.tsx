'use client'
 
// import { ThemeProvider } from 'acme-theme'
import { EventSourceProvider } from './ContextProviders/eventContext';
import { AuthProvider } from './ContextProviders/authContext';
import { ConfirmationProvider } from './confirmationDialog/Confirmation';
 
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <ThemeProvider>
      	<AuthProvider>
			<EventSourceProvider>
				<ConfirmationProvider>
					{children}
				</ConfirmationProvider>
			</EventSourceProvider>
		</AuthProvider>
    // </ThemeProvider>
  )
}