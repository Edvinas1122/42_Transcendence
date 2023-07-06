import '@/public/globals.css'
import '@/public/layout.css'
import { Providers } from '@/components/Providers'
// import Sidebar from '@/components/GeneralUI/Sidebar'
import EventPopUp from '@/components/EventsInfoUI/EventsInfo'



export default function DashboardLayout(
{
	children
}: {
	children: React.ReactNode,
})
{
	return (
		<>
			<Providers>
					<div className="MainDisplay">
						{children}
					</div>
			</Providers>
		</>
	)
}
