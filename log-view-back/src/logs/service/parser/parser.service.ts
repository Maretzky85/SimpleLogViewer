import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { LogsRepository } from '../../types';
import * as fs from 'node:fs';
import * as readline from 'node:readline';
import { parseTraefikLine } from '../../helpers';
import { logPath } from '../../../config/config';

@Injectable()
export class ParserService implements OnModuleInit {
  private readonly logger = new Logger(ParserService.name);
  private parsedLines = 0;

  @Inject('LogsRepository')
  private logsRepository: LogsRepository;

  async onModuleInit() {
    if (!logPath) {
      this.logger.warn('LOG_PATH is not set — no logs will be parsed');
      return;
    }
    try {
      await this.parseLogFile(logPath);
    } catch (e) {
      this.logger.error(`Failed to parse log file: ${(e as Error).message}`);
    } finally {
      this.logger.debug(`Parsed ${logPath} — ${this.parsedLines} lines processed`);
    }
  }

  private async parseLogFile(path: string) {
    const stream = fs.createReadStream(path, {
      encoding: 'utf-8',
      highWaterMark: 64 * 1024,
    });

    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    for await (const line of rl) {
      this.handleLogLine(line);
    }

    this.logger.log('Done parsing');
  }

  private handleLogLine(line: string) {
    this.parsedLines++;
    const parsed = parseTraefikLine(line);
    if (!parsed) return;
    try {
      this.logsRepository.add([parsed]);
    } catch (e) {
      this.logger.error(`Failed to insert log line: ${(e as NodeJS.ErrnoException).code}`);
    }
  }
}
