import { pg_where } from './pg_where';
import { table_names, db, postgres_log_types } from '../database';
import cfg from 'src/config/config';
import { getConnection } from 'typeorm';
import { pg_general } from '.';

// ---------------------------
export class pg_del<Entity> extends pg_where<Entity> {
  private limit: number = null;
  constructor(private table: table_names) {
    super();
  }

  /** Limit */
  l(num: number) {
    this.limit = num;
    return this;
  }

  private get getLimit() {
    return this.limit === null ? '' : ` LIMIT ${this.limit}`;
  }

  /** Get One */
  async one(): Promise<Entity> {
    const this_x = await this.l(1).x();
    if (this_x.length) return this_x[0];
    return {} as Entity;
  }

  async x(): Promise<any> {
    const qryStr = `DELETE FROM ${this.table}${this.where}${this.getLimit}`;
    // console.log('qryStr', qryStr);
    if (cfg.postgres_debug) db.pg_logQuery(postgres_log_types.select, qryStr);
    const res = await pg_general.getConnection.query(qryStr);
    // console.log('qry', qryStr);

    return res;
  }
}
// ---------------------------
