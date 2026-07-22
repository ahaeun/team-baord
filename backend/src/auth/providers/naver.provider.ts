import { Injectable } from '@nestjs/common';
import { OAuthProfile, OAuthProvider } from './oauth-provider.interface';

@Injectable()
export class NaverProvider implements OAuthProvider {
  readonly name = 'naver' as const;

  private get clientId() {
    return process.env.NAVER_CLIENT_ID ?? '';
  }

  private get clientSecret() {
    return process.env.NAVER_CLIENT_SECRET ?? '';
  }

  private get callbackUrl() {
    return process.env.NAVER_CALLBACK_URL ?? '';
  }

  getAuthorizeUrl(state: string): string {
    const url = new URL('https://nid.naver.com/oauth2.0/authorize');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', this.callbackUrl);
    url.searchParams.set('state', state);
    return url.toString();
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    const url = new URL('https://nid.naver.com/oauth2.0/token');
    url.searchParams.set('grant_type', 'authorization_code');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('client_secret', this.clientSecret);
    url.searchParams.set('code', code);

    const res = await fetch(url.toString());
    const data = await res.json();
    if (!data.access_token) {
      throw new Error(`Naver token exchange failed: ${JSON.stringify(data)}`);
    }
    return data.access_token;
  }

  async fetchProfile(accessToken: string): Promise<OAuthProfile> {
    const res = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    const profile = data.response;
    return {
      providerId: profile.id,
      name: profile.name,
      email: profile.email,
      avatarUrl: profile.profile_image,
    };
  }
}
