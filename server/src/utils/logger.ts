import winston from 'winston';
import { env } from '../config/env.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Custom log format for console output.
 * Format: `YYYY-MM-DD HH:mm:ss [LEVEL]: message`
 */
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} ${level}: ${message}\n${stack}`
      : `${timestamp} ${level}: ${message}`;
  }),
);

/**
 * Structured JSON format for file/production logging.
 */
const fileFormat = combine(timestamp(), errors({ stack: true }), winston.format.json());

/**
 * Application-wide Winston logger instance.
 *
 * - Development: colorized console output at `debug` level.
 * - Production: JSON-formatted file output at `info` level.
 */
const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  defaultMeta: { service: 'dear-days-server' },
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

// In production, also log to files
if (env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat,
      maxsize: 5_242_880, // 5 MB
      maxFiles: 5,
    }),
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: fileFormat,
      maxsize: 5_242_880,
      maxFiles: 5,
    }),
  );
}

export default logger;
