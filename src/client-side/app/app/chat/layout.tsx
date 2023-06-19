import ChatUI from "./ChatUI";

export default function	ChatsLayout({
	children,
}: {
	children: React.ReactNode
})
{
	return (
		<section>
			<ChatUI />
			{children}
		</section>
	);
}