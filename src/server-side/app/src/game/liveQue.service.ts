import { Inject, Injectable } from '@nestjs/common';
import { SocketGateway } from '../socket/socket.gateway';
import { UsersService } from '../users/users.service';
import { GameService } from './pongGame.service';

interface MachedData {
	info: string,
	gameKey?: string,
}

@Injectable()
export class LiveGameQue {
	constructor(
		@Inject(SocketGateway)
		private socketGateway: SocketGateway,
		private gameService: GameService,
	) {
		this.socketGateway.registerHandler('joinGame', this.handleJoinGameQue.bind(this), 'liveGameQueResponse');
		this.socketGateway.registerHandler('leaveGame', this.handleLeaveGameQue.bind(this), 'liveGameQueResponse');
		this.socketGateway.registerDicconnector(this.handleDisconnect.bind(this));
	}

	private liveGameQueMap = new Map<number, Set<number>>(); // key: userid, value: gameId


    handleJoinGameQue(data: { userId: number, gameId: number }): string {
        const { userId, gameId } = data;
        if (!this.liveGameQueMap.has(gameId)) {
            this.liveGameQueMap.set(gameId, new Set());
        }
        this.liveGameQueMap.get(gameId).add(userId);
        console.log(`User ${userId} joined game ${gameId}. Queue size: ${this.liveGameQueMap.get(gameId).size}`);

        this.socketGateway.sendToAll('liveGameQueInfo', `Have joined game ${gameId}`);

        this.AttemptToMatchGame(gameId);

        return `Have joined game ${gameId}`;
    }

	handleLeaveGameQue(data: { userId: number, gameId: number }): null {
		const { userId, gameId } = data;
		const gameQueue = this.liveGameQueMap.get(gameId);

		if (!gameQueue) {
			this.socketGateway.sendToUser('liveGameQueInfo', userId, `Game ${gameId} does not exist`);
			return null;
		}
		if (!gameQueue.has(userId)) {
			this.socketGateway.sendToUser('liveGameQueInfo', userId, `Game ${gameId} does not exist`);

		}
		gameQueue.delete(userId);
		console.log(`User ${userId} left game ${gameId}. Queue size: ${gameQueue.size}`);

		// If the game queue is empty, remove it from the map
		if (gameQueue.size === 0) {
			this.liveGameQueMap.delete(gameId);
			console.log(`Game ${gameId} queue is empty and has been removed`);
		}

		this.socketGateway.sendToAll('liveGameQueInfo', `Have left game ${gameId}`);
		return null;

	}

    private AttemptToMatchGame(gameId: number): void {
        const gameQueue = this.liveGameQueMap.get(gameId);

		if (!gameQueue) return;
        if (gameQueue.size >= 2) {
            const playerIds = Array.from(gameQueue);
            const player1Id = playerIds[0];
            const player2Id = playerIds[1];

            // Remove the matched players from the queue
            gameQueue.delete(player1Id);
            gameQueue.delete(player2Id);

			const announce: MachedData = {
				info: `Matched`,
			}

			const gameKey = this.gameService.handleJoinGameQue(player1Id, player2Id, gameId);
			const player1Key: MachedData = {
				info: `Matched`,
				gameKey: this.gameKeyIDAdder(player1Id, gameKey),
			}
			const player2Key: MachedData = {
				info: `Matched`,
				gameKey: this.gameKeyIDAdder(player2Id, gameKey),
			}
            this.socketGateway.sendToUser('MachMaking', player1Id, player1Key);
            this.socketGateway.sendToUser('MachMaking', player2Id, player2Key);
			
            // Send the game key to the matched players
        }
    }

	private gameKeyIDAdder(userId: number, gameKey: string): string {
		return `${gameKey}-${userId}`;
	}

	handleDisconnect(userId: number) {
		for (let [gameId, gameQueue] of this.liveGameQueMap.entries()) {
			if (gameQueue.has(userId)) {
				gameQueue.delete(userId);
				console.log(`User ${userId} disconnected from game ${gameId}. Queue size: ${gameQueue.size}`);

				if (gameQueue.size === 0) {
					this.liveGameQueMap.delete(gameId);
					console.log(`Game ${gameId} queue is empty and has been removed`);
				}
			}
		}
	}
}