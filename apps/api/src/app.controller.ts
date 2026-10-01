import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

// Liveness/status only — uptime monitors can't send a bearer token.
@Public()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getStatus() {
        return this.appService.getStatus();
    }

    @Get('health')
    @ApiTags('health')
    @ApiOperation({
        summary:
            'Liveness/readiness check — verifies DB and Redis are actually reachable, not just that the process is up.',
    })
    getHealth() {
        return this.appService.getHealth();
    }
}
