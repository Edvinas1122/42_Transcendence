import { Injectable, Inject } from "@nestjs/common";
import { EventService } from "../events/events.service";
import { RoleService, RoleType } from "./role.service";
import { ChatRoomEvent, MessageEvent, RoomEventType, MessageEventType, SseMessage } from "./events/chat.events";
import { Chat } from "./entities/chat.entity";
import { UserInfo } from "../users/dtos/user.dto";
import { MessageDto } from "./dtos/message.dtos";


@Injectable()
export class ChatEventGateway {
	constructor(
		@Inject(EventService)
		private eventService: EventService,
		@Inject(RoleService)
		private roleService: RoleService,
	) {}

	async updateOnlineUsersChatEvent(chat: Chat, eventType: RoomEventType, info?: any): Promise<boolean> {
		console.log('updateOnlineUsersChatEvent', chat.id, eventType, info);
		const data: ChatRoomEvent = new ChatRoomEvent(chat.id, eventType, info);
		
		const users = await this.roleService.getChatRoleRelatives(chat, RoleType.Blocked); // exclude blocked users
		console.log('ChatEvent', eventType, data);
		await this.eventService.sendToAll(data as SseMessage, users.map(user => user._id));
		return true;
	}

	async updateUserOfRoomEvent(userId: string, chatId: number, eventType: RoomEventType , charName?: string): Promise<boolean> {
		const data: ChatRoomEvent = new ChatRoomEvent(chatId, RoomEventType.Invite, charName);
		return await this.eventService.sendStoredEvent(userId, data as SseMessage);
	}

	async updateParticipantsOfRoomEvent(chat: Chat, eventType: RoomEventType, store: boolean = false, info?: string): Promise<boolean> {
		const data: ChatRoomEvent = new ChatRoomEvent(chat.id, eventType, info);
		const users = await this.roleService.getChatRelatives(chat);
		await this.distributeEventToUsers(users, data as SseMessage, store);
		return true;
	}

	async updateOnlineUsersMessageEvent(chat: Chat, message: MessageDto, eventType: MessageEventType = MessageEventType.New): Promise<boolean> {
		const data: MessageEvent = new MessageEvent(chat.id, eventType, message);
		const users = await this.roleService.getChatRoleRelatives(chat, RoleType.Blocked); // exclude blocked users
		await this.eventService.sendToAll(data as SseMessage, users.map(user => user._id));
		return true;
	}

	async updateParticipantsOfMessageEvent(chat: Chat, message: MessageDto, eventType: MessageEventType = MessageEventType.New): Promise<boolean> {
		const data: MessageEvent = new MessageEvent(chat.id, eventType, message);
		const users = await this.roleService.getChatRoleRelatives(chat, RoleType.Blocked); // exclude blocked users
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