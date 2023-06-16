"use client";

import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode  } from 'react';
import { EventSourceProvider } from './eventContext';
import { AuthorizedFetchContext } from './authContext';
import {Chat, User} from '@/app/dtos/AppData';

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
		const personalProfileData = await fetchWithToken('/chat/available');
		const chats = await personalProfileData.json();
		setChatList(chats);
	}, [fetchWithToken]);

	const fetchInvitations = useCallback(async () => {
		const friendInvites = await fetchWithToken('/users/manage/get-all-pending-friend-request');
		const invites = await friendInvites.json();
		setFriendInvites(invites);
	}, [fetchWithToken]);

	useEffect(() => {
		if (!authLoading) { // Ensures token is available and loading is done
			fetchChats();
			setLoading(false);
			console.log("Fetch users ok");
		}
		console.log("Fetch users cancelled");
	  }, [authLoading, fetchChats, fetchInvitations, fetchWithToken]);

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