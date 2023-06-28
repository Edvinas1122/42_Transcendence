"use client";

interface MachHistory {
	_id: string;
	opeonent: string;
	userScore: number;
	oponentScore: number;
	created: Date;
	completed: boolean;
}

interface Achievement {
	_id: string;
	name: string;
	description: string;
	achievedOn: Date;
}

interface User {
	_id: string;
	name: string;
	avatar: string;
	Online?: boolean; // non Current user context
	Ingame?: boolean; 
	Role?: RoleType; // chat context
	friend?: boolean;
}

interface UserProfile extends User {
	MachHistory: MachHistory[];
	Achievements: Achievement[];
}

interface Chat {
	_id: number;
	name: string;
	messages: Message[];
	personal: boolean;
	mine?: boolean;
	type: 'personal' | 'group';
	amParticipant?: boolean;
}

interface PersonalChat extends Chat {
	participant: User;
	type: 'personal'; 
}

interface GroupChat extends Chat {
	owner: User;
	participants: User[];
	privileged: boolean;
	type: 'group';
}

function isGroupChat(chat: Chat): chat is GroupChat { // discriminator
	if (!chat?.type)
		return false;	
    return chat.type === 'group';
}

interface Message {
	_id: number;
	content: string;
	user: User;
	me?: boolean;
	chatID?: number; // experimanetal
	timeSent?: Date;
}

enum RoleType {
	Admin = 'Admin',
	Participant = 'Participant',
	Muted = 'Muted',
	Invited = 'Invited',
	Blocked = 'Blocked',
}

interface AppData {
	user: User;
}

export default AppData;
export type { User, UserProfile, MachHistory, Chat, Achievement, PersonalChat, GroupChat, Message, RoleType };
export { isGroupChat };