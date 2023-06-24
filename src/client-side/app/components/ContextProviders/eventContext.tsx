"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthorizedFetchContext, AuthorizedFetchContextType } from './authContext';
import DisplayPopUp, {DisplayComponent} from '../EventsInfoUI/EventsInfo';
import { Message, User } from '@/lib/DTO/AppData';
import { useRouter } from 'next/router';

// export type EventSourceContextType = EventSource | null;
export type EventSourceContextType = Message | null;
// export type EventSourceContextType = {newMessage: Message | null, newParticipant: User | null}

export const EventSourceContext = createContext<EventSourceContextType>(null);
export const ChatSourceContext = createContext<ChatEventType | null>(null);

interface EventSourceProviderProps {
	children: React.ReactNode;
}

export interface ChatEventType {
	event: string;
	roomId: string;
	subType: string;
	data: any;
}

interface EventSourceData {
	type: string;
	data: ChatEventType;
	id: string;
	retry: number;
}

export const EventSourceProvider = ({ children }: EventSourceProviderProps) =>  {
	const { fetchWithToken, loading, token } = useContext<AuthorizedFetchContextType>(AuthorizedFetchContext);
	const [eventSource, setEventSource] = useState<EventSource | null>(null);
	const [chatEvent, setChatEvent] = useState<ChatEventType | null>(null);

	useEffect(() => {
		if (loading || !token) {
			return () => {};
		}
		let es = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/events/sse/?token=${token.accessToken}`);

		es.onmessage = (event) => {
			const parsedData: EventSourceData = JSON.parse(event.data);

			switch (parsedData.type) {
				case 'chat':
					setChatEvent(parsedData.data);
				case 'user':
					switch (parsedData.data.event) {}
					break;
			}
		};

		setEventSource(es);

	return () => {
		// Close EventSource connection when component unmounts
		es.close();
	}
	}, [token, loading]); // re-run effect when token changes

	

	return (
		<ChatSourceContext.Provider value={chatEvent}>
			<DisplayComponent/>
			{children}
		</ChatSourceContext.Provider>
	);
};