import { createHash } from 'crypto';
import { LogData, LogLevel } from './types';

export const makeLogHashId = (time: number, message: string): string => {
  return createHash('sha1')
    .update(time.toString())
    .update('|')
    .update(message)
    .digest('hex');
};

export const parseTraefikLogLevel = (logLevel: string): LogLevel => {
  switch (logLevel) {
    case 'ERR':
      return LogLevel.ERROR;
    case 'INF':
      return LogLevel.INFO;
    case 'WRN':
      return LogLevel.WARN;
    default:
      return LogLevel.DEBUG;
  }
};

export const isIsoTimestamp = (line: string): boolean => {
  return (
    line.length > 25 && line[4] === '-' && line[7] === '-' && line[10] === 'T'
  );
};

export const parseTraefikLine = (line: string): Omit<LogData, 'id'> | null => {
  if (!isIsoTimestamp(line)) return null;

  const firstSpace = line.indexOf(' ');
  if (firstSpace === -1) return null;

  const secondSpace = line.indexOf(' ', firstSpace + 1);
  if (secondSpace === -1) return null;

  const timestamp = new Date(line.slice(0, firstSpace)).getTime();
  const level = parseTraefikLogLevel(line.slice(firstSpace + 1, secondSpace));
  const message = line.slice(secondSpace + 1);

  return {
    timestamp,
    level,
    message,
    hashId: makeLogHashId(timestamp, message),
    metadata: '{}',
  };
};
