import type { User } from '@/types/user';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export function naverLoginUrl(): string {
  return `${API_BASE}/auth/naver`;
}

export function slackLoginUrl(): string {
  return `${API_BASE}/auth/slack`;
}

export function logoutUrl(): string {
  return `${API_BASE}/auth/logout`;
}

export async function fetchMe(): Promise<User | null> {
  const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
  if (!res.ok) return null;
  return res.json();
}
