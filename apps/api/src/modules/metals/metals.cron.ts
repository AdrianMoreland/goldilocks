import {Injectable, Logger, OnModuleInit} from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import {MetalsProvider} from "./metals.provider";
import {getYesterday} from "../../common/utils/date.utils";

const STALE_THRESHOLD_DAYS = 1;

@Injectable()
export class MetalsCron implements OnModuleInit {

    private readonly logger = new Logger(MetalsCron.name);

    constructor(
        private metalsProvider: MetalsProvider,
    ) {}

    /**
     * The daily historic-close cron only ever fires while this process is
     * alive — in dev (and on any host that isn't up 24/7) that leaves gaps
     * every time the app was down at 6am UTC. On startup, check how stale
     * the newest historic row is and backfill the whole gap in one go
     * (skipDuplicates makes this safe to run even when nothing is missing).
     */
    async onModuleInit() {
        const latest = await this.metalsProvider.getLatestHistoricDate();

        const daysStale = latest
            ? (Date.now() - latest.getTime()) / (1000 * 60 * 60 * 24)
            : Infinity;

        if (daysStale <= STALE_THRESHOLD_DAYS) {
            return;
        }

        this.logger.warn(
            latest
                ? `Historic spot data is stale (latest: ${latest.toISOString()}) — backfilling…`
                : 'No historic spot data found — seeding…',
        );

        await this.metalsProvider.seedHistoricPrices();
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async updateMetals() {
        await this.metalsProvider.fetchAndStore()
    }

    @Cron('0 6 * * *', {
        timeZone: 'UTC',
    })
    async dailyHistoricClose(){
        this.logger.log('Running daily historic close job');

        const yesterday = getYesterday();

        await this.metalsProvider.fetchAndStoreHistoricClose(
            yesterday
        );
    }

}