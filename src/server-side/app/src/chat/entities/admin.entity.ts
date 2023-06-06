import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.chatsBlocked)
  user: User;

  @ManyToOne(() => Chat, chat => chat.blockedUsers)
  chat: Chat;
}