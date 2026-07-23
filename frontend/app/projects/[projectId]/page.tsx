'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { TaskBoard } from '@/components/task/TaskBoard';
import { fetchTasksByProject } from '@/lib/api/task';
import { fetchProject } from '@/lib/api/project';
import type { Task } from '@/types/task';
import type { Project } from '@/types/project';
import '../../shared.css';
import '../../teams/teams.css';
import '../project-board.css';

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);

  useEffect(() => {
    fetchProject(projectId).then(setProject);
    fetchTasksByProject(projectId).then(setTasks);
  }, [projectId]);

  return (
    <main className="team-page-bg">
      <Header teamName={project?.name} />
      <div className="project-board-page">
        <h2>{project ? project.name : '프로젝트'}</h2>
        {tasks && <TaskBoard projectId={projectId} tasks={tasks} />}
      </div>
    </main>
  );
}
