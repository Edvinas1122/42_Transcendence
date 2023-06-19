"use client";

import "@/public/layout.css";
import React from 'react';
import { Chat } from '@/lib/DTO/AppData';
import Link from 'next/link';
// import ChatInfoBox from './ChatInfoBox.component';

interface ChatListProps {
	info: Chat[];
}

interface ChatBoxProps {
	info: Chat;
}


const ChatInfoBox: React.FC<ChatBoxProps> = (
	{info}: ChatBoxProps
) => {
	return (
		<div className="Entity">
			<Link href={`/chat/${info._id}`}>
				<p>
					<strong>{info.name}</strong>
					<span>{info.personal}</span>
				</p>
			</Link>
		</div>
	);
}

const ChatList: React.FC<ChatListProps> = (
	{info}: ChatListProps
) => {
	return (
		<div>
			{info.map(chat => (
				<ChatInfoBox key={chat._id} info={chat} />
			))}
		</div>
	);
}

export default ChatList;