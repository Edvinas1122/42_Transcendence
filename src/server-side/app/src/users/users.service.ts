import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

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

  async createFrom42(info: JSON): Promise<User | null>
  {
    const newUser = new User();
    newUser.name = info['login'];
    newUser.FullName = info['displayname'];
    newUser.avatar = info['image']['versions']['small'];
    newUser.ImageLinks = info['image']['versions'];
    newUser.OriginJson = info;

    const resultUser = await this.findOne(newUser.name);
    if (resultUser)
      return null;
    return await this.userRepository.save(newUser);
  }
}