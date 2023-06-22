import { Message, User } from "@/lib/DTO/AppData";
import UIListBox from "../GeneralUI/GenericList";
import GenericForm from "../GeneralUI/GenericForm";
import LiveMessages from "./Live/LiveMessages";
import fetchWithToken from "@/lib/fetch.util";
import "@/public/layout.css";
import "./Chat.css";


const MessagesDummy: Message[] = [
	{
		_id: 1,
		content: "Hello World!",
		user: {
			_id: "4",
			name: "test",
			avatar: "",
		},
		me: true,
	},
	{
		_id: 2,
		content: "Hello World!",
		user: {
			_id: "4",
			name: "test",
			avatar: "",
		},
		me: true,
	},
	{
		_id: 3,
		content: "Hello World!",
		user: {
			_id: "4",
			name: "test",
			avatar: "",
		},
		me: true,
	},
	{
		_id: 4,
		content: "Hello World!",
		user: {
			_id: "3",
			name: "alan",
			avatar: "",
		},
		me: false,
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

// Is being used in LiveMessages.tsx
// const MessageBox: Function = ({ item, style }: { item: Message, style?: string }) => {

// 	const messageClass = item.myMessage ? 'Message user' : 'Message';
// 	const messageSpace = "MessageSpace";

// 	return (
// 		<div className="MessageArea">
// 			<div className={messageSpace}></div>
// 			<div className={messageClass}>
// 				<p>{item.content}</p>
// 			</div>
// 			<div className={messageSpace}></div>
// 		</div>
// 	);
// }

// const ParticipantInteface: Function = ({ id }: { id: string }) => {
// 	return (
// 		<GenericForm 
			
// 		/>
// 	);

const ParticipantBox = ({ item }: { item: User }) => {
	return (
		<div className="Entity">
			<p>
				<strong>{item.name}</strong>
				<span>{item.name}</span>
			</p>
			<div className="status"></div>
		</div>
	);
}

const SendMessageBox: Function = ({id}: {id: string}) => {
	return (
		<GenericForm 
			endpoint={`/chat/messages/${id}`}
			method="POST"
			fields={[
				{ name: 'content', value: '', type: 'text', placeholder: 'Type your message here...' },
			]}
			className="MessageForm"
			resetAfterSubmit = {true}
		/>
	);
}

const MessangerUI: Function = async ({ params }: { params: { id: string } }) => {

	const AccessChat: boolean = await fetchWithToken<boolean>(`/chat/roles/${params.id}/join`, null, {}, "POST");
	const ChatMessages: Message[] = await fetchWithToken<Message[]>(`/chat/messages/${params.id}`);
	const ChatParticipants: User[] = await fetchWithToken<User[]>(`/chat/roles/${params.id}/Any`);

	return (
		<section className="Display">
			<div className="Segment">
				<div className="Component MessageComponent">
					<h1>
						Messages Display
					</h1>
					{/* <UIListBox Items={ChatMessages} BoxComponent={MessageBox} ListStyle={"MessageList"} /> */}
					<LiveMessages serverMessages={ChatMessages} chatID={params.id} />
					<SendMessageBox id={params.id} />
				</div>
			</div>
			<div className="Segment">
				<div className="Component">
					<h1>
						Particaipants Display
					</h1>
					<UIListBox Items={ChatParticipants} BoxComponent={ParticipantBox} />
				</div>
			</div>
	  	</section>
	);
}


export default MessangerUI;