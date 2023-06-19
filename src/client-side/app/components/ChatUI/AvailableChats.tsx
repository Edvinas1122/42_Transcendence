// "use client";

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ChatsContext, ChatsContextType } from '@/components/ContextProviders/appDataProvider';
import { Chat } from '@/lib/DTO/AppData';
import ChatList from './ChatList';
import '@/public/layout.css';

interface ChatListProps {
	initialChatList: Chat[];
}



function AvailableChats({initialChatList}: ChatListProps) {


	return (
		<div>
			<div>
				<h1>Chats</h1>
			</div>
			<div className="List">
				<ChatList info={initialChatList}/>
			</div>
		</div>
	);
}

export default AvailableChats;