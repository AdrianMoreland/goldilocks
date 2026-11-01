import { Module } from '@nestjs/common';
import { GithubClient } from './github.client';
import { GITHUB } from './github.port';

/** Consumers depend on the GITHUB token (GithubPort), never on the client. */
@Module({
    providers: [GithubClient, { provide: GITHUB, useExisting: GithubClient }],
    exports: [GITHUB],
})
export class GithubModule {}
