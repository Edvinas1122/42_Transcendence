import { Entity, Column, PrimaryGeneratedColumn,
	CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum Outcome {
	DISCONNECTED = 'DISCONNECTED',
	WON_BY_SCORE = 'WON_BY_SCORE',
	WON_BY_TIME = 'WON_BY_TIME',
}

@Entity('mach')
export class Match {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	gameType: string;

	@Column()
	outcome: Outcome;

	@Column()
	player1Score: number;

	@Column()
	player1ID: number;

	@ManyToOne(() => User, (user) => user.matchesAsPlayer1, { onDelete: 'CASCADE' })
	@JoinColumn({ name: "player1ID" })
	player1: User;

	@Column()
	player2Score: number;

	@Column()
	player2ID: number;

	@ManyToOne(() => User, (user) => user.matchesAsPlayer2, { onDelete: 'CASCADE' })
	@JoinColumn({ name: "player2ID" })
	player2: User;

	@CreateDateColumn()
	gameEndDate: Date;
}
