import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { SocketGateway } from '../socket/socket.gateway'
import { UsersService } from '../users/users.service'
import { EventService, SseMessage, EventType } from '../events/events.service';

interface InviteData {
	inviteKey: string,
	player1here: boolean,
	player2here: boolean,
	player1ID: number,
	player2ID: number,
	date: Date,
}

@Injectable()
export class InviteService {
	constructor(
		@Inject(SocketGateway)
		private socketGateway: SocketGateway,
		@Inject(UsersService)
		private usersService: UsersService,
		@Inject(EventService)
		private eventService: EventService,
	) {
		this.socketGateway.registerHandler('joinViaInvite', this.handleJoin.bind(this), 'joinResponse');
		this.socketGateway.registerDicconnector(this.handleDisconnect.bind(this));
	}

	private inviteMap = new Map<string, InviteData>();

	async createInvite(player1ID: number, player2Name: string): Promise<string> {
		const player2User = await this.usersService.findOne(player2Name);
		if (!player2User) {
			throw new NotFoundException(`User ${player2Name} does not exist`);
		}
		const player2ID = player2User.id;
		const inviteKey = `${player1ID}-${player2ID}`;
		const inviteData: InviteData = {
			inviteKey: inviteKey,
			player1here: false,
			player2here: false,
			player1ID: player1ID,
			player2ID: player2ID,
			date: new Date(),
		};
		this.inviteMap.set(inviteKey, inviteData);
		console.log(`Invite ${inviteKey} created`);
		console.log("inviteMap size: ", this.inviteMap.size);
		this.eventService.sendEvent(player2ID.toString(), {
			type: EventType.Game,
			payload: {
				event: 'invite',
				message: `You have been invited to a game by ${player2Name}`,
				inviteKey: inviteKey,
			}
		} as SseMessage)
		return inviteKey;
	}

	handleJoin(data: { joinKey: string, userId: number}): any {
		console.log(`User ${data.userId} is joining invite ${data.joinKey}`);
		const { joinKey, userId } = data;

		const inviteData = this.inviteMap.get(joinKey);
		console.log("inviteData: ", inviteData);
		if (inviteData === undefined) {
			this.socketGateway.sendToUser('MatchMaking', userId, { 
				error: true,
				message: `Invite ${joinKey} does not exist`,
			});
			return {error: true, message: `Invite ${joinKey} does not exist`};
		}
		if (inviteData.player1ID === userId) {
			inviteData.player1here = true;
		} else if (inviteData.player2ID === userId) {
			inviteData.player2here = true;
		} else {
			return `User ${userId} is not part of invite ${joinKey}`;
		}
		if (inviteData.player1here && inviteData.player2here) {
			this.socketGateway.sendToUser('MatchMaking', inviteData.player1ID, { gameKey: joinKey });
			this.socketGateway.sendToUser('MatchMaking', inviteData.player2ID, { gameKey: joinKey });
			this.inviteMap.delete(joinKey);
			return `Invite ${joinKey} is complete`;
		} else {
			return `Invite ${joinKey} is not complete`;
		}
	}

	handleDisconnect(userId: number): void {
		const userInviteSession = this.findUserInvite(userId);
		console.log(`User ${userId} disconnected, invite session: ${userInviteSession}`);
		if (userInviteSession) {
			const session = this.inviteMap.get(userInviteSession);
			if (session) {
				if (session.player1ID === userId) {
					session.player1here = false;
				} else if (session.player2ID === userId) {
					session.player2here = false;
				}
				if (!session.player1here && !session.player2here) {
					console.log(`Invite ${userInviteSession} is no longer valid`);
					this.inviteMap.delete(userInviteSession);
				}
			}
		}
	}

	private findUserInvite(userId: number): string | null {
		const allKeys = this.inviteMap.keys();
		for (const key of allKeys) {
			const { player1ID, player2ID } = this.keyToUsers(key);
			if (player1ID === userId || player2ID === userId) {
				return key;
			}
		}
		return null;
	}

	private keyToUsers(key: string): { player1ID: number, player2ID: number } {
		const [player1ID, player2ID] = key.split('-');
		return { player1ID: parseInt(player1ID), player2ID: parseInt(player2ID) };
	}
}