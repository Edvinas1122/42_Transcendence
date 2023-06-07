import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../../users/entities/user.entity';

export enum RoleType {
  Admin = 'Admin',
  Participant = 'Participant',
  Muted = 'Muted',
  Invited = 'Invited',
  Blocked = 'Blocked',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: RoleType,
    default: RoleType.Participant
  })
  type: RoleType;

  @ManyToOne(() => User, user => user.roles)
  user: User;

  @ManyToOne(() => Chat, chat => chat.roles)
  chat: Chat;
}
