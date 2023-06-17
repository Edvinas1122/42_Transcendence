"use client"; // This file is client-side only

import React, { useState, useEffect, useContext } from 'react';
import CreateChat from './Controlls/CreateChat';
import ChatList from './ChatList';
// import SendMessage from './SendMessage';
import { ChatsContext, ChatsContextType } from '@/app/context/appDataProvider';
import { Chat } from '@/app/dtos/AppData';

const Chats = () => {
	const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
	const {chatList, fetchChats, loading} = useContext<ChatsContextType>(ChatsContext);

	const handleChatBoxClick = (chat: Chat) => {
		console.log("in handleChatBoxClick: " + chat.name);
		setSelectedChat(chat);
	};

	useEffect(() => {
		if (!loading)
			fetchChats();
	}, [fetchChats, loading]);

	if (loading)
		return (<p>Loading...</p>);
	return (
		<div>
			{!chatList ? <h1>No chats available</h1> : <h1>Available Chats</h1>}
			{chatList?.map((chat: Chat) => 
				<li key={chat._id} onClick={() => 
				handleChatBoxClick(chat)}><ChatList chat={chat}/></li>)}
			<CreateChat />
			<h2>Messages</h2>
			{/* {selectedChat && <Messages chatProp={selectedChat} />} */}
			{/* {selectedChat && <SendMessage chatId={selectedChat._id} />} */}
		</div>
	);
}

export default Chats;