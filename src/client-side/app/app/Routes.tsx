"use client";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppData from '@/app/dtos/AppData';
import Sidebar  from './components/Sidebar/Sidebar';
import AppDisplays from './components/components.config';
import fetchWithToken from "./network/fetchWithToken";
import Cookie from "js-cookie";


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

const RootUI = () => {
	const [displays, setDisplays] = useState(AppDisplays);
	const authToken = Cookie.get('access_token');
	const eventSource = new EventSource(`http://localhost:3000/api/sse/?token=${authToken}`);

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

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Router>
			<div>
			<Routes>
				<Route path="/" element={<Sidebar displays={displays}/>} />
				{/* <Route path="/auth" element={<Authenticate />} /> */}
			</Routes>
			</div>
		</Router>
	);
};

export default RootUI;
