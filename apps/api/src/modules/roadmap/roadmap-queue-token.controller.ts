import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    Inject,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import {
    RoadmapQueueFiledRequestDto,
    RoadmapQueueRequestDto,
} from '../../common/dto/dtos';
import { RoadmapQueueService } from './roadmap-queue.service';
import { isValidToken } from './roadmap-token';
import { ROADMAP_WRITER, type RoadmapWriter } from './roadmap-writer';

const HEADER = 'x-roadmap-token';

/**
 * The queue routes that are not signed in with an account, because their callers cannot sign in: the phone
 * shortcut (adds a note) and the laptop tool (reads new notes and marks them filed). Each has its own shared
 * token in an env variable and refuses every call without it: ROADMAP_INTAKE_TOKEN for adding,
 * ROADMAP_DRAIN_TOKEN for reading and filing. With a variable unset its routes refuse everything.
 * Deliberately separate from RoadmapController, which is admin only as a whole.
 */
@ApiTags('roadmap')
@Controller('roadmap/queue')
export class RoadmapQueueTokenController {
    constructor(
        private readonly config: ConfigService,
        private readonly queue: RoadmapQueueService,
        @Inject(ROADMAP_WRITER) private readonly writer: RoadmapWriter,
    ) {}

    private require(variable: string, given: string | undefined) {
        if (!isValidToken(this.config.get<string>(variable), given)) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    @Public()
    @Post('intake')
    @HttpCode(201)
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    @ApiExcludeEndpoint()
    intake(
        @Headers(HEADER) token: string | undefined,
        @Body() body: RoadmapQueueRequestDto,
    ) {
        this.require('ROADMAP_INTAKE_TOKEN', token);
        return this.writer.append({ text: body.text, source: 'phone' });
    }

    @Public()
    @Get('pending')
    @Throttle({ default: { limit: 20, ttl: 60_000 } })
    @ApiExcludeEndpoint()
    pending(@Headers(HEADER) token: string | undefined) {
        this.require('ROADMAP_DRAIN_TOKEN', token);
        return this.queue.pending();
    }

    @Public()
    @Post('filed')
    @HttpCode(200)
    @Throttle({ default: { limit: 20, ttl: 60_000 } })
    @ApiExcludeEndpoint()
    filed(
        @Headers(HEADER) token: string | undefined,
        @Body() body: RoadmapQueueFiledRequestDto,
    ) {
        this.require('ROADMAP_DRAIN_TOKEN', token);
        return this.queue.markFiled(body.ids, 'laptop');
    }
}
