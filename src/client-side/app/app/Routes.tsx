"use client";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppData from '@/app/dtos/AppData';
import Sidebar  from './components/Sidebar/Sidebar';
import AppDisplays from './components/components.config';
import fetchWithToken from "./network/fetchWithToken";
import UserProfile from "./components/FriendsAndUsers/UserProfile/UserProfile";
import { TokenProvider, TokenContext } from "./context/tokenContext";
import { EventSourceProvider } from "./context/eventContext";
import { SidebarProvider } from "./context/sidebarContext";
import FriendsAndUsers from "./components/FriendsAndUsers/FriendsAndUsers";
import PersonalProfile from "./components/UserProfile/Profiles";
import Chats from "./components/Chat/Chat";




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
	const	[displays, setDisplays] = useState(AppDisplays);

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

	useEffect(() => {
		fetchData();
	}, []); 

	return (
		<TokenProvider>
			<TokenContext.Consumer>
			{([token]) => (
				<EventSourceProvider token={token}>
					<Router>
						<SidebarProvider>
							<Sidebar />
							<Routes>
								<Route path="/friends" element={<FriendsAndUsers />} />
								<Route path="/users" element={<PersonalProfile />} />
								<Route path="/chat" element={<Chats />} />
								<Route path="/users/:userId" element={<UserProfile />} />
							</Routes>
						</SidebarProvider>
					</Router>
				</EventSourceProvider>
			)}
			</TokenContext.Consumer>
		</TokenProvider>
	);
};

export default RootUI;
