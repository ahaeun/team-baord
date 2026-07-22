import { Injectable } from '@nestjs/common';
import { OAuthProfile, OAuthProvider } from './oauth-provider.interface';

@Injectable()
export class SlackProvider implements OAuthProvider {
  readonly name = 'slack' as const;

  private get clientId() {
    return process.env.SLACK_CLIENT_ID ?? '';
  }

  private get clientSecret() {
    return process.env.SLACK_CLIENT_SECRET ?? '';
  }

  private get callbackUrl() {
    return process.env.SLACK_CALLBACK_URL ?? '';
  }

  getAuthorizeUrl(state: string): string {
    const url = new URL('https://slack.com/openid/connect/authorize');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', this.callbackUrl);
    url.searchParams.set('scope', 'openid profile email');
    url.searchParams.set('state', state);
    return url.toString();
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.callbackUrl,
      code,
    });

    const res = await fetch('https://slack.com/api/openid.connect.token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = await res.json();
    if (!data.ok) {
      throw new Error(`Slack token exchange failed: ${JSON.stringify(data)}`);
    }
    return data.access_token;
  }

  async fetchProfile(accessToken: string): Promise<OAuthProfile> {
    const res = await fetch('https://slack.com/api/openid.connect.userInfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    return {
      providerId: data.sub,
      name: data.name,
      email: data.email,
      avatarUrl: data.picture,
    };
  }
}
