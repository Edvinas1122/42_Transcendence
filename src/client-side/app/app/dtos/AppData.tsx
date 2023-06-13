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
}

interface UserProfile extends User {
	MachHistory: MachHistory[];
	Achievements: Achievement[];
	friend?: boolean;
}

interface Chat {
	_id: number;
	name: string;
	messages: Message[];
	personal: boolean;
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
export { User, UserProfile, MachHistory, Achievement, PersonalChat, GroupChat, Message, RoleType };