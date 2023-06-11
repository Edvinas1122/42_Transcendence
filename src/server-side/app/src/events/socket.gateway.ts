// import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import * as jwt from 'jsonwebtoken';
// import { WSMessage, SystemMessage, SystemEvent } from './events.types';
// // import { Chat } from '../chat/entities/chat.entity';

// const corsWSConfig = { cors: {
// 	origin: process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL,
// 	methods: ["GET", "POST"],
// 	credentials: true
// }}

// @WebSocketGateway({ namespace: '/events', ...corsWSConfig})
// export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
// 	@WebSocketServer()
// 	server: Server;
// 	private userSocketMap = new Map<number, Set<Socket>>();

// 	handleConnection(client: Socket, ...args: any[]) {
// 		const token = client.handshake.query.token as string;
		
// 		try {
// 		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
// 		const userId = decodedToken['id'];
// 		console.log(`Client connected: ${userId}`);
		
// 		client.emit('events', SystemMessage(SystemEvent.SUCCESS, 'Connected to server'));
// 		this.addToMap(userId, client);
// 		// this.userSocketMap.set(userId, client);
// 		} catch (error) {
// 		console.log('Invalid token, disconnecting client...');
// 		client.emit('events', SystemMessage(SystemEvent.ERROR, 'Invalid token, disconnecting client...'));
// 		client.disconnect();
// 		}
// 	}

// 	@SubscribeMessage('events')
// 	SubscribtionToEvent(client: Socket, payload: any): string {
// 		return 'Hello world!';
// 	}

// 	@SubscribeMessage('messages')
// 	SubscribtionToMessages(client: Socket, payload: any): string {
// 		return 'Hello world!';
// 	}

// 	@SubscribeMessage('game')
// 	SubscribtionToGame(client: Socket, payload: any): string {
// 		return 'Hello world!';
// 	}

// 	handleDisconnect(client: Socket) {
// 		for (let [userId, sockets] of this.userSocketMap.entries()) {
// 		if (sockets.has(client)) {
// 			sockets.delete(client);
// 			if (sockets.size === 0) {
// 			console.log(`Client disconnected: ${userId}`);
// 			this.userSocketMap.delete(userId);
// 			client.disconnect();
// 			}
// 			break;
// 		}
// 		}
// 	}

// 	public sendToUser(userId: number, message: WSMessage): void {
// 		const sockets = this.userSocketMap.get(userId);
// 		if (sockets) {
// 		sockets.forEach(socket => {
// 			socket.emit('events', message);
// 		});
// 		}
// 	}

// 	// public sendToChat(chat: Chat, message: WSMessage): void {
// 	//   chat.participants.forEach(user => { 
// 	//     this.sendToUser(user.id, message);
// 	//   });
// 	// }

// 	private addToMap(userId: number, client: Socket)
// 	{
// 		let userSockets = this.userSocketMap.get(userId);
// 		if (!userSockets) {
// 		userSockets = new Set();
// 		this.userSocketMap.set(userId, userSockets);
// 		}
// 		userSockets.add(client);
// 	}

// }
