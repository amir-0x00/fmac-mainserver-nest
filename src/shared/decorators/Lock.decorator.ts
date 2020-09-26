import { LockInterceptor } from './../Lock/Lock.interceptor';
import { applyDecorators, UseInterceptors } from '@nestjs/common';

export function useLock() {
  return applyDecorators(UseInterceptors(LockInterceptor));
}
