import { Entity, Column, PrimaryGeneratedColumn,
			CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
  
export enum EventType {
	Chat = 'chat',
	Users = 'users',
	Game = 'game',
	System = 'system',
}

@Entity()
export class Event {
	@PrimaryGeneratedColumn()
	id: number;

	// @Column({
	// 	type: 'enum',
	// 	enum: StoredEventType,
	// 	default: StoredEventType.CHAT_MESSAGE,
	// })
	@Column()
	type: EventType;

	@Column({ type: 'jsonb', nullable: true })
	data: any;

	@ManyToOne(() => User, (user) => user.events)
	user: User;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}