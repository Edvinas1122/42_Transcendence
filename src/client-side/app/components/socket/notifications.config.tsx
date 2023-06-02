import { WSMessage, NotificationInfo } from "./message.type";
import { RelationshipHandler } from "./handlers/Relationship.handler";

interface Rule {
	match: (message: WSMessage) => boolean;
	handlers: Handler[];
}

interface Handler {
	match: (message: NotificationInfo) => boolean;
	action: (message: WSMessage) => void;
}

const notificationHandlers: Handler[] = [
	{
		match: (message: NotificationInfo) => message.category === 'Relationship',
		action: RelationshipHandler,
	},
	{
		match: (message: NotificationInfo) => message.category === 'System',
		action: (message: WSMessage) => {
			console.log('System: ', message);
		}
	},
	// Add more handlers here...
];

export const rules: Rule[] = [
	{
		match: (message: WSMessage) => message.type === 'notification',
		handlers: notificationHandlers,
	},
	// Add more rules here...
];