import "@/public/layout.css";
import ChatRoomsUI from "@/components/ChatUI/ChatRoomsUI";

export default function	ChatsLayout({
	children,
}: {
	children: React.ReactNode
})
{
	return (
		<section className="Display">
			<div className="Segment">
				<ChatRoomsUI />
			</div>
				{children}
		</section>
	);
}