import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Muted {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.chatsMuted)
	user: User;

	@ManyToOne(() => Chat, chat => chat.mutedUsers)
	chat: Chat;
}
