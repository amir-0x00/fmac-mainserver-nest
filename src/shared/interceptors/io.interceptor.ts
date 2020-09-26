import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request } from 'express';
import { urlExtractData } from 'src/utils/utils';
import io from '../scoket/io';
// import * as colors from 'colors-cli/safe';

@Injectable()
export class IoInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest(),
      url = req.url,
      { tableName, id, action } = urlExtractData(url);
    if (!(action === 'edit' || action === 'add' || action === 'delete')) return next.handle();
    const ioEvnt = tableName + '/' + action;

    if (action === 'edit' || action === 'delete') {
      io.emit(tableName + '/lock', { id });
      io.emit(ioEvnt, { id, inProgress: true });
    }

    return next.handle().pipe(
      tap(() => {
        io.emit(ioEvnt, { id, _last_emit_: true, done: true });
      }),
      catchError((err) => {
        if (action === 'edit' || action === 'delete') io.emit(ioEvnt, { id, error: true, _last_emit_: true });
        return throwError(err);
      }),
    );
  }
}
