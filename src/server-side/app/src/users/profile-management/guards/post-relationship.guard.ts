import { Inject, CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users.service';
import { ProfileManagementService } from '../profile-management.service';
import { In } from 'typeorm';

@Injectable()
export class FriendApproveGuard implements CanActivate {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
    @Inject(ProfileManagementService)
    private readonly profileManagementService: ProfileManagementService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
	// const requestSenderId = request['user']['id'];
	const requestReceiverId = request.body['receiverId'];

    // const requestSender = await this.userService.findOne(requestSenderId);
    const requestReceiver = await this.userService.findOne(requestReceiverId);

    if (!requestReceiver) {
      throw new NotFoundException('User not found');
    }

    // const friendRequest = await this.profileManagementService.getPendingFriendRequest(requestSender.id, requestReceiver.id);

    // if (!friendRequest) {
    //   throw new NotFoundException('Friend request not found');
    // }

    return true;
  }
}

@Injectable()
export class FriendRequestGuard implements CanActivate {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
    @Inject(ProfileManagementService)
    private readonly profileManagementService: ProfileManagementService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log(request as string);
	// const requestSenderId = request['user']['id'];
	const requestReceiverId = request.body['receiverId'];

    // const requestSender = await this.userService.findOne(requestSenderId);
    const requestReceiver = await this.userService.findOne(requestReceiverId);

    if (!requestReceiver) {
      throw new NotFoundException('User not found');
    }

    return true;
  }
}