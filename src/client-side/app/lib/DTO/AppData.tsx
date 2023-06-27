"use client";

interface MatchHistory {
	_id: string;
	opponent: string;
	userScore: number;
	opponentScore: number;
	created?: Date;
	completed: boolean;
}

interface Achievement {
	_id: number;
	name: string;
	description: string;
	achievedOn?: Date;
	icon?: any;
}

// added ? to date because it was causing problems in testing, can be deleted later
// also added icon 
// also changed id to number

interface User {
	_id: string;
	name: string;
	avatar: string;
	Online?: boolean; // non Current user context
	Ingame?: boolean; 
	Role?: RoleType; // chat context
	friend?: string;
}

interface UserProfile extends User {
	MatchHistory: MatchHistory[];
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
export type { User, UserProfile, MatchHistory, Chat, Achievement, PersonalChat, GroupChat, Message, RoleType };
export { isGroupChat };
