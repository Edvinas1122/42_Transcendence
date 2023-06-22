"use client";

import React, { useState, useEffect, useContext } from "react";
import UIClientListBox from "@/components/GeneralUI/GenericClientList";
import { EventSourceContext } from "@/components/ContextProviders/eventContext";
import { User } from "@/lib/DTO/AppData";

const ParticipantBox: React.FC = ({ item }: { item: User }) => {
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

const LiveParticipants: React.FC = ({ serverParticipants, chatID }: { serverParticipants: User[], chatID: number }) => {
	
	const newParticipant: User | null = useContext(EventSourceContext);
	const [Participants, setParticipants] = useState<User[]>(serverParticipants);

	useEffect(() => {
		if (newParticipant && newParticipant.chatID == chatID) {
			console.log("new participant is mine", newParticipant);
			setParticipants((prevParticipants) => [...prevParticipants, newParticipant]);
		}
	}, [newParticipant]);

	return (
		<UIClientListBox Items={Participants} BoxComponent={ParticipantBox} ListStyle="EntityList" />
	);
}