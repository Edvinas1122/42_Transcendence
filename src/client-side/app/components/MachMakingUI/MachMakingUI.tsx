"use client"

import React, { useState, useContext } from 'react';
import WebSocketContext from './GameDataProvider';
import LiveOnline from './live/LiveOnline';

const MachMakingUI: React.FC = () => {

	return (
		<>
		<div className={"Segment"}>
			<h2>Join Game Controller</h2>
		</div>
		<div className={"Segment"}>
			<h2>Live Que View</h2>
			<LiveOnline/>
		</div>
		</>
	);
}

export default MachMakingUI;