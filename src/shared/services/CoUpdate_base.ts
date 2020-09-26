import { HttpStatus } from '@nestjs/common';
import { HttpException } from '../exceptions/http.exception';
import { db } from 'src/utils/database/database';
import { toArray } from 'src/utils/utils';
import { IBaseService } from './co_service_class';

interface IParam_co_update<Entity> {
  id: number;
  body: Entity;
  user_id: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CoUpdate_base extends IBaseService {}

export abstract class CoUpdate_base {
  async co_update<Entity>({ id, body, user_id }: IParam_co_update<Entity>) {
    console.log('crrr');
    let res;
    const list = toArray(body);
    if (this.normRows) await this.normRows(list, true);
    try {
      res = await db.co_upd<Entity>(this.table).set(body).edit({ user_id }).w(id).x();
      // console.log('res', res);
      if (res[1] === 0) throw new HttpException({ msg: 'غير موجود' }, HttpStatus.NOT_FOUND);
    } catch (err) {
      if (this.handleErrors) this.handleErrors(err);
      throw err;
    }
    return res;
  }
}
