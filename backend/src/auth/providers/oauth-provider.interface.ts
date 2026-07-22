export interface OAuthProfile {
  providerId: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export interface OAuthProvider {
  readonly name: 'naver' | 'slack';
  getAuthorizeUrl(state: string): string;
  exchangeCodeForToken(code: string): Promise<string>;
  fetchProfile(accessToken: string): Promise<OAuthProfile>;
}
