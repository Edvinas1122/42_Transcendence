import { Message, User } from "@/lib/DTO/AppData";
import UIListBox from "../GeneralUI/GenericList";
import GenericForm from "../GeneralUI/GenericForm";
import LiveMessages from "./Live/LiveMessages";
import fetchWithToken from "@/lib/fetch.util";
import { notFound } from 'next/navigation'
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

const MessangerUI: Function = ({ params }: { params: { id: string } }) => {

	return (
		<>
			<div className="Segment">
				<div className="Component MessageComponent">
					<h1>
						Messages Display
					</h1>
					<LiveMessages initialMessages={`/chat/messages/${params.id}`} chatID={params.id} />
					<SendMessageBox id={params.id} />
				</div>
			</div>
			<div className="Segment Participants">
				<div className="Component">
					<h1>
						Particaipants Display
					</h1>
					<UIClientListBox initialParticipants={`/chat/roles/${params.id}/Any`} chatID={params.id} />
				</div>
			</div>
	  	</>
	);
}


export default MessangerUI;