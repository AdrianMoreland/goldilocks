import type { BranchRegion } from './branch.schema';
import type { KbVisibility } from './kb.schema';

/**
 * What a signed-in person may use, decided in ONE place from their branch. The API guard and the web app
 * both call this, so "UK branches don't get the Pricing Workbook" is a rule here, not a check scattered
 * across components. Add a capability by adding a field and a line per region below.
 */
export interface Capabilities {
  /** The /dashboard Pricing Workbook and every API behind it: prices, trade, portfolio, market mode, products. */
  pricingWorkbook: boolean;
  /** The internal AI assistant. It answers from every approved SOP and quotes live prices, so it follows the other two. */
  assistant: boolean;
  /** The side menu. A branch whose only page is the Knowledge Center has nowhere to navigate. */
  sidebar: boolean;
  /** Which SOPs the Knowledge Center lists: every one, or only those classified `all`. */
  knowledge: 'everything' | 'shared';
}

export interface CapabilitySubject {
  /** Null (no branch assigned) behaves as IE: every account that existed before branches keeps what it had. */
  branchRegion: BranchRegion | null;
  admin: boolean;
}

const BY_REGION: Record<BranchRegion, Capabilities> = {
  IE: { pricingWorkbook: true, assistant: true, sidebar: true, knowledge: 'everything' },
  UK: { pricingWorkbook: false, assistant: false, sidebar: false, knowledge: 'shared' },
};

export function capabilitiesFor(subject: CapabilitySubject): Capabilities {
  // Admins run the system and must be able to see (and classify) everything, wherever their desk is.
  if (subject.admin) return BY_REGION.IE;
  return BY_REGION[subject.branchRegion ?? 'IE'];
}

export function canSeeKbVisibility(capabilities: Capabilities, visibility: KbVisibility): boolean {
  return capabilities.knowledge === 'everything' || visibility === 'all';
}

/** Where a person lands after sign-in, and where a blocked page sends them. */
export function homePathFor(capabilities: Capabilities): string {
  return capabilities.pricingWorkbook ? '/dashboard' : '/knowledge';
}
