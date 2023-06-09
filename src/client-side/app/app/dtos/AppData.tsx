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
	Online: boolean;
	Ingame: boolean;
	MachHistory: MachHistory[];
	Achievements: Achievement[];
	friend?: boolean;
}

interface User_small {
	_id: string;
	name: string;
	avatar: string;
	Online: boolean;
	Ingame: boolean;
	Role?: RoleType;
}

interface PersonalChat {
	_id: string;
	name: string;
	participant: User_small;
	messages: Message[];
}

interface GroupChat {
	_id: string;
	name: string;
	owner: User_small;
	participants: User_small[];
	messages: Message[];
	privileged: boolean;
}

interface Message {
	_id: string;
	content: string;
	user: User_small;
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
export { User, MachHistory, Achievement, User_small, PersonalChat, GroupChat, Message, RoleType };