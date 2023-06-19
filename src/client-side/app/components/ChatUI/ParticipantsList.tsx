import { User } from "@/lib/DTO/AppData"
import "./Chat.css";
import "@/public/layout.css"


const ParticipantBox = ({ participant }: { participant: User }) => {
	return (
		<div className="Entity">
			<p>
				<strong>{participant.name}</strong>
				<span>{participant.name}</span>
				<div className="status"></div>
			</p>
		</div>
	);
}

const ParticipantsList = ({participants}: {participants: User[]}) => {
	return (
		<div>
			{participants && participants.map((participant) => (
				<ParticipantBox key={participant._id} participant={participant} />
			))}
		</div>
	);
}

export default ParticipantsList;