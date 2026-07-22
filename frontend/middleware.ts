import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function middleware(request: NextRequest) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Cookie: request.headers.get('cookie') ?? '' },
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/teams/:path*', '/projects/:path*'],
};
