import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository, ProjectRecord } from './project.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { TaskService } from '../task/task.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly taskService: TaskService,
  ) {}

  create(dto: CreateProjectDto): Promise<ProjectRecord> {
    return this.projectRepository.create(dto);
  }

  findAllByTeam(teamId: string): Promise<ProjectRecord[]> {
    return this.projectRepository.findAllByTeam(teamId);
  }

  async removeAllByTeam(teamId: string): Promise<void> {
    const projects = await this.projectRepository.findAllByTeam(teamId);
    await Promise.all(projects.map((project) => this.taskService.removeAllByProject(project.id)));
    await this.projectRepository.removeAllByTeam(teamId);
  }

  async findOne(id: string): Promise<ProjectRecord> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project not found: ${id}`);
    }
    return project;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectRecord> {
    const updated = await this.projectRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Project not found: ${id}`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.taskService.removeAllByProject(id);
    await this.projectRepository.remove(id);
  }
}
