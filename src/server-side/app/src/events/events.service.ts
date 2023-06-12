import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event, EventType } from './entities/event.entity';
import { SseMessage } from './events.types';
import { Subject } from 'rxjs';
import { User } from '../users/entities/user.entity';


@Injectable()
export class EventService {
	constructor(
		@InjectRepository(Event)
		private eventRepository: Repository<Event>,
	) {}
	private eventSubjects = new Map<string, Subject<any>>();

	connectUser(userId: string) {
		this.eventSubjects.set(userId, new Subject<any>());
	}

	disconnectUser(userId: string) {
		console.log('disconnectUser', userId);
		this.eventSubjects.get(userId)?.complete();
		this.eventSubjects.delete(userId);
	}

	sendEvent(userId: string, data: SseMessage): boolean {
		console.log('sendEventToUser', userId, data);
		const subject = this.eventSubjects.get(userId);
		if (subject) {
			subject.next({ data });
			return true; // User is online.
		}
		else {
			return false; // User is offline.
		}
	}
	
	async sendStoredEvent(userId: string, data: SseMessage): Promise<boolean> {
		console.log('sendEventToUser', userId, data);
		const subject = this.eventSubjects.get(userId);

		const event = new Event();
		event.type = data.type;
		event.data = data.payload;
		event.user = new User();
		event.user.id = Number(userId);
		await this.eventRepository.save(event);
		
		// Save the event
		await this.eventRepository.save(event);
		
		if (subject) {
			subject.next({ data });
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


	getUserEventStream(userId: string) {
		return this.eventSubjects.get(userId)?.asObservable();
	}
}

export { EventType, SseMessage };