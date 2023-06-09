import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToMany, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../../users/entities/user.entity';
import { Role } from './role.entity';

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

	@OneToMany(() => Role, role => role.chat)
	roles: Role[];

	@Column({ nullable: true })
	deletedAt: Date;

	@Column({ default: false })
	deleted: boolean;

	@OneToMany(() => Message, message => message.chat)
	messages: Message[];
}