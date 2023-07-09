"use client";

import React, { useState, useContext } from 'react';
import WebSocketContext from './GameDataProvider';
import LiveOnline from './live/LiveOnline';
import { InviteUserInterface } from './live/LiveOnline';
import { JoinOnline } from './live/LiveJoin';
import { useSearchParams } from 'next/navigation';
import "./Que.css";


const MachMakingUI: React.FC = () => {

	const searchParams = useSearchParams();
	const search = searchParams.get('join');

	return (
		<>
		<div className={"MachMaker"}>
			{search ?
				(<>
					<JoinOnline
						joinKey={search}
					/>
				</>) : 
				(<>
					<h2>Live Que View</h2>
					<LiveOnline/>
					<InviteUserInterface/>
				</>)
			}
		</div>
		</>
	);
}

export default MachMakingUI;