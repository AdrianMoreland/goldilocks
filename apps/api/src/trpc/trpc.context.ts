// src/trpc/trpc.context.ts
import { PrismaService } from '../infrastructure/prisma/prisma.service';

export interface Context {
    prisma: PrismaService;
}

export const createContext = (prisma: PrismaService): Context => {
    return { prisma };
};

export type TrpcContext = ReturnType<typeof createContext>;