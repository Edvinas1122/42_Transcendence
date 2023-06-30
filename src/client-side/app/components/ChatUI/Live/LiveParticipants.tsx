"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import UIClientListBox, {UIClientListBoxClassBuilder} from "@/components/GeneralUI/GenericClientList";
import { ParticipantSourceContext } from "../ChatEventProvider";
import { EntityInterfaceBuilder } from "@/components/GeneralUI/InterfaceGenerics/InterfaceComposer";
import { User } from "@/lib/DTO/AppData";
import "../Chat.css"

interface ParticipantBoxProps {
	item: User,
	childnode: React.ReactNode
}

const ParticipantBox: React.FC<ParticipantBoxProps> = ({
	item,
	childnode
}) => {
	return (
		<div>
			<p>
				<strong>{item.name}</strong>
				<span>{item.Role}</span>
			</p>
			<div className="status"></div>
			{childnode}
		</div>
		
	);
}

const LiveParticipants: Function = ({
	initialParticipants,
	chatID
}: {
	initialParticipants: User[] | string,
	chatID: number
}) => {
	
	const participantsEvent = useContext(ParticipantSourceContext);
	
	const handleNewEvent = useCallback((setItems: Function) => {
		if (participantsEvent) {
			console.log("participantsEvent", participantsEvent);
			if (participantsEvent.data._id == chatID) {
				switch (participantsEvent.subtype) {
					case "join":
						setItems(participantsEvent.data.participants);
						break;
					case "leave":
						setItems(participantsEvent.data.participants);
						break;
					case "kicked":
						setItems(participantsEvent.data.participants);
						break;
					default:
						setItems(participantsEvent.data.participants);
						break;
				}
			}
		}
	}, [participantsEvent]);


	const ParticipantRoleInterface = EntityInterfaceBuilder<User>()
		.addButton({
			// available to admins and owners
			name: "Kick",
			endpointTemplate: `/chat/roles/${chatID}/[id]`,
			type: "delete",
			displayDependency: (item: User) => item.Role === "Owner" ? false : true,
		})
		.addToggleButton({
			// available to admins and owners
			dependency: (item: User) => item?.Muted ? false : true,
			type: "simple",
			unitOne: {
				name: "Mute",
				endpointTemplate: `/chat/roles/${chatID}/mute`,
			},
			unitTwo: {
				name: "Unmute",
				endpointTemplate: `/chat/roles/${chatID}/unmute`,
			}
		})
		.addToggleButton({
			// available to owner
			dependency: (item: User) => item?.Role == "Admin" ? true : false,
			type: "simple",
			unitOne: {
				name: "Make Admin",
				endpointTemplate: `/chat/roles/${chatID}/promote`,
			},
			unitTwo: {
				name: "Demote",
				endpointTemplate: `/chat/roles/${chatID}/demote`,
			}
		})



	const ParticipantsList = new UIClientListBoxClassBuilder()
		.setInitialItems(initialParticipants)
		.setBoxComponent(ParticipantBox)
		.setEntityInterface(ParticipantRoleInterface)
		.setEditItemsCallback(handleNewEvent)
		.setListStyle("ParticipantsList")
		.addCategory({
			name: "Owner",
			dependency: (item: User) => item.Role == "Owner"
		})
		.addCategory({
			name: "Admins",
			dependency: (item: User) => item.Role == "Admin"
		})
		.addCategory({
			name: "Participants",
			dependency: (item: User) => item.Role == "Participant"
		})
		.setLinkDefinition({
			linktemplate: "/user/[id]",
			samePage: false,
			// highlightOnly: true,
		})
		.build();

	return (
		<UIClientListBox
			{...ParticipantsList}
		/>
	);
}

export default LiveParticipants;