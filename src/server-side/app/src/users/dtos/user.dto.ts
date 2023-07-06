import { RoleType } from '../../chat/entities/role.entity';
import { User } from '../entities/user.entity';
import { Relationship, RelationshipStatus } from '../profile-management/entities/relationship.entity';
import { IsString, MinLength,} from 'class-validator';

export class UpdateUsernameDto {
	newName: string;
}
export class UpdateUserDto {
	name?: string;
	avatar?: string;
}

export class UserInfo {
    constructor(user: User, role?: RoleType) {
        this._id = user.id;
        this.name = user.name;
        this.avatar = user.avatar;
        // this.Online = false;
        // this.Ingame = false;
        this.Role = role;
    }
    _id: number;
    name: string;
    avatar: string;
    Online?: boolean;
    Ingame?: boolean;
    Role?: RoleType;
	
}

export class UserProfileInfo extends UserInfo {
	constructor(user: User, friend?: string) {
		super(user);
		this.MachHistory = [];
		this.Achievements = [];
		this.friend = friend;
		this.rank = user.rank;
		// you can also assign user properties here if needed
	}
	MachHistory?: MachHistory[];
	Achievements?: Achievement[];
	friend?: string;
	rank?: number;
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
