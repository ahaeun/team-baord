export type ProjectStatus = 'IN_DEVELOPMENT' | 'IN_OPERATION' | 'CLOSED';

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  IN_DEVELOPMENT: '개발 중',
  IN_OPERATION: '운영 중',
  CLOSED: '종료',
};

export interface Project {
  id: string;
  teamId: string;
  name: string;
  startDate?: string;
  memo?: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface ProjectInput {
  teamId: string;
  name: string;
  startDate?: string;
  memo?: string;
  status?: ProjectStatus;
}
