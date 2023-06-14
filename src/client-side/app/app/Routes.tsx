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


const RootUI = () => {

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
