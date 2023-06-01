import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../entities/user.entity';

export enum RelationshipStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED',
}

@Entity('relationship')
export class Relationship
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user1ID: number;

  @ManyToOne(() => User, user => user.relationshipsInitiated, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user1ID' })
  user1: User;

  @Column()
  user2ID: number;

  @ManyToOne(() => User, user => user.relationshipsReceived, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user2ID' })
  user2: User;

  @Column({
    type: "enum",
    enum: RelationshipStatus,
    default: RelationshipStatus.PENDING
  })
  status: RelationshipStatus;
}
