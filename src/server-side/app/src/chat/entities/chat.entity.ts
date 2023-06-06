import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToMany, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../../users/entities/user.entity';
import { Participant } from './participants.entity';
import { Invited } from './invited.entity';
import { Blocked } from './blocked.entity';
import { Muted } from './muted.entity';
import { Admin } from './admin.entity';

@Entity('chat')
export class Chat {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	ownerID: number;

	@ManyToOne(() => User, user => user.chatsOwned, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'ownerID' })
	owner: User;

	@Column()
	private: boolean;

	@Column()
	personal: boolean;

	@Column({ nullable: true })
	password: string;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@OneToMany(() => Participant, participant => participant.chat)
	participants: Participant[];

	@OneToMany(() => Invited, invited => invited.chat)
	invitedUsers: Invited[];

	@OneToMany(() => Blocked, blocked => blocked.chat)
	blockedUsers: Blocked[];

	@OneToMany(() => Muted, muted => muted.chat)
	mutedUsers: Muted[];

	@OneToMany(() => Admin, admin => admin.chat)
	admins: Admin[];

	@Column({ nullable: true })
	deletedAt: Date;

	@Column({ default: false })
	deleted: boolean;

	@OneToMany(() => Message, message => message.chat)
	messages: Message[];
}