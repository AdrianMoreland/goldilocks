// src/trpc/trpc.router.ts
// src/trpc/trpc.ts
import { initTRPC } from '@trpc/server';
import { TrpcContext } from './trpc.context';

export const t = initTRPC.context<TrpcContext>().create();
