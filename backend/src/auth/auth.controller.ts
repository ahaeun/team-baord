import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { UserRepository } from './user.repository';

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'team_board_session';
const SESSION_TTL_SECONDS = Number(process.env.SESSION_TTL_SECONDS ?? 60 * 60 * 24 * 7);
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  // 정적 라우트(me, logout)는 아래 동적 라우트(:provider)보다 반드시 먼저 선언해야 한다.
  // NestJS(Express)는 선언 순서대로 매칭하므로, 순서가 바뀌면 /auth/me가 :provider="me"로 잘못 매칭된다.
  @Get('me')
  async me(@Req() req: Request) {
    return this.userRepository.findById((req as Request & { userId: string }).userId);
  }

  @Public()
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
    if (sessionId) {
      await this.authService.destroySession(sessionId);
    }
    res.clearCookie(SESSION_COOKIE_NAME);
    res.redirect(`${FRONTEND_URL}/login`);
  }

  @Public()
  @Get(':provider')
  async redirectToProvider(@Param('provider') provider: string, @Res() res: Response) {
    const url = await this.authService.createAuthorizeUrl(provider);
    res.redirect(url);
  }

  @Public()
  @Get(':provider/callback')
  async handleCallback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    const { sessionId } = await this.authService.handleCallback(provider, code, state);

    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: SESSION_TTL_SECONDS * 1000,
    });
    res.redirect(`${FRONTEND_URL}/teams`);
  }
}
