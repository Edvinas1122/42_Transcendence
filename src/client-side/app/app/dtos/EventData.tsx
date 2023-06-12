export enum EventType {
	Chat = 'Chat',
	Message = 'Message',
	Friend = 'Friend',
	Game = 'Game',
}

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
}

enum MessageEventType {
	New = 'new',
	Edit = 'edit',
	Delete = 'delete',
}
