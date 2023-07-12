"use client";
import React, { FC, useCallback } from "react";
import UIClientListBox, { 
	UIClientListBoxClassBuilder,
} from "@/components/GeneralUI/GenericClientList";
import { EntityInterfaceBuilder } from "@/components/GeneralUI/InterfaceGenerics/InterfaceComposer";
import { User } from "@/lib/DTO/AppData";
import { UserBoxProps } from "../UserBox";

const AllUsersLive: React.FC<{ node: React.FC<UserBoxProps> }> = ({
	node
}) => {
	const endpoint = "/users/all";

	// const { userEvent } = useContext();
	const userEvent = null;

	const handleEvents = useCallback((setItems: Function) => {
		if (userEvent) {
			console.log("user event", userEvent);
		}
	}, []);

	const UserInteface = EntityInterfaceBuilder<User>()
		.addButton(
			{
				name: "Invite",
				endpointTemplate: "/users/manage/send-friend-request/[id]",
				type: "action",
				displayDependency: (item: User) => true,
			}
		)
		.addButton(
			{
				name: "Block",
				endpointTemplate: "/users/manage/block-user/[id]",
				type: "action",
				displayDependency: (item: User) => true,
			}
		)
		.addButton(
			{
				name: "MSG Priv",
				endpointTemplate: `/chat/messages/user/create/[id]`,
				type: "action",
				link: {link: "/chat", push: true},
			}
		)
	
	const UsersLiveDisplay = new UIClientListBoxClassBuilder()
		.setInitialItems(endpoint)
		.setEditItemsCallback(handleEvents)
		.setEntityInterface(UserInteface)
		.setBoxComponent(node)
		.addCategory({
				name: "Online",
				dependency: (item: User) => true,
				// displayDependency: (item: User) => item.online,
		})
		.addCategory({
			name: "Offline",
			dependency: (item: User) => false,
			// displayDependency: (item: User) => item.online,
		})
		.setLinkDefinition({
			linktemplate: "/user/[id]",
			samePage: false,
			// highlightOnly: true,
		})
		.setEmptyListMessage("No users")
		.build();

	return (
		<>
			<UIClientListBox
				{...UsersLiveDisplay}
			/>
		</>
	);
}

export default AllUsersLive;