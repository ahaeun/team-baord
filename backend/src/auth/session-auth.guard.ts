import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionService } from './session.service';
import { IS_PUBLIC_KEY } from './public.decorator';

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'team_board_session';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
    if (!sessionId) {
      throw new UnauthorizedException('No session');
    }

    const userId = await this.sessionService.getUserId(sessionId);
    if (!userId) {
      throw new UnauthorizedException('Invalid session');
    }

    req.userId = userId;
    return true;
  }
}
