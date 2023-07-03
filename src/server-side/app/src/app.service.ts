import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  redirectToDev(): { url: string } {
    // redirect to /auth/UserDev/
    return { url: process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL + '/auth/UserDev/' };
  }
}
