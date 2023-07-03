import { SseMessage, EventType } from "../../events/events.service";

enum ChatEventType {
	Room = 'room',
	Message = 'message',
}

enum RoomEventType {
	Invite = 'invite',
	Join = 'join',
	Leave = 'leave',
	NewAvailable = 'new-available',
	Deleted = 'deleted',
	Kicked = 'kicked',
	Banned = 'banned',
	Unbanned = 'unbanned',
	Promoted = 'promoted',
	Demoted = 'demoted',
	Muted = 'muted',
	Unmuted = 'unmuted',
}

enum MessageEventType {
	New = 'new',
	Edit = 'edit',
	Delete = 'delete',
}

// interface EventData {
// 	initiatorId: string;
// }

class ChatData {
	roomId: number;
	event: ChatEventType;
	subType?: MessageEventType | RoomEventType;
	data?: any;
}

class ChatEvent extends SseMessage {
	constructor(eventType: ChatEventType, roomId: number, subType: MessageEventType | RoomEventType, data?: any)
	{
		const payload: ChatData = {roomId: roomId, event: eventType, subType: subType, data: data};
		super(EventType.Chat, payload);
	}
}

class ChatRoomEvent extends ChatEvent {
	constructor(roomId: number, type: RoomEventType = RoomEventType.Invite,  data?: any) {
		super(ChatEventType.Room, roomId, type, data);
	}
}

class MessageEvent extends ChatEvent {
	constructor(roomId: number, type: MessageEventType = MessageEventType.New, data?: any) {
		super(ChatEventType.Message, roomId, type, data);
	}
}

export { ChatRoomEvent, MessageEvent, MessageEventType, RoomEventType, SseMessage };