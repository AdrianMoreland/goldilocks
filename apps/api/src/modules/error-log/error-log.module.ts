import { Global, Module } from '@nestjs/common';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { AuthModule } from '../auth/auth.module';
import { ErrorLogService } from './error-log.service';
import { ErrorLogController } from './error-log.controller';

/** Global so the app-wide exception filter and any module (metals, …) can record errors without importing this. */
@Global()
@Module({
    imports: [RedisModule, AuthModule],
    providers: [ErrorLogService],
    controllers: [ErrorLogController],
    exports: [ErrorLogService],
})
export class ErrorLogModule {}
