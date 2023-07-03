"use client";
import React, { FC, useCallback } from "react";
import UIClientListBox, { 
	UIClientListBoxClassBuilder,
} from "@/components/GeneralUI/GenericClientList";
import { EntityInterfaceBuilder } from "@/components/GeneralUI/InterfaceGenerics/InterfaceComposer";
import { User } from "@/lib/DTO/AppData";

const FriendsLive: React.FC<{ node: React.FC<{ item: any; }> }> = ({
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
		.setBoxComponent(node)
		.setLinkDefinition({
			linktemplate: "/user/[id]",
			samePage: false,
			// highlightOnly: true,
		})
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