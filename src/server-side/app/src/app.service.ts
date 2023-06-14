import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  redirectToDev(): { url: string } {
    // redirect to /auth/UserDev/
    return { url: 'https://localhost:3000/auth/UserDev/' };
  }
}
