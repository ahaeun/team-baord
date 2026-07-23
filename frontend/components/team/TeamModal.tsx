'use client';

import { useEffect, useState } from 'react';
import type { Team, TeamInput } from '@/types/team';

interface TeamModalProps {
  team: Team | null;
  onSubmit: (input: TeamInput) => void;
  onDelete?: (team: Team) => void;
  onCancel: () => void;
}

export function TeamModal({ team, onSubmit, onDelete, onCancel }: TeamModalProps) {
  const [name, setName] = useState(team?.name ?? '');

  useEffect(() => {
    setName(team?.name ?? '');
  }, [team]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()}>
        {/* From Uiverse.io by uiverse-astronaut */} 
        <form onSubmit={handleSubmit}>
          <div className="cir-note" role="status" aria-live="polite">
            <span className="cir-note__ico" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v3"></path>
                <path d="M12 18v3"></path>
                <path d="M5 12H2"></path>
                <path d="M22 12h-3"></path>
                <path d="m18.36 5.64-2.12 2.12"></path>
                <path d="m7.76 16.24-2.12 2.12"></path>
                <path d="m18.36 18.36-2.12-2.12"></path>
                <path d="m7.76 7.76-2.12-2.12"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </span>
            <div className="cir-note__body">
              <p className="cir-note__t">팀을 추가해주세요.</p>
              <p className="cir-note__d">
                <label className="cir-search">
                  {/* <svg
                    className="cir-search__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.34-4.34"></path>
                  </svg> */}
                  <input
                    className="cir-search__field"
                    type="search"
                    placeholder="Please enter a team name."
                    aria-label="Search"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <button className="cir-search__kbd" type="submit">ADD</button>
                </label>

              </p>
            </div>
            <div className="cir-note__act">
              {team && onDelete && (
                <button
                  className="cir-note__close cir-note__delete"
                  type="button"
                  aria-label="Delete"
                  onClick={() => onDelete(team)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              )}
              <button className="cir-note__close" type="button" aria-label="Dismiss" onClick={onCancel}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
