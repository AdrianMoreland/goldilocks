// backend/src/trpc/app.router.ts
import { productsRouter } from './products.router';
import {t} from "./trcp.router";

export const appRouter = t.router({
    products: productsRouter,
});

export type AppRouter = typeof appRouter;