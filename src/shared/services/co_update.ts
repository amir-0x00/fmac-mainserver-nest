import { HttpStatus } from '@nestjs/common';
import { HttpException } from './../exceptions/http.exception';
import { db } from 'src/utils/database/database';
import { table_names } from '../../utils/database/database';
import { toArray } from 'src/utils/utils';

interface IParam_co_update<Entity> {
  that: any;
  table: table_names;
  id: number;
  body: Entity;
  user_id: number;
}

export default async function co_update<Entity>({ that, table, id, body, user_id }: IParam_co_update<Entity>) {
  let res;
  const list = toArray(body);
  if (that.normRows) await that.normRows(list, true);
  try {
    res = await db.co_upd<Entity>(table).set(body).edit({ user_id }).w(id).x();
    if (res[1] === 0) throw new HttpException({ msg: 'غير موجود' }, HttpStatus.NOT_FOUND);
  } catch (err) {
    if (that.handleErrors) that.handleErrors(err);
    throw err;
  }
  return res;
}
