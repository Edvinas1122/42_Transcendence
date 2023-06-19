import React from "react";
import fetchWithToken from "@/lib/fetch.util";
import { Chat } from "@/lib/DTO/AppData";
// import Chats from "@/app/components/Chat/Chat";
import AvailableChats from "@/components/ChatUI/AvailableChats";
import CreateChatBox from "@/components/ChatUI/CreateChat";

const ChatUI: Function = async () => {

	const ChatsAvailable: Chat[] = await fetchWithToken<Chat[]>("/chat/available", 30);

	return (
		<div>
			<h1>Chat Page test</h1>
			<AvailableChats initialChatList={ChatsAvailable} />
			<CreateChatBox />
		</div>
	);
};
  
export default ChatUI;