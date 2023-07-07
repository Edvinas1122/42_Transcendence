
import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtTwoFactorGuard extends AuthGuard('jwt-two-factor') {}