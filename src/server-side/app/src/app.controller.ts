import { Controller, Get, Redirect, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express'; // Make sure to import the Response object from 'express'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  redirectToDev(@Res() res: Response): void {
    const devLoginUrl = process.env.FRONT_END_API;
    res.redirect(devLoginUrl);
  }
}