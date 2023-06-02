export enum WSMessageType {
	NOTIFICATION = 'notification',
	MESSAGE = 'message',
	GAMEDATA = 'gamedata'
}
  
export interface NotificationInfo {
	category: string;
	event: string;
	fetch: boolean;
	message?: string | JSON;
	silent?: boolean;
}
  
export interface WSMessage {
	type: WSMessageType;
	info: NotificationInfo | string;
}