import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import LockManager from './LockManager';
import { Request } from 'express';
import { BeforeDeleteGuard } from '../guards/beforeDelete.guard';
// import * as colors from 'colors-cli/safe';

@Injectable()
export class LockInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest(),
      url = req.url;
    if (!(req.method === 'DELETE' || req.method === 'PUT')) return next.handle();
    // console.log('eeeee');

    await LockManager.wait_for(url);
    if (req.method === 'DELETE') await BeforeDeleteGuard(url);

    return next.handle().pipe(
      tap(() => {
        LockManager.end(url);
      }),
      catchError((err) => {
        LockManager.end(url);
        return throwError(err);
      }),
    );
  }
}
