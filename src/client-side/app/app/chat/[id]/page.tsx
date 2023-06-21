import "@/public/layout.css"
import MessangerUI from "@/components/ChatUI/MessangerUI";


const ChatDisplay: Function = async ({ params }: { params: { id: string } }) => {
	
	// const ChatMessages: Message[] = await fetchWithToken<Message[]>(`/chat/messages/${params.id}`);
	// const ChatMessages: Message[] = MessagesDummy;
	// const ChatParticipants: User[] = await fetchWithToken<User[]>(`/chat/participants/${params.id}`);
	// const ChatParticipants: User[] = DummyParticipants;

	return (
		<MessangerUI params={params}/>
	);
};
  
export default ChatDisplay;