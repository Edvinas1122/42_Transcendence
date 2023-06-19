"use client";

import React from 'react';
import { Chat } from '@/lib/DTO/AppData';
import ChatInfoBox from './ChatInfoBox.component';

interface ChatListProps {
	info: Chat[];
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