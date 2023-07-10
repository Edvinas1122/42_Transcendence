import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SocketGateway } from '../socket/socket.gateway';
import { MatchService } from './match.service';
import { Match, Outcome } from './entities/match.entity';
import { RankService } from './rank.service';
import { AchievementService } from './achievement.service';

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
	end_game_reason?: string
}

interface inviteLink {
	inviteLink: string;
}

class MatchResult implements Partial<Match> {
	constructor(
		data: PongGameData,
		outcome: Outcome = Outcome.WON_BY_SCORE,
	)
	{
		this.gameType = data.gameId.toString();
		this.outcome = outcome;
		this.player1Score = data.score1;
		this.player1ID = data.player1Id;
		this.player2Score = data.score2;
		this.player2ID = data.player2Id;
		this.gameEndDate = new Date();
	}
	gameType: string;
	outcome: Outcome;
	player1Score: number;
	player1ID: number;
	player2Score: number;
	player2ID: number;
	gameEndDate: Date;
}

@Injectable()
export class GameService {

	constructor(
		@Inject(SocketGateway)
		private socketGateway: SocketGateway,
		@Inject(MatchService)
		private matchService: MatchService,
		@Inject(RankService)
		private rankService: RankService,
		@Inject(AchievementService)
		private achievementService: AchievementService,
	) {
		this.socketGateway.registerDicconnector(this.handleDisconnect.bind(this));
		this.socketGateway.registerHandler('pongGamePlayerUpdate', this.handleGameUpdate.bind(this), 'pongGamePlayerUpdateResponse');
		this.socketGateway.registerHandler('pongGameBegin', this.handleGameBegin.bind(this), 'pongGameBeginResponse');
	}

	private liveGameInstancesMap = new Map<string, PongGameInstance>();
	
	public userIsInGame(userId: number): boolean {
		const user = this.getInstanceByUserId(userId);
		if (user === undefined) {
			return false;
		}
		return true;
	}

	/*
		wrong name, ture name -> handleJoinGame 
	*/
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
				this.validator.bind(this),
			);
			this.liveGameInstancesMap.set(gameKey, gameInstance);
		}
		return gameKey;
	}

	handleGameBegin(data: {gameKey: string}): void {
		const { player1ID, player2ID } = this.parseGameKey(data.gameKey);
		const defaultKey = this.defaultGameKey(player1ID, player2ID);
		this.liveGameInstancesMap.get(defaultKey)?.Start().then((result) => {
			if (result) {
				this.matchService.createRecord(
					result
				).then((match) => {
					this.rankService.updateRanks(match).then(() => {
						this.achievementService.checkAchievements(match.player1ID);
						this.achievementService.checkAchievements(match.player2ID);
					}).then(() => {
						this.handleDisconnect(player1ID);
						this.handleDisconnect(player2ID);
					});
				});
			}
		});
	}

	validator(userId1: number, userId2: number)
	{
		if (this.socketGateway.CheckUserConnection(userId1) && this.socketGateway.CheckUserConnection(userId2)) {
			return true;
		}
		return false;
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

	private parseGameKey(gameKey: string): { player1ID: number, player2ID: number, currentPlayer: number } {
		const [player1ID, player2ID, currentPlayer] = gameKey.split('-').map(Number);
		return { player1ID, player2ID, currentPlayer };
	}

	handleDisconnect(userId: number)
	{
		const gameInstance = this.getInstanceByUserId(userId);
		if (gameInstance) {
			gameInstance.Stop().then((data) => {
				this.liveGameInstancesMap.delete(
					this.defaultGameKey(data.player1Id, data.player2Id));
			});
		}
	}

	private getInstanceByUserId(userId: number): PongGameInstance | undefined {
		const allKeys = Array.from(this.liveGameInstancesMap.keys());
		const gameKey = allKeys.find((key) => {
			const { player1ID, player2ID } = this.parseGameKey(key);
			return player1ID === userId || player2ID === userId;
		});
		if (gameKey) {
			const { player1ID, player2ID } = this.parseGameKey(gameKey);
			return this.liveGameInstancesMap.get(this.defaultGameKey(player1ID, player2ID));
		}
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
	beginGame: number;
}

interface PongMatchCustomisation {
	gameType: string,
	scoreToWin?: number,
	timeLimit?: number,
}

export class PongGameInstance
{
	private pongGameData: PongGameData;
	private sendToUser: (subcription: string, userId: number, message: any) => void;
	private validator: (userId1: number, userId2: number) => boolean;
	private runTimeInfo: RunTimeDetails;
	private gameCustomisation: PongMatchCustomisation;

	constructor(
		player1Id: number,
		player2Id: number,
		gameId: number,
		sendToUser: (subcription: string, userId: number, message: any) => void,
		validator: (userId1: number, userId2: number) => boolean,
		pausedUntil: number = Date.now() + 3000,
		player1Pos: number = 0,
		player2Pos: number = 0,
		ballPos: BallPosition = {x: 0, y: 0},
		ballMovement: Vector = {x: 0.5, y: 0.5},
		score1: number = 0,
		score2: number = 0,
		run: boolean = true,
		gameCustomisation: PongMatchCustomisation = {
			gameType: "classic",
			scoreToWin: 5,
			timeLimit: 36000
		},
	) {
		this.gameCustomisation = gameCustomisation;
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
			gameId: gameId,
		
		};
		this.sendToUser = sendToUser;
		this.validator = validator;
		this.runTimeInfo = {
			GAME_LOOP_DELAY: 20,
			MAX_GAME_TIME: 360000, // max game duration
			DISCONNECT_CHECK_INTERVAL: 4000, // every 3 seconds
			gameStartTime: Date.now(),
			lastDisconnectCheckTime: Date.now(),
			beginGame: 0,
		};
	}

	public CustomiseGame(customisation: PongMatchCustomisation): void {
		if (customisation.gameType) {
			this.gameCustomisation.gameType = customisation.gameType;
		}
		if (customisation.scoreToWin) {
			this.gameCustomisation.scoreToWin = customisation.scoreToWin;
		}
		if (customisation.timeLimit) {
			this.gameCustomisation.timeLimit = customisation.timeLimit;
		}
	}

	async Start(): Promise<MatchResult | null> {
		if (this.runTimeInfo.beginGame < 1) {
			this.runTimeInfo.beginGame++;
			return null;
		}
		this.runTimeInfo.gameStartTime = Date.now();
		this.runTimeInfo.lastDisconnectCheckTime = Date.now();
		this.pongGameData.pausedUnitl = Date.now() + 1000;
		// const GameCommenceInitiateMessage: GameCommenceData = {begin: true};
		// this.sendToUser('GameCommence', this.pongGameData.player1Id, GameCommenceInitiateMessage);
		// this.sendToUser('GameCommence', this.pongGameData.player2Id, GameCommenceInitiateMessage);
		return this.gameInstanceLoop();
	}

	public async Stop(): Promise<PongGameData> {
		this.pongGameData.run = false;
		this.sendToUser('GameCommence', this.pongGameData.player1Id, `Player ${this.pongGameData.player2Id} has disconnected.`);
		this.sendToUser('GameCommence', this.pongGameData.player2Id, `Player ${this.pongGameData.player1Id} has disconnected.`);
		this.sleep(2000);
		return (this.pongGameData);
	}

	private async gameInstanceLoop(): Promise<MatchResult>
	{
		while (this.pongGameData.run && Date.now() - this.runTimeInfo.gameStartTime < this.runTimeInfo.MAX_GAME_TIME) {
			if (this.GameInstanceLogicHandler()) {
				return new MatchResult(this.pongGameData);
			}
			const gameDataForPlaye1: PongGameDataUserUpdate = this.prepareUpdateDataForPlayer(this.pongGameData.player1Id);
			const gameDataForPlaye2: PongGameDataUserUpdate = this.invertBallPosition(gameDataForPlaye1);
			this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player1Id, gameDataForPlaye1);
			this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player2Id, gameDataForPlaye2);
			this.validateConnections();
			await this.sleep(this.runTimeInfo.GAME_LOOP_DELAY);
		}
		this.tellUserstoDisconnect();
		return new MatchResult(this.pongGameData, Outcome.DISCONNECTED);
	}

	private validateConnections() {
		if (Date.now() - this.runTimeInfo.lastDisconnectCheckTime > this.runTimeInfo.DISCONNECT_CHECK_INTERVAL) {
			this.runTimeInfo.lastDisconnectCheckTime = Date.now();
			if (!this.validator(this.pongGameData.player1Id, this.pongGameData.player2Id)) {
				this.Stop().then(
					() => {
						console.log("Game Stopped by validator------- not clean stop");
					}
				);
			}
		}
	}

	private GameInstanceLogicHandler(): boolean {
		if (this.pongGameData.pausedUnitl > Date.now()) {
			// game is paused
		} else if (this.updateBallPosition(this.pongGameData)) {
			if (this.winCondition()) {
				this.sendWinMessage();
				return true;
			}
			this.restartBall();
			this.updatePlayerOfMachReload();
		}
		return false;
	}

	private sendWinMessage() {

		const winMessage: PongGameDataUserUpdate = {
			score1: this.pongGameData.score1,
			score2: this.pongGameData.score2,
			end_game: true,
			end_game_reason: 'win',
			oponent_pong_position: this.pongGameData.player1Pos,
			ball_position: this.pongGameData.ballPos,
		};

		const loseMessageForPlayer1: PongGameDataUserUpdate = {
			score1: this.pongGameData.score1,
			score2: this.pongGameData.score2,
			end_game: true,
			end_game_reason: 'lose',
			oponent_pong_position: this.pongGameData.player2Pos,
			ball_position: this.pongGameData.ballPos,
		};

		if (this.pongGameData.score1 > this.pongGameData.score2) {
			this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player1Id, winMessage);
			this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player2Id, loseMessageForPlayer1);
		} else {
			this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player2Id, winMessage);
			this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player1Id, loseMessageForPlayer1);
		}
	}

	private winCondition(): boolean {
		if (this.pongGameData.gameId !== 0) {
			if (this.pongGameData.score1 >= this.gameCustomisation.scoreToWin
				|| this.pongGameData.score2 >= this.gameCustomisation.scoreToWin) {
				return true;
			}
		}
		else {
			if (this.pongGameData.score1 >= 
				this.gameCustomisation.scoreToWin ||
				this.pongGameData.score2 >= this.gameCustomisation.scoreToWin) 
			{
				return true;
			}
		}
		return false;
	}


	private restartBall() {
		this.pongGameData.ballPos.x = 0;
		this.pongGameData.ballPos.y = 0;
		this.pongGameData.ball_movement.x = 0.5;
		this.pongGameData.ball_movement.y = 0.5;
		this.pongGameData.pausedUnitl = Date.now() + 940;
	}

	private updatePlayerOfMachReload()
	{
		const gameDataForPlayer: PongGameDataUserUpdate = {
			oponent_pong_position: 0,
			ball_position: {
				x: 0,
				y: 0,
			},
			score1: this.pongGameData.score1,
			score2: this.pongGameData.score2,
		};
		this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player1Id, gameDataForPlayer);
		this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player2Id, gameDataForPlayer);
	}

	private prepareUpdateDataForPlayer(playerId: number, invert: boolean = false): PongGameDataUserUpdate {

		const gameDataForPlayer: PongGameDataUserUpdate = {
			oponent_pong_position: this.pongGameData.player1Id === playerId ? this.pongGameData.player2Pos : this.pongGameData.player1Pos,
			ball_position: {
				x: invert ? this.pongGameData.ballPos.x * -1 : this.pongGameData.ballPos.x,
				y: this.pongGameData.ballPos.y,
			},
			end_game: !this.pongGameData.run,
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

	private tellUserstoDisconnect() {
		const gameDataForPlaye1: PongGameDataUserUpdate = this.prepareUpdateDataForPlayer(this.pongGameData.player1Id);
		const gameDataForPlaye2: PongGameDataUserUpdate = this.prepareUpdateDataForPlayer(this.pongGameData.player2Id);
		this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player1Id, gameDataForPlaye1);
		this.sendToUser('pongGamePlayerUpdate', this.pongGameData.player2Id, gameDataForPlaye2);
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