import { Entity, Column, PrimaryGeneratedColumn,
	CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('achievement')
export class Achievement {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column()
	laureateId: number;

	@ManyToOne(() => User, (user) => user.achievements, { onDelete: 'CASCADE' })
	@JoinColumn({ name: "LaureateId" })
	laureate: User;

	@CreateDateColumn()
	createdAt: Date;
}