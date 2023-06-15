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

export class MessageEvent {
	constructor(messge: SseMessage)
	{
		this.data = messge.payload;
		this.id = "15";
		this.type = messge.type;
		this.retry = 1000;
	}
	data: string | object;
	id?: string;
	type?: string;
	retry?: number;
  }