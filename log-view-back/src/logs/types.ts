import { GetLogsQuery } from './dto/get-logs.dto';

export interface PaginatedLogs {
  logs: LogData[];
  nextCursor?: string;
  hasMore?: boolean;
}

export interface LogsRepository {
  add(logs: Omit<LogData, 'id'>[]): void;
  getLogs(query: GetLogsQuery): PaginatedLogs;
}

export enum LogLevel {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}
export type LogData = {
  id: number;
  timestamp: number;
  message: string;
  level: LogLevel;
  hashId: string;
  metadata: string;
};
