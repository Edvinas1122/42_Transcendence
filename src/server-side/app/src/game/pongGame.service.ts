import { Inject, Injectable } from '@nestjs/common';
import { SocketGateway } from '../socket/socket.gateway';
import { UsersService } from '../users/users.service';

interface Vector {
	x: number,
	y: number,
}


interface PongGameData {
	pausedUnitl: number;
	score1: number;
	score2: number;
	ball_movement: Vector;
	player1Id: number;
	player2Id: number;
	player1Pos: number;
	player2Pos: number;
	ballPos: BallPosition;
	gameId: number;
	run: boolean;
	notify: boolean;
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
	score1?: number
	score2?: number
	end_game?: boolean
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
		const GAME_BEGIN_DELAY = 2950;
		const gameKey = this.generateGameKey(userId1, userId2);
		if (this.liveGameInstancesMap.has(gameKey)) {
			this.liveGameInstancesMap.delete(gameKey);
		}
		if (!this.liveGameInstancesMap.has(gameKey)) {
			this.liveGameInstancesMap.set(gameKey, {
				pausedUnitl: Date.now() + GAME_BEGIN_DELAY + 1,
				score1: 0,
				score2: 0,
				ball_movement: {x: 0.5, y: 0.5},
				player1Id: userId1,
				player2Id: userId2,
				player1Pos: 0,
				player2Pos: 0,
				ballPos: {x: 0, y: 0},
				gameId: gameId,
				run: true,
				notify: false,
			});
		}
		const GameCommenceInitiateMessage: GameCommenceData = {begin: true};
		setTimeout(() => {
			try {
				this.sendToUserProtected('GameCommence', userId1, GameCommenceInitiateMessage);
				this.sendToUserProtected('GameCommence', userId2, GameCommenceInitiateMessage);
				this.gameInstanceLoop(userId1, userId2, gameKey).then(() => {
					console.log(`Game instance loop ended for key: ${gameKey as string}`);
				});
			} catch (e) {
				console.error(`Error sending game commence message to user: ${userId1} or ${userId2}`);
				console.error(e);
			}
		}, GAME_BEGIN_DELAY);
		return gameKey;
	}

	async gameInstanceLoop(playerId1: number, playerId2: number, gameKey: string)
	{
		const GAME_LOOP_DELAY = 20;
		const MAX_GAME_TIME = 360000; // max game duration
		const DISCONNECT_CHECK_INTERVAL = 3000; // every 3 seconds
		const gameStartTime = Date.now();

		const gameInstance = this.liveGameInstancesMap.get(gameKey);
		console.log(`Game instance loop started for key: ${gameKey as string}`)

		if (!gameInstance) {
			console.error(`Game instance not found for key: ${gameKey as string}`);
			return;
		}
		let lastDisconnectCheckTime = Date.now();
		while (gameInstance.run && Date.now() - gameStartTime < MAX_GAME_TIME) {
			this.GameInstanceLogicHandler(gameInstance);
			const gameDataForPlaye1: PongGameDataUserUpdate = this.gameUpdateDataForPlayer(gameInstance, playerId1);
			const invertedInstance = this.invertedGameInstance(gameInstance);
			const gameDataForPlaye2: PongGameDataUserUpdate = this.gameUpdateDataForPlayer(invertedInstance, playerId2);
			this.socketGateway.sendToUser('pongGamePlayerUpdate', playerId1, gameDataForPlaye1);
			this.socketGateway.sendToUser('pongGamePlayerUpdate', playerId2, gameDataForPlaye2);
			await this.sleep(GAME_LOOP_DELAY);
			if (Date.now() - lastDisconnectCheckTime > DISCONNECT_CHECK_INTERVAL) {
				lastDisconnectCheckTime = Date.now();
				if (!this.userInMap(playerId1) || !this.userInMap(playerId2)) {
					gameInstance.run = false;
				}
			}
		}
		const gameDataForPlaye1: PongGameDataUserUpdate = this.gameUpdateDataForPlayer(gameInstance, playerId1, true);
		const gameDataForPlaye2: PongGameDataUserUpdate = this.gameUpdateDataForPlayer(gameInstance, playerId2, true);
		this.socketGateway.sendToUser('pongGamePlayerUpdate', playerId1, gameDataForPlaye1);
		this.socketGateway.sendToUser('pongGamePlayerUpdate', playerId2, gameDataForPlaye2);
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
		} else {
			throw new Error(`User ${userId} not found in map`); // can not be uncought
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
				
				const gameInstance = this.liveGameInstancesMap.get(gameKey);
				if (gameInstance) {
					gameInstance.run = false;
					this.liveGameInstancesMap.set(gameKey, gameInstance);
				}
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

	private gameUpdateDataForPlayer(gameInstance: PongGameData, playerId: number, end: boolean = false): PongGameDataUserUpdate {

		const gameDataForPlayer: PongGameDataUserUpdate = {
			oponent_pong_position: gameInstance.player1Id === playerId ? gameInstance.player2Pos : gameInstance.player1Pos,
			ball_position: {
				x: gameInstance.ballPos.x,
				y: gameInstance.ballPos.y,
			},
			end_game: end,
			score1: gameInstance.notify ? gameInstance.score1 : undefined,
			score2: gameInstance.notify ? gameInstance.score2 : undefined,
		};
		gameInstance.notify = false;
		return gameDataForPlayer;
	}

	private GameInstanceLogicHandler(gameInstance: PongGameData) {
		// Update the ball's position
		if (gameInstance.pausedUnitl > Date.now()) {
			// The ball is paused
			
		} else if (this.updateBallPosition(gameInstance)) {
			// A player scored, reset the ball
			gameInstance.ballPos.x = 0;
			gameInstance.ballPos.y = 0;
			gameInstance.ball_movement.x = 0.5;
			gameInstance.ball_movement.y = 0.5;
			// gameInstance.ball_movement = this.randMovementVector(30);
			gameInstance.pausedUnitl = Date.now() + 940;
			gameInstance.notify = true;
		}
	}

	// private randMovementVector(angleLimit: number): Vector {
	// 	// Generate a random movement vector for the ball
	// 	// The angle of the vector will be between -angleLimit and angleLimit
	// 	// The magnitude of the vector will be 1
	// 	const angle = Math.random() * angleLimit * 2 - angleLimit;
	// 	const x = Math.cos(angle);
	// 	const y = Math.sin(angle);
	// 	return { x, y };
	// }

	private updateBallPosition(gameInstance: PongGameData): boolean {
		// Update the ball's position based on its current movement vector
		let newBallPos: BallPosition = {
			x: gameInstance.ballPos.x + gameInstance.ball_movement.x,
			y: gameInstance.ballPos.y + gameInstance.ball_movement.y
		};
		console.log(`player 1: ${gameInstance.player1Pos} player 2: ${gameInstance.player2Pos} ball: ${newBallPos.y}`);
		// Check for collisions with the game boundaries
		// Assuming the game field is 100 units in both dimensions
		const FIELD_SIZE_Y = 50;
		const FIELD_SIZE_X = 40; // css 80% width
		if (newBallPos.y < -FIELD_SIZE_Y || newBallPos.y > FIELD_SIZE_Y) {
			// The ball hit the top or bottom wall, reverse its vertical direction
			gameInstance.ball_movement.y *= -1;
		}
	
		// Check for collisions with the players
		// Assuming the players' pong is at a fixed x-position
		const PLAYER1_PONG_X = -36.5; // css 80% width
		const PLAYER2_PONG_X = 36.5; // css 80% width
		const PONG_HEIGHT = 12;  // Assuming the height of the pong
	
		if (newBallPos.x <= PLAYER1_PONG_X && // reach here
			newBallPos.y >= gameInstance.player1Pos - PONG_HEIGHT && 
			newBallPos.y <= gameInstance.player1Pos + PONG_HEIGHT) {
			// The ball hit player 1's pong, reverse its horizontal direction
			gameInstance.ball_movement.x *= -1;
			newBallPos.x = gameInstance.ballPos.x + gameInstance.ball_movement.x;
		}
	
		if (newBallPos.x >= PLAYER2_PONG_X && 
			newBallPos.y >= gameInstance.player2Pos - PONG_HEIGHT && 
			newBallPos.y <= gameInstance.player2Pos + PONG_HEIGHT) {
			// The ball hit player 2's pong, reverse its horizontal direction
			gameInstance.ball_movement.x *= -1;
		}

		if (newBallPos.x < -FIELD_SIZE_X || newBallPos.x > FIELD_SIZE_X) {
			// gameInstance.ball_movement.x *= -1;
			if (newBallPos.x < -FIELD_SIZE_X) {
				gameInstance.score2 += 1;
			} else {
				gameInstance.score1 += 1;
			}
			return true;
		}
	
		// Now calculate the new position with the possibly updated movement vector
		newBallPos.x = gameInstance.ballPos.x + gameInstance.ball_movement.x;
		newBallPos.y = gameInstance.ballPos.y + gameInstance.ball_movement.y;
	
		// Update the ball's position in the game instance
		gameInstance.ballPos = newBallPos;
	
		return false;
	}

	private updateBallPositionWithAngle(gameInstance: PongGameData): BallPosition {
		// Update the ball's position based on its current movement vector
		let newBallPos: BallPosition = {
			x: gameInstance.ballPos.x + gameInstance.ball_movement.x,
			y: gameInstance.ballPos.y + gameInstance.ball_movement.y
		};
	
		// Check for collisions with the game boundaries
		// Assuming the game field is 100 units in both dimensions
		const FIELD_SIZE_Y = 50;
		const FIELD_SIZE_X = 40; // css 80% width
		if (newBallPos.y < -FIELD_SIZE_Y || newBallPos.y > FIELD_SIZE_Y) {
			// The ball hit the top or bottom wall, reverse its vertical direction
			gameInstance.ball_movement.y *= -1;
		}
	
		// Check for collisions with the players
		// Assuming the players' pong is at a fixed x-position
		const PLAYER1_PONG_X = -36.5; // css 80% width
		const PLAYER2_PONG_X = 36.5; // css 80% width
		const PONG_HEIGHT = 12;  // Assuming the height of the pong
	
		if (newBallPos.x <= PLAYER1_PONG_X &&
			newBallPos.y >= gameInstance.player1Pos - PONG_HEIGHT && 
			newBallPos.y <= gameInstance.player1Pos + PONG_HEIGHT) {
			// The ball hit player 1's pong, reverse its horizontal direction and adjust the vertical direction based on the hit position
			gameInstance.ball_movement.x *= -1;
			const t = (gameInstance.ballPos.y - gameInstance.player1Pos + PONG_HEIGHT / 2) / PONG_HEIGHT;
			gameInstance.ball_movement.y += this.easeInOutQuad(t);
			newBallPos.x = gameInstance.ballPos.x + gameInstance.ball_movement.x;
		}
	
		if (newBallPos.x >= PLAYER2_PONG_X && 
			newBallPos.y >= gameInstance.player2Pos - PONG_HEIGHT && 
			newBallPos.y <= gameInstance.player2Pos + PONG_HEIGHT) {
			// The ball hit player 2's pong, reverse its horizontal direction and adjust the vertical direction based on the hit position
			gameInstance.ball_movement.x *= -1;
			const t = (gameInstance.ballPos.y - gameInstance.player2Pos + PONG_HEIGHT / 2) / PONG_HEIGHT;
			gameInstance.ball_movement.y += this.easeInOutQuad(t);
		}
	
		if (newBallPos.x < -FIELD_SIZE_X || newBallPos.x > FIELD_SIZE_X) {
			gameInstance.ball_movement.x *= -1;
			if (newBallPos.x < -FIELD_SIZE_X) {
				gameInstance.score2 += 1;
			} else {
				gameInstance.score1 += 1;
			}
		}
	
		// Now calculate the new position with the possibly updated movement vector
		newBallPos.x = gameInstance.ballPos.x + gameInstance.ball_movement.x;
		newBallPos.y = gameInstance.ballPos.y + gameInstance.ball_movement.y;
	
		// Update the ball's position in the game instance
		gameInstance.ballPos = newBallPos;
	
		return newBallPos;
	}

	private easeInOutQuad(t: number): number {
		return t < .5 ? 2 * t * t : -1 +(4 - 2 * t) * t;
	}

	private invertedGameInstance(gameInstance: PongGameData): PongGameData {
		const invertedGameInstance: PongGameData = {
			pausedUnitl: gameInstance.pausedUnitl,
			player1Id: gameInstance.player2Id,
			player2Id: gameInstance.player1Id,
			player1Pos: gameInstance.player2Pos,
			player2Pos: gameInstance.player1Pos,
			ballPos: {
				x: gameInstance.ballPos.x * -1,
				y: gameInstance.ballPos.y,
			},
			ball_movement: {
				x: -gameInstance.ball_movement.x * -1,
				y: -gameInstance.ball_movement.y,
			},
			score1: gameInstance.score2,
			score2: gameInstance.score1,
			run: gameInstance.run,
			gameId: gameInstance.gameId,
			notify: gameInstance.notify,
		};
		return invertedGameInstance;
	}

}
