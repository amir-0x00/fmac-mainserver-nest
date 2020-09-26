import { db } from 'src/utils/database/database';
import { toArray } from 'src/utils/utils';
import { IBaseService } from './co_service_class';

interface IParam_co_create<Entity> {
  body: Entity | Entity[];
  user_id: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CoCreate_base extends IBaseService {}

export abstract class CoCreate_base {
  async co_create<Entity>({ body, user_id }: IParam_co_create<Entity>) {
    let res: Entity[];
    const list = toArray(body);
    if (this.normRows) await this.normRows(list);
    try {
      res = await db.co_ins<Entity>(this.table, list).x();
    } catch (err) {
      if (this.handleErrors) this.handleErrors(err);
      throw err;
    }
    return res;
  }
}
