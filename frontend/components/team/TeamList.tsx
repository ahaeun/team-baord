import type { Team } from '@/types/team';
import { TeamCard } from './TeamCard';

interface TeamListProps {
  teams: Team[];
  selectedIds: Set<string>;
  onToggleSelect: (teamId: string) => void;
  onEdit: (team: Team) => void;
}

export function TeamList({ teams, selectedIds, onToggleSelect, onEdit }: TeamListProps) {
  if (teams.length === 0) {
    return <p className="card-list-empty">아직 팀이 없습니다.</p>;
  }

  return (
    <div className="team-timeline">
      {teams.map((team, index) => (
        <TeamCard
          key={team.id}
          team={team}
          isLast={index === teams.length - 1}
          isSelected={selectedIds.has(team.id)}
          onToggleSelect={onToggleSelect}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
