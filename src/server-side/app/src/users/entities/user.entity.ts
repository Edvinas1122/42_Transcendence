import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { Relationship } from '../profile-management/entities/relationship.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { Message } from '../../chat/entities/message.entity';
import { Role } from '../../chat/entities/role.entity';
import { Event } from '../../events/entities/event.entity';
import { Sanction } from '../../chat/entities/sanction.entity';
import { Match } from '../../game/entities/match.entity';
import { Achievement } from '../../game/entities/achievement.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	avatar: string;

	@Column("json", { nullable: true })
	ImageLinks: any;

	@Column()
	FullName: string;

	// @Column("json", { nullable: true })
	// OriginJson: any;

	@OneToMany(() => Relationship, relationship => relationship.user1)
	relationshipsInitiated: Relationship[];

	@OneToMany(() => Relationship, relationship => relationship.user2)
	relationshipsReceived: Relationship[];

	@OneToMany(() => Chat, chat => chat.owner)
	chatsOwned: Chat[];

	@OneToMany(() => Role, role => role.user)
	roles: Role[];

	@OneToMany(() => Message, message => message.sender)
	messagesSent: Message[];

	@OneToMany(() => Event, (event) => event.user)
	events: Event[];

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@OneToMany(() => Sanction, sanction => sanction.user)
	sanctions: Sanction[];

	@OneToMany(() => Match, match => match.player1)
	matchesAsPlayer1: Match[];

	@OneToMany(() => Match, match => match.player2)
	matchesAsPlayer2: Match[];

	@OneToMany(() => Achievement, achievement => achievement.laureate)
	achievements: Achievement[];

	@Column({ nullable: true })
	rank: number;
}
