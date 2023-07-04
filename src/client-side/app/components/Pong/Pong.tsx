"use client";
import WebSocketContext, { useWebSocket } from '../MachMakingUI/GameDataProvider';
import React, { useEffect, useContext, useState } from 'react';
import { GameKeyContext } from './GameKeyProvider';
import { notFound } from 'next/navigation';
import "./Pong.css";


interface PongGamePlayerUpdate {
	// playerId: number,
	x: number,
	gameKey: string,
}

interface BallPosition {
	x: number,
	y: number,
}

interface PongGameData {
	oponent_pong_position: number
	ball_position: BallPosition
}

const PongGameDisplay: React.FC<PongGameData> = ({
	oponent_pong_position,
	ball_position,
}: PongGameData) => {

	const [player_pong_position, setPlayerPongPosition] = useState<number>(0);
	const [opponent_pong_position, setOpponentPongPosition] = useState<number>(0);
	const { gameKey } = useContext(GameKeyContext);
	const Socket = useContext(WebSocketContext);

	if (!gameKey) {
		notFound();
	}

	useEffect(() => {
		const mouseMoveHandler = (event: MouseEvent) => {
			// The factor 100 is used to convert pixel to vh (viewport height)
			setPlayerPongPosition(event.clientY / window.innerHeight * 100 - 50);
			Socket.emit('events', { event: "pongGamePlayerUpdate", data: {x: event.clientY, gameKey: gameKey}});
		}
		window.addEventListener('mousemove', mouseMoveHandler);
		return () => {
			window.removeEventListener('mousemove', mouseMoveHandler);
		}
	}, []);

	useEffect(() => {
		if (gameKey) {
		}
	}, [gameKey]);

	return (
		<>
		<div className="pong-container">
			<div className="pong-player" style={{top: player_pong_position + "vh"}}></div>
			<div className="pong-ball" style={{top: ball_position.y + "vh", left: ball_position.x + "vw"}}></div>
			<div className="pong-player" style={{top: opponent_pong_position + "vh"}}></div>
		</div>
		</>
	);
}

const PongGame: React.FC = () => {
	
	const { gameKey } = useContext(GameKeyContext);
	const Socket = useWebSocket();
	const [gameData, setGameData] = useState<PongGameData>({
		oponent_pong_position: 0,
		ball_position: {
			x: 0,
			y: 0,
		}

	});

	const GameActionDisplay = (data: PongGameData) => {
		setGameData(data);
	}

	useEffect(() => {
		if (gameKey) {
			Socket.on('PongData', (data: PongGameData) => {
				console.log(data);
			});
			return () => {
				Socket.off('PongData');
			};
		}
	}, [gameKey]);

	return (
		<>
		<div className={"Display"}>
			<PongGameDisplay
				oponent_pong_position={gameData.oponent_pong_position}
				ball_position={gameData.ball_position}
			/>
		</div>
		</>
	);
}

export default PongGame;