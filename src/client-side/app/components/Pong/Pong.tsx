"use client";
import WebSocketContex from '../MachMakingUI/GameDataProvider';
import React, { useEffect, useContext, useState } from 'react';
import { GameKeyContext } from './GameKeyProvider';
import { notFound, useRouter } from 'next/navigation';
import { Socket } from 'socket.io-client';
import GameCustomizationNegotiation from './GameCustomizationNegotiation';
import "./Pong.css";


interface PongGamePlayerUpdate {
	oponent_pong_position: number,
	ball_position: BallPosition,
	end_game?: boolean,
	end_game_reason?: string,
	score1?: number,
	score2?: number,
}

interface gameCustomizationRequest {
	winCondition: 'score' | 'time',
	winConditionValue: number,
	ballType: 'simple' | 'speedy' | 'bouncy',
}

interface BallPosition {
	x: number,
	y: number,
}

interface PongGameData {
	Socket: Socket,
	gameKey: string,
	endGame: () => void,
}

function pixelsToScreenPosition(pixels: number): number {
	return pixels / window.innerHeight * 100 - 50;
}

const PongGameDisplay: React.FC<PongGameData> = ({
	Socket,
	gameKey,
	endGame,
}: PongGameData) => {

	const [player_pong_position, setPlayerPongPosition] = useState<number>(0);
	const [opponent_pong_position, setOpponentPongPosition] = useState<number>(0);
	const [ball_position, setBallPosition] = useState<BallPosition>({x: 0, y: 0});
    const [displayScore, setDisplayScore] = useState<string>("0 - 0");
    const [showScore, setShowScore] = useState<boolean>(false);

	useEffect(() => {
		const mouseMoveHandler = (event: MouseEvent) => {
			console.log(event.clientY);
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

	useEffect(() => {
		if (gameKey) {


			const scoreDisplay = (data: PongGamePlayerUpdate) => {
				if (data?.score1 || data?.score2) {
					setDisplayScore(`${data.score1}-${data.score2}`);
                    setShowScore(true);
                    setTimeout(() => setShowScore(false), 1000);
				}
			}

			const manageGameLifecycle = (data: PongGamePlayerUpdate) => {
				if (data.end_game) {
					setDisplayScore(data?.end_game_reason ? data.end_game_reason : "Game Over");
					endGame();
				}
			}
			
			
			Socket.on('pongGamePlayerUpdate', (data: PongGamePlayerUpdate) => {
				scoreDisplay(data);
				manageGameLifecycle(data);
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
			{showScore && <div className="pong-score">{displayScore}</div>}
			<div className="pong-ball" style={{top: ball_position.y + "vh", left: ball_position.x + "vw"}}></div>
			<div className="pong-player" style={{top: opponent_pong_position + "vh"}}></div>
			</div>
		</>
	);
}

const PongGame: React.FC = () => {

	const [negotiating, setNegotiating] = useState<boolean>(true);
	const { gameKey } = useContext(GameKeyContext);
	const Socket = useContext(WebSocketContex);
	const router = useRouter();

	if (!gameKey || !Socket) {
		notFound();
	}

	const gameBeginInitiative = (
		gameCustomization: gameCustomizationRequest
	) => {
		Socket.emit('events', { event: "pongGameBegin", data: {
			gameKey: gameKey,
			gameCustomization: gameCustomization
		}});
		setNegotiating(false);
	}

	const endGameHadler = () => {
		setTimeout(() => {
			router.replace('/game');
		}, 1000);
	}

	const LifeCycleHandle = (data: PongGamePlayerUpdate) => {
		if (data.end_game) {
			endGameHadler();
		}
	}

	useEffect(() => {
		if (Socket) {
			Socket.on('PongGameLifecycle', LifeCycleHandle);
			return () => {
				Socket.off('PongGameLifecycle');
			};
		}
	},[Socket]);

	return (
		<>
		<div className={"Display PongMain"}>
			{negotiating ? (
				<GameCustomizationNegotiation
					startGame={gameBeginInitiative}
				/>
			):(
				<PongGameDisplay
					Socket={Socket}
					gameKey={gameKey}
					endGame={endGameHadler}
				/>
			)}
		</div>
		</>
	);
}

export default PongGame;