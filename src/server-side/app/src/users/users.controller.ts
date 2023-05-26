import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return [
      { id: 1, name: 'Dummy User 1', email: 'dummy1@email.com' },
      { id: 2, name: 'Dummy User 2', email: 'dummy2@email.com' },
      { id: 3, name: 'Dummy User 3', email: 'dummy3@email.com' },
    ];
  }
}
