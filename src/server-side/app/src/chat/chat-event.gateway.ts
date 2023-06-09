import { Injectable, Inject } from "@nestjs/common";
import { EventService } from "../events/events.service";
import { RoleService, RoleType } from "./role.service";
import { ChatRoomEvent, MessageEvent, RoomEventType, MessageEventType, SseMessage } from "./events/chat.events";
import { Chat } from "./entities/chat.entity";
import { UserInfo } from "../users/dtos/user.dto";
import { MessageDto } from "./dtos/message.dtos";
import { UsersService } from "../users/users.service";


@Injectable()
export class ChatEventGateway {
	constructor(
		@Inject(EventService)
		private eventService: EventService,
		@Inject(RoleService)
		private roleService: RoleService,
		@Inject(UsersService)
		private usersService: UsersService,
	) {}


	async updateOnlineUsersChatEvent(
		chat: Chat,
		eventType: RoomEventType,
		info?: any,
		distributorId?: number
	): Promise<boolean> {
		const data: ChatRoomEvent = new ChatRoomEvent(chat.id, eventType, info);
		const users = await this.roleService.getBlockedChatMembers(chat); // exclude blocked users
	
		if (distributorId === undefined) {
			await this.eventService.sendToAll(data as SseMessage, users.map(user => user._id));
			return true;
		}
		const promise = users.map(async user => {
			const isBlocked = await this.usersService.isBlocked(user._id, distributorId);
			if (isBlocked) {
				return null;
			}
			return user;
		});
	
		const usersNotBlocked = await Promise.all(promise);
		const usersFiltered = usersNotBlocked.filter(user => user !== null);
		await this.eventService.sendToAll(data as SseMessage, usersFiltered.map(user => user._id));
		return true;
	}

	// async updateOnlineUsersOfRoomEvent(chatId: number, eventType: RoomEventType, info?: any): Promise<boolean> {
	// 	const data: ChatRoomEvent = new ChatRoomEvent(chatId, eventType, info);
	// 	return await this.eventService.sendToAll(data as SseMessage);
	// }

	
	async updateUserOfRoomEvent(userId: string, chatId: number, eventType: RoomEventType , charName?: string): Promise<boolean> {
		const data: ChatRoomEvent = new ChatRoomEvent(chatId, RoomEventType.Invite, charName);
		return await this.eventService.sendStoredEvent(userId, data as SseMessage);
	}

	async updateParticipantsOfRoomEvent(chat: Chat, eventType: RoomEventType, store: boolean = false, info?: any): Promise<boolean> {
		const data: ChatRoomEvent = new ChatRoomEvent(chat.id, eventType, info);
		const users = await this.roleService.getChatRelatives(chat);
		await this.distributeEventToUsers(users, data as SseMessage, store);
		return true;
	}

	// async updateOnlineUsersMessageEvent(chat: Chat, message: MessageDto, eventType: MessageEventType = MessageEventType.New): Promise<boolean> {
	// 	const data: MessageEvent = new MessageEvent(chat.id, eventType, message);
	// 	const users = await this.roleService.getBlockedChatMembers(chat); // exclude blocked users

	// 	await this.eventService.sendToAll(data as SseMessage, users.map(user => user._id));
	// 	return true;
	// }

	async updateParticipantsOfMessageEvent(
		chat: Chat,
		message?: MessageDto,
		eventType: MessageEventType = MessageEventType.New,
		distributor?: number
	): Promise<boolean> {
		const data: MessageEvent = new MessageEvent(chat.id, eventType, message);
		const users = await this.roleService.getChatRoleRelatives(chat, RoleType.Blocked, distributor);
		
		await this.distributeEventToUsers(users, data as SseMessage, false); // TODO: store message events if chat has no new events
		return true;
	}

	private async distributeEventToUsers(users: UserInfo[], data: SseMessage, store: boolean = false): Promise<boolean> {
		if (store) {
			await Promise.all(users.map(user => this.eventService.sendStoredEvent(user._id.toString(), data)));
		}
		else {
			await Promise.all(users.map(user => this.eventService.sendEvent(user._id.toString(), data)));
		}
		return true;
	}

}

export { RoomEventType, MessageEventType };