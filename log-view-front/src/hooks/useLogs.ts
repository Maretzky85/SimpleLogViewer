import {useInfiniteQuery} from '@tanstack/react-query'
import {fetchLogs} from '../api/logs'
import type {Filters} from "../types/logs.ts";

export function useLogs(filters: Filters) {
    return useInfiniteQuery({
        queryKey: ['logs', filters],
        queryFn: ({pageParam}) =>
            fetchLogs({cursor: pageParam, filters}),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) =>
            lastPage.hasMore ? lastPage.nextCursor : undefined,
    })
}