import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import Profile from "./Profile";
import Pong from "./Pong";
import Chat from "./Chat";
import Friends from "./Friends";
import Settings from "./Settings";

import CallBackPage from "./CallBackPage";
import GamePage from './GamePage';
import WinnerPage from './WinnerPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
// 	console.log('hoo');
// 	const fetchData = async () => {
// 		const result = await fetch('https://api.intra.42.fr/oauth/token');
// 		const jsonResult = await result.json();
// 	}
// 	fetchData();
//   }, [] )

  const responseMessage = (response) => {
    console.log(response);
    console.log('Reached responseMessage in App');
    setIsAuthenticated(true);
  };

  return (
    <div className="app-container">
      <Routes>
	  	<Route path="/callback" element={<GamePage />} />
		<Route path="/winner" element={<WinnerPage />} />
		{isAuthenticated && <Sidebar isAuthenticated={isAuthenticated} />}
        <Route path="/" element={<LoginPage isAuthenticated={isAuthenticated} responseMessage={responseMessage} />} />
        {isAuthenticated && <Route path="/Dashboard" element={<Dashboard isAuthenticated={isAuthenticated} />} />}
        {isAuthenticated && <Route path="/Profile" element={<Profile isAuthenticated={isAuthenticated} />} />}
        {isAuthenticated && <Route path="/Pong" element={<Pong isAuthenticated={isAuthenticated} />} />}
        {isAuthenticated && <Route path="/Chat" element={<Chat isAuthenticated={isAuthenticated} />} />}
        {isAuthenticated && <Route path="/Friends" element={<Friends isAuthenticated={isAuthenticated} />} />}
        {isAuthenticated && <Route path="/Settings" element={<Settings isAuthenticated={isAuthenticated} />} />}
      </Routes>
    </div>
  );
}