import "dotenv/config";
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from "../../../prisma/generated/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const connectionString = `${process.env.DATABASE_URL}`


function createPrismaClient(): PrismaClient {
    const adapter = new PrismaPg({
        connectionString,
    })

    return new PrismaClient({
        adapter,
        log:
            process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error'],
    })
}


const prismaInstance: PrismaClient = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance
}

// Ensure Prisma client is properly initialized
if (!prismaInstance) {
    throw new Error(
        'Prisma Client is not initialized. Please run `pnpm db:generate` to generate the Prisma client.'
    )
}

export const prisma = prismaInstance