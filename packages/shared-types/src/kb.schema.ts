import { z } from 'zod';

/**
 * Knowledge Center (roadmap 1.4). The SOP file format is specified in
 * docs/sops/00-README.md; these enums are that spec in code, so the importer,
 * the API and the web app can never disagree about what a category is.
 */

export const KB_CATEGORIES = [
  'sales',
  'trading',
  'operations',
  'compliance',
  'storage',
  'systems',
  'directory',
  'meta',
] as const;
export const KbCategoryEnum = z.enum(KB_CATEGORIES);
export type KbCategory = z.infer<typeof KbCategoryEnum>;

export const KbJurisdictionEnum = z.enum(['all', 'IE', 'UK', 'ES']);
export type KbJurisdiction = z.infer<typeof KbJurisdictionEnum>;

/** draft: visible with a "Not yet approved" banner · approved: visible · retired: hidden from staff, kept for audit. */
export const KbStatusEnum = z.enum(['draft', 'approved', 'retired']);
export type KbStatus = z.infer<typeof KbStatusEnum>;

/** Matches the README's slug rule. Never changes after approval — links depend on it. */
export const KbSlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase, hyphenated');

const isoDay = z.iso.date();

/** The YAML frontmatter at the top of every SOP file. Values arrive as strings, hence the coercion on version. */
export const KbFrontmatterSchema = z.object({
  slug: KbSlugSchema,
  title: z.string().trim().min(1),
  category: KbCategoryEnum,
  jurisdiction: KbJurisdictionEnum,
  owner: z.string().trim().min(1),
  status: KbStatusEnum,
  version: z.coerce.number().int().positive(),
  updatedAt: isoDay,
});
export type KbFrontmatter = z.infer<typeof KbFrontmatterSchema>;

/** One SOP as the API serves it. `contentUpdatedOn` is the SOP's own date (frontmatter `updatedAt`), not the row's. */
export const KbDocumentSchema = z.object({
  slug: KbSlugSchema,
  title: z.string(),
  category: KbCategoryEnum,
  jurisdiction: KbJurisdictionEnum,
  owner: z.string(),
  status: KbStatusEnum,
  version: z.number().int(),
  contentUpdatedOn: isoDay,
  markdown: z.string(),
});
export type KbDocument = z.infer<typeof KbDocumentSchema>;

export const KbDocumentListResponseSchema = z.object({
  documents: z.array(KbDocumentSchema),
});
export type KbDocumentListResponse = z.infer<typeof KbDocumentListResponseSchema>;

/**
 * Admin edit of a SOP's content. Frontmatter fields the file format owns
 * (slug, category, jurisdiction, version, status, date) are deliberately not
 * editable here: slug never changes, status moves through the approval
 * workflow, and version/date are set by approval.
 */
export const UpdateKbDocumentRequestSchema = z.object({
  title: z.string().trim().min(1).max(200),
  owner: z.string().trim().min(1).max(100),
  markdown: z.string().trim().min(1).max(100_000),
});
export type UpdateKbDocumentRequest = z.infer<typeof UpdateKbDocumentRequestSchema>;

/** Moves a SOP through draft → approved, back to draft, or to retired. */
export const SetKbStatusRequestSchema = z.object({ status: KbStatusEnum });
export type SetKbStatusRequest = z.infer<typeof SetKbStatusRequestSchema>;

/** Plain-language description of each category, shown on the library tiles (from the README's category list). */
export const KB_CATEGORY_INFO: Record<KbCategory, { label: string; description: string }> = {
  sales: { label: 'Sales', description: 'Inquiries, quotes, pricing and customer conversations' },
  trading: { label: 'Trading', description: 'Payment, price lock, hedging and cancellations' },
  operations: { label: 'Operations', description: 'Stock, fulfilment, collection, buyback and delivery' },
  compliance: { label: 'Compliance', description: 'KYC, AML and ID checks' },
  storage: { label: 'Storage', description: 'Bonded silver' },
  systems: { label: 'Systems', description: 'Which system is used for what' },
  directory: { label: 'Directory', description: 'Branches and contacts' },
  meta: { label: 'About', description: 'How SOPs are written' },
};
