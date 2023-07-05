"use client"

import React, { useState, useContext } from 'react';
import WebSocketContext from './GameDataProvider';
import LiveOnline from './live/LiveOnline';
import { InviteUserInterface } from './live/LiveOnline';
import "./Que.css";

const MachMakingUI: React.FC = () => {

	return (
		<>
		<div className={"MachMaker"}>
			<h2>Live Que View</h2>
			<LiveOnline/>
			<InviteUserInterface/>
		</div>
		</>
	);
}

export default MachMakingUI;