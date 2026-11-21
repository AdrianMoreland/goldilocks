// src/api/ai.api.ts
import { useApiClient } from '@/api/api-client';
import { z } from 'zod';
import { AiStatusSchema, AskResponseSchema, type AskRequestInput } from '@goldilocks/shared-types';

/** The internal AI assistant. Open to every signed-in user - bounded server-side by the per-user quota, the per-minute limit and the daily spend breaker. */
export function useAiApi() {
    const client = useApiClient();

    return {
        getStatus: () => client.get('/ai/status', AiStatusSchema),
        ask: (body: AskRequestInput) => client.post('/ai/ask', body, AskResponseSchema),
        /** Thumbs up or down on one of your own answers; rating again replaces it. */
        rate: (questionId: number, helpful: boolean) => client.post(`/ai/questions/${questionId}/feedback`, { helpful }, z.unknown()),
    };
}
