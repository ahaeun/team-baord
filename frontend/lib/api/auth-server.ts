import { cookies } from 'next/headers';
import type { User } from '@/types/user';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

// 서버 컴포넌트 전용: 브라우저 대신 서버가 요청하므로 들어온 쿠키를 직접 백엔드로 전달한다.
export async function getCurrentUser(): Promise<User | null> {
  const cookieHeader = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}
