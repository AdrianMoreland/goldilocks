import { describe, expect, it } from 'vitest';
import { UserPreferencesSchema, renderQuoteText, isMuted, parseUserAgent } from './settings.schema';

describe('UserPreferencesSchema', () => {
  it('fills every default from an empty record, so a new person needs no row', () => {
    expect(UserPreferencesSchema.parse({})).toEqual({
      detail: 'detailed',
      singleKeyShortcuts: true,
      quote: { signOff: '', defaultChannel: null },
      board: { view: 'GOLD', pins: [] },
      notifications: { muted: [] },
    });
  });

  it('keeps what was saved and defaults the rest', () => {
    const p = UserPreferencesSchema.parse({ detail: 'simple', board: { pins: [3, 7] } });
    expect(p.detail).toBe('simple');
    expect(p.board).toEqual({ view: 'GOLD', pins: [3, 7] });
  });
});

describe('renderQuoteText', () => {
  it('fills the known placeholders and leaves unknown ones as typed', () => {
    expect(renderQuoteText('Hi, {name} here. Prices at {spot_time}. {other}', { name: 'Maeve', spot_time: '14:05' })).toBe(
      'Hi, Maeve here. Prices at 14:05. {other}',
    );
  });
});

describe('isMuted', () => {
  it('is true only for muted kinds', () => {
    expect(isMuted({ muted: ['feed_down'] }, 'feed_down')).toBe(true);
    expect(isMuted({ muted: ['feed_down'] }, 'order_step')).toBe(false);
  });
});

describe('parseUserAgent', () => {
  it('names the browser and the system', () => {
    expect(parseUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36')).toBe('Chrome on Windows');
    expect(parseUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1')).toBe('Safari on iPhone');
    expect(parseUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Gecko/20100101 Firefox/132.0')).toBe('Firefox on Mac');
    expect(parseUserAgent('Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/131.0 Safari/537.36 Edg/131.0')).toBe('Edge on Windows');
    expect(parseUserAgent(null)).toBe('Unknown device');
  });
});
