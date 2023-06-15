"use client"; // This file is client-side only

import React, { useState, useEffect } from 'react';
import { GroupChat } from '@/app/dtos/AppData';
import CreateChat from './Controlls/CreateChat';
import Chat from './Chat'
import ChatList from './ChatList';
import SendMessage from './SendMessage';
import Messages from './Messages/Messages';
import ListChatUsers from './ChatUsers/ListChatUsers';
import "./chat.css";


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
		<div className="chat">
			<div className="chat-sidebar">
				<div className="chat-list">
					{!chats ? <h1>No chats available</h1> : <h1>Available Chats</h1>}
					<div className="available-chats">
						{chats?.map((chat) => 
						<div key={chat._id} onClick={() => 
						handleChatBoxClick(chat)}><ChatList chat={chat}/></div>)}
					</div>
				</div>
				<CreateChat />
			</div>
			<div className="selected-chat">
				<div className="chat-window">
					{<Messages chatId={selectedChat? selectedChat._id : 0} />}
					{<SendMessage chatId={selectedChat? selectedChat._id : 0} />}
				</div>
				{<ListChatUsers chatId={selectedChat? selectedChat._id : 0} />}
			</div>
		</div>
		</>
	);
}

export default Chats;