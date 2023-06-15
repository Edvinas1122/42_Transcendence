"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthorizedFetchContext } from './authContext';
// Create a new Context

export type EventSourceContextType = EventSource | null;

export const EventSourceContext = createContext<EventSourceContextType>(null);

interface EventSourceProviderProps {
	fetchChats: () => void;
	fetchInvitations: () => void;
	children: React.ReactNode;
}

// Create a provider for components to consume and subscribe to changes
export const EventSourceProvider = ({ fetchChats, fetchInvitations, children }: EventSourceProviderProps) =>  {
	const { fetchWithToken, loading, token } = useContext(AuthorizedFetchContext);
	const [eventSource, setEventSource] = useState<EventSource | null>(null);

	useEffect(() => {
		if (loading || !token) {
			return () => {};
		}
		console.log("EventSourceProvider useEffect ", token.accessToken as string);
		let es = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/events/sse/?token=${token.accessToken}`);

		es.onmessage = (event) => {
			const parsedData = JSON.parse(event.data);
			console.log('New message:', parsedData.type);
			switch (parsedData.type) {
				case 'chat':
					console.log("EventSourceProvider useEffect chat");
					fetchChats();
					switch (parsedData.action) {}
					break;
				case 'user':
					console.log("EventSourceProvider useEffect user");
					fetchInvitations();
					switch (parsedData.action) {}
					break;
				case 'message':
					console.log("EventSourceProvider useEffect message");
					switch (parsedData.action) {}
					break;
				default:
					break;
			}
		};

		setEventSource(es);

	return () => {
		// Close EventSource connection when component unmounts
		es.close();
	}
	}, [token, fetchChats, fetchInvitations, loading]); // re-run effect when token changes

	

	return (
	<EventSourceContext.Provider value={eventSource}>
		{children}
	</EventSourceContext.Provider>
	);
};