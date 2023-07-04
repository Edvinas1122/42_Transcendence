import { Inject, Injectable } from '@nestjs/common';
import { SocketGateway } from '../socket/socket.gateway';
import { UsersService } from '../users/users.service';


interface PongGameData {
	player1Pos: number;
	player2Pos: number;
	ballPos: number;
	gameId: number;
	run: boolean;
};

interface GameCommenceData {
	begin: boolean,
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
	}

	private liveGameInstancesMap = new Map<string, PongGameData>();
	
	public handleJoinGameQue(userId1: number, userId2:number, gameId:number): string {
		const GAME_BEGIN_DELAY = 3000;
		const gameKey = this.generateGameKey(userId1, userId2);
		if (!this.liveGameInstancesMap.has(gameKey)) {
			this.liveGameInstancesMap.set(gameKey, {
				player1Pos: 0,
				player2Pos: 0,
				ballPos: 0,
				gameId: gameId,
				run: true,
			});
		}
		const GameCommenceInitiateMessage: GameCommenceData = {
			begin: true,
		};
		setTimeout(() => {
			this.sendToUserProtected('GameCommence', userId1, GameCommenceInitiateMessage);
			this.sendToUserProtected('GameCommence', userId2, GameCommenceInitiateMessage);
		}, GAME_BEGIN_DELAY);
		return gameKey;
	}

	async gameLoop() {

	}
	
	private generateGameKey(player1ID: number, player2ID: number): string {
		return `${player1ID}-${player2ID}`;
	}

	private sendToUserProtected(subcription: string, userId: number, message: any) {
		// if (this.userInMap(userId)) {
			this.socketGateway.sendToUser(subcription, userId, message);
		// }
	}

	handleDisconnect(userId: number) {
		// ...
		// Iterate over the keys in the map and remove any game instances involving the disconnected user
		for (let gameKey of this.liveGameInstancesMap.keys()) {
			let [player1ID, player2ID] = gameKey.split('-').map(Number);
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
		return this.liveGameInstancesMap.has(userId.toString());
	}

}
