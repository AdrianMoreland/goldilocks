import {Injectable, Logger, OnModuleInit} from '@nestjs/common'
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import {MetalsProvider} from "./metals.provider";
import {getYesterday} from "../../common/utils/date.utils";

const STALE_THRESHOLD_DAYS = 1;

/** Name registered with SchedulerRegistry — lets the admin panel actually start/stop the underlying cron-job timer, not just a flag the job checks. */
const PRICE_REFRESH_JOB = 'updateMetals';

@Injectable()
export class MetalsCron implements OnModuleInit {

    private readonly logger = new Logger(MetalsCron.name);

    constructor(
        private metalsProvider: MetalsProvider,
        private readonly schedulerRegistry: SchedulerRegistry,
    ) {}

    /** Whether the 10-minute price-refresh cron is currently running. Resets to running on every restart/redeploy — this is a manual runtime pause, not a persisted setting. */
    isPriceCronRunning(): boolean {
        return this.schedulerRegistry.getCronJob(PRICE_REFRESH_JOB).isActive;
    }

    setPriceCronEnabled(enabled: boolean): boolean {
        const job = this.schedulerRegistry.getCronJob(PRICE_REFRESH_JOB);
        if (enabled) {
            job.start();
            this.logger.log('▶️ Price-refresh cron resumed by admin');
        } else {
            job.stop();
            this.logger.warn('⏸️ Price-refresh cron paused by admin');
        }
        return this.isPriceCronRunning();
    }

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

    @Cron(CronExpression.EVERY_10_MINUTES, { name: PRICE_REFRESH_JOB })
    async updateMetals() {
        const { degradedMetals } = await this.metalsProvider.refreshAll();
        if (degradedMetals.length > 0) {
            this.logger.warn(`No usable price anywhere (API/DB) for: ${degradedMetals.join(', ')}`);
        }
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