import { z } from 'zod';

export const CurrencyEnum = z.enum(['EUR', 'USD', 'GBP']);

/** Which side of the business a branch belongs to. Drives what its staff may use (see branch-access.ts). */
export const BranchRegionEnum = z.enum(['IE', 'UK']);
export type BranchRegion = z.infer<typeof BranchRegionEnum>;

/** The branch as it travels on a session: just enough for the web app to work out capabilities. */
export const SessionBranchSchema = z.object({
  id: z.number(),
  name: z.string(),
  region: BranchRegionEnum,
});
export type SessionBranch = z.infer<typeof SessionBranchSchema>;

export const BranchSchema = z.object({
  id: z.number(),
  name: z.string(),
  region: BranchRegionEnum,
  address: z.string().nullable(),
  currency: CurrencyEnum,
  createdAt: z.iso.datetime(),
});

export const CreateBranchRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional(),
  region: BranchRegionEnum.default('IE'),
  currency: CurrencyEnum.default('EUR'),
});

export type Branch = z.infer<typeof BranchSchema>;
export type CreateBranchRequest = z.infer<typeof CreateBranchRequestSchema>;
