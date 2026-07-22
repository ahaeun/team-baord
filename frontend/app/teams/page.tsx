'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { TeamList } from '@/components/team/TeamList';
import { TeamModal } from '@/components/team/TeamModal';
import { createTeam, deleteTeam, fetchTeams, updateTeam } from '@/lib/api/team';
import type { Team, TeamInput } from '@/types/team';
import '../shared.css';
import './teams.css';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTeams().then(setTeams);
  }, []);

  const openCreateModal = () => {
    setEditingTeam(null);
    setIsModalOpen(true);
  };

  const openEditModal = (team: Team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  const handleSubmit = async (input: TeamInput) => {
    if (editingTeam) {
      const updated = await updateTeam(editingTeam.id, input);
      setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const created = await createTeam(input);
      setTeams((prev) => [created, ...prev]);
    }
    closeModal();
  };

  const handleDelete = async (team: Team) => {
    await deleteTeam(team.id);
    setTeams((prev) => prev.filter((t) => t.id !== team.id));
    closeModal();
  };

  const toggleSelect = (teamId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(teamId)) {
        next.delete(teamId);
      } else {
        next.add(teamId);
      }
      return next;
    });
  };

  const handleBulkDelete = async () => {
    await Promise.all(Array.from(selectedIds).map((id) => deleteTeam(id)));
    setTeams((prev) => prev.filter((t) => !selectedIds.has(t.id)));
    setSelectedIds(new Set());
  };

  return (
    <main className="team-page-bg">
      <Header />
      <div className="team-card">
        <div className="page-header">
          <h2>TEAM LIST 📝</h2>
          <button className="cir-search__kbd" onClick={openCreateModal}>
            ADD TEAM +
          </button>
        </div>
        <div className="memo">
          <span>팀 이름 클릭 시 해당 팀으로 이동됩니다.</span>
        </div>

        <TeamList
          teams={teams}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onEdit={openEditModal}
        />

        {selectedIds.size > 0 && (
          <button className="team-delete-selected" onClick={handleBulkDelete}>
            선택한 {selectedIds.size}개 팀 삭제
          </button>
        )}

        {isModalOpen && (
          <TeamModal team={editingTeam} onSubmit={handleSubmit} onDelete={handleDelete} onCancel={closeModal} />
        )}
      </div>
    </main>
  );
}
