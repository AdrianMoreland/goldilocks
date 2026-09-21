"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../../../prisma/generated/client");
const globalForPrisma = globalThis;
const connectionString = `${process.env.DATABASE_URL}`;
function createPrismaClient() {
    const adapter = new adapter_pg_1.PrismaPg({
        connectionString,
    });
    return new client_1.PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
    });
}
const prismaInstance = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
}
if (!prismaInstance) {
    throw new Error('Prisma Client is not initialized. Please run `pnpm db:generate` to generate the Prisma client.');
}
exports.prisma = prismaInstance;
//# sourceMappingURL=prisma.js.map