"use client";
import React, { FC, useCallback, useContext, useEffect } from "react";
import UIClientListBox, { 
	UIClientListBoxClassBuilder,
} from "@/components/GeneralUI/GenericClientList";
import { EntityInterfaceBuilder } from "@/components/GeneralUI/InterfaceGenerics/InterfaceComposer";
import { User } from "@/lib/DTO/AppData";
import { UserBoxProps } from "../UserBox";
import { EventSourceProviderContext } from '@/components/ContextProviders/eventContext';
import DisplayPopUp from "@/components/EventsInfoUI/EventsInfo";

interface UserEvent {
	event: string;
	message: string;
	subType: string;
	data: User;
}


const InvitesLive: React.FC<{ node: React.FC<UserBoxProps> }> = ({
	node
}) => {
	const endpoint = "/users/manage/get-all-pending-friend-request/";

	const { registerEventListener } = useContext(EventSourceProviderContext);

	useEffect(() => {
		const unregister = registerEventListener("users", (event: UserEvent) => {
			if (event.event === "friends") {
				if (event.subType === "invited") {
					DisplayPopUp("Friend Invite", "You have a new friend invite!");
				} else if (event.subType === "approved") {
					DisplayPopUp("Friend Invite", "Your friend invite was accepted!");
				} else if (event.subType === "declined") {
					DisplayPopUp("Friend Invite", "Your friend invite was rejected!");
				}
			}
			console.log("user event", event);

		});
		return () => unregister;
	}, [registerEventListener]);



	// const handleEvents = useCallback((setItems: Function) => {
	// }, [registerEventListener]);

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
		// .setEditItemsCallback(handleEvents)
		.setBoxComponent(node)
		.setListStyle("InvitesLiveList")
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