
import fetchWithToken from "@/lib/fetch.util";
import { Chat, Message, User } from "@/lib/DTO/AppData";
import MessageList from "@/components/ChatUI/MessageList";
import MessagePostController from "@/components/ChatUI/MessagesController";

const MessagesDummy: Message[] = [
	{
		_id: 1,
		content: "Hello World!",
		user: {
			_id: "4",
			name: "test",
			avatar: "",
		},
	},
	{
		_id: 2,
		content: "Hello World!",
		user: {
			_id: "4",
			name: "test",
			avatar: "",
		},
	},
	{
		_id: 3,
		content: "Hello World!",
		user: {
			_id: "4",
			name: "test",
			avatar: "",
		},
	},
	{
		_id: 4,
		content: "Hello World!",
		user: {
			_id: "3",
			name: "alan",
			avatar: "",
		},
	}
];

const MessagesDisplay: Function = async ({ params }: { params: { id: string } }) => {
	
	// const ChatMessages: Message[] = await fetchWithToken<Message[]>(`/chat/messages/${params.id}`);
	const ChatMessages: Message[] = MessagesDummy;

	return (
	  <div>
		<h1>
			Messages Display
		</h1>
			<MessageList messages={ChatMessages} />
			<MessagePostController chatId={params.id}/>
	  </div>
	);
};
  
export default MessagesDisplay;