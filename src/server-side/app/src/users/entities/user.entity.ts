import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { Relationship } from '../profile-management/entities/relationship.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { Message } from '../../chat/entities/message.entity';
import { Participant } from '../../chat/entities/participants.entity';
import { Admin } from '../../chat/entities/admin.entity';
import { Blocked } from '../../chat/entities/blocked.entity';
import { Muted } from '../../chat/entities/muted.entity';
import { Invited } from '../../chat/entities/invited.entity';

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

	@OneToMany(() => Participant, participant => participant.user)
	participatingInChats: Participant[];

	@ManyToMany(() => Chat, chat => chat.mutedUsers)
	chatsMuted: Chat[];

	@ManyToMany(() => Chat, chat => chat.blockedUsers)
	chatsBlocked: Chat[];

	@ManyToMany(() => Chat, chat => chat.invitedUsers)
	chatsInvited: Chat[];

	@OneToMany(() => Message, message => message.sender)
	messagesSent: Message[];

	@OneToMany(() => Admin, admin => admin.user)
	chatsAdmin: Admin[];

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;
}
