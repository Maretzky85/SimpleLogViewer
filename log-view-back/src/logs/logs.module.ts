import { Module } from '@nestjs/common';
import { useMock } from '../config/config';
import { MockLogsRepository } from './mock/mock.repository';
import { SqliteLogsRepository } from './sqlite/sqlite.repository';
import { ParserService } from './service/parser/parser.service';
import { LogsController } from './controller/logs.controller';
import { LogService } from './service/log/log.service';

@Module({
  providers: [
    LogService,
    {
      provide: 'LogsRepository',
      useClass: useMock ? MockLogsRepository : SqliteLogsRepository,
    },
    ...(useMock ? [] : [ParserService]),
  ],
  controllers: [LogsController],
})
export class LogsModule {}
