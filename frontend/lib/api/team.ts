import type { Team, TeamInput } from '@/types/team';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function fetchTeams(): Promise<Team[]> {
  const res = await fetch(`${API_BASE}/teams`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch teams');
  return res.json();
}

export async function fetchTeam(id: string): Promise<Team> {
  const res = await fetch(`${API_BASE}/teams/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch team');
  return res.json();
}

export async function createTeam(input: TeamInput): Promise<Team> {

  if (input.name.trim() === '') {
    alert('팀 이름을 입력해주세요.');
    throw new Error('Team name is required');
  }

  const res = await fetch(`${API_BASE}/teams`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create team');
  return res.json();
}

export async function updateTeam(id: string, input: TeamInput): Promise<Team> {
  const res = await fetch(`${API_BASE}/teams/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update team');
  return res.json();
}

export async function deleteTeam(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/teams/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete team');
}
