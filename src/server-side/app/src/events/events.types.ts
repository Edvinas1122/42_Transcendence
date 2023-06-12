import { EventType } from "./entities/event.entity";

export class SseMessage {
	constructor(type: EventType, payload?: any) {
		this.type = type;
		this.payload = payload ?? {};
		this.timestamp = Date.now();
	}
	type: EventType;
	payload: any;
	timestamp: number;
}

