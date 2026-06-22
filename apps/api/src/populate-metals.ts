// populate-metals.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { prisma } from "./lib/db/prisma";
import {Decimal} from "../prisma/generated/internal/prismaNamespace";
import {MetalsProvider} from "./modules/metals/metals.provider";



async function run() {
    const app = await NestFactory.create(AppModule);
    const metalsProvider = app.get(MetalsProvider);

    try {
        // Insert default metal prices if they don't exist
        await prisma.metalSpotPrice.createMany({
            data: [
                {
                    metalType: 'GOLD',
                    priceGbp: new Decimal('4800'),
                    priceEur: new Decimal('4400'),
                    source: 'livepriceofgold',
                    timestamp: new Date('2000-01-01T00:00:00.000Z'),
                },
                {
                    metalType: 'SILVER',
                    priceGbp: new Decimal('27'),
                    priceEur: new Decimal('25'),
                    source: 'livepriceofgold',
                    timestamp: new Date('2000-01-01T00:00:00.000Z'),
                },
                {
                    metalType: 'PLATINUM',
                    priceGbp: new Decimal('1200'),
                    priceEur: new Decimal('1100'),
                    source: 'livepriceofgold',
                    timestamp: new Date('2000-01-01T00:00:00.000Z'),
                },
                {
                    metalType: 'PALLADIUM',
                    priceGbp: new Decimal('2600'),
                    priceEur: new Decimal('2400'), 
                    source: 'livepriceofgold',
                    timestamp: new Date('2000-01-01T00:00:00.000Z'),
                },
            ],
            skipDuplicates: true, // prevents errors if records already exist
        });

        // Call your existing fetch-and-cache logic
        await metalsProvider.fetchAndStore(); // caches metals in Redis

        console.log('✅ Metals initialized and cached in Redis');
    } catch (err) {
        console.error('❌ Failed to initialize metals:', err);
    } finally {
        await prisma.$disconnect();
        await app.close();
    }
}

run();