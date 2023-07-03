import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../../users/entities/user.entity';

export enum SanctionType {
  KICKED = 'kicked',
  MUTED = 'muted',
  // ... add more sanction types here as necessary
}

@Entity('sanction')
export class Sanction {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'enum',
		enum: SanctionType,
		default: SanctionType.KICKED,
	})
	sanctionType: SanctionType;

	@Column('timestamp')
	sanctionUntil: Date;

	@Column()
	userId: number;

	@ManyToOne(() => User, user => user.sanctions, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user: User;

	@Column()
	chatId: number;

	@ManyToOne(() => Chat, chat => chat.sanctions, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'chatId' })
	chat: Chat;
}