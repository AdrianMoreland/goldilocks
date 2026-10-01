import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAiApi } from '@/api/ai.api';
import { useAuth } from '@/contexts/auth-context';
import { queryKeys } from '@/lib/query-keys';
import { readSpotOverrides } from '@/lib/spot-overrides';
import type { AiMode, AskResponse } from '@goldilocks/shared-types';

export interface Exchange {
    id: number;
    mode: AiMode;
    /** What was typed, or the customer's pasted message. */
    question: string;
    response?: AskResponse;
    /** The API's plain-language reason when the question couldn't be answered (off, out of credit, unreachable…). */
    error?: string;
}

/**
 * The assistant panel's state. One message in, one answer out — nothing from
 * earlier exchanges is sent to the model, the list is only what the panel
 * shows. It lives in memory and is gone on refresh.
 *
 * Every ask carries the spot the product table is quoting from (a frozen or
 * typed spot, if the user set one), so a price the assistant gives matches the
 * price on screen.
 */
export function useAiAssistant(enabled: boolean) {
    const { getStatus, ask } = useAiApi();
    const { user } = useAuth();
    const [exchanges, setExchanges] = useState<Exchange[]>([]);

    const status = useQuery({
        queryKey: queryKeys.ai.status,
        queryFn: getStatus,
        enabled,
        staleTime: 60_000,
    });

    const mutation = useMutation({
        mutationFn: (input: { question: string; mode: AiMode }) =>
            ask({ ...input, spotOverrides: readSpotOverrides(user?.id) }),
    });

    const send = useCallback(
        async (question: string, mode: AiMode) => {
            const trimmed = question.trim();
            if (!trimmed || mutation.isPending) return;

            const id = Date.now();
            setExchanges((current) => [...current, { id, mode, question: trimmed }]);
            try {
                const response = await mutation.mutateAsync({ question: trimmed, mode });
                setExchanges((current) => current.map((item) => (item.id === id ? { ...item, response } : item)));
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Something went wrong.';
                setExchanges((current) => current.map((item) => (item.id === id ? { ...item, error: message } : item)));
            }
        },
        [mutation],
    );

    return {
        status: status.data,
        statusError: status.isError,
        exchanges,
        pending: mutation.isPending,
        send,
        clear: () => setExchanges([]),
    };
}
