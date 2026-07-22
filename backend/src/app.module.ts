import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { TeamModule } from './team/team.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RedisModule, TeamModule, ProjectModule, TaskModule, AuthModule],
})
export class AppModule {}
