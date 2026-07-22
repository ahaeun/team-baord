import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/api/auth-server';

export default async function HomePage() {
  const user = await getCurrentUser();
  redirect(user ? '/teams' : '/login');
}
