"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import UIClientListBox, {UIClientListBoxClassBuilder} from "@/components/GeneralUI/GenericClientList";
import { ParticipantSourceContext } from "../ChatEventProvider";
import { EntityInterfaceBuilder } from "@/components/GeneralUI/InterfaceGenerics/InterfaceComposer";
import { RoleType, User } from "@/lib/DTO/AppData";
import { UserInfoBox } from "@/components/UserUI/UserProfileUI";
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
			<UserInfoBox 
				user={item}
				scale={70}
			/>
			<p>
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
			fields: [
				{
					name: "duration",
					type: "number",
					dependency: (item: User) => true,
				}
			],
		})
		.addToggleButton({
			// available to admins and owners
			dependency: (item: User) => item?.Muted ? false : true,
			type: "simple",
			unitOne: {
				name: "Mute",
				endpointTemplate: `/chat/roles/${chatID}/mute`,
				fields: [
					{
						name: "user",
						type: "text",
						autoField: (item: User) => item.name,
						invisible: true,
					},
				],

			},
			unitTwo: {
				name: "Unmute",
				endpointTemplate: `/chat/roles/${chatID}/unmute`,
				fields: [
					{
						name: "user",
						type: "text",
						autoField: (item: User) => item.name,
						invisible: true,
					},
				],
			}
		})
		.addToggleButton({
			// available to owner
			dependency: (item: User) => item?.Role !== RoleType.Admin ? true : false,
			type: "linkToggle",
			unitOne: {
				name: "Promote",
				endpointTemplate: `/chat/roles/${chatID}/promote`,
				fields: [
					{
						name: "user",
						type: "text",
						autoField: (item: User) => item.name,
						invisible: true,
					},
				],
				editEntity: (item: User) => {
					item.Role = RoleType.Admin;
					return item;
				}
			},
			unitTwo: {
				name: "Demote",
				endpointTemplate: `/chat/roles/${chatID}/demote`,
				fields: [
					{
						name: "user",
						type: "text",
						autoField: (item: User) => item.name,
						invisible: true,
					},
				],
				editEntity: (item: User) => {
					item.Role = RoleType.Participant;
					return item;
				}
			}
		})
		.addToggleButton({
			// available to owner
			dependency: (item: User) => item?.Role !== RoleType.Blocked ? true : false,
			type: "linkToggle", // toggles links/ unwanted
			unitOne: {
				name: "Ban",
				endpointTemplate: `/chat/roles/${chatID}/ban`,
				fields: [
					{
						name: "user",
						type: "text",
						autoField: (item: User) => item.name,
						invisible: true,
					},
				],
				editEntity: (item: User) => {
					item.Role = RoleType.Blocked;
					return item;
				}
			},
			unitTwo: {
				name: "Unban",
				endpointTemplate: `/chat/roles/${chatID}/unban`,
				fields: [
					{
						name: "user",
						type: "text",
						autoField: (item: User) => item.name,
						invisible: true,
					},
				],
				editEntity: (item: User) => {
					item.Role = RoleType.Participant;
					return item;
				}
			}
		})
		.addButton({
			name: "MSG Priv",
			endpointTemplate: `/chat/messages/user/create/[id]`,
			type: "action",
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