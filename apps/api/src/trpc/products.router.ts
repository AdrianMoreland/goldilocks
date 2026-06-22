// src/trpc/products.router.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { TrpcContext } from './trpc.context';

const t = initTRPC.context<TrpcContext>().create();

export const productsRouter = t.router({
    getAll: t.procedure.query(async ({ ctx }) => {
        return ctx.prisma.product.findMany();
    }),

    getById: t.procedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const product = await ctx.prisma.product.findUnique({
                where: { id: input.id },
            });
            if (!product) throw new Error('Product not found');
            return product;
        }),

    create: t.procedure
        .input(
            z.object({
                sku: z.string(),
                name: z.string(),
                metalType: z.enum(['GOLD','SILVER','PLATINUM','PALLADIUM']),
                weight: z.number(),
                spreadBuy: z.number(),
                spreadSell: z.number(),
                vatRate: z.number(),
                stock: z.number(),
                description: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.product.create({ data: input });
        }),

    update: t.procedure
        .input(
            z.object({
                id: z.number(),
                data: z.object({
                    name: z.string().optional(),
                    weight: z.number().optional(),
                    spreadBuy: z.number().optional(),
                    spreadSell: z.number().optional(),
                    description: z.string().optional(),
                }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.product.update({
                where: { id: input.id },
                data: input.data,
            });
        }),

    delete: t.procedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.product.delete({ where: { id: input.id } });
        }),
});