"use client";
import UIClientListBox, { EntityBoxInterface, EntityButton } from "@/components/GeneralUI/GenericClientList";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { EventSourceContext } from "@/components/ContextProviders/eventContext";
import Link from "next/link";
import { Chat } from "@/lib/DTO/AppData";
import "../Chat.css";

// const deleteChat = useCallback(() => {
// 	console.log("remove item");
// }, []);

const canDeleteChat = (item: Chat): boolean => {
	console.log("can delete chat", item);
	if (item.personal)
		return true;
	else
		return item.mine? true : false;
}

// const joinChat = useCallback(() => {
// 	console.log("join chat");
// }, []);

// const quitChat = useCallback(() => {
// 	console.log("quit chat");
// }, []);



const ChatRoomInterface: EntityBoxInterface = {
	removeItemEntityCallbackEffects: [{
		name: "remove chat",
		onClick: () => console.log("remove item"),
		dependency: canDeleteChat,
	}],
	interactItemEntityCallbackEffects: [{
		name: "join chat",
		onClick: () => console.log("join chat"),
		dependency: (item: Chat) => !item.mine,
	}, {
		name: "quit chat",
		onClick: () => console.log("quit chat"),
		dependency: (item: Chat) => item.mine,
	}],
}

const ChatRoomBox: Function = ({ item, style }: { item: Chat, style?: string }) => {
	return (
		<div className={"Entity " + style}>
			<Link href={`/chat/${item._id}`}>
				<p>
					<strong>{item.name}</strong>
					<span>{item.personal}</span>
				</p>
			</Link>
		</div>
	);
}

const ChatRoomsLive: Function = ({ serverChats }: { serverChats: Chat[] }) => {

	return (
		<UIClientListBox
			initialItems={serverChats}
			// setItemsCallback={handleNewChat}
			BoxComponent={ChatRoomBox}
			ListStyle="AvailableChats"
			entityInterface={ChatRoomInterface}
		/>
	);
}

export default ChatRoomsLive;