import { Repository } from 'typeorm';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event, EventType } from './entities/event.entity';
import { SseMessage, MessageEvent } from './events.types';
import { Subject } from 'rxjs';
import { User } from '../users/entities/user.entity';


@Injectable()
export class EventService implements OnModuleDestroy {
	constructor(
		@InjectRepository(Event)
		private eventRepository: Repository<Event>,
	) {}
	private eventSubjects = new Map<string, Subject<any>>();
	

	connectUser(userId: string) {
		this.eventSubjects.set(userId, new Subject<any>());
	}

	disconnectUser(userId: string) {
		this.eventSubjects.get(userId)?.complete();
		this.eventSubjects.delete(userId);
	}

	sendEvent(userId: string, data: SseMessage): boolean {
		const subject = this.eventSubjects.get(userId);
		if (subject) {
			subject.next(new MessageEvent(data));
			return true; // User is online.
		}
		else {
			return false; // User is offline.
		}
	}
	
	async sendStoredEvent(userId: string, data: SseMessage): Promise<boolean> {
		const subject = this.eventSubjects.get(userId);

		const event = new Event();
		event.type = data.type;
		event.data = data.payload;
		event.user = new User();
		event.user.id = Number(userId);
		
		await this.eventRepository.save(event);
		
		if (subject) {
			subject.next(new MessageEvent(data));
			return true; // User is online.
		} else {
			return false; // User is offline.
		}
	}

	async sendToAll(data: SseMessage, except?: number[]): Promise<void> {
		const users = this.eventSubjects.keys();
		for (const user of users) {
			if (!except || !except.includes(Number(user))) {
				this.sendEvent(user, data);
			}
		}
	}

	async getAllOnlineUsers(): Promise<number[]> {
		return Array.from(this.eventSubjects.keys()).map(Number);
	}

	seeIfUserIsOnline(userId: string): boolean {
		console.log("Total online count", this.eventSubjects.size)
		return this.eventSubjects.has(userId);
	}

	getUserEventStream(userId: string) {
		return this.eventSubjects.get(userId)?.asObservable();
	}

	async onModuleDestroy(): Promise<void> {
		const shutdownMessage: SseMessage = {
			type: EventType.System,
			payload: { event: "restart", message: 'Server is shutting down.'},
			timestamp: Date.now(),
		};
		await this.sendToAll(shutdownMessage);
	}
}

export { EventType, SseMessage };