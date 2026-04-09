import type {Filters, PaginatedLogs} from "../types/logs.ts";
import {LOGS_URL} from "./const.ts";

export async function fetchLogs({cursor, filters}: {
    cursor?: string
    filters: Filters
}): Promise<PaginatedLogs> {
    const params = new URLSearchParams()
    if (cursor) params.set('cursor', cursor)
    if (filters.levels?.length) {
        params.set('levels', filters.levels.join(','))
    }
    if (filters.dateFrom) {
        params.set('dateFrom', String(filters.dateFrom))
    }
    if (filters.dateTo) {
        params.set('dateTo', String(filters.dateTo))
    }
    const res = await fetch(`${LOGS_URL}?${params}`)
    if (!res.ok) throw new Error('Failed to fetch logs')
    return res.json()
}
