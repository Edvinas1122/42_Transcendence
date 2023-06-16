import Chat from "@/app/components/Chat/Chat";

export default function ChatsLayout({
	children,
}: {
	children: React.ReactNode
})
{
	return (
		<section>
			<Chat />
			{children}
		</section>
	);
}