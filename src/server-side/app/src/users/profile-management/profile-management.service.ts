import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from '../entities/user.entity';
import { Relationship, RelationshipStatus } from './entities/relationship.entity';
import { Repository } from 'typeorm';
import { EventsGateway } from '../../events/events.gateway';

@Injectable()
export class ProfileManagementService {
  constructor(
    @InjectRepository(Relationship)
    private relationshipsRepository: Repository<Relationship>,
    private readonly eventsGateway: EventsGateway
  ) {}

  async sendFriendRequest(senderId: number, receiverId: number): Promise<Relationship> {

    const relationship = new Relationship();
    relationship.user1ID = senderId;
    relationship.user2ID = receiverId;
    relationship.status = RelationshipStatus.PENDING;
  
    this.eventsGateway.sendToUser(receiverId, "friend Request Received");
    return this.relationshipsRepository.save(relationship);
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