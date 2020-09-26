import { HttpStatus } from '@nestjs/common';
import { db } from 'src/utils/database/database';
import { HttpException } from '../exceptions/http.exception';
import { IBaseService } from './co_service_class';

interface IParam_co_delete<Entity> {
  id: number | number[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CoDelete_base extends IBaseService {}

export abstract class CoDelete_base {
  async co_delete<Entity>({ id: id }: IParam_co_delete<Entity>) {
    let res;
    try {
      if (this.deleteValidation) await this.deleteValidation(id);
      res = await db.co_del_flag<any>(this.table).w('i', id).x();
      if (res[1] === 0) throw new HttpException({ msg: 'غير موجود' }, HttpStatus.NOT_FOUND);
    } catch (err) {
      if (this.handleErrors) this.handleErrors(err);
      throw err;
    }
    return res;
    return res;
  }
}
