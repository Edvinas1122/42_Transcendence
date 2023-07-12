"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext, AuthContextType } from './authContext';
import DisplayPopUp, {DisplayComponent} from '../EventsInfoUI/EventsInfo';
import { Message, User } from '@/lib/DTO/AppData';
import { ConfirmationContext } from '../confirmationDialog/Confirmation';
import { useRouter } from 'next/navigation';

// export type EventSourceContextType = EventSource | null;
export type EventSourceContextType = Message | null;
// export type EventSourceContextType = {newMessage: Message | null, newParticipant: User | null}

export const EventSourceContext = createContext<EventSourceContextType>(null);
export const ChatSourceContext = createContext<ChatEventType | null>(null);
export const OnlineUsersContext = createContext<number[] | null>(null);

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

type RegisterEventListener = (type: string, listener: (data: any) => void) => void;

interface EventSourceProviderState {
	eventListeners: { [key: string]: ((data: any) => void)[] };
	registerEventListener: RegisterEventListener;
}

export const EventSourceProviderContext = createContext<EventSourceProviderState>({
	eventListeners: {},
	registerEventListener: () => {},
});

export const EventSourceProvider = ({ children }: EventSourceProviderProps) =>  {

	const { token } = useContext<AuthContextType>(AuthContext);
	const [eventSource, setEventSource] = useState<EventSource | null>(null);
	const [chatEvent, setChatEvent] = useState<ChatEventType | null>(null);
	const [state, setState] = useState<EventSourceProviderState>({
		eventListeners: {},
		registerEventListener: () => {},
	});

	const registerEventListener = useCallback((type: string, listener: (data: any) => void) => {
		setState((prevState) => ({
			...prevState,
			eventListeners: {
				...prevState.eventListeners,
				[type]: [...(prevState.eventListeners[type] || []), listener],
			},
		}));
	}, []);

	useEffect(() => {

		if (!token) {
			return () => {};
		}
		const url = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/events/sse/?token=${token}`;
		const connect = () => {
			const es = new EventSource(url);

			setEventSource(es);
			es.onopen = () => {
				DisplayPopUp("Connected", "You are now connected to the server", 3000, "info");
			};

			es.onmessage = (event: MessageEvent | null) => {
				if (!event) {
					return;
				}
				const parsedData: EventSourceData = JSON.parse(event.data);

				console.log("received event", parsedData);
				switch (parsedData.type) {
					case 'chat':
						setChatEvent(parsedData.data);
						break;
					// case 'user':
					// 	switch (parsedData.data.event) {}
					// 	break;
					default:
						if (state.eventListeners[parsedData.type]) {
							state.eventListeners[parsedData.type].forEach(listener => listener(parsedData.data));
						}
						break;
				}
				setTimeout(() => {
					setChatEvent(null);
				}, 100);

			};

			es.onerror = (event) => {
				es.close();
				DisplayPopUp("Connection error", "Reconnecting connection...", 2500, "danger");
			};
		};
		connect();

	return () => {
		eventSource && eventSource.close();
	}
	}, [token]); // re-run effect when token changes

	

	return (
		<ChatSourceContext.Provider value={chatEvent}>
			<EventSourceProviderContext.Provider value={{...state, registerEventListener}}>
			<DisplayComponent/>
			{children}
			</EventSourceProviderContext.Provider>
		</ChatSourceContext.Provider>
	);
};