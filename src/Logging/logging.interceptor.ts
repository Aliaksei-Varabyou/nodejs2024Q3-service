import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import LoggingService from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url } = request;
    const queryParams = JSON.stringify(request.query);
    const body = JSON.stringify(request.body);
    const statusCode = response.statusCode;

    return next.handle().pipe(
      tap(() => {
        this.loggingService.info(
          `Method: ${method}, URL: ${url}, QueryParams: ${queryParams}, Body: ${body}, StatusCode: ${statusCode}`,
        );
      }),
    );
  }
}
