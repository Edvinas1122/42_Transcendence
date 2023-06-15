"use client";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppData from '@/app/dtos/AppData';
import Sidebar  from './components/Sidebar/Sidebar';
import AppDisplays from './components/components.config';
import fetchWithToken from "./network/fetchWithToken";
import UserProfile from "./components/FriendsAndUsers/UserProfile/UserProfile";
import { AuthProvider } from "./context/authContext";
import { EventSourceProvider } from "./context/eventContext";
import { FetchProvider } from "./context/fetchContext";
import { AppDataProvider } from "./context/appDataProvider";
import { SidebarProvider } from "./context/sidebarContext";
import FriendsAndUsers from "./components/FriendsAndUsers/FriendsAndUsers";
import PersonalProfile from "./components/UserProfile/Profiles";
import Chats from "./components/Chat/Chat";


const RootUI = () => {

	return (
		<AuthProvider>
		<AppDataProvider>
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
		</AppDataProvider>
		</AuthProvider>
	);
};

export default RootUI;
