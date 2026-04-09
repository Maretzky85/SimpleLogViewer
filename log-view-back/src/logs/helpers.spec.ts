import { isIsoTimestamp, makeLogHashId, parseTraefikLogLevel, parseTraefikLine } from './helpers';
import { LogLevel } from './types';

describe('isIsoTimestamp', () => {
  it('returns true for a valid ISO 8601 timestamp', () => {
    expect(isIsoTimestamp('2026-04-09T12:00:00Z rest of line')).toBe(true);
  });

  it('returns false for a short string', () => {
    expect(isIsoTimestamp('2026-04')).toBe(false);
  });

  it('returns false when dashes and T are not in the right positions', () => {
    expect(isIsoTimestamp('not a timestamp at all here')).toBe(false);
  });
});

describe('parseLogLevel', () => {
  it.each([
    ['ERR', LogLevel.ERROR],
    ['INF', LogLevel.INFO],
    ['WRN', LogLevel.WARN],
    ['DBG', LogLevel.DEBUG],
    ['unknown', LogLevel.DEBUG],
  ])('maps %s to %s', (input, expected) => {
    expect(parseTraefikLogLevel(input)).toBe(expected);
  });
});

describe('makeLogId', () => {
  it('returns a hex string', () => {
    expect(makeLogHashId(1000, 'msg')).toMatch(/^[0-9a-f]+$/);
  });

  it('returns the same value for the same inputs', () => {
    expect(makeLogHashId(1000, 'msg')).toBe(makeLogHashId(1000, 'msg'));
  });

  it('returns different values for different inputs', () => {
    expect(makeLogHashId(1000, 'a')).not.toBe(makeLogHashId(1000, 'b'));
  });
});

describe('parseTraefikLine', () => {
  const validLine = '2026-04-09T10:00:00Z INF Server started on port 3000';

  it('parses a valid line into LogData fields', () => {
    const result = parseTraefikLine(validLine);
    expect(result).not.toBeNull();
    expect(result?.level).toBe(LogLevel.INFO);
    expect(result?.message).toBe('Server started on port 3000');
    expect(result?.timestamp).toBe(new Date('2026-04-09T10:00:00Z').getTime());
  });

  it('returns null when the line does not start with an ISO timestamp', () => {
    expect(parseTraefikLine('plain log line without timestamp')).toBeNull();
  });

  it('returns null when there is only one token after the timestamp', () => {
    expect(parseTraefikLine('2026-04-09T10:00:00Z INF')).toBeNull();
    expect(parseTraefikLine('2026-04-09T10:00:00Z')).toBeNull();
  });
});
