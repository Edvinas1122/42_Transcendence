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
	friend?: boolean;
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
}

interface PersonalChat extends Chat {
	participant: User;
}

interface GroupChat extends Chat {
	owner: User;
	participants: User[];
	privileged: boolean;
}

interface Message {
	_id: number;
	content: string;
	user: User;
	me?: boolean;
	chatID?: number; // experimanetal
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