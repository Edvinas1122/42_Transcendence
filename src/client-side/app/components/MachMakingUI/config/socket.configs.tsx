import { SocketOptions } from 'socket.io-client';

export interface SocketSettings {
	url: string,
	options: SocketOptions
}

export const connectSettings = (token: string): SocketSettings => {
	// const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
	const url = "http://localhost:3000";
	if (url == undefined) {
		throw new Error("Socket URL is undefined");
	}
	return (	
		{
			url: url,
			options: {
				// autoConnect: true,
				// reconnection: true,
				// reconnectionAttempts: 100,
				// reconnectionDelay: 2000,
				// reconnectionDelayMax: 5000,
				// randomizationFactor: 0.5,
				auth: {
					token: token,
				},
			}

		}
	)
}

