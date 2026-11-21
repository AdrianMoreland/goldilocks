import { describe, expect, it } from 'vitest';
import { SessionUserSchema, UiSettingsSchema, UI_SETTINGS_MAX_BYTES } from './session.schema';

describe('UiSettingsSchema', () => {
  it('accepts a mode with or without a look', () => {
    expect(UiSettingsSchema.parse({ mode: 'dark', look: null })).toEqual({ mode: 'dark', look: null });
    expect(UiSettingsSchema.parse({ mode: 'light', look: { font: 'inter', fontScale: 1 } }).mode).toBe('light');
  });

  it('refuses an unknown mode and an oversized look', () => {
    expect(UiSettingsSchema.safeParse({ mode: 'system', look: null }).success).toBe(false);
    const huge = { blob: 'x'.repeat(UI_SETTINGS_MAX_BYTES) };
    expect(UiSettingsSchema.safeParse({ mode: 'dark', look: huge }).success).toBe(false);
  });
});

describe('SessionUserSchema uiSettings', () => {
  const user = { id: 'u1', email: 'a@b.ie', firstName: 'A', lastName: 'B', role: 'SALES', admin: false };

  it('defaults to null for an API that does not send it yet', () => {
    expect(SessionUserSchema.parse(user).uiSettings).toBeNull();
  });

  it('keeps saved settings', () => {
    expect(SessionUserSchema.parse({ ...user, uiSettings: { mode: 'light', look: null } }).uiSettings).toEqual({ mode: 'light', look: null });
  });
});
