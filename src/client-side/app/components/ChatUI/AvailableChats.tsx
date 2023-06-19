// "use client";

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ChatsContext, ChatsContextType } from '@/components/ContextProviders/appDataProvider';
import { Chat } from '@/lib/DTO/AppData';
import ChatList from './AvailableChats/ChatList.component';

interface ChatListProps {
	initialChatList: Chat[];
}

function AvailableChats({initialChatList}: ChatListProps) {


	return (
		<ChatList info={initialChatList}/>
	);
}

export default AvailableChats;