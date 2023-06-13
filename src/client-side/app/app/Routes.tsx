"use client";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import AppData from '@/app/dtos/AppData';
import Sidebar  from './components/Sidebar/Sidebar';
import AppDisplays from './components/components.config';
import fetchWithToken from "./network/fetchWithToken";
import Cookie from "js-cookie";
import ChatPage from "./components/Chat/ChatPage";


const dataExample : AppData = {
	user: {
		_id: "1234567890",
		name: "John Doe",
		avatar: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
		Online: true,
		Ingame: false,
		MachHistory: [],
		Achievements: [],
	}
}

async function fetchDataForDisplay(display) {
	if (display.propsFetchAPI) {
	try {
		const response = await fetchWithToken(display.propsFetchAPI);
		const data = await response.json();
		return { ...display, props: data };
	} catch (error) {
		return display;
	}
	}
	return display;
}

const UserView = () => {
	const { id } = useParams();

	return (
		<div>
			<h1>User View</h1>
			<p>id: {id}</p>
		</div>
	);
}

const authValidate = () => {
	const authToken = Cookie.get('access_token');
	if (!authToken) {
		window.location.href = '/auth';
	}
	return authToken;
}  


const RootUI = () => {
	const	[displays, setDisplays] = useState(AppDisplays);
	// const	authToken = authValidate();
	let		eventSource = new EventSource(`http://localhost:3000/events/sse/?token=${authValidate()}`);

	const fetchData = async (displayType) => {
		const fetchedDisplayData = await Promise.all(
			AppDisplays.map(display => {
				if (!displayType || display.subscibe === displayType) {
					return fetchDataForDisplay(display);
				} else {
					return display;
				}
			})
		);
		setDisplays(fetchedDisplayData);
	};
	
	eventSource.onmessage = (event) => {
		const data = JSON.parse(event.data);
		console.log(data);

		// Trigger fetchData with the type of data received
		fetchData(data.type);
	};

	eventSource.onerror = function (err) {
		console.error('EventSource failed:', err);
		if (eventSource.readyState === EventSource.CLOSED) {
			console.log('Connection was closed. Reconnecting...');
			// Optionally, you could add a delay here, to avoid too many immediate reconnection attempts
			setTimeout(() => {
				eventSource = new EventSource(`http://localhost:3000/api/sse/?token=${authValidate()}`);
			}, 5000);
		}
	  };

	useEffect(() => {
		fetchData();
	}, []); 

	return (
		<Router>
			<div>
			<Routes>
				<Route path="/" element={<Sidebar displays={displays}/>} />
				<Route path="/user/:id" element={<UserView />} />
				<Route exact path="/chat/:chatId" element={<ChatPage />} />
			</Routes>
			</div>
		</Router>
	);
};

export default RootUI;
