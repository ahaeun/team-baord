import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository, ProjectRecord } from './project.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  create(dto: CreateProjectDto): Promise<ProjectRecord> {
    return this.projectRepository.create(dto);
  }

  findAllByTeam(teamId: string): Promise<ProjectRecord[]> {
    return this.projectRepository.findAllByTeam(teamId);
  }

  removeAllByTeam(teamId: string): Promise<void> {
    return this.projectRepository.removeAllByTeam(teamId);
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
    await this.projectRepository.remove(id);
  }
}
