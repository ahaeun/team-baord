'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchMe, logoutUrl } from '@/lib/api/auth';
import { createTeam } from '@/lib/api/team';
import { TeamModal } from '@/components/team/TeamModal';
import type { User } from '@/types/user';
import type { TeamInput } from '@/types/team';

interface HeaderProps {
  teamName?: string;
}

export function Header({ teamName }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);

  useEffect(() => {
    fetchMe().then(setUser);
  }, []);

  const handleAddTeam = async (input: TeamInput) => {
    await createTeam(input);
    setIsAddTeamOpen(false);
    router.push('/teams');
    router.refresh();
  };

  return (
    <>
      <header className="app-header">
        <Link href="/teams" className="app-header__icon" aria-label="홈">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5 12 3l9 6.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </Link>

        <span className="app-header__divider" />

        {teamName && (
          <>
            <span className="app-header__team">{teamName}</span>
          </>
        )}

        <button
          type="button"
          className="app-header__icon"
          onClick={() => setIsAddTeamOpen(true)}
          aria-label="팀 추가"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </button>

        {user && (
          <>
            <span className="app-header__profile">
              {user.avatarUrl ? (
                <img className="app-header__avatar-img" src={user.avatarUrl} alt="" />
              ) : (
                <span className="app-header__avatar">{user.name?.[0] ?? '?'}</span>
              )}
              {user.name}
            </span>
            <span className="app-header__divider" />
          </>
        )}

        <a href={logoutUrl()} className="app-header__icon" aria-label="로그아웃">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
        </a>
      </header>

      {isAddTeamOpen && (
        <TeamModal team={null} onSubmit={handleAddTeam} onCancel={() => setIsAddTeamOpen(false)} />
      )}
    </>
  );
}
