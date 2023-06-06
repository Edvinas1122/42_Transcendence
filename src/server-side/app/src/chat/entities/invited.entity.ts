import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Invited {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.chatsInvited)
  user: User;

  @ManyToOne(() => Chat, chat => chat.invitedUsers)
  chat: Chat;
}
