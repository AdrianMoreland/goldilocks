import { describe, expect, it } from 'vitest';
import { parseViewAs, VIEW_AS_OPTIONS } from './view-as';

describe('parseViewAs', () => {
  it('finds a known option', () => {
    expect(parseViewAs('MANAGER')?.role).toBe('MANAGER');
    expect(parseViewAs('SALES:UK')).toMatchObject({ role: 'SALES', region: 'UK' });
  });

  it('ignores empty and unknown values, and never offers ADMIN', () => {
    expect(parseViewAs(undefined)).toBeNull();
    expect(parseViewAs('')).toBeNull();
    expect(parseViewAs('ADMIN')).toBeNull();
    expect(parseViewAs('manager')).toBeNull();
    expect(VIEW_AS_OPTIONS.some((o) => (o.role as string) === 'ADMIN')).toBe(false);
  });
});
