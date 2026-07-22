import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { UserRepository } from './user.repository';
import { NaverProvider } from './providers/naver.provider';
import { SlackProvider } from './providers/slack.provider';
import { SessionAuthGuard } from './session-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionService,
    UserRepository,
    NaverProvider,
    SlackProvider,
    SessionAuthGuard,
    { provide: APP_GUARD, useClass: SessionAuthGuard },
  ],
  exports: [SessionAuthGuard, SessionService, UserRepository],
})
export class AuthModule {}
