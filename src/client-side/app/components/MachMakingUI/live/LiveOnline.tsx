import React, {useContext, useState, useEffect} from 'react';
import WebSocketContext from '../GameDataProvider';
import { Socket } from "socket.io-client";
import {useRouter} from 'next/navigation';

interface SocketEvent {
	event: string,
	data: any,
}

interface QueInterfaceProps {
    socket: Socket;
}

const QueInterface: React.FC<QueInterfaceProps> = ({
	socket
}:QueInterfaceProps
) => {

	const joinGameMessage = {
		event: "joinGame",
		data: {
			gameId: 1,
		}
	}
	const leaveGameMessage = {
		event: "leaveGame",
		data: {
			gameId: 1,
		}
	}

	const onClick = () => {
		socket.emit('events', joinGameMessage);
	}

	const onClickLeave = () => {
		socket.emit('events', leaveGameMessage);
	}

	return (
		<>
			<button onClick={onClick}>JoinQue</button>
			<button onClick={onClickLeave}>LeaveQue</button>
		</>
	)
}

const QueList: React.FC = () => {


	return (
		<>

		</>
	)
}

interface GameCommenceData {
	begin: boolean,
}


const Countdown: React.FC<{
	gameKey: string,
	socket: Socket,
	setVisibility: (abort: boolean) => void,
}> = ({
	gameKey,
	socket,
	setVisibility,
}) => {

	const [countdown, setCountdown] = useState(3);
	const [abort, setAbort] = useState(false);
	const [starting, setStarting] = useState(false);
	const [serverResponded, setServerResponded] = useState(false);
	// const [failure, setFailure] = useState(false);
	const router = useRouter();
	// const gameKey = gameKey;

    const redirect = (event: GameCommenceData) => {
		console.log("redirect", event);
		if (!event.begin) {
			setAbort(true);

			setTimeout(() => {
				setVisibility(false);
			}, 1500);
			return;
		}
		setServerResponded(true);
        router.push(`/game?match=${gameKey}`);
    };

    useEffect(() => {
        if (countdown > 0 && !abort) {
			socket.on('GameCommence', redirect);
            setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0) {
			setStarting(true);
			setTimeout(() => {
				// if (!serverResponded){
				// 	setFailure(true);
				// }
				setTimeout(() => {
					setVisibility(false);
				}, 1000);
			}, 1500);
			return;
        }
		return () => {
			socket.off('GameCommence');
		}
    }, [gameKey, redirect]);

	// if (failure) return <p>Game Failed to Start</p>
	if (starting) return <p>Game Starting...</p>
	if (abort) return <p>Game Aborted</p>
    return <p>Game Starts in {countdown}...</p>
};

interface MachMakingData {
	info: string,
	gameKey?: number,
}

const LiveOnline: React.FC = () => {
    const Socket = useContext(WebSocketContext);
    const [onlineList, setOnlineList] = useState("");
	const [gameMachKey, setGameMachKey] = useState<null | string>(null);

    useEffect(() => {
        if (!Socket) return;

        const handleQueInfoUpdate = (event: any) => {
            console.log("que update", event);
        };

        const handleMatchMade = (event: MachMakingData) => {
            console.log("match made", event);
			if (event?.gameKey !== undefined) {
				setGameMachKey(event.gameKey);
			}
        };

        Socket.on('liveGameQueInfo', handleQueInfoUpdate);
        Socket.on('MachMaking', handleMatchMade);

        // Return a function to clean up the listener when the component unmounts
        return () => {
            Socket.off('liveGameQueInfo');
            Socket.off('MachMaking');
        };
    }, [Socket]);

    return (
        <>
            <p>{onlineList}</p>
            {gameMachKey && <Countdown
					gameKey={gameMachKey}
					socket={Socket}
					setVisibility={setGameMachKey}
			/>}
            {Socket && <QueInterface socket={Socket}/>}
        </>
    )
}

export default LiveOnline;