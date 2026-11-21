import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    CompanyQuoteTemplateSchema,
    NotificationListSchema,
    SignedInSessionListSchema,
    UserPreferencesSchema,
    type CompanyQuoteTemplate,
    type UserPreferences,
} from '@goldilocks/shared-types';
import { useApiClient } from '@/api/api-client';
import { features } from '@/config/features';
import { useAuth } from '@/contexts/auth-context';
import { queryKeys } from '@/lib/query-keys';

export function useSettingsApi() {
    const client = useApiClient();
    const none = z.unknown();
    return {
        preferences: () => client.get('/settings/me', UserPreferencesSchema),
        savePreferences: (body: UserPreferences) => client.put('/settings/me', body, UserPreferencesSchema),
        quoteTemplate: () => client.get('/settings/quote-template', CompanyQuoteTemplateSchema),
        saveQuoteTemplate: (body: CompanyQuoteTemplate) => client.put('/settings/quote-template', body, CompanyQuoteTemplateSchema),
        sessions: () => client.get('/settings/sessions', SignedInSessionListSchema),
        signOut: (id: string) => client.del(`/settings/sessions/${id}`, none),
        signOutOthers: () => client.post('/settings/sessions/sign-out-others', {}, none),
        notifications: () => client.get('/notifications', NotificationListSchema),
        markRead: (ids?: number[]) => client.post('/notifications/read', ids ? { ids } : {}, none),
    };
}

const DEFAULTS = UserPreferencesSchema.parse({});

/** My Settings, with the defaults until they load, and a save that merges a change into the whole record. */
export function useMyPreferences() {
    const api = useSettingsApi();
    const { user } = useAuth();
    const client = useQueryClient();
    const key = queryKeys.settings.me(user?.id ?? '');
    // Only with the preview flag: without it nothing is asked of the server and every default stays as before.
    const query = useQuery({ queryKey: key, queryFn: api.preferences, enabled: !!user && features.redesign, staleTime: 5 * 60_000 });
    const prefs = query.data ?? DEFAULTS;
    // Merges into the latest saved copy (never the defaults), so one change cannot wipe the others.
    const save = useMutation({
        mutationFn: (patch: Partial<UserPreferences>) => {
            const current = client.getQueryData<UserPreferences>(key);
            if (!current) throw new Error('Your settings have not loaded yet. Try again in a moment.');
            const next = { ...current, ...patch };
            client.setQueryData(key, next);
            return api.savePreferences(next);
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save that setting."),
        onSettled: () => client.invalidateQueries({ queryKey: key }),
    });
    return {
        prefs,
        loaded: query.isSuccess,
        save: (patch: Partial<UserPreferences>) => (query.isSuccess ? save.mutate(patch) : undefined),
        saving: save.isPending,
        error: save.error,
    };
}
