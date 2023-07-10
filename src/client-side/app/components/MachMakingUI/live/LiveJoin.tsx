"use client";
import React, {useContext, useState, useEffect} from 'react';
import WebSocketContext from '../GameDataProvider';
import { notFound, useRouter } from "next/navigation";
import { GameKeyContext } from '@/components/Pong/GameKeyProvider';

interface MachMakingData {
	error?: boolean,
	message?: string,
	info: string,
	gameKey: string,
}

interface joinViaInviteData {
	joinKey: string;
}

interface JoinOnlineProps {
	joinKey: string;
}

export const JoinOnline: React.FC<JoinOnlineProps> = ({
	joinKey
}: JoinOnlineProps
) => {
	const Socket = useContext(WebSocketContext);
	const [gameInfo, setGameInfo] = useState<string>("");
	const [error, setError] = useState<boolean>(false);
	const [waiting, setWaiting] = useState<boolean>(true);
	const { setGameKey } = useContext(GameKeyContext);
	const router = useRouter();

	useEffect(() => {
		if (error) {
			notFound();
		}
	}, [error]);

	const redirect = () => {
		router.replace(`/game/pong/`);
	}

	useEffect(() => {
		if (!Socket) return;

		const joinGame = (joinKey: joinViaInviteData) => {
			console.log("joinGame", joinKey);
			Socket.emit("events", {
				event: "joinViaInvite",
				data: joinKey,
			});
		}

		Socket.on("MatchMaking", (data: MachMakingData) => {
			console.log("MatchMaking", data);
			if (data?.error) {
				setError(true);
			} else {
				setGameKey(data.gameKey);
				setWaiting(false);
				setGameInfo("Game Starting!");
				setTimeout(() => redirect(), 900);
			}
		});

		joinGame({joinKey: joinKey});

		return () => {
			Socket.off("MatchMaking");
		}
	}, [Socket, joinKey]);

	return (
		<>
			{waiting ?
				(	<>
						<p>Waiting for player to start a game...</p>
					</>
				):
				(	<>
						<p>{gameInfo}</p>
					</>
				)
			}
		</>
	);
};