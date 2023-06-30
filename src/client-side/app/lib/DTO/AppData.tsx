"use client";

interface HasId {
	_id: number;
}

interface MachHistory extends HasId {
	opeonent: string;
	userScore: number;
	oponentScore: number;
	created: Date;
	completed: boolean;
}

interface Achievement extends HasId {
	name: string;
	description: string;
	achievedOn: Date;
}

interface User extends HasId {
	name: string;
	avatar: string;
	Online?: boolean; // non Current user context
	Ingame?: boolean; 
	Role?: RoleType; // chat context
	Muted?: boolean; // chat context
	Banned?: boolean; // chat context
	friend?: boolean;
}

interface UserProfile extends User {
	MachHistory: MachHistory[];
	Achievements: Achievement[];
}

interface Chat extends HasId {
	name: string;
	messages: Message[];
	personal: boolean; // a fuckup double discriminator
	mine?: boolean;
	type: 'personal' | 'group'; // a fuckup double discriminator
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
	protected?: boolean // remove optional field
	passwordProtected: boolean;
	type: 'group';
}

function isGroupChat(chat: Chat): chat is GroupChat { // discrimination
	if (!chat?.type)
		return false;	
    return chat.type === 'group';
}

interface Message extends HasId {
	content: string;
	user: User;
	me?: boolean;
	chatID?: number; // experimanetal
	timeSent?: Date;
}

enum RoleType {
	Owner = 'Owner',
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