import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Chat } from './chat.entity';

@Entity('message')
export class Message
{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	senderID: number;

	@ManyToOne(() => User, user => user.messagesSent, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'senderID' })
	sender: User;

	@Column({ nullable: true })
	chatID: number;

	@ManyToOne(((type) => Chat), chat => chat.messages, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'chatID' })
	chat: Chat;

	@Column()
	content: string;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;
}
