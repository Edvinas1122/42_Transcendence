import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // Custom methods or overrides can be defined here
  // Example: findActiveUsers(): Promise<User[]> { ... }
}