import { Injectable } from '@nestjs/common';
import { LogData, LogLevel, LogsRepository, PaginatedLogs } from '../types';
import { GetLogsQuery } from '../dto/get-logs.dto';

const h = 3_600_000;
const now = Date.now();

const RAW: Omit<LogData, 'id'>[] = [
  { timestamp: now - 0.1 * h, level: LogLevel.INFO,  hashId: 'a01', message: 'Server started on port 3000', metadata: '{}' },
  { timestamp: now - 0.3 * h, level: LogLevel.DEBUG, hashId: 'a02', message: 'Connected to database', metadata: '{}' },
  { timestamp: now - 0.5 * h, level: LogLevel.INFO,  hashId: 'a03', message: 'GET /api/logs 200 12ms', metadata: '{}' },
  { timestamp: now - 0.8 * h, level: LogLevel.WARN,  hashId: 'a04', message: 'Response time exceeded 500ms threshold', metadata: JSON.stringify({ duration: 612, route: '/api/logs' }) },
  { timestamp: now - 1.0 * h, level: LogLevel.ERROR, hashId: 'a05', message: 'Failed to connect to cache: ECONNREFUSED 127.0.0.1:6379', metadata: '{}' },
  { timestamp: now - 1.5 * h, level: LogLevel.INFO,  hashId: 'a06', message: 'Cache reconnected successfully', metadata: '{}' },
  { timestamp: now - 2.0 * h, level: LogLevel.DEBUG, hashId: 'a07', message: 'Scheduled job "cleanup" triggered', metadata: '{}' },
  { timestamp: now - 2.5 * h, level: LogLevel.INFO,  hashId: 'a08', message: 'Cleanup job completed: 142 records removed', metadata: JSON.stringify({ removed: 142, duration: 230 }) },
  { timestamp: now - 3.0 * h, level: LogLevel.WARN,  hashId: 'a09', message: 'Disk usage above 80%', metadata: JSON.stringify({ used: '82%', mount: '/' }) },
  { timestamp: now - 4.0 * h, level: LogLevel.ERROR, hashId: 'a10', message: 'Unhandled exception in worker thread', metadata: JSON.stringify({ worker: 3, pid: 14592 }) },
  { timestamp: now - 5.0 * h, level: LogLevel.FATAL, hashId: 'a11', message: 'Out of memory — process restarting', metadata: JSON.stringify({ heapUsed: '1.9GB', heapLimit: '2GB' }) },
  { timestamp: now - 5.2 * h, level: LogLevel.INFO,  hashId: 'a12', message: 'Process restarted by supervisor', metadata: '{}' },
  { timestamp: now - 6.0 * h, level: LogLevel.TRACE, hashId: 'a13', message: 'DB query: SELECT * FROM logs WHERE level = $1', metadata: JSON.stringify({ params: ['error'], duration: 4 }) },
  { timestamp: now - 7.0 * h, level: LogLevel.DEBUG, hashId: 'a14', message: 'Auth token validated for user #4821', metadata: '{}' },
  { timestamp: now - 8.0 * h, level: LogLevel.WARN,  hashId: 'a15', message: 'Rate limit reached for IP 203.0.113.42', metadata: JSON.stringify({ ip: '203.0.113.42', limit: 100 }) },
  { timestamp: now - 9.0 * h, level: LogLevel.INFO,  hashId: 'a16', message: 'Config reloaded from environment', metadata: '{}' },
  { timestamp: now - 10 * h,  level: LogLevel.ERROR, hashId: 'a17', message: 'Upstream service /payments timed out after 30s', metadata: JSON.stringify({ upstream: '/payments', timeout: 30000 }) },
  { timestamp: now - 12 * h,  level: LogLevel.INFO,  hashId: 'a18', message: 'Health check passed', metadata: '{}' },
  { timestamp: now - 14 * h,  level: LogLevel.DEBUG, hashId: 'a19', message: 'Session GC: 38 expired sessions removed', metadata: '{}' },
  { timestamp: now - 16 * h,  level: LogLevel.WARN,  hashId: 'a20', message: 'JWT expiry within 5 minutes for user #1033', metadata: '{}' },
  { timestamp: now - 18 * h,  level: LogLevel.INFO,  hashId: 'a21', message: 'Deployment started: v2.4.1', metadata: JSON.stringify({ version: 'v2.4.1', triggeredBy: 'ci' }) },
  { timestamp: now - 19 * h,  level: LogLevel.INFO,  hashId: 'a22', message: 'Deployment finished: v2.4.1', metadata: JSON.stringify({ version: 'v2.4.1', duration: 47 }) },
  { timestamp: now - 22 * h,  level: LogLevel.ERROR, hashId: 'a23', message: 'S3 upload failed: AccessDenied', metadata: JSON.stringify({ bucket: 'app-assets', key: 'reports/2026-04.pdf' }) },
  { timestamp: now - 24 * h,  level: LogLevel.TRACE, hashId: 'a24', message: 'Middleware: request body parsed in 1ms', metadata: '{}' },
  { timestamp: now - 26 * h,  level: LogLevel.INFO,  hashId: 'a25', message: 'New user registered: id=9931', metadata: '{}' },
  { timestamp: now - 30 * h,  level: LogLevel.WARN,  hashId: 'a26', message: 'Deprecated endpoint /api/v1/events called', metadata: JSON.stringify({ caller: '10.0.0.5' }) },
  { timestamp: now - 36 * h,  level: LogLevel.ERROR, hashId: 'a27', message: 'Email delivery failed for order #55214', metadata: JSON.stringify({ orderId: 55214, reason: 'invalid_address' }) },
  { timestamp: now - 42 * h,  level: LogLevel.INFO,  hashId: 'a28', message: 'Nightly backup completed successfully', metadata: JSON.stringify({ size: '1.2GB', duration: 183 }) },
  { timestamp: now - 48 * h,  level: LogLevel.DEBUG, hashId: 'a29', message: 'Feature flag "new-dashboard" enabled for 10% of users', metadata: '{}' },
  { timestamp: now - 60 * h,  level: LogLevel.FATAL, hashId: 'a30', message: 'Database connection pool exhausted', metadata: JSON.stringify({ pool: 'primary', maxConnections: 20 }) },
];

const MOCK_LOGS: LogData[] = RAW.map((entry, i) => ({ ...entry, id: RAW.length - i }));

@Injectable()
export class MockLogsRepository implements LogsRepository {
  private readonly logs = [...MOCK_LOGS].sort(
    (a, b) => b.timestamp - a.timestamp || b.id - a.id,
  );

  add(): void {
    // no-op — mock data is static
  }

  getLogs({ cursor, limit, levels, dateFrom, dateTo }: GetLogsQuery): PaginatedLogs {
    const realLimit = limit ?? 100;

    let filtered = this.logs;

    if (dateFrom) filtered = filtered.filter((l) => l.timestamp >= dateFrom);
    if (dateTo)   filtered = filtered.filter((l) => l.timestamp <= dateTo);
    if (levels?.length) filtered = filtered.filter((l) => levels.includes(l.level));

    if (cursor) {
      const [ts, id] = cursor.split('_').map(Number);
      filtered = filtered.filter(
        (l) => l.timestamp < ts || (l.timestamp === ts && l.id < id),
      );
    }

    const page = filtered.slice(0, realLimit + 1);
    const hasMore = page.length > realLimit;
    const logs = hasMore ? page.slice(0, realLimit) : page;

    return {
      logs,
      hasMore,
      nextCursor: hasMore ? `${logs.at(-1)?.timestamp}_${logs.at(-1)?.id}` : undefined,
    };
  }
}
