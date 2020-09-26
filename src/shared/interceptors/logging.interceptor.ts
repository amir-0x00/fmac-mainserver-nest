import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request } from 'express';
import * as colors from 'colors-cli/safe';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.getArgs()[0];
    let methodColor = 'yellow';
    switch (req.method) {
      case 'POST':
        methodColor = 'green';
        break;
      case 'PUT':
        methodColor = 'blue';
        break;
      case 'DETELE':
        methodColor = 'red';
        break;
    }
    const now = Date.now();
    return next.handle().pipe(
      tap(() =>
        console.log(
          `${req.method} ${colors[methodColor](req.url)} ${Date.now() - now}ms`,
        ),
      ),
      catchError(err => {
        console.log(
          `${colors.red(req.method)} ${colors[methodColor](
            req.url,
          )} ${Date.now() - now}ms`,
        );
        return throwError(err);
      }),
    );
  }
}
