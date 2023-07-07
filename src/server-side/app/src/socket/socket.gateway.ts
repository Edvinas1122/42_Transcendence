import { WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { Inject, UnauthorizedException } from '@nestjs/common';
// import { WSMessage, SystemMessage, SystemEvent } from './events.types';
// import { Chat } from '../chat/entities/chat.entity';

const corsWSConfig = { cors: {
	origin: [process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL, "http://localhost:3030"],
	// origin: "*",
	// methods: ["GET", "POST", ],
	credentials: true
}}

interface WSMessage {
	event: string;
	data: any;
	userId: number;
}

@WebSocketGateway({ ...corsWSConfig })
export class SocketGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		@Inject(UsersService)
		private userService: UsersService
	) {}
	@WebSocketServer()
	public server: Server;
	private userSocketMap = new Map<number, Set<Socket>>();
	private handlers: { [event: string]: {handler: (payload: any) => any | null, responseChannel: string} } = {};
    private disconnectors: Array<(userId: number) => void> = [];

    public registerDicconnector(disconnector: (userId: number) => void) {
        this.disconnectors.push(disconnector);
    }

	public registerHandler(
		event: string,
		handler: (payload: any) => any,
		responseChannel: string
	) {
		this.handlers[event] = {
			handler,
			responseChannel
		};
	}

	@SubscribeMessage('events')
	SubscribtionToGame(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: WSMessage,
	): void {
		const userId = this.authHandle(client);
		this.handleWebSocketMessage(client, payload, userId);
	}

	public sendToAll(subscibtion: string, message: any): void {
		this.server.emit(subscibtion, message);
	}

	public sendToUser(
		subscibtion: string,
		userId: number,
		message: any
	): void {
		const sockets = this.userSocketMap.get(userId);
		if (sockets) {
			sockets.forEach(socket => {
				socket.emit(subscibtion, message);
		});
		}
	}

	private handleWebSocketMessage(
		client: Socket,
		payload: WSMessage,
		userId: number
	) {
		if (this.handlers[payload.event]) {
			payload.data = { ...payload.data, userId };
			try {
				const response = this.handlers[payload.event].handler(payload.data);
				if (response) {
					client.emit(this.handlers[payload.event].responseChannel, response);
				}
			} catch (e) {
				client.emit(this.handlers[payload.event].responseChannel, e);
			}
		} else {
			console.warn(`No handler registered for event "${payload.event}"`);
		}
	}

	handleConnection(client: Socket, ...args: any[]) {
		const userId = this.authHandle(client, true);
		this.addToMap(userId, client);
	}

    handleDisconnect(client: Socket) {
        for (let [userId, sockets] of this.userSocketMap.entries()) {
            if (sockets.has(client)) {
                sockets.delete(client);
                if (sockets.size === 0) {
                    this.userSocketMap.delete(userId);
                    client.disconnect();

                    // Trigger the registered disconnectors for the user
                    for (let disconnector of this.disconnectors) {
                        disconnector(userId);
                    }
                }
                break;
            }
        }
    }

	public CheckUserConnection(userId: number): boolean {
		const sockets = this.userSocketMap.get(userId);
		if (sockets) {
			return true;
		}
		return false;
	}

	private addToMap(userId: number, client: Socket)
	{
		let userSockets = this.userSocketMap.get(userId);
		if (!userSockets) {
		userSockets = new Set();
		this.userSocketMap.set(userId, userSockets);
		}
		userSockets.add(client);
	}

	private authHandle(client: Socket, checkDB: boolean = false): number {
		const token = client.handshake.auth.token as string;
		try {
			const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
			const userId = decodedToken['id'];
			if (checkDB) {
				const user = this.userService.findUser(userId).then((user) => {
					if (!user) {
						this.handleDisconnect(client);
					}
				});
			}
			client.emit('authorized', 'user. connected to the server');
			return userId;
		} catch (error) {
			console.log(`Client connection failed: ${error}`);
			client.emit('unauthorized', 'Invalid token');
			client.disconnect();
		}
	}

}
