import React, {useContext, useState, useEffect} from 'react';
import WebSocketContext from '../GameDataProvider';
import { Socket } from "socket.io-client";

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


const Countdown: React.FC<{count: number, redirect: () => void}> = ({count, redirect}) => {
    useEffect(() => {
        if (count > 0) {
            setTimeout(() => setCount(count - 1), 1000);
        } else if (count === 0) {
            redirect();
        }
    }, [count, redirect]);

    return <p>Redirecting in {count}...</p>
};


const LiveOnline: React.FC = () => {
	const Socket = useContext(WebSocketContext);
	const [onlineList, setOnlineList] = useState("");

	useEffect(() => {
		if (!Socket) return;
		
		const handleQueInfoUpdate = (event: any) => {
			console.log("que update", event);
			// setOnlineList(event);
		};

		const handleMachMade = (event: any) => {
			console.log("mach made", event);
			// setOnlineList(event);
		};
		
		console.log("adding listener")
		Socket.on('liveGameQueInfo', handleQueInfoUpdate);
		Socket.on('MachMaking', handleMachMade);
		
		// Return a function to clean up the listener when the component unmounts
		return () => {
			Socket.off('liveGameQueInfo');
			Socket.off('MachMaking');
		};
	}, [Socket]);

	return (
		<>
			<p>
				{onlineList}
			</p>
			{Socket && <QueInterface socket={Socket}/>}
		</>
	)
}

export default LiveOnline;