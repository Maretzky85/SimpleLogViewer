export interface PaginatedLogs {
    logs: LogData[]
    nextCursor?: string
    hasMore?: boolean
}

export type LogData = {
    id: number;
    timestamp: number;
    message: string;
    level: LogLevel;
    hashId: string;
    metadata: string;
};

export interface Filters {
    cursor?: string;
    levels: LogLevel[]
    limit?: number;
    dateFrom?: number;
    dateTo?: number;
}

export type LogLevel =
    | 'fatal'
    | 'error'
    | 'warn'
    | 'info'
    | 'debug'
    | 'trace'
