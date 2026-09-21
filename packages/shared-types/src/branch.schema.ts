import { z } from 'zod';

export const CurrencyEnum = z.enum(['EUR', 'USD', 'GBP']);

export const BranchSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().nullable(),
  currency: CurrencyEnum,
  createdAt: z.iso.datetime(),
});

export const CreateBranchRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional(),
  currency: CurrencyEnum.default('EUR'),
});

export type Branch = z.infer<typeof BranchSchema>;
export type CreateBranchRequest = z.infer<typeof CreateBranchRequestSchema>;
