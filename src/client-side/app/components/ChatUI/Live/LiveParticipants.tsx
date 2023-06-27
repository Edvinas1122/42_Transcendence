"use client";

import React, { useState, useEffect, useContext } from "react";
import UIClientListBox, {UIClientListBoxClassBuilder} from "@/components/GeneralUI/GenericClientList";
import { EventSourceContext } from "@/components/ContextProviders/eventContext";
import { User } from "@/lib/DTO/AppData";

const ParticipantBox: Function = ({ item }: { item: User }) => {
	return (
		<div>
			<p>
				<strong>{item.name}</strong>
				<span>{item.name}</span>
				<span>{item.Role}</span>
			</p>
			<div className="status"></div>
		</div>
	);
}



const LiveParticipants: Function = ({ initialParticipants, chatID }: { initialParticipants: User[] | string, chatID: number }) => {
	

	const ParticipantsList = new UIClientListBoxClassBuilder()
		.setInitialItems(initialParticipants)
		.setBoxComponent(ParticipantBox)
		.build();

	return (
		<UIClientListBox
			{...ParticipantsList}
		/>
	);
}

export default LiveParticipants;