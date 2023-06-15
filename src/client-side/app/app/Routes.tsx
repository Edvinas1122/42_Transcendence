"use client";
// import { useRouter } from 'next/router'
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar  from './components/Sidebar/Sidebar';
import UserProfile from "./components/FriendsAndUsers/UserProfile/UserProfile";
import { AuthProvider } from "./context/authContext";
import { AppDataProvider } from "./context/appDataProvider";
import FriendsAndUsers from "./components/FriendsAndUsers/FriendsAndUsers";
import PersonalProfile from "./components/UserProfile/Profiles";
import Chats from "./components/Chat/Chat";




const RootUI = () => {
  
	return (
		<AuthProvider>
		<AppDataProvider>
			<Router>
					<Sidebar />
					<Routes>
						<Route path="/user" element={<PersonalProfile />} />
						<Route path="/chat" element={<Chats />} />
						<Route path="/friends" element={<FriendsAndUsers />} />
						<Route path="/users/:id" element={<UserProfile />} />
					</Routes>
			</Router>
		</AppDataProvider>
		</AuthProvider>
	);
};

export default RootUI;
