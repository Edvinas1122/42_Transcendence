"use client";
import React, {useEffect, useState} from 'react';
import { AuthContext } from '../ContextProviders/authContext';
import { io, Socket } from "socket.io-client";
import { connectSettings, SocketSettings } from './config/socket.configs';

const WebSocketContext = React.createContext<Socket | null>(null);

interface WebSocketProviderProps {
	children: React.ReactNode;
}

const WebSocketProvider: React.FC<WebSocketProviderProps> = (
	{children}
) => {
	const { token } = React.useContext(AuthContext);
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		if (!token) return;
		const settings: SocketSettings = connectSettings(token);

		const newSocket = io(settings.url, settings.options);
		setSocket(newSocket);
		return () => {
			newSocket.close();
		};
	}, [token]);

	return (
		<>
		<WebSocketContext.Provider value={socket}>
			{children}
		</WebSocketContext.Provider>
		</>
	);
};


export { WebSocketProvider };
export default WebSocketContext;