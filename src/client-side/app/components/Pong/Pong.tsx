"use client";
import WebSocketContex from '../MachMakingUI/GameDataProvider';
import React, { useEffect, useContext, useState } from 'react';
import { GameKeyContext } from './GameKeyProvider';
import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import "./Pong.css";


interface PongGamePlayerUpdate {
	oponent_pong_position: number,
	ball_position: BallPosition,
	end_game?: boolean,
	end_game_reason?: string,
	score1?: number,
	score2?: number,
}

interface BallPosition {
	x: number,
	y: number,
}

interface PongGameData {}

function pixelsToScreenPosition(pixels: number): number {
	return pixels / window.innerHeight * 100 - 50;
}

const PongGameDisplay: React.FC<PongGameData> = ({}: PongGameData) => {

	const [player_pong_position, setPlayerPongPosition] = useState<number>(0);
	const [opponent_pong_position, setOpponentPongPosition] = useState<number>(0);
	const [ball_position, setBallPosition] = useState<BallPosition>({x: 0, y: 0});
    const [displayScore, setDisplayScore] = useState<string>("0 - 0");
    const [showScore, setShowScore] = useState<boolean>(false);
	const router = useRouter();
	const { gameKey } = useContext(GameKeyContext);
	const Socket = useContext(WebSocketContex);

	if (!gameKey || !Socket) {
		notFound();
	}

	useEffect(() => {
		const mouseMoveHandler = (event: MouseEvent) => {
			setPlayerPongPosition(pixelsToScreenPosition(event.clientY));
			Socket.emit('events', { event: "pongGamePlayerUpdate", data: {
				x: pixelsToScreenPosition(event.clientY),
				gameKey: gameKey
			}});
		}
		window.addEventListener('mousemove', mouseMoveHandler);
		return () => {
			window.removeEventListener('mousemove', mouseMoveHandler);
		}
	}, [gameKey, Socket]);

	const endGameHadler	= (data: PongGamePlayerUpdate) => {

		setTimeout(() => {
			router.push('/game');
		}, 2000);
			
	}

	useEffect(() => {
		if (gameKey) {
			Socket.emit('events', { event: "pongGameBegin", data: {
				gameKey: gameKey
			}});
			Socket.on('pongGamePlayerUpdate', (data: PongGamePlayerUpdate) => {
				console.log(data);
				if (data?.score1)
				{
					setDisplayScore(`${data.score1}-${data.score2}`);
                    setShowScore(true); // Make score visible

                    // After 1 second, make score invisible
                    setTimeout(() => setShowScore(false), 1000);
				}
				if (data.end_game) {
					setDisplayScore(data?.end_game_reason ? data.end_game_reason : "Game Over");
					endGameHadler(data);
				}
				setOpponentPongPosition(data.oponent_pong_position);
				setBallPosition(data.ball_position);
			});
			return () => {
				Socket.off('pongGamePlayerUpdate');
			};
		}
	}, [gameKey, Socket]);

	return (
		<>
		<div className="pong-container">
			<div className="pong-player" style={{top: player_pong_position + "vh"}}></div>
			{/* Show the score only when showScore is true */}
			{showScore && <div className="pong-score">{displayScore}</div>}
			<div className="pong-ball" style={{top: ball_position.y + "vh", left: ball_position.x + "vw"}}></div>
			<div className="pong-player" style={{top: opponent_pong_position + "vh"}}></div>
		</div>
		</>
	);
}

const PongGame: React.FC = () => {

	return (
		<>
		<div className={"Display PongMain"}>
			<PongGameDisplay/>
		</div>
		</>
	);
}

export default PongGame;