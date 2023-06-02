import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users.service';
import { ProfileManagementService } from '../profile-management.service';

@Injectable()
export class FriendApproveGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly profileManagementService: ProfileManagementService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
	const requestSenderId = request['user']['id'];
	const requestReceiverId = request.body['receiverId'];

    const requestSender = await this.userService.findOne(requestSenderId);
    const requestReceiver = await this.userService.findOne(requestReceiverId);

    if (!requestSender || !requestReceiver) {
      throw new NotFoundException('User not found');
    }

    const friendRequest = await this.profileManagementService.getPendingFriendRequest(requestSender.id, requestReceiver.id);

    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    return true;
  }
}

@Injectable()
export class FriendRequestGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly profileManagementService: ProfileManagementService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
	const requestSenderId = request['user']['id'];
	const requestReceiverId = request.body['receiverId'];

    const requestSender = await this.userService.findOne(requestSenderId);
    const requestReceiver = await this.userService.findOne(requestReceiverId);

    if (!requestSender || !requestReceiver) {
      throw new NotFoundException('User not found');
    }

    return true;
  }
}