import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { EventSourceProvider } from './eventContext';
import { AuthorizedFetchContext } from './authContext';


export const ChatsContext = createContext();
export const UsersContext = createContext();
// ... More contexts

export const AppDataProvider = ({ children }) => {

	const {fetchWithToken, loading} = useContext(AuthorizedFetchContext);

	// const [userList, setUserList] = useState([]);
	const [chatList, setChatList] = useState([]);
	const [friendInvites, setFriendInvites] = useState([]);


	const fetchChats = useCallback(async () => {
		const personalProfileData = await fetchWithToken('/chat/available');
		const chats = await personalProfileData.json();
		setChatList(chats);
	}, [loading]);

	const fetchInvitations = useCallback(async () => {
		const friendInvites = await fetchWithToken('/users/manage/get-all-pending-friend-request');
		const invites = await friendInvites.json();
		setFriendInvites(invites);
	}, [loading]);

	useEffect(() => {
		if (!loading && fetchWithToken) { // Ensures token is available and loading is done
		  fetchChats();
		  console.log("Fetch users ok");
		}
		console.log("Fetch users cancelled");
	  }, [loading, fetchWithToken, fetchChats]);

	return (
		<EventSourceProvider fetchChats={fetchChats, fetchInvitations}>
		<ChatsContext.Provider value={ { chatList, fetchChats } }>
		<UsersContext.Provider value={{ friendInvites, fetchInvitations }}>
		{ /* ... More providers */}
		{children}
		{ /* ... More providers */}
		</UsersContext.Provider>
		</ChatsContext.Provider>
		</EventSourceProvider>
	);
};