import { RoleType } from '../../chat/entities/role.entity';
import { Outcome } from '../../game/entities/match.entity';
import { User } from '../entities/user.entity';
import { Relationship, RelationshipStatus } from '../profile-management/entities/relationship.entity';
import { IsString, MinLength,} from 'class-validator';
import { IsLongField, IsShortField } from '../../utils/formFields.decorator';

export class UpdateUsernameDto {
	@IsString()
	@IsShortField({message: 'Wrong input'})
	@MinLength(3, {message: "Username must be between 3 and 20 characters long."})
	newName: string;
}
export class UpdateUserDto { // not used ??
	@IsString()
	@IsShortField()
	name?: string;

	@IsString()
	@IsShortField()
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
		this.twoFA = user.twoFactorAuth;
    }
    _id: number;
    name: string;
    avatar: string;
    Online?: boolean;
    Ingame?: boolean;
    Role?: RoleType;
	twoFA?: boolean;
}

export class UserProfileInfo extends UserInfo {
	constructor(user: User, friend?: string, online?: boolean, ingame?: boolean) {
		super(user);
		let wincount = 0;
		let losscount = 0;
		this.Online = online;
		this.Ingame = ingame;
		this.MatchHistory = [...user.matchesAsPlayer1, ...user.matchesAsPlayer2].map(match => {
			if (match.player1ID === user.id) {
				if (match.player1Score > match.player2Score) {
					wincount++;
				} else {
					losscount++;
				}
			} else {
				if (match.player2Score > match.player1Score) {
					wincount++;
				} else {
					losscount++;
				}
			}
			return {
				_id: match.id,
				opponent: match.player1ID === user.id ? match.player2.name : match.player1.name,
				userScore: match.player1ID === user.id ? match.player1Score : match.player2Score,
				opponentScore: match.player1ID === user.id ? match.player2Score : match.player1Score,
				created: match.gameEndDate,
				completed: match.outcome !== Outcome.DISCONNECTED,
			};
		});
		this.achievements = user.achievements.map(achievement => {
			return {
				_id: achievement.id,
				name: achievement.name,
				description: achievement.description,
				achievedOn: achievement.createdAt,
			};
		});
		this.friend = friend;
		this.rank = user.rank;
		this.wins = wincount;
		this.losses = losscount;
		// you can also assign user properties here if needed
	}
	MatchHistory?: MachHistory[];
	achievements?: Achievement[];
	friend?: string;
	rank?: number;
	wins?: number;
	losses?: number;
}

export class Achievement {
	_id: number;
	name: string;
	description: string;
	achievedOn: Date;
}

export class MachHistory {
	_id: number;
	opponent: string;
	userScore: number;
	opponentScore: number;
	created: Date;
	completed: boolean;
}
