import "@/public/layout.css";
import "./layout.css";
import "@/components/ChatUI/Chat.css";
import ChatRoomsUI from "@/components/ChatUI/ChatRoomsUI";
import { ChatEventProvider } from "@/components/ChatUI/ChatEventProvider";

export default function	ChatsLayout({
	children,
}: {
	children: React.ReactNode
})
{
	return (
		<section className="Display">
			{/* <ChatEventProvider> */}
				<div className="Segment ChatRooms">
					<ChatRoomsUI />
				</div>
				<div className="Segment">
					{children}
				</div>
			{/* </ChatEventProvider> */}
		</section>
	);
}