'use client';

import { useRouter } from 'next/navigation';
import type { Project, ProjectStatus } from '@/types/project';
import { PROJECT_STATUS_LABELS } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

const STATUS_COLORS: Record<ProjectStatus, string> = {
  IN_DEVELOPMENT: '#2563eb',
  IN_OPERATION: '#16a34a',
  CLOSED: '#dc2626',
};

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const router = useRouter();

  return (
    <main>
      <article className="cir-stat" style={{ cursor: 'pointer' }} onClick={() => router.push(`/projects/${project.id}`)}>
        <header className="cir-stat__head">
          <span className="cir-stat__label">
            <span
              className="status-dot"
              style={{ backgroundColor: STATUS_COLORS[project.status] }}
              aria-hidden="true"
            >
            </span>
            <span style={{ color: '#9a9a9aff' }}>{project.status}</span>
          </span>
          <span className="cir-stat__range">{project.startDate}</span>
        </header>

        <div className="cir-stat__value">
          {project.name}
        </div>


        <div className="cir-stat__bar" aria-hidden="true">
          <span style={{ flex: 46 }}></span>
          <span style={{ flex: 28 }}></span>
          <span style={{ flex: 14 }}></span>
          <span style={{ flex: 12 }}></span>
        </div>

        <footer className="cir-stat__legend">
          <span>{project.memo}</span>
        </footer>
      </article>


      {/* <div className="card" onClick={() => router.push(`/projects/${project.id}`)}>
        <div className="card-header">
          <h3>{project.name}</h3>
          <button
            type="button"
            className="card-edit"
            aria-label="프로젝트 수정"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
          >
            ✎
          </button>
        </div>
        {project.startDate && <p className="card-date">시작일: {project.startDate}</p>}
        {project.memo && <p className="card-memo">{project.memo}</p>}
      </div> */}

    </main>
  );
}
