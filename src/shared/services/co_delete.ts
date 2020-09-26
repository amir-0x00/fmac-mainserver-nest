import { HttpStatus } from '@nestjs/common';
import { HttpException } from '../exceptions/http.exception';
import { db } from 'src/utils/database/database';
import { table_names } from '../../utils/database/database';
import { toArray } from 'src/utils/utils';

export default async function co_delete<Entity>(that: any, table: table_names, id: number) {
  let res;
  try {
    if (that.deleteValidation) await that.deleteValidation(id);
    res = await db.co_del_flag<Entity>('tree').w(id).x();
    if (res[1] === 0) throw new HttpException({ msg: 'غير موجود' }, HttpStatus.NOT_FOUND);
  } catch (err) {
    if (that.handleErrors) that.handleErrors(err);
    throw err;
  }
  return res;
}
