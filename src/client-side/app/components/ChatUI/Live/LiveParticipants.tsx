"use client";

import React, { useState, useEffect, useContext } from "react";
import UIClientListBox from "@/components/GeneralUI/GenericClientList";
import { EventSourceContext } from "@/components/ContextProviders/eventContext";
import { User } from "@/lib/DTO/AppData";

const ParticipantBox: Function = ({ item }: { item: User }) => {
	return (
		<div>
			<p>
				<strong>{item.name}</strong>
				<span>{item.name}</span>
			</p>
			<div className="status"></div>
		</div>
	);
}

const LiveParticipants: Function = ({ initialParticipants, chatID }: { initialParticipants: User[] | string, chatID: number }) => {
	

	return (
		<UIClientListBox
			Items={initialParticipants}
			BoxComponent={ParticipantBox}
		/>
	);
}