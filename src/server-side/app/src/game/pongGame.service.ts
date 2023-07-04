import { Inject, Injectable } from '@nestjs/common';
import { SocketGateway } from '../socket/socket.gateway';
import { UsersService } from '../users/users.service';


interface PongGameData {
	player1Id: number;
	player2Id: number;
	player1Pos: number;
	player2Pos: number;
	ballPos: BallPosition;
	gameId: number;
	run: boolean;
};

interface GameCommenceData {
	begin: boolean,
}

interface PongGamePlayerUpdate {
	x: number,
	gameKey: string,
}

interface BallPosition {
	x: number,
	y: number,
}

interface PongGameDataUserUpdate {
	oponent_pong_position: number
	ball_position: BallPosition
}

@Injectable()
export class GameService {

	constructor(
		@Inject(SocketGateway)
		private socketGateway: SocketGateway,
		@Inject(UsersService)
		private usersService: UsersService,
	) {
		this.socketGateway.registerDicconnector(this.handleDisconnect.bind(this));
		this.socketGateway.registerHandler('pongGamePlayerUpdate', this.handleGameUpdate.bind(this), 'pongGamePlayerUpdateResponse');
	}

	private liveGameInstancesMap = new Map<string, PongGameData>();
	
	public handleJoinGameQue(userId1: number, userId2:number, gameId:number): string {
		const GAME_BEGIN_DELAY = 1000;
		const gameKey = this.generateGameKey(userId1, userId2);
		if (!this.liveGameInstancesMap.has(gameKey)) {
			this.liveGameInstancesMap.set(gameKey, {
				player1Id: userId1,
				player2Id: userId2,
				player1Pos: 0,
				player2Pos: 0,
				ballPos: {x: 0, y: 0},
				gameId: gameId,
				run: true,
			});
		}
		const GameCommenceInitiateMessage: GameCommenceData = {begin: true};
		setTimeout(() => {
			this.sendToUserProtected('GameCommence', userId1, GameCommenceInitiateMessage);
			this.sendToUserProtected('GameCommence', userId2, GameCommenceInitiateMessage);
			this.gameInstanceLoop(userId1, userId2, gameKey).then(() => {
				console.log(`Game instance loop ended for key: ${gameKey as string}`);
			});
		}, GAME_BEGIN_DELAY);
		return gameKey;
	}

	async gameInstanceLoop(playerId1: number, playerId2: number, gameKey: string)
	{
		const GAME_LOOP_DELAY = 30;
		const gameInstance = this.liveGameInstancesMap.get(gameKey);
		if (!gameInstance) {
			console.error(`Game instance not found for key: ${gameKey as string}`);
			return;
		}
		while (gameInstance.run) {
			const gameDataForPlaye1: PongGameDataUserUpdate = {
				oponent_pong_position: gameInstance.player2Pos,
				ball_position: {
					x: gameInstance.ballPos.x,
					y: gameInstance.ballPos.y,
				},
			};
			const gameDataForPlaye2: PongGameDataUserUpdate = {
				oponent_pong_position: gameInstance.player1Pos,
				ball_position: {
					x: gameInstance.ballPos.x,
					y: gameInstance.ballPos.y,
				},
			};
			this.sendToUserProtected('pongGameUpdate', playerId1, gameDataForPlaye1);
			this.sendToUserProtected('pongGameUpdate', playerId2, gameDataForPlaye2);
			await this.sleep(GAME_LOOP_DELAY);
		}
	}

	private sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	handleGameUpdate(data: PongGamePlayerUpdate): void {
		const { x, gameKey } = data;
		const { player1ID, player2ID, currentPlayer } = this.parseGameKey(gameKey);
		const defaultKey = this.generateGameKey(player1ID, player2ID);
		this.updateGameInstance(defaultKey, x, currentPlayer);
	}

	private updateGameInstance(defaultKey: string, x: number, currentPlayerId: number) {

		const gameInstance = this.liveGameInstancesMap.get(defaultKey);
	
		if (!gameInstance) {
			console.error(`Game instance not found for key: ${defaultKey as string}`);
			return;
		}
		if (gameInstance.player1Id === currentPlayerId) {
			gameInstance.player1Pos = x;
		} else if (gameInstance.player2Id === currentPlayerId) {
			gameInstance.player2Pos = x;
		}
		this.liveGameInstancesMap.set(defaultKey, gameInstance);
	}

	private generateGameKey(player1ID: number, player2ID: number): string {
		return `${player1ID}-${player2ID}`;
	}

	private sendToUserProtected(subcription: string, userId: number, message: any) {
		if (this.userInMap(userId)) {
			this.socketGateway.sendToUser(subcription, userId, message);
		}
	}

	private parseGameKey(gameKey: string): { player1ID: number, player2ID: number, currentPlayer: number } {
		const [player1ID, player2ID, currentPlayer] = gameKey.split('-').map(Number);
		return { player1ID, player2ID, currentPlayer };
	}

	handleDisconnect(userId: number) {
		// ...
		// Iterate over the keys in the map and remove any game instances involving the disconnected user
		for (let gameKey of this.liveGameInstancesMap.keys()) {
			let {player1ID, player2ID, currentPlayer} = this.parseGameKey(gameKey)
			if (player1ID === userId || player2ID === userId) {
				this.liveGameInstancesMap.delete(gameKey);
				
				// Identify the ID of the other player in the game
				const otherPlayerId = player1ID === userId ? player2ID : player1ID;
				
				// Send a message to the other player to notify them that the user has disconnected
				this.socketGateway.sendToUser('GameCommence', otherPlayerId, `Player ${userId} has disconnected.`);
			}
		}
		console.log(`User ${userId} disconnected. Live game instances: ${this.liveGameInstancesMap.size}`);
	}

	private userInMap(userId: number): boolean {
		for (let gameInstance of this.liveGameInstancesMap.values()) {
			if (gameInstance.player1Id === userId || gameInstance.player2Id === userId) {
				return true;
			}
		}
		return false;
	}

}
