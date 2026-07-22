import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamRepository, TeamRecord } from './team.repository';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ProjectService } from '../project/project.service';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly projectService: ProjectService,
  ) {}

  create(dto: CreateTeamDto): Promise<TeamRecord> {
    return this.teamRepository.create(dto);
  }

  findAll(): Promise<TeamRecord[]> {
    return this.teamRepository.findAll();
  }

  async findOne(id: string): Promise<TeamRecord> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new NotFoundException(`Team not found: ${id}`);
    }
    return team;
  }

  async update(id: string, dto: UpdateTeamDto): Promise<TeamRecord> {
    const updated = await this.teamRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Team not found: ${id}`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.projectService.removeAllByTeam(id);
    await this.teamRepository.remove(id);
  }
}
