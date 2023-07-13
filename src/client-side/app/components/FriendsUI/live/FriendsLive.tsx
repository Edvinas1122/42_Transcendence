"use client";
import React, { FC, useCallback } from "react";
import UIClientListBox, { 
	UIClientListBoxClassBuilder,
} from "@/components/GeneralUI/GenericClientList";
import { EntityInterfaceBuilder } from "@/components/GeneralUI/InterfaceGenerics/InterfaceComposer";
import { User } from "@/lib/DTO/AppData";
import { UserBoxProps } from "../UserBox";

const FriendsLive: React.FC<{ node: React.FC<UserBoxProps> }> = ({
	node
}) => {
	const endpoint = "/users/manage/friends/";

	const LiveFriendsInteface = EntityInterfaceBuilder<User>()
		.addButton(
			{
				name: "Remove",
				endpointTemplate: "/users/manage/remove-friend/[id]",
				type: "simple",
				displayDependency: (item: User) => true,
			}
		)
	
	const LiveFriendsDisplay = new UIClientListBoxClassBuilder()
		.setInitialItems(endpoint)
		.setEntityInterface(LiveFriendsInteface)
		.setListStyle("FriendsListLive")
		.setBoxComponent(node)
		.setLinkDefinition({
			linktemplate: "/user/[id]",
			samePage: false,
			// highlightOnly: true,
		})
		.setEmptyListMessage("No friends added")
		.build();

	return (
		<>
			<UIClientListBox
				{...LiveFriendsDisplay}
			/>
		</>
	);
}

export default FriendsLive;