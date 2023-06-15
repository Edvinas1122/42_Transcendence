import React, { createContext, useState, useEffect, useContext } from 'react';
import { TokenContext } from './authContext';
// Create a new Context
export const EventSourceContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const EventSourceProvider = ({ fetchChats, fetchInvitations, children }) => {
	const [token, loading] = useContext(TokenContext);
	const [eventSource, setEventSource] = useState(null);

	useEffect(() => {
		if (loading) {
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
	}, [loading, token]); // re-run effect when token changes

	

	return (
	<EventSourceContext.Provider value={eventSource}>
		{children}
	</EventSourceContext.Provider>
	);
};