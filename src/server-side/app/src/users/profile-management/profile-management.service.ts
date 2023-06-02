import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from '../entities/user.entity';
import { Relationship, RelationshipStatus } from './entities/relationship.entity';
import { Repository } from 'typeorm';
import { EventsGateway } from '../../events/events.gateway';
import { RelationshipNotificationMessage } from './utils/messages.types';

@Injectable()
export class ProfileManagementService {
  constructor(
    @InjectRepository(Relationship)
    private relationshipsRepository: Repository<Relationship>,
    private readonly eventsGateway: EventsGateway
  ) {}

  async sendFriendRequest(senderId: number, receiverId: number): Promise<Relationship>{
    const relationship = new Relationship();
    relationship.user1ID = senderId;
    relationship.user2ID = receiverId;
    relationship.status = RelationshipStatus.PENDING;
  
    const alreadyExists = await this.relationshipsRepository.findOne({
        where: [
            { user1ID: senderId, user2ID: receiverId },
            { user1ID: receiverId, user2ID: senderId }
        ]
      });
    // if (alreadyExists)
    //   return alreadyExists;
    const info = await this.relationshipsRepository.save(relationship);
    this.eventsGateway.sendToUser(receiverId, 
      RelationshipNotificationMessage(RelationshipStatus.PENDING, null));
    return info;
  }

  async getPendingFriendRequest(senderId: number, receiverId: number): Promise<Relationship> {
    return this.relationshipsRepository.findOne({
      where: [
        { user1ID: senderId, user2ID: receiverId, status: RelationshipStatus.PENDING },
        { user1ID: receiverId, user2ID: senderId, status: RelationshipStatus.PENDING }
      ]
    });
  }

  async getAllPendingRequests(userId: number): Promise<Relationship[]> {
    return this.relationshipsRepository.find({
      where: [
        { user1ID: userId, status: RelationshipStatus.PENDING },
        { user2ID: userId, status: RelationshipStatus.PENDING }
      ]
    });
  }


  async approveFriendRequest(requestSenderId: number, requestReceiverId: number): Promise<Relationship> {
    const friendRequest = await this.relationshipsRepository.findOne({ 
      where: { 
        user1ID: requestSenderId,
        user2ID: requestReceiverId,
        status: RelationshipStatus.PENDING
      } 
    });

    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    friendRequest.status = RelationshipStatus.APPROVED;

    const updatedRelationship = await this.relationshipsRepository.save(friendRequest);

    this.eventsGateway.sendToUser(requestSenderId,
        RelationshipNotificationMessage(RelationshipStatus.APPROVED, null));

    return updatedRelationship;
  }


  // async removeFriend(userName: string, friendName: string): Promise<any> {
  //   const friendRequest = await this.relationshipsRepository.findOne({ 
  //     where: { 
  //       user1ID: requestSenderId,
  //       user2ID: requestReceiverId,
  //       status: RelationshipStatus.PENDING
  //     } 
  //   });

  //   if (!friendRequest) {
  //     throw new NotFoundException('Friend request not found');
  //   }

  //   friendRequest.status = RelationshipStatus.REJECTED;

  //   const updatedRelationship = await this.relationshipsRepository.save(friendRequest);

  //   this.eventsGateway.sendToUser(requestSenderId, 'Friend request approved');

  //   return updatedRelationship;
  // }


  // async blockUser(userName: string, targetName: string): Promise<any> {
  //   const friendRequest = await this.relationshipsRepository.findOne({ 
  //     where: { 
  //       user1ID: requestSenderId,
  //       user2ID: requestReceiverId,
  //     } 
  //   });

  //   if (!friendRequest) {
  //     throw new NotFoundException('Friend request not found');
  //   }

  //   friendRequest.status = RelationshipStatus.BLOCKED;

  //   const updatedRelationship = await this.relationshipsRepository.save(friendRequest);

  //   this.eventsGateway.sendToUser(requestSenderId, 'Friend request approved');

  //   return updatedRelationship;
  // }
}