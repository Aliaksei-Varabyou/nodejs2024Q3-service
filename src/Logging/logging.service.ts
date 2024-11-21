import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggingService {
  log(message: string, level: 'info' | 'error' = 'info') {
    if (level === 'error') {
      console.error(message);
    } else {
      console.log(message);
    }
  }
}
