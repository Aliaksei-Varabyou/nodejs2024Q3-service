import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as DailyRotateFile from 'winston-daily-rotate-file';

type LEVELS = 'info' | 'error' | 'debug' | 'warn';

@Injectable()
export default class LoggingService {
  private logger: winston.Logger;
  static logger: any;

  constructor() {
    const logLevel = process.env.LOG_LEVEL || 'info';
    const logToFile = process.env.LOG_TO_FILE === 'true';
    const logMaxFileSize = process.env.LOG_MAX_FILE_SIZE || '100k';

    const logFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.printf(
        (info) =>
          `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`,
      ),
    );

    this.logger = winston.createLogger({
      level: logLevel,
      format: logFormat,
      transports: [],
    });

    if (logToFile) {
      this.logger.add(
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: logMaxFileSize,
          maxFiles: '14d',
          level: logLevel,
        }),
      );
    } else {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
          level: logLevel,
        }),
      );
    }
  }

  log(message: string, level: LEVELS = 'info') {
    this.logger.log({
      level: level,
      message: message,
    });
  }

  error(message: string) {
    this.log(message, 'error');
  }

  info(message: string) {
    this.log(message, 'info');
  }

  warning(message: string) {
    this.log(message, 'warn');
  }

  debug(message: string) {
    this.log(message, 'debug');
  }
}
