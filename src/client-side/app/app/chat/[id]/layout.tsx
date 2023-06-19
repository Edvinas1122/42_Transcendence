import "@/public/layout.css"

export default function  ChatsLayout({
	children,
}: {
	children: React.ReactNode
})
{
	return (
		<div>
			{children}
		</div>
	);
}