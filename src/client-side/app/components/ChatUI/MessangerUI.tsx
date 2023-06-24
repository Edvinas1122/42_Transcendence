import { Message, User } from "@/lib/DTO/AppData";
import UIListBox from "../GeneralUI/GenericList";
import GenericForm from "../GeneralUI/GenericForm";
import LiveMessages from "./Live/LiveMessages";
import fetchWithToken from "@/lib/fetch.util";
import "@/public/layout.css";
import "./Chat.css";
import UIClientListBox from "../GeneralUI/GenericClientList";

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
					<LiveMessages initialMessages={ChatMessages} chatID={params.id} />
					<SendMessageBox id={params.id} />
				</div>
			</div>
			<div className="Segment">
				<div className="Component">
					<h1>
						Particaipants Display
					</h1>
					<UIClientListBox initialParticipants={ChatParticipants} chatID={params.id} />
				</div>
			</div>
	  	</section>
	);
}


export default MessangerUI;