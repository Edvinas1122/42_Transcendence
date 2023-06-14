"use client"; // This file is client-side only

import React, { useState, useEffect } from 'react';
import { GroupChat } from '@/app/dtos/AppData';
import CreateChat from './Controlls/CreateChat';
import Chat from './Chat'
import ChatList from './ChatList';
import SendMessage from './SendMessage';
import Messages from './Messages/Messages';

// const Messages = ({chatProp}: {chatProp: Chat}) => {
// 	const chat: Chat = chatProp;
  
// 	if (!chat) {
// 	  return <div>Loading...</div>;
// 	}
  
// 	// console.log("in messages: " + chat.name);
  
// 	return (
// 	<div>
// 		<h2>{chat.name}</h2>
// 		<p>{chat.id}</p>
// 		<p>Example</p>
// 	</div>
// 	);
// }

const Chats = ({props}: {props: Chat[]}) => {
	const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

	const handleChatBoxClick = (chat: Chat) => {
		console.log("in handleChatBoxClick: " + chat.name);
		setSelectedChat(chat);
	};

	const chats: Chat[] = props;
	// console.log("in chats: " + chats[0].name);
	return (
		<>
		<div>
			{!chats ? <h1>No chats available</h1> : <h1>Available Chats</h1>}
			{chats?.map((chat) => 
				<li key={chat._id} onClick={() => 
				handleChatBoxClick(chat)}><ChatList chat={chat}/></li>)}
			<CreateChat />
			<h2>Messages</h2>
			{selectedChat && <Messages chatId={selectedChat._id} />}
			{selectedChat && <SendMessage chatId={selectedChat._id} />}
		</div>
		</>
	);
}

export default Chats;