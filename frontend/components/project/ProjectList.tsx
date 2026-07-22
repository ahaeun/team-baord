import type { Project } from '@/types/project';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
}

export function ProjectList({ projects, onEdit }: ProjectListProps) {
  if (projects.length === 0) {
    return <p className="card-list-empty">아직 프로젝트가 없습니다.</p>;
  }

  return (
    <div className="card-list">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onEdit={onEdit} />
      ))}
    </div>
  );
}
