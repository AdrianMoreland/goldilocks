import { z } from 'zod';

/**
 * Settings: each person's preferences (saved on their account so they follow them to any browser), the company's
 * quote wording (admins), in-app notifications (admins only for now) and signed-in sessions.
 */
export const NOTIFICATION_KINDS = ['feed_down', 'order_step', 'import_review', 'permission_changed'] as const;
export const NotificationKindSchema = z.enum(NOTIFICATION_KINDS);
export type NotificationKind = z.infer<typeof NotificationKindSchema>;

export const NOTIFICATION_LABELS: Record<NotificationKind, string> = {
  feed_down: 'Price feed failing or prices stale',
  order_step: 'An order reached a new step',
  import_review: 'An import finished or items wait for review',
  permission_changed: 'Someone’s role or permissions changed',
};

export const USER_PREFERENCES_MAX_BYTES = 8_000;

export const UserPreferencesSchema = z
  .object({
    /** The page-wide Simple / Detailed switch. */
    detail: z.enum(['simple', 'detailed']).default('detailed'),
    /** Single-key shortcuts (1–4, T, G, A, P, Q, /). Ctrl+K and arrows always work. */
    singleKeyShortcuts: z.boolean().default(true),
    quote: z
      .object({
        signOff: z.string().max(300).default(''),
        defaultChannel: z.enum(['whatsapp', 'email']).nullable().default(null),
      })
      .default({ signOff: '', defaultChannel: null }),
    board: z
      .object({
        view: z.string().max(40).default('GOLD'),
        pins: z.array(z.number().int().positive()).max(60).default([]),
      })
      .default({ view: 'GOLD', pins: [] }),
    notifications: z.object({ muted: z.array(NotificationKindSchema).default([]) }).default({ muted: [] }),
  })
  .refine((v) => JSON.stringify(v).length <= USER_PREFERENCES_MAX_BYTES, { message: 'Those settings are too large to save.' });
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

/** Company wording around the generated price lines. Null keeps the built-in text. Placeholders: {name}, {spot_time}. */
export const CompanyQuoteTemplateSchema = z.object({
  opening: z.string().trim().max(500).nullable(),
  closingNote: z.string().trim().max(1000).nullable(),
});
export type CompanyQuoteTemplate = z.infer<typeof CompanyQuoteTemplateSchema>;
export const QUOTE_PLACEHOLDERS = ['name', 'spot_time'] as const;

export function renderQuoteText(template: string, values: Record<(typeof QUOTE_PLACEHOLDERS)[number], string>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    (QUOTE_PLACEHOLDERS as readonly string[]).includes(key) ? values[key as keyof typeof values] : whole,
  );
}

export const NotificationSchema = z.object({
  id: z.number().int(),
  kind: NotificationKindSchema,
  title: z.string(),
  body: z.string(),
  link: z.string().nullable(),
  createdAt: z.string(),
  readAt: z.string().nullable(),
});
export type AppNotification = z.infer<typeof NotificationSchema>;
export const NotificationListSchema = z.object({ items: z.array(NotificationSchema), unread: z.number().int() });

export function isMuted(prefs: { muted: readonly NotificationKind[] }, kind: NotificationKind): boolean {
  return prefs.muted.includes(kind);
}

export const SignedInSessionSchema = z.object({
  id: z.string(),
  device: z.string(),
  ip: z.string().nullable(),
  createdAt: z.string(),
  lastActiveAt: z.string(),
  current: z.boolean(),
});
export type SignedInSession = z.infer<typeof SignedInSessionSchema>;
export const SignedInSessionListSchema = z.array(SignedInSessionSchema);

/** "Chrome on Windows" from a user-agent string; good enough to recognise your own devices. */
export function parseUserAgent(ua: string | null | undefined): string {
  if (!ua) return 'Unknown device';
  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /Firefox\//.test(ua)
      ? 'Firefox'
      : /Chrome\//.test(ua)
        ? 'Chrome'
        : /Safari\//.test(ua)
          ? 'Safari'
          : 'Browser';
  const system = /iPhone/.test(ua)
    ? 'iPhone'
    : /iPad/.test(ua)
      ? 'iPad'
      : /Android/.test(ua)
        ? 'Android'
        : /Windows/.test(ua)
          ? 'Windows'
          : /Mac OS X|Macintosh/.test(ua)
            ? 'Mac'
            : /Linux/.test(ua)
              ? 'Linux'
              : 'unknown system';
  return `${browser} on ${system}`;
}

export const MarkNotificationsReadSchema = z.object({ ids: z.array(z.number().int().positive()).max(200).optional() });
export type MarkNotificationsRead = z.infer<typeof MarkNotificationsReadSchema>;
