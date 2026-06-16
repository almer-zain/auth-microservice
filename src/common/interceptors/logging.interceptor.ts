import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express'; // <-- Import both types
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Type the HTTP context to stop 'any' from leaking into request/response
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = ctx.getResponse<Response>();
        const delay = Date.now() - now;

        this.logger.log(
          `[${method}] ${url} ${response.statusCode} - ${delay}ms`,
        );
      }),
    );
  }
}
