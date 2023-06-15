	"use client"; // This file is client-side only

	import React, { useState, useEffect, useContext } from 'react';
	import CreateChat from './Controlls/CreateChat';
	import ChatList from './ChatList';
	import SendMessage from './SendMessage';
	import { ChatsContext } from '@/app/context/appDataProvider';

	const Messages = ({chatProp}: {chatProp: Chat}) => {
		const chat: Chat = chatProp;
	
		if (!chat) {
		return <div>Loading...</div>;
		}
	
		// console.log("in messages: " + chat.name);
	
		return (
		<div>
			<h2>{chat.name}</h2>
			<p>{chat.id}</p>
			<p>Example</p>
		</div>
		);
	}

	const Chats = () => {
		const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
		const {chatList, fetchChats, getChats} = useContext(ChatsContext);

		const handleChatBoxClick = (chat: Chat) => {
			console.log("in handleChatBoxClick: " + chat.name);
			setSelectedChat(chat);
		};

		// useEffect(() => {
		// 	fetchChats();
		// }, []);

		return (
			<>
			<div>
				{!chatList ? <h1>No chats available</h1> : <h1>Available Chats</h1>}
				{chatList?.map((chat) => 
					<li key={chat._id} onClick={() => 
					handleChatBoxClick(chat)}><ChatList chat={chat}/></li>)}
				<CreateChat />
				<h2>Messages</h2>
				{selectedChat && <Messages chatProp={selectedChat} />}
				{selectedChat && <SendMessage chatId={selectedChat._id} />}
			</div>
			</>
		);
	}

	export default Chats;