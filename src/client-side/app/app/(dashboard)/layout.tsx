import '@/public/globals.css'
import '@/public/layout.css'
import { Providers } from '@/components/Providers'
// import Sidebar from '@/components/GeneralUI/Sidebar'



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
