import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import type { LogsRepository } from '../../types';

const mockRepository: jest.Mocked<LogsRepository> = {
  add: jest.fn(),
  getLogs: jest.fn().mockReturnValue({ logs: [], hasMore: false }),
};

describe('LogService', () => {
  let service: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogService,
        { provide: 'LogsRepository', useValue: mockRepository },
      ],
    }).compile();

    service = module.get(LogService);
  });

  it('delegates getLogs to the repository', () => {
    const query = { limit: 10, levels: [] };
    service.getLogs(query as any);
    expect(mockRepository.getLogs).toHaveBeenCalledWith(query);
  });

  it('returns the result from the repository', () => {
    const expected = { logs: [], hasMore: false };
    mockRepository.getLogs.mockReturnValueOnce(expected);
    expect(service.getLogs({} as any)).toBe(expected);
  });
});
