import "@/public/layout.css"

export default function  ChatsLayout({
	children,
}: {
	children: React.ReactNode
})
{
	return (
		<div className="Segment">
			{children}
		</div>
	);
}
