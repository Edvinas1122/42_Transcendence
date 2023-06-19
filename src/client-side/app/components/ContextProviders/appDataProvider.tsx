"use client";

import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode  } from 'react';
import { EventSourceProvider } from './eventContext';
import { AuthorizedFetchContext } from './authContext';
import { Chat, User} from '@/lib/DTO/AppData';

export type ChatsContextType = {
	chatList: Chat[]; // Replace `Chat` with the type of your chat items
	fetchChats: () => void;
	loading: boolean;
};

export type UsersContextType = {
	friendInvites: User[];
	fetchInvitations: () => void;
};

export const ChatsContext = createContext<ChatsContextType>({
	chatList: [],
	fetchChats: () => {},
	loading: true,
});
export const UsersContext = createContext<UsersContextType>({
	friendInvites: [],
	fetchInvitations: () => {},
});
// ... More contexts

export const AppDataProvider = ({ children }: { children?: ReactNode }) => {

	const {fetchWithToken, loading: authLoading} = useContext(AuthorizedFetchContext);

	const [loading, setLoading] = useState(true);

	const [chatList, setChatList] = useState([]);
	const [friendInvites, setFriendInvites] = useState([]);


	const fetchChats = useCallback(async () => {
		if (authLoading) return;
		const personalProfileData = await fetchWithToken('/chat/available');
		const chats = await personalProfileData.json();
		setChatList(chats);
	}, [fetchWithToken]);

	const fetchInvitations = useCallback(async () => {
		if (authLoading) return;
		const friendInvites = await fetchWithToken('/users/manage/get-all-pending-friend-request');
		const invites = await friendInvites.json();
		setFriendInvites(invites);
	}, [fetchWithToken]);

	useEffect(() => {
		if (authLoading) { // Ensures token is available and loading is done
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [authLoading, fetchWithToken]);

	return (
		<EventSourceProvider fetchChats={fetchChats} fetchInvitations={fetchInvitations}>
		<ChatsContext.Provider value={{ chatList, fetchChats, loading }}>
		<UsersContext.Provider value={{ friendInvites, fetchInvitations }}>
		{ /* ... More providers */}
		{children}
		{ /* ... More providers */}
		</UsersContext.Provider>
		</ChatsContext.Provider>
		</EventSourceProvider>
	);
};