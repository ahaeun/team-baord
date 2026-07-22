export interface User {
  id: string;
  provider: 'naver' | 'slack';
  providerId: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
}
