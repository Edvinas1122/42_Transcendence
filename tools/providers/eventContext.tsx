"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthorizedFetchContext } from './authContext';
import DisplayPopUp, {DisplayComponent} from '../EventsInfoUI/EventsInfo';
import { Message, User } from '@/lib/DTO/AppData';

// export type EventSourceContextType = EventSource | null;
export type EventSourceContextType = Message | null;
// export type EventSourceContextType = {newMessage: Message | null, newParticipant: User | null}


export const EventSourceContext = createContext<EventSourceContextType>(null);

interface EventSourceProviderProps {
	fetchChats: () => void;
	fetchInvitations: () => void;
	children: React.ReactNode;
}

interface ChatEventType {
	event: string;
	roomId: string;
	subType: string;
	data?: string;
}

interface EventSourceData {
	type: string;
	data: ChatEventType;
	id: string;
	retry: number;
}

export const EventSourceProvider = ({ fetchChats, fetchInvitations, children }: EventSourceProviderProps) =>  {
	const { fetchWithToken, loading, token } = useContext(AuthorizedFetchContext);
	const [eventSource, setEventSource] = useState<EventSource | null>(null);
	const [newMessage, setNewMessage] = useState<Message | null>(null);
	const [newParticipant, setNewParticipant] = useState<User | null>(null);

	useEffect(() => {
		if (loading || !token) {
			return () => {};
		}
		// console.log("EventSourceProvider useEffect ", token.accessToken as string);
		let es = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/events/sse/?token=${token.accessToken}`);

		es.onmessage = (event) => {
			const parsedData: EventSourceData = JSON.parse(event.data);

			// console.log('New message:', parsedData);
			switch (parsedData.type) {
				case 'chat':
					// console.log("EventSourceProvider useEffect chat");
					switch (parsedData.data.event) {
						case 'room':
							switch (parsedData.data.subType) {
								case 'new-available':
									DisplayPopUp("New Chat Available", parsedData.data.data as string);
									fetchChats();
									break;
								case 'added':
									DisplayPopUp("New Chat", "You have been added to a new chat");
								default:
									break;
							}
						case 'message':
							switch (parsedData.data.subType) {
								case 'new':
									let newMessage: Message = parsedData.data.data as unknown as Message;
									newMessage.chatID = parseInt(parsedData.data.roomId);
									setNewMessage(newMessage);
									break;
							}
						default:
							break;
					}
				case 'user':
					// console.log("EventSourceProvider useEffect user");
					fetchInvitations();
					switch (parsedData.data.event) {}
					break;
				// case 'message':
				// 	console.log("EventSourceProvider useEffect message");
				// 	switch (parsedData.data.event) {
				// 		case 'new':
				// 			console.log("EventSourceProvider useEffect message new");
				// 			setNewMessage(parsedData.data.data as Message);
				// 			break;
				// 	}
				// 	break;
				// default:
				// 	DisplayPopUp("New Event", parsedData.type);
				// 	break;
			}
		};

		setEventSource(es);

	return () => {
		// Close EventSource connection when component unmounts
		es.close();
	}
	}, [token, fetchChats, fetchInvitations, loading]); // re-run effect when token changes

	

	return (
		<EventSourceContext.Provider value={newMessage}>
		<DisplayComponent/>
			{children}
		</EventSourceContext.Provider>
	);
};