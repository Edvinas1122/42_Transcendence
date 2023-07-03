"use client";
import React, { FC } from "react";
import UIClientListBox, { 
	UIClientListBoxClassBuilder,
} from "@/components/GeneralUI/GenericClientList";
import { User } from "@/lib/DTO/AppData";

const InvitesLive: React.FC<{ node: React.FC<{ item: User; }> }> = ({
	node
}) => {
	const endpoint = "/users/manage/get-all-pending-friend-request/";

	const LiveUserList = new UIClientListBoxClassBuilder()
		.setInitialItems(endpoint)
		.setBoxComponent(node)
		.build();

	return (
		<>
			<UIClientListBox
				{...LiveUserList}
			/>
		</>
	);
}
export default InvitesLive;