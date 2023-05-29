import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../ormEntities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(name: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { name } });
  }

  async create(user: User): Promise<User | null>
  {
    if (!user.name) {
      throw new Error('User name is required');
    }
    const resultUser = await this.findOne(user.name);
    if (resultUser) {
      return null;
    }
    return await this.userRepository.save(user);
  }

  async create2({ id, username, photos }): Promise<User | null>
  {
    const newUser = new User();
    newUser.name = username;
    console.log(photos);
    const resultUser = await this.findOne(username);
    if (resultUser)
      return null;
    return await this.userRepository.save(newUser);
  }
}