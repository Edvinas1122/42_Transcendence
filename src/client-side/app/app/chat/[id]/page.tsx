import "@/public/layout.css"
import fetchWithToken from "@/lib/fetch.util";
import { Chat, Message, User } from "@/lib/DTO/AppData";
import MessageList from "@/components/ChatUI/MessageList";
import MessagePostController from "@/components/ChatUI/MessagesController";
import ParticipantsList from "@/components/ChatUI/ParticipantsList";


const MessagesDummy: Message[] = [
	{
		_id: 1,
		content: "Hello World!",
		user: {
			_id: "4",
			name: "test",
			avatar: "",
		},
		myMessage: true,
	},
	{
		_id: 2,
		content: "Hello World!",
		user: {
			_id: "4",
			name: "test",
			avatar: "",
		},
		myMessage: true,
	},
	{
		_id: 3,
		content: "Hello World!",
		user: {
			_id: "4",
			name: "test",
			avatar: "",
		},
		myMessage: true,
	},
	{
		_id: 4,
		content: "Hello World!",
		user: {
			_id: "3",
			name: "alan",
			avatar: "",
		},
		myMessage: false,
	}
];

const DummyParticipants: User[] = [
	{
		_id: "4",
		name: "test",
		avatar: "",
	},
	{
		_id: "3",
		name: "alan",
		avatar: "",
	}
];

const MessagesDisplay: Function = async ({ params }: { params: { id: string } }) => {
	
	// const ChatMessages: Message[] = await fetchWithToken<Message[]>(`/chat/messages/${params.id}`);
	const ChatMessages: Message[] = MessagesDummy;
	// const ChatParticipants: User[] = await fetchWithToken<User[]>(`/chat/participants/${params.id}`);
	const ChatParticipants: User[] = DummyParticipants;

	return (
		<section>
			<div className="MainSubsection1">
				<h1>
					Messages Display
				</h1>
				<div className="List">
					<MessageList messages={ChatMessages} />
				</div>
				<div>
					<MessagePostController chatId={params.id}/>
				</div>
			</div>
			<div className="MainSubsection2">
				<h1>
					Particaipants Display
				</h1>
				<div className="List">
					<ParticipantsList participants={ChatParticipants} />
				</div>
			</div>
	  	</section>
	);
};
  
export default MessagesDisplay;