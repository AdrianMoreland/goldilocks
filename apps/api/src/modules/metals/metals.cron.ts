import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import {MetalsProvider} from "./metals.provider";

@Injectable()
export class MetalsCron {

    constructor(
        private metalsProvider: MetalsProvider,
    ) {}

    @Cron(CronExpression.EVERY_10_MINUTES)
    async updateMetals() {

        await this.metalsProvider.fetchAndStore()

    }

}