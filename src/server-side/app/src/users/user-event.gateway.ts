import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { ProfileManagementService } from "./profile-management/profile-management.service";
import { EventService, EventType } from "../events/events.service";
import { UserRelationshipEvent, UserOnlineStatusEvent, RelationshipType, OnlineStatusEventTypes } from "./events/user-event.types";

@Injectable()
export class UserEventGateway {
	constructor(
		@Inject(EventService)
		private readonly eventService: EventService,
	) {}

	async sendUserRelationshipEvent(userId: number, event: RelationshipType, data?: any): Promise<void> {
		const userRelationshipEvent = new UserRelationshipEvent(userId, event, data);
		await this.eventService.sendStoredEvent(userId.toString(), userRelationshipEvent);
	}

	async sendUserOnlineStatusEvent(userId: number, event: OnlineStatusEventTypes, except: number[]): Promise<void> {
		const userOnlineStatusEvent = new UserOnlineStatusEvent(userId, event);
		await this.eventService.sendToAll(userOnlineStatusEvent, except);
	}

	async getAllOnlineUsers(): Promise<number[]> {
		return await this.eventService.getAllOnlineUsers();
	}
}

export { UserRelationshipEvent, UserOnlineStatusEvent, RelationshipType, OnlineStatusEventTypes };