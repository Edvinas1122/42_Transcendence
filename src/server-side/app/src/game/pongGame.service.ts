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

	private liveGameInstancesMap = new Map<string, PongGameInstance>();
	
	public handleJoinGameQue(userId1: number, userId2:number, gameId:number): string {
		const GAME_BEGIN_DELAY = 2950;
		const gameKey = this.generateGameKey(userId1, userId2);
		if (this.liveGameInstancesMap.has(gameKey)) {
			this.liveGameInstancesMap.delete(gameKey);
		}
		if (!this.liveGameInstancesMap.has(gameKey)) {
			const gameInstance = new PongGameInstance(
				userId1,
				userId2,
				gameId,
				this.sendtoUser.bind(this),
			);
			this.liveGameInstancesMap.set(gameKey, gameInstance);
			setTimeout(() => {
				try {
					gameInstance.Start();
				} catch (e) {
					console.error(`Error sending game commence message to user: ${userId1} or ${userId2}`);
					console.error(e);
				}
			}, GAME_BEGIN_DELAY);
		}
		return gameKey;
	}

	sendtoUser(subcription: string, userId: number, message: any) {
		this.socketGateway.sendToUser(subcription, userId, message);
	}

	handleGameUpdate(data: PongGamePlayerUpdate): void {
		const { player1ID, player2ID, currentPlayer } = this.parseGameKey(data.gameKey);
		const defaultKey = this.defaultGameKey(player1ID, player2ID);
		this.liveGameInstancesMap.get(defaultKey)?.updateGameInstance(data.x, currentPlayer);
	}

	private generateGameKey(player1ID: number, player2ID: number): string {
		return `${player1ID}-${player2ID}`;
	}

	// private sendToUserProtected(subcription: string, userId: number, message: any) {
	// 	if (this.userInMap(userId)) {
	// 		this.socketGateway.sendToUser(subcription, userId, message);
	// 	} else {
	// 		throw new Error(`User ${userId} not found in map`); // can not be uncought
	// 	}
	// }

	private parseGameKey(gameKey: string): { player1ID: number, player2ID: number, currentPlayer: number } {
		const [player1ID, player2ID, currentPlayer] = gameKey.split('-').map(Number);
		return { player1ID, player2ID, currentPlayer };
	}

	handleDisconnect(userId: number) {
		const allKeys = Array.from(this.liveGameInstancesMap.keys());
		const gameKey = allKeys.find((key) => {
			const { player1ID, player2ID } = this.parseGameKey(key);
			return player1ID === userId || player2ID === userId;
		});
		if (gameKey) {
			const { player1ID, player2ID } = this.parseGameKey(gameKey);
			const gameInstance = this.liveGameInstancesMap.get(this.defaultGameKey(player1ID, player2ID));
			if (gameInstance) {
				gameInstance.Stop();
			}
			this.liveGameInstancesMap.delete(this.defaultGameKey(player1ID, player2ID));
			const otherPlayerId = player1ID === userId ? player2ID : player1ID;
			this.socketGateway.sendToUser('GameCommence', otherPlayerId, `Player ${userId} has disconnected.`);
		}
		console.log(`User ${userId} disconnected. Live game instances: ${this.liveGameInstancesMap.size}`);
	}

	private userInMap(userId: number): boolean {
		const allKeys = Array.from(this.liveGameInstancesMap.keys());
		for (let key of allKeys) {
			const { player1ID, player2ID } = this.parseGameKey(key);
			if (player1ID === userId || player2ID === userId) {
				return true;
			}
		}
		return false;
	}

	private defaultGameKey(playerId1: number, playerId2: number): string {
		return `${playerId1}-${playerId2}`;
	}
}

interface RunTimeDetails {
	GAME_LOOP_DELAY: number;
	MAX_GAME_TIME: number;
	DISCONNECT_CHECK_INTERVAL: number;
	gameStartTime: number;
	lastDisconnectCheckTime: number;
}

export class PongGameInstance {
	private pongGameData: PongGameData;
	private sendToUser: (subcription: string, userId: number, message: any) => void;
	private runTimeInfo: RunTimeDetails;

	constructor(
		player1Id: number,
		player2Id: number,
		gameId: number,
		sendToUser: (subcription: string, userId: number, message: any) => void,
		pausedUntil: number = Date.now() + 3000,
		player1Pos: number = 0,
		player2Pos: number = 0,
		ballPos: BallPosition = {x: 0, y: 0},
		ballMovement: Vector = {x: 0.5, y: 0.5},
		score1: number = 0,
		score2: number = 0,
		run: boolean = true,
		notify: boolean = false
	) {
		this.pongGameData = {
			player1Id: player1Id,
			player2Id: player2Id,
			pausedUnitl: pausedUntil,
			player1Pos: player1Pos,
			player2Pos: player2Pos,
			ballPos: ballPos,
			ball_movement: ballMovement,
			score1: score1,
			score2: score2,
			run: run,
			notify: notify,
			gameId: gameId,
		
		};
		this.sendToUser = sendToUser;
		this.runTimeInfo = {
			GAME_LOOP_DELAY: 20,
			MAX_GAME_TIME: 360000, // max game duration
			DISCONNECT_CHECK_INTERVAL: 3000, // every 3 seconds
			gameStartTime: Date.now(),
			lastDisconnectCheckTime: Date.now(),
		};
	}

	public Start() {
		this.gameInstanceLoop();
	}

	public Stop() {
		this.pongGameData.run = false;
	}

	private async gameInstanceLoop()
	{
		const GameCommenceInitiateMessage: GameCommenceData = {begin: true};
		this.sendToUser('GameCommence', this.pongGameData.player1Id, GameCommenceInitiateMessage);
		this.sendToUser('GameCommence', this.pongGameData.player2Id, GameCommenceInitiateMessage);
		while (this.pongGameData.run && Date.now() - this.runTimeInfo.gameStartTime < this.runTimeInfo.MAX_GAME_TIME) {
			this.GameInstanceLogicHandler();
			// const invertedInstance = this.invertedGameInstance(this.pongGameData);
			const gameDataForPlaye1: PongGameDataUserUpdate = this.prepareUpdateDataForPlayer(this.pongGameData.player1Id);
			const gameDataForPlaye2: PongGameDataUserUpdate = this.invertBallPosition(gameDataForPlaye1);
			this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player1Id, gameDataForPlaye1);
			this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player2Id, gameDataForPlaye2);
			this.pongGameData.notify = false;
			await this.sleep(this.runTimeInfo.GAME_LOOP_DELAY);
		}
		const gameDataForPlaye1: PongGameDataUserUpdate = this.prepareUpdateDataForPlayer(this.pongGameData.player1Id, true, true);
		const gameDataForPlaye2: PongGameDataUserUpdate = this.prepareUpdateDataForPlayer(this.pongGameData.player2Id, true, true);
		this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player1Id, gameDataForPlaye1);
		this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player2Id, gameDataForPlaye2);
	}

	private GameInstanceLogicHandler() {
		// Update the ball's position
		if (this.pongGameData.pausedUnitl > Date.now()) {
			// The ball is paused
			
		} else if (this.updateBallPosition(this.pongGameData)) {
			// A player scored, reset the ball
			this.pongGameData.ballPos.x = 0;
			this.pongGameData.ballPos.y = 0;
			this.pongGameData.ball_movement.x = 0.5;
			this.pongGameData.ball_movement.y = 0.5;
			// this.pongGameData.ball_movement = this.randMovementVector(30);
			this.pongGameData.pausedUnitl = Date.now() + 940;
			this.pongGameData.notify = true;
		}
	}

	private prepareUpdateDataForPlayer(playerId: number, invert: boolean = false, end: boolean = false): PongGameDataUserUpdate {

		const gameDataForPlayer: PongGameDataUserUpdate = {
			oponent_pong_position: this.pongGameData.player1Id === playerId ? this.pongGameData.player2Pos : this.pongGameData.player1Pos,
			ball_position: {
				x: invert ? this.pongGameData.ballPos.x * -1 : this.pongGameData.ballPos.x,
				y: this.pongGameData.ballPos.y,
			},
			end_game: end,
			score1: this.pongGameData.notify ? this.pongGameData.score1 : undefined,
			score2: this.pongGameData.notify ? this.pongGameData.score2 : undefined,
		};
		return gameDataForPlayer;
	}

	private invertBallPosition(data: PongGameDataUserUpdate)
	{
		const inverted = {
			oponent_pong_position: this.pongGameData.player2Id,
			ball_position: {
				x: data.ball_position.x * -1,
				y: data.ball_position.y,
			},
			end_game: data.end_game,
			score1: data.score1,
			score2: data.score2,
		};
		return inverted;
	}

	private sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
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

	public updateGameInstance(x: number, currentPlayerId: number) {
		if (this.pongGameData.player1Id === currentPlayerId) {
			this.pongGameData.player1Pos = x;
		} else if (this.pongGameData.player2Id === currentPlayerId) {
			this.pongGameData.player2Pos = x;
		}
	}

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
}