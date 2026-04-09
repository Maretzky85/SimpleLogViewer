import { LogData, LogsRepository, PaginatedLogs } from '../types';
import Database from 'better-sqlite3';
import { GetLogsQuery } from '../dto/get-logs.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SqliteLogsRepository implements LogsRepository {
  private db: Database.Database;
  constructor() {
    this.db = new Database(':memory:');
    this.db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE logs (
      id INTEGER PRIMARY KEY,
      timestamp INTEGER NOT NULL,
      level TEXT NOT NULL,
      hashId TEXT NOT NULL UNIQUE,
      message TEXT,
      metadata TEXT
    );

    CREATE INDEX idx_logs_ts_id ON logs(timestamp, id);
    `);
    console.debug('table created');
  }

  add(logs: LogData[]): void {
    const stmt = this.db.prepare(`
        INSERT INTO logs (hashId, timestamp, level, message, metadata)
        VALUES (?, ?, ?, ?, ?);`);

    const transaction = this.db.transaction((logs: LogData[]) => {
      for (const log of logs) {
        stmt.run(
          log.hashId,
          log.timestamp,
          log.level,
          log.message,
          JSON.stringify(log.metadata ?? {}),
        );
      }
    });
    transaction(logs);
  }

  getLogs({
    cursor,
    limit,
    levels,
    dateFrom,
    dateTo,
  }: GetLogsQuery): PaginatedLogs {
    const realLimit = limit || 100;
    const fetchLimit = realLimit + 1;
    let query = `
    SELECT * FROM logs
    WHERE 1=1`;

    const params: any[] = [];

    if (dateFrom) {
      query += ` AND timestamp >= ?`;
      params.push(dateFrom);
    }

    if (dateTo) {
      query += ` AND timestamp <= ?`;
      params.push(dateTo);
    }

    if (cursor) {
      const { timestamp, id } = this.parseCursor(cursor);
      query += ` AND (timestamp < ? 
                 OR (timestamp = ? AND id < ?)
                )`;
      params.push(timestamp, timestamp, id);
    }

    if (levels && levels.length > 0) {
      query += ` AND level IN (${levels.map(() => '?').join(',')})`;
      params.push(...levels);
    }

    query += ` ORDER BY timestamp DESC
    LIMIT ?;`;

    params.push(fetchLimit);
    const rows: LogData[] = (
      this.db.prepare(query).all(params) as LogData[]
    ).map((r) => ({
      ...r,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      metadata: JSON.parse(r.metadata || '{}'),
    }));
    const hasMore = rows.length > realLimit;
    return {
      logs: hasMore ? rows.slice(0, realLimit) : rows,
      nextCursor: hasMore
        ? `${rows.at(-1)?.timestamp}_${rows.at(-1)?.id}`
        : undefined,
      hasMore,
    };
  }

  private parseCursor(cursor: string) {
    const [timestamp, id] = cursor.split('_');
    return { timestamp, id };
  }
}
