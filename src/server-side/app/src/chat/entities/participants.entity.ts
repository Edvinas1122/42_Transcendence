import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Chat } from './chat.entity';

@Entity()
export class Participant {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Chat, chat => chat.participants, { onDelete: 'CASCADE' })
	chat: Chat;

	@ManyToOne(() => User, user => user.participatingInChats, { onDelete: 'CASCADE' })
	user: User;

	// You can add additional properties here if needed
}