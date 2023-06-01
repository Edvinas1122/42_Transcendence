import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../ormEntities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileManagementService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async sendFriendRequest(senderName: string, receiverName: string): Promise<any> {
    // Logic to send a friend request
    
  }

  async approveFriendRequest(requestSenderName: string): Promise<any> {
    // Logic to approve a friend request
  }

  async removeFriend(userName: string, friendName: string): Promise<any> {
    // Logic to remove a friend
  }

  async blockUser(userName: string, targetName: string): Promise<any> {
    // Logic to block a user
  }
}