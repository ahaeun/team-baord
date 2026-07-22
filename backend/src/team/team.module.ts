import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [ProjectModule],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository],
  exports: [TeamService],
})
export class TeamModule {}
