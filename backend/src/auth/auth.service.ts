import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RedisService } from '../redis/redis.service';
import { NaverProvider } from './providers/naver.provider';
import { SlackProvider } from './providers/slack.provider';
import { OAuthProvider } from './providers/oauth-provider.interface';
import { UserRepository, User } from './user.repository';
import { SessionService } from './session.service';

const STATE_TTL_SECONDS = 300;

@Injectable()
export class AuthService {
  private readonly providers: Record<string, OAuthProvider>;

  constructor(
    private readonly redis: RedisService,
    private readonly naverProvider: NaverProvider,
    private readonly slackProvider: SlackProvider,
    private readonly userRepository: UserRepository,
    private readonly sessionService: SessionService,
  ) {
    this.providers = { naver: this.naverProvider, slack: this.slackProvider };
  }

  private getProvider(name: string): OAuthProvider {
    const provider = this.providers[name];
    if (!provider) {
      throw new UnauthorizedException(`Unknown provider: ${name}`);
    }
    return provider;
  }

  async createAuthorizeUrl(providerName: string): Promise<string> {
    const provider = this.getProvider(providerName);
    const state = randomUUID();
    await this.redis.client.set(`oauth:state:${state}`, providerName, 'EX', STATE_TTL_SECONDS);
    return provider.getAuthorizeUrl(state);
  }

  async handleCallback(
    providerName: string,
    code: string,
    state: string,
  ): Promise<{ sessionId: string; user: User }> {
    const stateKey = `oauth:state:${state}`;
    const storedProvider = await this.redis.client.get(stateKey);
    if (!storedProvider || storedProvider !== providerName) {
      throw new UnauthorizedException('Invalid or expired OAuth state');
    }
    await this.redis.client.del(stateKey);

    const provider = this.getProvider(providerName);
    const accessToken = await provider.exchangeCodeForToken(code);
    const profile = await provider.fetchProfile(accessToken);
    const user = await this.userRepository.upsertFromProfile(provider.name, profile);
    const sessionId = await this.sessionService.create(user.id);

    return { sessionId, user };
  }

  async destroySession(sessionId: string): Promise<void> {
    await this.sessionService.destroy(sessionId);
  }
}
