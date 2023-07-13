'use client'
 
// import { ThemeProvider } from 'acme-theme'
import { EventSourceProvider } from './ContextProviders/eventContext';
import { AuthProvider } from './ContextProviders/authContext';
import { ConfirmationProvider } from './confirmationDialog/Confirmation';
import { GameInvite } from './GameInvite';
import { ChatEventProvider } from "@/components/ChatUI/ChatEventProvider";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <ThemeProvider>
      	<AuthProvider>
			<ConfirmationProvider>
				<EventSourceProvider>
					<GameInvite/>
					<ChatEventProvider>
					{children}
					</ChatEventProvider>
				</EventSourceProvider>
			</ConfirmationProvider>
		</AuthProvider>
    // </ThemeProvider>
  )
}