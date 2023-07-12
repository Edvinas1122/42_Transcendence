"use client";
import React, { FC } from "react";
import UIClientListBox, { 
	UIClientListBoxClassBuilder,
} from "@/components/GeneralUI/GenericClientList";
import { EntityInterfaceBuilder } from "@/components/GeneralUI/InterfaceGenerics/InterfaceComposer";
import { User } from "@/lib/DTO/AppData";
import { UserBoxProps } from "../UserBox";

const InvitesLive: React.FC<{ node: React.FC<UserBoxProps> }> = ({
	node
}) => {
	const endpoint = "/users/manage/get-all-pending-friend-request/";

	const LiveInviteInteface = EntityInterfaceBuilder<User>()
		.addButton(
			{
				name: "Accept",
				endpointTemplate: "/users/manage/approve-friend-request/[id]",
				type: "simple",
				displayDependency: (item: User) => true,
			}
		)
		.addButton(
			{
				name: "Reject",
				endpointTemplate: "/users/manage/reject-friend-request/[id]",
				type: "simple",
				displayDependency: (item: User) => true,
			}
		)

	const LiveInvitesDisplay = new UIClientListBoxClassBuilder()
		.setInitialItems(endpoint)
		.setEntityInterface(LiveInviteInteface)
		.setBoxComponent(node)
		.setLinkDefinition({
			linktemplate: "/user/[id]",
			samePage: false,
			// highlightOnly: true,
		})
		.setEmptyListMessage("No current invites")
		.build();

	return (
		<>
			<UIClientListBox
				{...LiveInvitesDisplay}
			/>
		</>
	);
}
export default InvitesLive;