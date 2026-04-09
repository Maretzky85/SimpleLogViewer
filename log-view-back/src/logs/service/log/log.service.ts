import { Inject, Injectable } from '@nestjs/common';
import type { LogsRepository } from '../../types';
import { GetLogsQuery } from '../../dto/get-logs.dto';

@Injectable()
export class LogService {
  @Inject('LogsRepository')
  private logsRepository: LogsRepository;

  getLogs(query: GetLogsQuery) {
    return this.logsRepository.getLogs(query);
  }
}
