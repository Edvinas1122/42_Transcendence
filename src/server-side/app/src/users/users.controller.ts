import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../ormEntities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get('all')
  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  @Get('dummy')
  findAllDummy() {
    return [
      { id: 1, name: 'Dummy User 1', email: 'dummy1@email.com' },
      { id: 2, name: 'Dummy User 2', email: 'dummy2@email.com' },
      { id: 3, name: 'Dummy User 3', email: 'dummy3@email.com' },
    ];
  }

  @Post()
  async createUser(@Body() user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
