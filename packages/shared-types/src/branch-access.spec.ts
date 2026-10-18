import { describe, expect, it } from 'vitest';
import { canSeeKbVisibility, capabilitiesFor, homePathFor } from './branch-access';

describe('capabilitiesFor', () => {
  it('gives Irish branches everything', () => {
    const caps = capabilitiesFor({ branchRegion: 'IE', admin: false });
    expect(caps).toEqual({ pricingWorkbook: true, assistant: true, sidebar: true, knowledge: 'everything' });
  });

  it('treats a user with no branch as Irish so existing accounts are unchanged', () => {
    expect(capabilitiesFor({ branchRegion: null, admin: false }).pricingWorkbook).toBe(true);
  });

  it('removes the Pricing Workbook and assistant from UK branches', () => {
    const caps = capabilitiesFor({ branchRegion: 'UK', admin: false });
    expect(caps.pricingWorkbook).toBe(false);
    expect(caps.assistant).toBe(false);
    expect(caps.sidebar).toBe(false);
    expect(caps.knowledge).toBe('shared');
  });

  it('never restricts an admin', () => {
    expect(capabilitiesFor({ branchRegion: 'UK', admin: true }).pricingWorkbook).toBe(true);
  });
});

describe('canSeeKbVisibility', () => {
  it('shows UK branches only SOPs classified for everyone', () => {
    const uk = capabilitiesFor({ branchRegion: 'UK', admin: false });
    expect(canSeeKbVisibility(uk, 'all')).toBe(true);
    expect(canSeeKbVisibility(uk, 'ie_only')).toBe(false);
  });

  it('shows Irish branches every SOP', () => {
    const ie = capabilitiesFor({ branchRegion: 'IE', admin: false });
    expect(canSeeKbVisibility(ie, 'ie_only')).toBe(true);
  });
});

describe('homePathFor', () => {
  it('sends UK branches to the Knowledge Center', () => {
    expect(homePathFor(capabilitiesFor({ branchRegion: 'UK', admin: false }))).toBe('/knowledge');
    expect(homePathFor(capabilitiesFor({ branchRegion: 'IE', admin: false }))).toBe('/dashboard');
  });
});
