import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

type LEVELS = 'info' | 'error' | 'debug' | 'warn';

@Injectable()
export default class LoggingService {
  static logger: any;
  private logLevel: LEVELS | string;
  private logToFile: boolean;
  private logFilePath: string;
  private currentLogFile: string;
  private logMaxFileSize: number;

  constructor() {
    dotenv.config();
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.logToFile = process.env.LOG_TO_FILE === 'true';
    this.logFilePath = 'logs'; //path.join(__dirname, 'logs');
    console.log('PATH::', this.logFilePath);
    console.log(__dirname);
    console.log(process.cwd());
    this.logMaxFileSize =
      parseInt(process.env.LOG_MAX_FILE_SIZE || '100') * 1024;

    if (this.logToFile && !fs.existsSync(this.logFilePath)) {
      fs.mkdirSync(this.logFilePath, { recursive: true });
    }
    this.updateLogFile();
  }

  private updateLogFile() {
    const today = new Date().toISOString().slice(0, 10);
    let fileIndex = 0;
    let logFile;

    do {
      fileIndex++;
      logFile = path.join(this.logFilePath, `${today}-${fileIndex}.log`);
    } while (
      fs.existsSync(logFile) &&
      fs.statSync(logFile).size >= this.logMaxFileSize
    );

    this.currentLogFile = logFile;
    if (!fs.existsSync(this.currentLogFile)) {
      fs.writeFileSync(this.currentLogFile, '', 'utf-8');
    }
  }

  private formatMessage(level: LEVELS, message: string): string {
    const timestamp = new Date().toISOString();
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  }

  private writeToFile(message: string) {
    const today = new Date().toISOString().slice(0, 10);
    const expectedLogFilePrefix = path.join(this.logFilePath, `${today}-`);
    if (
      !this.currentLogFile.startsWith(expectedLogFilePrefix) ||
      fs.statSync(this.currentLogFile).size >= this.logMaxFileSize
    ) {
      this.updateLogFile();
    }
    fs.appendFileSync(this.currentLogFile, message + '\n');
  }

  log(message: string, level: LEVELS = 'info') {
    if (this.levels[level] <= this.levels[this.logLevel]) {
      const output = this.formatMessage(level, message);
      if (this.logToFile) {
        this.writeToFile(output);
      } else {
        process.stdout.write(output);
      }
    }
  }

  error(message: string) {
    this.log(message, 'error');
  }

  info(message: string) {
    this.log(message, 'info');
  }

  warn(message: string) {
    this.log(message, 'warn');
  }

  debug(message: string) {
    this.log(message, 'debug');
  }

  levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };
}
