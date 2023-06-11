"use client"; // This file is client-side only

import React, { useState, useEffect } from 'react';
import { GroupChat } from '@/app/dtos/AppData';
import CreateChat from './Controlls/CreateChat';
import Chat from '../Chat/Chat'


const ChatBox = ({props}: Chat) => {
	
	const chat: Chat = props;

	return (
		<div>
			<h2>{chat.name}</h2>
			<p>{chat.id}</p>
		</div>
	);
}

const Chats = ({props}: Chat[]) => {

	// let [availableChats, setAvailableChats] = useState(chats);

	// useEffect(() => {
	// 	setAvailableChats(chats);
	// }, [chats]);

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
							<li key={chat._id}>{chat.name}</li>
						))}
					</ul>
				</div>
				<div>
					<CreateChat />
				</div>
			</div>
		);
}

export default Chats;