import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';

@Module({
    imports: [PrismaModule, RedisModule, AuditLogModule, PermissionsModule],
    controllers: [PeopleController],
    providers: [PeopleService],
})
export class PeopleModule {}
