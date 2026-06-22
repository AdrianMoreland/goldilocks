import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../../../prisma/generated/client";


//SINGLETON
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Create adapter once
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

// Function to create a new Prisma client
function createPrismaClient(): PrismaClient {
    return new PrismaClient({
        adapter,
        log:
            process.env.NODE_ENV === 'development'
                ? ['query', 'warn', 'error']
                : ['error'],
    });
}

// Use existing PrismaClient if available (hot reload safe)
const prismaInstance: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

// Store instance globally in dev mode
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
}

// Optional: export for scripts or seeds
// export const prisma = prismaInstance;

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
        constructor() {

            super({
                adapter: new PrismaPg({
                    connectionString: process.env.DATABASE_URL!,
                }),
                log:
                    process.env.NODE_ENV === 'development'
                        ? ['query', 'error', 'warn']
                        : ['error'],
            })

            /*  super({
                adapter, // reuse the adapter variable
                log:
                    process.env.NODE_ENV === 'development'
                        ? ['query', 'error', 'warn']
                        : ['error'], // explicitly pass log
            });*/
        }

    async onModuleInit() {
        await this.$connect(); // アプリ起動時にDB接続
    }

    async onModuleDestroy() {
        await this.$disconnect(); // アプリ終了時に切断
    }


}