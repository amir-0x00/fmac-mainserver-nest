import { HttpException } from './../exceptions/http.exception';
import { db } from 'src/utils/database/database';
import { HttpStatus } from '@nestjs/common';
import LockManager from '../Lock/LockManager';
import { urlExtractData } from 'src/utils/utils';

// export const BeforeDeleteGuard = async (tableName: string, id: number) => {
export const BeforeDeleteGuard = async (url: string) => {
  // const [, tableName, id] = url.split('/');
  const { tableName, id } = urlExtractData(url);
  if (tableName && id) {
    const rw = await db
      .es_slc<any>(<any>tableName)
      .c('i')
      .w('i', id)
      .one();

    if (!rw.i) {
      LockManager.end(url);
      throw new HttpException({ msg: 'غير موجود' }, HttpStatus.NOT_FOUND);
    }
  }
  return true;
};
