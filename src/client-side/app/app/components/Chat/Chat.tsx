"use client"; // This file is client-side only

import React, { useState, useEffect } from 'react';
import { GroupChat } from '@/app/dtos/AppData';
import CreateChat from './Controlls/CreateChat';
import Chat from '../Chat/Chat'
import ChatList from './ChatList';
import SendMessage from './SendMessage';


const ChatBox = ({props}: Chat) => {
	
	const chat: Chat = props;

	return (
		<div>
			<h2>{chat.name}</h2>
			<p>{chat.id}</p>
		</div>
	);
}

const Messages = ({chatProp}: {chatProp: Chat}) => {
	const chat: Chat = chatProp;
  
	if (!chat) {
	  return <div>Loading...</div>;
	}
  
	console.log("in messages: " + chat.name);
  
	return (
	<div>
		<h2>{chat.name}</h2>
		<p>{chat.id}</p>
		<p>Example</p>
	</div>
	);
}

const Chats = ({props}: {props: Chat[]}) => {
	const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

	const handleChatBoxClick = (chat: Chat) => {
		console.log("in handleChatBoxClick: " + chat.name);
		setSelectedChat(chat);
	};

	const chats: Chat[] = props;
	// console.log("in chats: " + chats[0].name);


	if (!chats)
	return (
		<div>
			<div>No chats available</div>
			<div>
				<CreateChat />
			</div>
		</div>
	);
	else
	return (
		<div>
		<div>
			<h2>Available Chats</h2>
				<ul>
					{chats.map(chat => (
						<li key={chat._id} onClick={() => handleChatBoxClick(chat)}>
						<ChatBox props={chat} />
						</li>
					))}
				</ul>
		</div>
		<div>
			<h2>Messages</h2>
			{selectedChat && <Messages chatProp={selectedChat} />}
			{selectedChat && <SendMessage chatId={selectedChat._id} />}
		</div>
			<div>
				<CreateChat />
			</div>
		</div>
	);
}

export default Chats;