"use client";
import React, { FC, useCallback } from "react";
import UIClientListBox, { 
	UIClientListBoxClassBuilder,
} from "@/components/GeneralUI/GenericClientList";
import { EntityInterfaceBuilder } from "@/components/GeneralUI/InterfaceGenerics/InterfaceComposer";
import { User } from "@/lib/DTO/AppData";
import { UserBoxProps } from "../UserBox";

const BlockedUsersLive: React.FC<{ node: React.FC<UserBoxProps> }> = ({
	node
}) => {
	const endpoint = "/users/manage/get-blocked-users/";

	const BlockedUsersInteface = EntityInterfaceBuilder<User>()
		.addButton(
			{
				name: "Unblock",
				endpointTemplate: "/users/manage/unblock-user/[id]",
				type: "simple",
				displayDependency: (item: User) => true,
			}
		)
	
	const LiveBlockedUsersDisplay = new UIClientListBoxClassBuilder()
		.setInitialItems(endpoint)
		.setEntityInterface(BlockedUsersInteface)
		.setBoxComponent(node)
		.setLinkDefinition({
			linktemplate: "/user/[id]",
			samePage: false,
			// highlightOnly: true,
		})
		.setEmptyMessage("No blocked users")
		.build();

	return (
		<>
			<UIClientListBox
				{...LiveBlockedUsersDisplay}
			/>
		</>
	);

}

export default BlockedUsersLive;