import React, { createContext, useState, useEffect } from 'react';

// Create a new Context
export const EventSourceContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const EventSourceProvider = ({ token, children }) => {
	const [eventSource, setEventSource] = useState(null);

	useEffect(() => {
		console.log("EventSourceProvider useEffect ", token);
		let es = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/events/sse/?token=${token}`);

	// Set event source in the state
		setEventSource(es);

	return () => {
		// Close EventSource connection when component unmounts
		es.close();
	}
	}, [token]); // re-run effect when token changes

	

	return (
	<EventSourceContext.Provider value={eventSource}>
		{children}
	</EventSourceContext.Provider>
	);
};