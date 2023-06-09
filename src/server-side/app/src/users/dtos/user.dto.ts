import { RoleType } from '../../chat/entities/role.entity';
import { User } from '../entities/user.entity';

export class UpdateUserDto {
	name: string;
	avatar: string;
}

export class UserInfo {
	constructor(user?: User) {
		this._id = user ? user.id : null;
		this.name = user ? user.name : null;
		this.avatar = user ? user.avatar : null;
		this.Online = false;
		this.Ingame = false;
		// this.Role = user && user.Role ? user.Role : undefined; // for chat context
	}
	_id?: number;
	name: string;
	avatar: string;
	Online?: boolean;
	Ingame?: boolean;
	Role?: RoleType;
}

export class UserProfileInfo extends UserInfo {
	constructor(user: User) {
		super(user);
		this.MachHistory = [];
		this.Achievements = [];
		// you can also assign user properties here if needed
	}
	MachHistory?: MachHistory[];
	Achievements?: Achievement[];
	friend?: boolean; // for non-current user context
}

export class Achievement {
	_id: number;
	name: string;
	description: string;
	achievedOn: Date;
}

export class MachHistory {
	_id: number;
	opeonent: string;
	userScore: number;
	oponentScore: number;
	created: Date;
	completed: boolean;
}
