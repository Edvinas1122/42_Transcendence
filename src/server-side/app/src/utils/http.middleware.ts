import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['x-forwarded-proto'] == 'http') {
      res.redirect(301, `https://${req.headers.host}${req.url}`);
    } else {
      next();
    }
  }
}