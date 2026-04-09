import { Test, TestingModule } from '@nestjs/testing';
import { LogsController } from './logs.controller';
import { LogService } from '../service/log/log.service';

const mockLogService = {
  getLogs: jest.fn().mockReturnValue({ logs: [], hasMore: false }),
};

describe('LogsController', () => {
  let controller: LogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [{ provide: LogService, useValue: mockLogService }],
    }).compile();

    controller = module.get(LogsController);
  });

  it('calls LogService.getLogs with the query and returns the result', () => {
    const query = { limit: 5, levels: ['error'] } as any;
    const result = controller.getLogs(query);
    expect(mockLogService.getLogs).toHaveBeenCalledWith(query);
    expect(result).toEqual({ logs: [], hasMore: false });
  });
});
