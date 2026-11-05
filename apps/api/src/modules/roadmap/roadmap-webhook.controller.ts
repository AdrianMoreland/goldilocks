import {
    Controller,
    Headers,
    HttpCode,
    Logger,
    Post,
    Req,
    UnauthorizedException,
    type RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { isValidGithubSignature } from './github-signature';
import { RoadmapInboxService } from './roadmap-inbox.service';
import { RoadmapPullService } from './roadmap-pull.service';

/**
 * GitHub calls this after every push (roadmap 1.20 slice 2). It is open to the internet by necessity,
 * so the signature is the only credential: no valid `X-Hub-Signature-256` for the shared secret, no
 * work. A push to master starts a background pull and answers at once, well inside GitHub's 10 seconds.
 * Deliberately a separate controller from RoadmapController, which is admin only as a whole.
 */
@ApiTags('roadmap')
@Controller('roadmap/sync')
export class RoadmapWebhookController {
    private readonly logger = new Logger(RoadmapWebhookController.name);

    constructor(
        private readonly pulls: RoadmapPullService,
        private readonly inbox: RoadmapInboxService,
        private readonly config: ConfigService,
    ) {}

    @Public()
    @Post('webhook')
    @HttpCode(202)
    @ApiExcludeEndpoint()
    handle(
        @Req() req: RawBodyRequest<Request>,
        @Headers('x-hub-signature-256') signature: string | undefined,
        @Headers('x-github-event') event: string | undefined,
    ) {
        const secret = this.config.get<string>('GITHUB_WEBHOOK_SECRET');
        if (!isValidGithubSignature(secret, req.rawBody, signature)) {
            throw new UnauthorizedException('Invalid signature');
        }
        if (event === 'ping') return { ok: true };
        // A new or relabelled issue: copy it into the inbox in the background (a no-op when it is not a roadmap one).
        if (event === 'issues') {
            void this.inbox.autoRefresh();
            return { accepted: true };
        }

        const body = req.body as { ref?: unknown } | undefined;
        if (event !== 'push' || body?.ref !== 'refs/heads/master') {
            return { ignored: true };
        }
        void this.pulls.autoPull('github-webhook').then((result) => {
            if (result?.applied) {
                this.logger.log(
                    `Pulled master ${result.commit.slice(0, 7)} after a push (${result.mode})`,
                );
            }
        });
        return { accepted: true };
    }
}
