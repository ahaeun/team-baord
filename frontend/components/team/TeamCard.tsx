'use client';

import { useRouter } from 'next/navigation';
import type { Team } from '@/types/team';

interface TeamCardProps {
  team: Team;
  isLast: boolean;
  isSelected: boolean;
  onToggleSelect: (teamId: string) => void;
  onEdit: (team: Team) => void;
}

export function TeamCard({ team, isLast, isSelected, onToggleSelect, onEdit }: TeamCardProps) {
  const router = useRouter();
  const date = new Date(team.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="team-step" onClick={() => router.push(`/teams/${team.id}`)}>
      <div className="team-step-marker">
        <label className="cir-check" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(team.id)} />
          <span className="cir-check__box" aria-hidden="true"></span>
        </label>
        {!isLast && <div className="team-step-line" />}
      </div>
      <div className="team-step-body">
        <div className="team-step-title-row">
          <h3>{team.name}</h3>
          <p className="team-step-date">{date}</p>
        </div>
      </div>
    </div>
  );
}
