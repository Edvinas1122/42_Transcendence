import { SseMessage, EventType } from "../../events/events.service";

enum UserEventTypes {
	Friends = "friends",
	Online = "online",
}

enum RelationshipType {
	Invited = "invited",
	Approved = "approved",
	Blocked = "blocked",
}

enum OnlineStatusEventTypes {
	Online = "online",
	Offline = "offline",
	Ingame = "ingame",
}

class UserData {
	userId: number;
	event: UserEventTypes;
	subType?: RelationshipType | OnlineStatusEventTypes;
	data?: any;
}

class UserEvent extends SseMessage {
	constructor(eventType: UserEventTypes, userId: number, subType: RelationshipType | OnlineStatusEventTypes, data?: any) {
		const payload: UserData = {userId: userId, event: eventType, subType: subType, data: data};
		super(EventType.Users, payload);
	}
}

class UserRelationshipEvent extends UserEvent {
	constructor(userId: number, type: RelationshipType, data?: any) {
		super(UserEventTypes.Friends, userId, type, data);
	}
}

class UserOnlineStatusEvent extends UserEvent {
	constructor(userId: number, type: OnlineStatusEventTypes, data?: any) {
		super(UserEventTypes.Online, userId, type, data);
	}
}

export { UserRelationshipEvent, UserOnlineStatusEvent, RelationshipType, OnlineStatusEventTypes, SseMessage };
