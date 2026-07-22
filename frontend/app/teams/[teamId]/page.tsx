'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ProjectList } from '@/components/project/ProjectList';
import { ProjectModal } from '@/components/project/ProjectModal';
import { createProject, deleteProject, fetchProjectsByTeam, updateProject } from '@/lib/api/project';
import { fetchTeam } from '@/lib/api/team';
import type { Project, ProjectInput } from '@/types/project';
import type { Team } from '@/types/team';
import '../../shared.css';
import '../teams.css';

export default function TeamProjectsPage() {
  const params = useParams<{ teamId: string }>();
  const teamId = params.teamId;

  const [team, setTeam] = useState<Team | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTeam(teamId).then(setTeam);
    fetchProjectsByTeam(teamId).then(setProjects);
  }, [teamId]);

  const openCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (input: ProjectInput) => {
    if (editingProject) {
      const updated = await updateProject(editingProject.id, input);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await createProject(input);
      setProjects((prev) => [created, ...prev]);
    }
    closeModal();
  };

  const handleDelete = async (project: Project) => {
    await deleteProject(project.id);
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    closeModal();
  };

  return (
    <main className="team-page-bg">
      <Header teamName={team?.name} />
      <div className="projects-list">
        <div className="page-header">
          <h2>📌 {team ? `${team.name} 프로젝트` : '프로젝트'}</h2>
          <button className="cir-search__kbd" onClick={openCreateModal}>
            ADD PROJECT +
          </button>
        </div>
        <div className="memo">
          <span>프로젝트 클릭 시 해당 프로젝트로 이동됩니다.</span>
        </div>

        <ProjectList projects={projects} onEdit={openEditModal} />

        {isModalOpen && (
          <ProjectModal
            teamId={teamId}
            project={editingProject}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onCancel={closeModal}
          />
        )}
      </div>
    </main>
  );
}
