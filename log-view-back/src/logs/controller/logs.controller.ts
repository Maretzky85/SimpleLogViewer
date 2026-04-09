import { Controller, Get, Query } from '@nestjs/common';
import { LogService } from '../service/log/log.service';
import { GetLogsQuery } from '../dto/get-logs.dto';

@Controller('api/logs')
export class LogsController {
  constructor(private logService: LogService) {}

  @Get()
  getLogs(@Query() query: GetLogsQuery) {
    return this.logService.getLogs(query);
  }
}
